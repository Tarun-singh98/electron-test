import { ipcMain, Notification } from 'electron'
import { exec } from "child_process";
import cron from "cron";
import {
  type ProgressInfo,
  type UpdateDownloadedEvent,
  autoUpdater
} from 'electron-updater'
import moment from 'moment';

import { syncMasters } from "./tally-sync/sync/masters/syncMasters"
import { syncVouchers } from './tally-sync/sync/transactions/vouchers/syncVouchers';
import { syncReports } from './tally-sync/sync/reports/syncReports';
import { bufferItemCheck, bufferLedgerCheck, bufferVoucherCheck } from './tally-sync/fromCloud/buffer/buffer';
import { checKTallyConnection, companyPermissionConfigFetch, educationModeCheck, updatePemissionConfig, updateSyncTime } from './tally-sync/sync/utilities/beforeSyncing';
import { pushCompanyToUserObject } from './tally-sync/toCloud/configuration/companies';
import { fetchCompanyInfo, fetchTallyAppInfo } from './tally-sync/internal/tallyInfo/tallyCompaniesInfo';
import { checkIfcompanyExistunderUser, companiesInfoFromToken, companyUnderCurrentMachine, fetchLetestAlterId } from './tally-sync/util/incrementalSyncUtil/incrementalSync';
import { incrementSyncVouchers } from './tally-sync/sync/transactions/vouchers/incrementSyncVouchers';
import { win } from "./index"
import { findMatchingObjects, getCaseIdFromLocalStorage, getPortFromLocalStorage, getTokenFromLocalStorage } from '../../core/util';
import { getMachineId } from './tally-sync/util/deviceInfo/uniqueIdFromDevice';
import { checkGlobalCronAllow, fetchConnectorVersionInfo, phoneFromToken } from './tally-sync/fromCloud/util/phoneFromToken';
import { companyPreviouslyExists } from './tally-sync/fromCloud/util/dbPreviouslyExistCheck';
import { checkAndCreateDb } from './tally-sync/util/checkAndCreateDb';
import { MasterAndVoucherAlterIdFromTally } from './tally-sync/internal/fromTally/XML/alterId/allAlterIdFromTally';
import { fetchSyncMeterConfigByCaseId } from './tally-sync/util/syncMeterConfig';
import { sendNotification } from './tally-sync/util/notification/notification';


let cronJobArr: any = [];
let reportcronJobArr: any = [];

export function tally(win: Electron.BrowserWindow) {

  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = false
  autoUpdater.disableWebInstaller = false
  autoUpdater.allowDowngrade = false

  //Check whether tally is connected or not
  ipcMain.handle('is-tally-open', async (event) => {
    const isAppRunning = await checkAppIsRunning('tally')
    // console.log(isAppRunning, "isAppRunning from tally.ts")
    // event.sender.send('tally-status', isAppRunning)
    return isAppRunning;
  })


  ipcMain.handle("check-tally-connected-on-given-port", async (event, params) => {
    try {
      const isTallyConnectedonGivenPort = await fetch(`http://localhost:${params}`)
      if (isTallyConnectedonGivenPort.status === 200) {
        return true
      }
    } catch {
      return false
    }
  })
  // const syncComplete = (companyName: any) => {
  //   new Notification({ title: "Sync Complete", body: `Company ${companyName} is synced.` }).show();
  // }
  // ipcMain.handle("sync-complete", (event, params) => {
  //   console.log(params);
  //   syncComplete(params.companyName);
  // });


  ipcMain.handle('fetch-company-info', async (event, params) => {
    const companiesInfo = await fetchCompanyInfo(params)
    // console.log(companiesInfo)
    return companiesInfo;
  })

  ipcMain.handle('fetch-tally-info', async (event, params) => {
    // console.log(params, "event from fetchTallyAppInfo")
    const tallyInfo = await fetchTallyAppInfo(params);
    // console.log(tallyInfo);
    return tallyInfo;
  })

  ipcMain.handle('mobile-push-notification', async (event, params) => {
    // console.log(params, "event from fetchTallyAppInfo")
    const { expoToken, title, body } = params;
    const notification = await sendNotification(expoToken, title, body);
    // console.log(notification);
    return notification;
  })

  ipcMain.handle('sync-company', async (event, params) => {
    try {
      // console.log("sync company started", params)
      console.log(params.tallyInfo.info, "from list")
      const tallyInfo = params.tallyInfo.info;
      let isCronJobStarted = false;
      let clickSync = true;
      const response = await syncCompany(params.port, params.companyData, tallyInfo, params.email, isCronJobStarted, clickSync)
      return response;
    } catch (error) {
      // Handle any errors
      console.error('Company sync error:', error);
      event.sender.send('company-sync-error', error);
    }
  })
}

const checkAppIsRunning = (appName: any) => {
  return new Promise((resolve, reject) => {
    const command = `tasklist /FI "IMAGENAME eq ${appName}.exe"`;
    exec(command, (error: any, stdout: any, stderr: any) => {
      if (stdout.includes(appName)) {
        // console.log(`${appName} is running`);
        resolve(true);
      } else {
        console.log(`${appName} is not running`);
        resolve(false);
      }
    });
  });
};

function startDownload(
  callback: (error: Error | null, info: ProgressInfo | null) => void,
  complete: (event: UpdateDownloadedEvent) => void,
) {
  autoUpdater.on('download-progress', info => callback(null, info))
  autoUpdater.on('error', error => callback(error, null))
  autoUpdater.on('update-downloaded', complete)
  autoUpdater.downloadUpdate()
}

let i = 0
let isSyncing = false;

let retryTimeout: NodeJS.Timeout | null = null;

export const beforeSyncTallyVerification = async (port: any, companyData: any, tallyAppInfo: any, email: any, isCronJobStarted: any, clickSync: any) => {
  if (companyData === undefined || tallyAppInfo === undefined) {
    return { code: 400, msg: "check tally in running or not.", proceed: false }
  }
  console.log("\x1b[32m===============>SYNC START ----------> ", "[ sync count :", ++i, "], [ timestamp :", moment().format("DD-MM-YYYY hh:mm"), "]", "\x1b[0m");

  const tallyConnection: any = await checKTallyConnection(port);
  if (tallyConnection?.code === 400) {
    isSyncing = false;
    return tallyConnection;
  }
  if (!tallyConnection) {
    isSyncing = false;
    return { code: 400, msg: "Tally is not running", proceed: false }
  }
  const isEducation: any = await educationModeCheck(port);
  if (isEducation?.code === 400) {
    isSyncing = false;
    return isEducation
  }
  console.log("\x1b[34m%s\x1b[0m", "isEducation ==>", isEducation);
  if (isEducation) {
    isSyncing = false;
    return { code: 400, msg: "Tally is in eductaion mode" }
  }
  if (+tallyAppInfo?.licenseNumber === 0) {
    console.log("Tally is in education mode.");
    isSyncing = false;
    return { code: 400, msg: "Tally is in educaion mode" }
  }
  return { code: 200, proceed: true }
}

export const beforeSyncInternalVerification = async (port: any, companyData: any, tallyAppInfo: any, email: any, isCronJobStarted: any, clickSync: any) => {
  const token = await getTokenFromLocalStorage();
  if (token?.code === 400) {
    isSyncing = false
    return token;
  }
  const phoneNumber = await phoneFromToken(token);
  if (phoneNumber?.code === 400) {
    isSyncing = false;
    return { phoneNumber: phoneNumber, proceed: false }
  }
  let licenseNumber = tallyAppInfo.licenseNumber
  let companyNameData = companyData.Name
  let companyNameForTally = companyNameData
  let companyNameModify = companyNameData.replace(/[\s.]/g, '');
  let companyName_lowerCase = companyNameModify.toLowerCase();
  let startDate = companyData.StartingFrom

  let machineId: any = await getMachineId();
  if (machineId?.code === 400) {
    isSyncing = false
    return machineId;
  }
  let syncTimeUpdateFlag = true;

  const companyNameForDb = await checkAndCreateDb(companyNameForTally, companyName_lowerCase, licenseNumber, phoneNumber, token);
  if (companyNameForDb?.code === 400) {
    isSyncing = false;
    return { companyNameForDb: companyNameForDb, proceed: false }
  }

  console.log("\x1b[34m%s\x1b[0m", "companyNameForTally ===> :", companyNameForTally);
  console.log("\x1b[34m%s\x1b[0m", "companyNameForDb ===> :", companyNameForDb);

  const completeUserDetail = await companiesInfoFromToken(token);
  if (completeUserDetail?.code === 400) {
    isSyncing = false
    return completeUserDetail
  }
  const allTallyLicenses = completeUserDetail?.data?.userData?.tallyLicenses

  if (allTallyLicenses.length === 0 || allTallyLicenses === undefined) {
    console.log("No tally license found in user object.");
  }

  const activeTallyLicInfo = await allTallyLicenses.find((license: any) => license.tallyLicenseNumber === licenseNumber)

  if (!activeTallyLicInfo || activeTallyLicInfo === undefined) {
    console.log("No active license found in user object.");
  }

  const currentMachineInfo = await activeTallyLicInfo?.connectors.find((connector: any) => connector.machineId === machineId)

  if (!currentMachineInfo || currentMachineInfo === undefined) {
    console.log("No machine found in user object.");
  }
  const dataObject = {
    token,
    machineId,
    licenseNumber,
    companyNameData,
    companyNameForTally,
    companyNameModify,
    companyName_lowerCase,
    startDate,
    syncTimeUpdateFlag,
    currentMachineInfo,
    companyNameForDb
  }
  return { proceed: true, data: dataObject }
}

export const syncConfigurationSetup = async (currentMachineInfo: any) => {
  const caseIdFromLS = await getCaseIdFromLocalStorage();
  if (caseIdFromLS?.code === 400) {
    isSyncing = false
    return caseIdFromLS
  }
  const caseId = currentMachineInfo?.config?.syncConfigId || caseIdFromLS || 222
  const syncConfigInfo = await fetchSyncMeterConfigByCaseId(caseId)
  if (syncConfigInfo?.code === 400) {
    isSyncing = false
    return syncConfigInfo
  }
  let syncIntervalConfig = currentMachineInfo?.config?.syncInterval || 10

  if (!syncConfigInfo || syncConfigInfo === undefined) {
    console.log("No syncConfig found in user object.");
  } else {
    console.log(syncIntervalConfig, " syncIntervalConfig INFO ---------------------->");
  }
  console.log(syncConfigInfo?.caseId, "SYNC CONFIG CASE ID ---------------------->");
  const allConfig = currentMachineInfo?.config
  return { proceed: true, syncConfigInfo: syncConfigInfo, allConfig: allConfig }
}

export const syncProcessForNewCompany = async (port: any, token: any, companyNameForDb: any, licenseNumber: any, machineId: any, isCronJobStarted: any, companyNameForTally: any, startDate: any, syncConfigInfo: any) => {
  const checkCompanyPreviouclyExist = await companyPreviouslyExists(token, companyNameForDb, licenseNumber, machineId);
  console.log("\x1b[34m%s\x1b[0m", "company previously exist status in syncedCompany collection =================>", checkCompanyPreviouclyExist.status);
  if (checkCompanyPreviouclyExist?.code === 400) {
    isSyncing = false;
    return checkCompanyPreviouclyExist
  }
  // 1> buffer Check flow will be called
  win.webContents.send('sync-progress-check', { progress: 1, companyName: companyNameForTally, isCronJob: isCronJobStarted });
  console.log("------------------------------------------------------------->bufferCheck function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->bufferCheck function call");

  //BUFFER LEDGER CHECK
  const bufferLedgerSyncCheck: any = await bufferLedgerCheck(companyNameForDb, companyNameForTally, isCronJobStarted, token, port);
  if (bufferLedgerSyncCheck?.code === 400) {
    win.webContents.send('connector-noissue', bufferLedgerSyncCheck);
    isSyncing = false;
    return { proceed: false, bufferLedgerSyncCheck: bufferLedgerSyncCheck }
  }
  win.webContents.send('connector-noissue', bufferLedgerSyncCheck);

  //BUFFER ITEM CHECK
  const bufferItemSyncCheck: any = await bufferItemCheck(companyNameForDb, companyNameForTally, isCronJobStarted, token, port);
  if (bufferItemSyncCheck?.code === 400) {
    win.webContents.send('connector-noissue', bufferItemSyncCheck);
    isSyncing = false;
    return { proceed: false, bufferItemSyncCheck: bufferItemSyncCheck }
  }
  win.webContents.send('connector-noissue', bufferItemSyncCheck);

  //BUFFER VOUCHER CHECK
  const bufferCheckData: any = await bufferVoucherCheck(companyNameForDb, companyNameForTally, isCronJobStarted, token, port);
  if (bufferCheckData?.code === 400) {
    win.webContents.send('connector-noissue', bufferCheckData);
    isSyncing = false;
    return { proceed: false, bufferCheckData: bufferCheckData }
  }
  win.webContents.send('connector-noissue', bufferCheckData);

  console.log("------------------------------------------------------------->bufferCheck function End");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->bufferCheck function End");
  win.webContents.send('sync-progress-check', { progress: 9, companyName: companyNameForTally, isCronJob: isCronJobStarted });

  // 2> syncVouchers flow will be called
  console.log("------------------------------------------------------------->syncVouchers function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->syncVouchers function call");

  // SYNC VOUCHER
  const vchSync: any = await syncVouchers(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token, syncConfigInfo);
  if (vchSync?.code === 400) {
    win.webContents.send('connector-noissue', vchSync);
    isSyncing = false;
    return { proceed: false, vchSync: vchSync }
  }
  win.webContents.send('connector-noissue', vchSync);

  console.log("------------------------------------------------------------->syncVouchers function End");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->syncVouchers function End");
  win.webContents.send('sync-progress-check', { progress: 50, companyName: companyNameForTally, isCronJob: isCronJobStarted });

  // 3> Master Sync flow will be executed
  console.log("------------------------------------------------------------->syncMasters function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->syncMasters function call");

  //SYNC MASTER
  const mstSync: any = await syncMasters(port, companyNameForDb, companyNameForTally, isCronJobStarted, token);
  if (mstSync?.code === 400) {
    win.webContents.send('connector-noissue', mstSync);
    isSyncing = false;
    return { proceed: false, mstSync: mstSync }
  }
  win.webContents.send('connector-noissue', mstSync);

  console.log("------------------------------------------------------------->syncMasters function End");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->syncMasters function End");
  win.webContents.send('sync-progress-check', { progress: 68, companyName: companyNameForTally, isCronJob: isCronJobStarted });

  //4> Reports Sync
  console.log("------------------------------------------------------------->syncReports function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->syncReports function call");

  // SYNC REPORT
  const reportSync: any = await syncReports(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token, syncConfigInfo);
  if (reportSync?.code === 400) {
    win.webContents.send('connector-noissue', reportSync);
    isSyncing = false;
    return { proceed: false, reportSync: reportSync }
  }
  win.webContents.send('connector-noissue', reportSync);

  console.log("------------------------------------------------------------->syncReports function End");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->syncReports function End");
  win.webContents.send('sync-progress-check', { progress: 93, companyName: companyNameForTally, isCronJob: isCronJobStarted });
  return {
    code: 200,
    msg: "new comp synced with no err",
    proceed: true
  }
}

export const syncProcessForExistingCompany = async (port: any, token: any, companyNameForDb: any, licenseNumber: any, machineId: any, isCronJobStarted: any, companyNameForTally: any, startDate: any, syncConfigInfo: any, companyData: any, tallyAppInfo: any, email: any, clickSync: any, syncTimeUpdateFlag: any) => {
  const checkCompanyPreviouclyExist = await companyPreviouslyExists(token, companyNameForDb, licenseNumber, machineId);
  console.log("\x1b[34m%s\x1b[0m", "company previously exist status in syncedCompany collection =================>", checkCompanyPreviouclyExist.status);
  if (checkCompanyPreviouclyExist?.code === 200) {
    return checkCompanyPreviouclyExist
  }

  if (checkCompanyPreviouclyExist.data.allowSync || clickSync) {
    const bufferLedgerSyncCheck: any = await bufferLedgerCheck(companyNameForDb, companyNameForTally, isCronJobStarted, token, port);
    if (bufferLedgerSyncCheck?.code === 400) {
      isSyncing = false;
      return bufferLedgerSyncCheck
    }

    win.webContents.send('sync-progress-check', { progress: 2, companyName: companyNameForTally, isCronJob: isCronJobStarted });
    const data = await fetchLetestAlterId(companyNameForDb, token);
    if (data?.code === 400) {
      isSyncing = false;
      return data
    }
    const bufferItemSyncCheck: any = await bufferItemCheck(companyNameForDb, companyNameForTally, isCronJobStarted, token, port);
    if (bufferItemSyncCheck?.code === 400) {
      isSyncing = false;
      return bufferItemSyncCheck
    }
    if (checkCompanyPreviouclyExist.data.allowAddVoucher) {
      const bufferCheckData: any = await bufferVoucherCheck(companyNameForDb, companyNameForTally, isCronJobStarted, token, port);
      if (bufferCheckData?.code === 400) {
        isSyncing = false;
        return bufferCheckData
      }
    } else {
      console.log("\x1b[34m%s\x1b[0m", `Add voucher is not allowed for this company : ${companyNameForTally} =================>`);
    }
    const alterIdFromTally = await MasterAndVoucherAlterIdFromTally(port, companyNameForTally, startDate);
    if (alterIdFromTally?.code === 400) {
      isSyncing = false;
      return alterIdFromTally
    }
    const transactionAlterId = data.transactionAlterId;
    const masterAlterId = data.masterAlterId;
    if (transactionAlterId == null || masterAlterId == null) {
      console.log("need to take full sync, ALTERID IS NULL ===============================>");
      await syncCompany(port, companyData, tallyAppInfo, email, isCronJobStarted, clickSync)
      return { code: 400, msg: "need to take full sync" };
    };

    console.log("DB-TransactionAlterId :=>", transactionAlterId, "<===>", "DB-MasterAlterId :=>", masterAlterId);
    console.log("TALLY-TransactionAlterId :=>", alterIdFromTally.maxVoucherAlterId, "<===>", "TALLY-MasterAlterId :=>", alterIdFromTally.maxMasterAlterId);

    if (transactionAlterId !== alterIdFromTally.maxVoucherAlterId) {
      const incVchSync: any = await incrementSyncVouchers(port, companyNameForDb, companyNameForTally, startDate, transactionAlterId, isCronJobStarted, token, syncConfigInfo);
      if (incVchSync?.code === 400) {
        isSyncing = false;
        return incVchSync
      }
    } else {
      console.log("\x1b[34m%s\x1b[0m", `No need to sync vouchers : ${companyNameForTally} =================>`);
    }

    if (masterAlterId !== alterIdFromTally.maxMasterAlterId || transactionAlterId !== alterIdFromTally.maxVoucherAlterId) {
      const mstIncSync: any = await syncMasters(port, companyNameForDb, companyNameForTally, isCronJobStarted, token);
      if (mstIncSync?.code === 400) {
        isSyncing = false;
        return mstIncSync
      }
    } else {
      console.log("\x1b[34m%s\x1b[0m", `No need to sync masters : ${companyNameForTally} =================>`);
    }
  } else {
    isSyncing = false;
    syncTimeUpdateFlag = false;
    console.log("\x1b[34m%s\x1b[0m", `company sync is not allowed for company : ${companyNameForTally} =================>`);
  }
}

export const postSyncOperation = async (companyData: any, tallyAppInfo: any, isCronJobStarted: any, companyNameForDb: any, token: any, machineId: any, port: any, email: any, syncTimeUpdateFlag: any, companyNameForTally: any, companyNameData: any, allConfig: any) => {
  let lastSynced = moment().format("YYYY-MM-DD HH:mm")
  let dateObj = { lastSynced }
  const tally_companyInfo = { ...companyData, ...tallyAppInfo, ...dateObj }

  console.log("------------------------------------------------------------->updateSyncTime function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->updateSyncTime function call");
  win.webContents.send('sync-progress-check', { progress: 94, companyName: companyNameForTally, isCronJob: isCronJobStarted });
  console.log("------------------------------------------------------------->updateSyncTime function end");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->updateSyncTime function end");

  console.log("------------------------------------------------------------->companyPermissionConfigFetch function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->companyPermissionConfigFetch function call");
  const permissions = await companyPermissionConfigFetch(companyNameForDb, token)
  if (permissions?.code === 400) {
    isSyncing = false;
    return permissions
  }
  console.log("------------------------------------------------------------->companyPermissionConfigFetch function end");
  win.webContents.send('sync-progress-check', { progress: 95, companyName: companyNameForTally, isCronJob: isCronJobStarted });
  console.log("------------------------------------------------------------->updatePemissionConfig function call");
  const updateAllUserPermission = await updatePemissionConfig(companyNameForDb, token)
  if (updateAllUserPermission?.code === 400) {
    isSyncing = false;
    return updateAllUserPermission
  }
  console.log("------------------------------------------------------------->updatePemissionConfig function end");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->companyPermissionConfigFetch function end");

  let connectorConfig = {
    tallyPort: port || '9000',
    tallyHost: "localhost",
    syncInterval: 10,
    reportSyncInterval: 3,
    notificationEnabled: true
  }
  if (allConfig && allConfig !== undefined) {
    const { tallyPort, tallyHost, syncInterval, reportSyncInterval, notificationEnabled } = allConfig;
    connectorConfig = {
      tallyPort: tallyPort || port || '9000',
      tallyHost: tallyHost || "localhost",
      syncInterval: syncInterval || 10,
      reportSyncInterval: reportSyncInterval || 3,
      notificationEnabled: notificationEnabled?.toString() === "false" ? notificationEnabled : true
    }
  }
  const caseIdFromLS = await getCaseIdFromLocalStorage()

  const caseId = caseIdFromLS || 222
  const InfoData = { email, machineId, tally_companyInfo, permissions, connectorConfig, caseId: caseId }

  // Company details push
  console.log("------------------------------------------------------------->pushCompanyToUserObject function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->pushCompanyToUserObject function call");

  if (syncTimeUpdateFlag) {
    const companyPushTouserObj: any = await pushCompanyToUserObject(InfoData, companyNameForDb, token)
    if (companyPushTouserObj?.code === 400) {
      isSyncing = false;
      return companyPushTouserObj
    }
  } else {
    console.log("\x1b[34m%s\x1b[0m", `company sync is not allowed for company : ${companyNameForTally} =================>`);
  }
  win.webContents.send('sync-progress-check', { progress: 96, companyName: companyNameForTally, isCronJob: isCronJobStarted });
  console.log("------------------------------------------------------------->pushCompanyToUserObject function end ");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->pushCompanyToUserObject function end ");

  win.webContents.send('sync-progress-check', { progress: 98, companyName: companyNameForTally, isCronJob: isCronJobStarted });
  console.log("------------------------------------------------------------->companyPermissionConfigFetch function call");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->companyPermissionConfigFetch function call");

  console.log("------------------------------------------------------------->companyPermissionConfigFetch function end");
  win.webContents.send('connector-noissue', "------------------------------------------------------------->companyPermissionConfigFetch function end");
  win.webContents.send('sync-progress-check', { progress: 100, companyName: companyNameForTally, isCronJob: isCronJobStarted });

  console.log("\x1b[32m===============>SYNC END ----------> ", "[ sync count :", i, "] , [ timestamp :", moment().format("DD-MM-YYYY hh:mm"), "]", "\x1b[0m");
  const syncComplete = (companyName: any) => {
    new Notification({ title: "Sync Complete", body: `Company ${companyName} is synced.` }).show();
  }
  if (allConfig?.notificationEnabled) {
    syncComplete(companyNameForTally)
  } else {
    console.log("Notification disabled.");
  }
  isSyncing = false;
  win.webContents.send('sync-completed-check', true);
  console.timeEnd("syncCompany")

  //to skip sync if mandatory update is available
  // const checkCronAllow = await fetchConnectorVersionInfo()
  // console.log("IS CRON JOB ALLOWED IN TALLY.TS : ------------------>", checkCronAllow);
  // if (checkCronAllow) {
  if (cronJobArr.length === 1) {
    // await cronJob.stop()
    console.log(`Already cron job exist.`);
    console.log(cronJobArr.length, "This is the count for how many cron job is active.");
    // startCronJobForSyncCompany(isCronJobStarted)
  } else if (cronJobArr.length > 1) {
    for (let i = 0; i < cronJobArr.length - 1; i++) {
      cronJobArr[i].stop()
    }
    console.log(cronJobArr.length, "This is the count for how many cron job is active.");
  } else {
    console.log(`Previous cron job not found.`);
    console.log(cronJobArr.length, "This is the count for how many cron job is active.");
    startCronJobForSyncCompany(isCronJobStarted)
  }

  if (reportcronJobArr.length === 1) {
    // await cronJob.stop()
    console.log(`Already report cron job exist.`);
    console.log(reportcronJobArr.length, "This is the count for how many report cron job is active.");
    // startCronJobForSyncCompany(isCronJobStarted)
  } else if (reportcronJobArr.length > 1) {
    for (let i = 0; i < reportcronJobArr.length - 1; i++) {
      reportcronJobArr[i].stop()
    }
    console.log(reportcronJobArr.length, "This is the count for how many report cron job is active.");
  } else {
    console.log(`Previous cron job not found.`);
    console.log(reportcronJobArr.length, "This is the count for how many report cron job is active.");
    startCronJobForReport()
  }

  let obj = {
    msg: "Sync Complete.",
    code: 200,
    lastSynced,
    companyName: companyNameData
  }
  console.log("\x1b[90m%s\x1b[0m", "Response sent to frontend =================>");
  return obj
}

export const syncCompany = async (port: any, companyData: any, tallyAppInfo: any, email: any, isCronJobStarted: any, clickSync: any) => {
  console.time("syncCompany")
  if (clickSync) {
    isSyncing = false
  }
  if (isSyncing) {
    let res = {
      code: 400,
      msg: `company ${companyData.Name} is already syncing in background. Please wait for some time.`,
      proceed: false
    }
    console.log("\x1b[32m=*=*=*=*=*=*=*Function is already running. Skipping this execution.=*=*=*=*=*=*=*", "\x1b[0m");
    return res;
  }
  isSyncing = true;
  win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted });
  win.webContents.send('current-syncing-company', { companyData: companyData, action: 'sync-start' })
  const isCompanyBeforeSyncTallyVerified = await beforeSyncTallyVerification(port, companyData, tallyAppInfo, email, isCronJobStarted, clickSync);
  if (isCompanyBeforeSyncTallyVerified?.code === 400 || isCompanyBeforeSyncTallyVerified?.proceed === false) {
    win.webContents.send('connector-noissue', isCompanyBeforeSyncTallyVerified);
    isSyncing = false
    win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: isCompanyBeforeSyncTallyVerified });
    return isCompanyBeforeSyncTallyVerified;
  }
  const isCompanyBeforeSyncInternalVerified = await beforeSyncInternalVerification(port, companyData, tallyAppInfo, email, isCronJobStarted, clickSync);
  if (isCompanyBeforeSyncInternalVerified?.code === 400 || isCompanyBeforeSyncInternalVerified?.proceed === false) {
    win.webContents.send('connector-noissue', isCompanyBeforeSyncInternalVerified);
    isSyncing = false
    win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: isCompanyBeforeSyncInternalVerified });
    return isCompanyBeforeSyncInternalVerified;
  }
  if (isCompanyBeforeSyncTallyVerified?.proceed && isCompanyBeforeSyncInternalVerified?.proceed) {
    let {
      token,
      machineId,
      licenseNumber,
      companyNameData,
      companyNameForTally,
      startDate,
      syncTimeUpdateFlag,
      currentMachineInfo,
      companyNameForDb }: any = isCompanyBeforeSyncInternalVerified.data;

    const syncConfigSetupProcess = await syncConfigurationSetup(currentMachineInfo);
    if (syncConfigSetupProcess?.code === 400 || syncConfigSetupProcess?.proceed === false) {
      win.webContents.send('connector-noissue', syncConfigSetupProcess);
      isSyncing = false
      win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: syncConfigSetupProcess });
      return syncConfigSetupProcess;
    }
    const { syncConfigInfo, allConfig } = syncConfigSetupProcess;

    const companyExistCheck = await checkIfcompanyExistunderUser(companyNameForDb, token, machineId, licenseNumber);
    if (companyExistCheck?.code === 400) {
      win.webContents.send('connector-noissue', companyExistCheck);
      win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: companyExistCheck });
      isSyncing = false;
      return companyExistCheck
    }
    console.log("\x1b[34m%s\x1b[0m", "company exist under user status(both in mongo and pg) =================>", companyExistCheck);
    if (!companyExistCheck) {
      const newCompanySync: any = await syncProcessForNewCompany(port, token, companyNameForDb, licenseNumber, machineId, isCronJobStarted, companyNameForTally, startDate, syncConfigInfo);
      console.log(newCompanySync, "-----------> new comp sync");

      if (newCompanySync?.code === 400 || newCompanySync?.proceed === false) {
        win.webContents.send('connector-noissue', newCompanySync);
        isSyncing = false;
        win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: newCompanySync });
        console.log(newCompanySync, "-----------------------> new comp err");
        return newCompanySync
      }
      win.webContents.send('connector-noissue', newCompanySync);
    } else {
      const existingCompanySync: any = await syncProcessForExistingCompany(port, token, companyNameForDb, licenseNumber, machineId, isCronJobStarted, companyNameForTally, startDate, syncConfigInfo, companyData, tallyAppInfo, email, clickSync, syncTimeUpdateFlag);
      if (existingCompanySync?.code === 400 || existingCompanySync?.proceed === false) {
        win.webContents.send('connector-noissue', existingCompanySync);
        isSyncing = false;
        win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: existingCompanySync });
        console.log(existingCompanySync, "-----------------------> existing comp err");
        return existingCompanySync
      }
      win.webContents.send('connector-noissue', existingCompanySync);
    }

    const postSyncOperationOutput = await postSyncOperation(companyData, tallyAppInfo, isCronJobStarted, companyNameForDb, token, machineId, port, email, syncTimeUpdateFlag, companyNameForTally, companyNameData, allConfig)
    if (postSyncOperationOutput?.code === 400) {
      win.webContents.send('connector-noissue', postSyncOperationOutput);
      isSyncing = false
      win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: postSyncOperationOutput });
      return postSyncOperationOutput
    }
    win.webContents.send('current-syncing-company', { companyData: companyData, action: 'sync-end' })
    console.log(postSyncOperationOutput, "post sync out")
    return postSyncOperationOutput;
  } else {
    console.log(isCompanyBeforeSyncTallyVerified, "err in isCompanyBeforeSyncTallyVerified");
    console.log(isCompanyBeforeSyncInternalVerified, "err in isCompanyBeforeSyncInternalVerified");
    win.webContents.send('sync-progress-check', { progress: 1, companyName: companyData?.Name, isCronJob: isCronJobStarted, code: 400, err: isCompanyBeforeSyncTallyVerified });
  }
  return
};

let x = 0

export const startCronJobForSyncCompany = async (isCronJobStarted: any) => {
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
  const syncConfigData: any = await getCronJobSyncConfig();
  if (!syncConfigData || syncConfigData.code === 400) {
    console.log("No token or error in config, no cron job");

    retryTimeout = setTimeout(async () => {
      await startCronJobForSyncCompany(false);
    }, 10000);
    return;
  }
  if (syncConfigData?.code !== 200 || syncConfigData?.code === 400) {
    console.log(`err starting cronjob======>`);
    console.log(syncConfigData);
  }
  let { syncIntervalConfig }: any = syncConfigData?.data;
  syncIntervalConfig = syncIntervalConfig ? syncIntervalConfig : 2
  console.log("------------------------------> startCronJobForSyncCompany start", "Interval :", syncIntervalConfig);
  win.webContents.send('connector-noissue', `------------------------------> startCronJobForSyncCompany start${x}}`, +syncIntervalConfig);


  let currentDate: any = moment().format("YYYY-MM-DD HH:mm");
  let lastNotificationSendAt: any;
  let nextNotificationSendAt: any;

  let cronJob = new cron.CronJob(`*/${+syncIntervalConfig} * * * *`, async () => { //*/${+syncIntervalConfig} * * * *
    try {
      const checkCronAllow = await checkGlobalCronAllow();
      const isVersionMatch = await fetchConnectorVersionInfo();
      console.log("CRON JOB ALLOWED ==>", checkCronAllow, "||", "IS VERSION MATCH ==>", isVersionMatch);

      if (isReportCronJobRunning) {
        console.log("\x1b[34m%s\x1b[0m", "Report cron job is running ,skipping this Normal cronjob exicution. ===================>");
        return
      }

      if (checkCronAllow && isVersionMatch) {
        const syncConfigData: any = await getCronJobSyncConfig()
        if (syncConfigData?.code === 300 || syncConfigData?.code === 600) {
          console.log("\x1b[34m%s\x1b[0m", "return cron ===================>");
          return
        }
        let { token, companiesInfo, port, tallyInfo, syncIntervalConfig }: any = syncConfigData?.data;

        if (companiesInfo?.data?.userData?.appConfig?.subscriptionEnabled) {
          const findLic = companiesInfo?.data?.userData?.tallyLicenses.find((obj: any) => obj.tallyLicenseNumber === tallyInfo?.info.licenseNumber);
          if (findLic?.plan !== "Active") {
            console.log("Cron job is not allowed , Skipping the sync process.");
            return
          } else {
            console.log("Data will be synced..");
          }
        }

        console.log("in side cron job , Interval ->", syncIntervalConfig, "count:=>", ++x);
        isCronJobStarted = true;
        if (token && token !== null) {
          const dbCompanyInfoData = await companyUnderCurrentMachine(companiesInfo, tallyInfo.info.licenseNumber)
          if (dbCompanyInfoData.finalData.length === 0) {
            console.log("\x1b[31m%s\x1b[0m", "No company found for this machine, No need to cronjob sync.");
            return;
          }
          const companiesInfoFromTally: any = await fetchCompanyInfo(port);
          if (companiesInfoFromTally?.code === 400) {
            return companiesInfoFromTally
          }
          if (companiesInfoFromTally.info.length > 0) {
            const comaniesInfoData = findMatchingObjects(companiesInfoFromTally.info, dbCompanyInfoData.finalData);
            for (let i = 0; i < comaniesInfoData.length; i++) {
              if (comaniesInfoData[i].syncData) {
                const companyInfo = comaniesInfoData[i].companyInfo;
                let clickSync = false;
                await syncCompany(port, companyInfo, companyInfo, companiesInfo.data.userData.email, isCronJobStarted, clickSync)
              } else {
                console.log("\x1b[31m%s\x1b[0m", `company sync is not allowed for company : ${comaniesInfoData?.[i]?.companyInfo?.Name} =================>`);
              }
            }
          } else {
            console.log("no company found");
          }
        } else {
          console.log("token is null");
        }
      } else {
        console.log("Cron job is not allowed , Skipping till get the permission or version mismatch");
        if (!isVersionMatch) {
          const updateNotification = () => {
            new Notification({ title: "Update Required", body: `A new update is available. To continue syncing your company, please update the application.` }).show();
          }
          updateNotification()

          let { companiesInfo }: any = syncConfigData?.data;

          const expoToken = companiesInfo?.data?.userData?.expoToken || [];

          if (expoToken.length > 0) {
            if (!lastNotificationSendAt || !nextNotificationSendAt || currentDate > nextNotificationSendAt) {
              const pushNotification = await sendNotification(
                expoToken,
                "Connector Update Required",
                "A new update is available in the connector. To continue syncing your company, please update the connector application."
              );

              if (pushNotification.code === 400 || pushNotification.code === 500) {
                console.log("Something went wrong while sending the push notification", pushNotification);
              } else {
                console.log("Push notification sent successfully", pushNotification);
                // Update the times only if the notification was sent successfully
                lastNotificationSendAt = currentDate;
                nextNotificationSendAt = moment(currentDate, "YYYY-MM-DD HH:mm").add(3, 'hours').format("YYYY-MM-DD HH:mm");
              }
            } else {
              console.log("You will expect next notification at : ", nextNotificationSendAt || currentDate);
            }
          } else {
            console.log("No Expo token to send notification.");
          }
        }
        // cronJobArr[0].stop()
      }
    } catch (error: any) {
      console.error(
        "An error occurred during the startCronJobForSyncCompany in tally.ts:",
        error
      );
      return error.message
    }
  }, null, false, 'America/New_York', null, true);
  cronJobArr.push(cronJob);
  cronJob.start();
};

let isReportCronJobRunning = false;

export const startCronJobForReport = async () => {
  let interval = 3
  const syncInterval = await getCronJobSyncConfig()
  if (syncInterval?.code === 200) {
    interval = syncInterval?.reportSyncInterval || 3
  }
  const cronJobReport = new cron.CronJob(`0 */${interval} * * *`, async () => { //0 */${interval} * * *
    try {
      const checkCronAllow = await checkGlobalCronAllow();
      const isVersionMatch = await fetchConnectorVersionInfo();
      if (checkCronAllow && isVersionMatch) {
        if (isReportCronJobRunning) {
          console.log("\x1b[32m=*=*=*=*=*=*=*Function is already running. Skipping this execution for report.=*=*=*=*=*=*=*", "\x1b[0m");
          return;
        }
        isReportCronJobRunning = true;

        const token = await getTokenFromLocalStorage();
        const phoneNumber = await phoneFromToken(token);
        if (phoneNumber?.code === 400) {
          isSyncing = false;
          return phoneNumber
        }
        if (token && token !== null) {
          let companiesInfo = await companiesInfoFromToken(token);
          if (companiesInfo?.code === 400) {
            return companiesInfo
          }
          const port = await getPortFromLocalStorage();
          const tallyInfo = await fetchTallyAppInfo(port);
          if (tallyInfo.info.licenseNumber === 0) {
            console.log("\x1b[31m%s\x1b[0m", "Tally is in education mode, No need to cronjob sync.");
            return;
          }

          if (companiesInfo?.data?.userData?.appConfig?.subscriptionEnabled) {
            const findLic = companiesInfo?.data?.userData?.tallyLicenses.find((obj: any) => obj.tallyLicenseNumber === tallyInfo?.info.licenseNumber);
            if (findLic?.plan !== "Active") {
              console.log("Cron job is not allowed , Skipping the sync process.");
              return
            } else {
              console.log("Data will be synced..");
            }
          }

          let machineId = await getMachineId();
          const completeUserDetail = await companiesInfoFromToken(token);

          const allTallyLicenses = completeUserDetail?.data?.userData?.tallyLicenses

          if (allTallyLicenses.length === 0 || allTallyLicenses === undefined) {
            console.log("No tally license found in user object.");
          }

          const activeTallyLicInfo = allTallyLicenses.find((license: any) => license.tallyLicenseNumber === tallyInfo.info.licenseNumber)

          if (!activeTallyLicInfo || activeTallyLicInfo === undefined) {
            console.log("No active license found in user object.");
          }

          const currentMachineInfo = activeTallyLicInfo?.connectors.find((connector: any) => connector.machineId === machineId)

          if (!currentMachineInfo || currentMachineInfo === undefined) {
            console.log("No machine found in user object.");
          }

          const caseIdFromLS = await getCaseIdFromLocalStorage()
          const caseId = currentMachineInfo?.config?.syncConfigId || caseIdFromLS || 222
          const syncConfigInfo = await fetchSyncMeterConfigByCaseId(caseId)

          if (!syncConfigInfo || syncConfigInfo === undefined) {
            console.log("No syncConfig found in user object.");
          }

          const dbCompanyInfoData = await companyUnderCurrentMachine(companiesInfo, tallyInfo.info.licenseNumber)
          if (dbCompanyInfoData.finalData.length === 0) {
            console.log("\x1b[31m%s\x1b[0m", "No company found for this machine, No need to REPORT cronjob sync.");
            return;
          }
          const companiesInfoFromTally: any = await fetchCompanyInfo(port);
          if (companiesInfoFromTally.info.length > 0) {
            const comaniesInfoData = findMatchingObjects(companiesInfoFromTally.info, dbCompanyInfoData.finalData);
            for (let i = 0; i < comaniesInfoData.length; i++) {
              if (comaniesInfoData[i].syncData) {
                const companyInfo = comaniesInfoData[i].companyInfo;
                let licenseNumber = companyInfo.licenseNumber;
                console.log("licenseNumber :", licenseNumber);
                let companyNameData1 = companyInfo.Name;
                let companyNameForTally = companyNameData1;
                console.log("companyNameForTally :", companyNameForTally);
                let companyNameModify = companyNameData1.replace(/[\s.]/g, "");
                let modify = companyNameModify.toLowerCase();
                let companyName_lowerCase = modify.toLowerCase();

                const companyNameForDb = await checkAndCreateDb(companyNameForTally, companyName_lowerCase, licenseNumber, phoneNumber, token);
                if (companyNameForDb?.code === 400) {
                  return companyNameForDb
                }
                console.log("companyNameForDb :", companyNameForDb);
                let startDate = companyInfo.StartingFrom;
                console.log(
                  "startDate :",
                  startDate
                );
                console.log(
                  "\x1b[34m%s\x1b[0m",
                  "cron job for reports started inside loop.... =+=+=+=+=+=+=+=+=>"
                );
                await syncReports(
                  port,
                  companyNameForDb,
                  companyNameForTally,
                  startDate,
                  false,
                  token,
                  syncConfigInfo
                );
              } else {
                console.log("\x1b[31m%s\x1b[0m", `company sync is not allowed for company (REPORT) : ${comaniesInfoData?.[i]?.companyInfo?.Name} =================>`);
              }
            }
          } else {
            console.log("no company found");
          }
        } else {
          console.log("token is null");
        }
      } else {
        console.log(" Cron job is not allowed , skippling till got the permission or version mismatch.");
        // reportcronJobArr[0].stop()
      }
    } catch (error: any) {
      console.error(
        "An error occurred during the startCronJobForReport in tally.ts:",
        error
      );
      return error.message;
    } finally {
      isReportCronJobRunning = false;
    }
  });
  reportcronJobArr.push(cronJobReport)
  cronJobReport.start();
}

const getCronJobSyncConfig = async () => {
  try {
    const token = await getTokenFromLocalStorage();
    if (!token || token.code === 400) {
      return token;
    }

    const machineId: any = await getMachineId();
    if (machineId?.code === 400) {
      return machineId;
    }

    const companiesInfo = await companiesInfoFromToken(token);
    if (companiesInfo?.code === 400) {
      return companiesInfo;
    }

    const port = await getPortFromLocalStorage();
    if (port?.code === 400) {
      return port;
    }

    const tallyInfo = await fetchTallyAppInfo(port);
    if (tallyInfo?.code === 400) {
      return {
        code: 300,
        data: { token, companiesInfo, port, tallyInfo: null, syncIntervalConfig: 2 }
      };
    }

    const licenseNumber = tallyInfo?.info?.licenseNumber;
    if (licenseNumber === 0) {
      console.log("Tally is in education mode");
      return {
        code: 600,
        data: { token, companiesInfo, port, tallyInfo, syncIntervalConfig: null }
      };
    }

    const allTallyLicenses = companiesInfo?.data?.userData?.tallyLicenses || [];
    const activeTallyLicInfo = allTallyLicenses.find((license: any) => license.tallyLicenseNumber === licenseNumber);
    const currentMachineInfo = activeTallyLicInfo?.connectors.find((connector: any) => connector.machineId === machineId);
    let syncIntervalConfig = currentMachineInfo?.config?.syncInterval;
    if (!syncIntervalConfig) {
      syncIntervalConfig = 10
    }
    const reportSyncInterval = currentMachineInfo?.config?.reportSyncInterval || 3

    return {
      code: 200,
      data: { token, companiesInfo, port, tallyInfo, syncIntervalConfig, reportSyncInterval }
    };
  } catch (error: any) {
    return {
      code: 400,
      msg: "Err in getSyncInterval function.",
      err: error.message
    };
  }
};
