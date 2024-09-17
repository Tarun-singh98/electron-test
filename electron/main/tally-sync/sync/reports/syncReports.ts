import { win } from "../../../index";
import { updateBalanceSheetInDb } from "../../toCloud/reports/balanceSheet";
import { updateCashBankdataInDb } from "../../toCloud/reports/cashBankData";
import { updatePayableInDB } from "../../toCloud/reports/payableData";
import { updateProfitLossInDb } from "../../toCloud/reports/profitLoss";
import { updateRecievableInDb } from "../../toCloud/reports/receivableData";
import { updateTrialBalanceInDb } from "../../toCloud/reports/trialBalance";

export const syncReports = async (port: any, companyNameForDb: any, companyNameForTally: any, startDate: any, isCronJobStarted: any, token: any, syncConfigInfo: any) => {
  try {
    console.time("syncReports");
    try {
      const storeTB = await updateTrialBalanceInDb(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token);
      if (storeTB?.code === 400) {
        return storeTB
      }
      win.webContents.send('sync-progress-check', { progress: 70, companyName: companyNameForTally, isCronJob: isCronJobStarted });
      win.webContents.send('connector-noissue', "no error in updateTrialBalanceInDb");
    } catch (error: any) {
      win.webContents.send('connector-error-check', error.message);
      console.error("Error updating trial balance:", error);
      return {
        code: 400,
        msg: "err in storeTB",
        err: error.message
      }
    }
    try {
      const storePL = await updateProfitLossInDb(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token);
      if (storePL?.code === 400) {
        return storePL
      }
      win.webContents.send('sync-progress-check', { progress: 74, companyName: companyNameForTally, isCronJob: isCronJobStarted });
      win.webContents.send('connector-noissue', "no error in updateProfitLossInDb");
    } catch (error: any) {
      win.webContents.send('connector-error-check', error.message);
      console.error("Error updating profit and loss:", error);
      return {
        code: 400,
        msg: "err updateProfitLossInDb",
        err: error.message
      }
    }
    try {
      const storeBS = await updateBalanceSheetInDb(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token);
      if (storeBS?.code === 400) {
        return storeBS
      }
      win.webContents.send('sync-progress-check', { progress: 77, companyName: companyNameForTally, isCronJob: isCronJobStarted });
      win.webContents.send('connector-noissue', "no error in updateBalanceSheetInDb");
    } catch (error: any) {
      win.webContents.send('connector-error-check', error.message);
      console.error("Error updating balance sheet:", error);
      return {
        code: 400,
        msg: "err updateBalanceSheetInDb",
        err: error.message
      }
    }
    try {
      const storeCB = await updateCashBankdataInDb(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token);
      if (storeCB?.code === 400) {
        return storeCB
      }
      win.webContents.send('sync-progress-check', { progress: 82, companyName: companyNameForTally, isCronJob: isCronJobStarted });
      win.webContents.send('connector-noissue', "no error in updateCashBankdataInDb");
    } catch (error: any) {
      win.webContents.send('connector-error-check', error.message);
      console.error("Error updating cash and bank data:", error);
      return {
        code: 400,
        msg: "err updateCashBankdataInDb",
        err: error.message
      }
    }
    try {
      const storeRec = await updateRecievableInDb(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token, syncConfigInfo);
      if (storeRec?.code === 400) {
        return storeRec
      }
      win.webContents.send('sync-progress-check', { progress: 86, companyName: companyNameForTally, isCronJob: isCronJobStarted });
      win.webContents.send('connector-noissue', "no error in updateRecievableInDb");
    } catch (error: any) {
      win.webContents.send('connector-error-check', error.message);
      console.error("Error updating receivable data:", error);
      return {
        code: 400,
        msg: "err updateRecievableInDb",
        err: error.message
      }
    }
    try {
      const storePay = await updatePayableInDB(port, companyNameForDb, companyNameForTally, startDate, isCronJobStarted, token, syncConfigInfo);
      if (storePay?.code === 400) {
        return storePay
      }
      win.webContents.send('sync-progress-check', { progress: 90, companyName: companyNameForTally, isCronJob: isCronJobStarted });
      win.webContents.send('connector-noissue', "no error in updatePayableInDB");
    } catch (error: any) {
      win.webContents.send('connector-error-check', error.message);
      console.error("Error updating payable data:", error);
      return {
        code: 400,
        msg: "err updatePayableInDB",
        err: error.message
      }
    }
    console.timeEnd("syncReports");
    return {
      code: 200,
      msg: "Report synced success."
    }
  } catch (error: any) {
    win.webContents.send('connector-error-check', error.message);
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong, Please restart the application."
    }
  };
};
