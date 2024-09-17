import { win } from "../../../../index";
import {
    incrementFetchAccountingDataFromTally,
    incrementFetchCoreVouchersFromTally,
    incrementFetchVouchersBillDataFromTally,
    incrementFetchVouchersInventoryDataFromTally,
} from "../../../internal/fromTally/XML/transactions/incrementalVoucherData";
import {
    updateCoreVouchersInDb,
    updateAccoutingDataInDb,
    updateInventoryDataInDb,
    updateBillDataInDb,
} from "../../../toCloud/transactions/updateVouchersInDb";

const incrementSyncVouchers = async (
    port: any,
    companyNameForDb: string,
    companyNameForTally: string,
    startDate: Date,
    alterId: any,
    isCronJobStarted: any,
    token: any,
    syncConfigInfo: any
) => {
    console.time("incrementSyncVouchers");
    try {
        //CORE
        try {
            const coreVoucherData = await incrementFetchCoreVouchersFromTally(
                port,
                companyNameForTally,
                startDate,
                alterId,
                syncConfigInfo
            );
            if (coreVoucherData?.code === 400) {
                win.webContents.send('connector-error-check', coreVoucherData);
                return coreVoucherData
            } else {
                win.webContents.send('sync-progress-check', { progress: 11, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                const coreVoucherDataAllEmpty = checkEnvelopes(coreVoucherData);
                win.webContents.send('sync-progress-check', { progress: 13, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                if (!coreVoucherDataAllEmpty.allEmpty) {
                    await updateCoreVouchersInDb(companyNameForDb, coreVoucherDataAllEmpty.nonEmptyEnvelopes, token);
                } else {
                    console.log("no need to update core vouchers")
                }
                win.webContents.send('sync-progress-check', { progress: 14, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                win.webContents.send('connector-noissue', "no error in fetchCoreVouchersFromTally");
            }
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }
        //ACCOUNTING
        try {
            const accoutingData = await incrementFetchAccountingDataFromTally(
                port,
                companyNameForTally,
                startDate,
                alterId,
                syncConfigInfo
            );

            if (accoutingData?.code === 400) {
                win.webContents.send('connector-error-check', accoutingData);
                return accoutingData
            } else {
                win.webContents.send('sync-progress-check', { progress: 16, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                const accoutingDataAllEmpty = checkEnvelopes(accoutingData);
                win.webContents.send('sync-progress-check', { progress: 19, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                if (!accoutingDataAllEmpty.allEmpty) {
                    await updateAccoutingDataInDb(companyNameForDb, accoutingDataAllEmpty.nonEmptyEnvelopes, token);
                } else {
                    console.log("no need to update accounting vouchers")
                }
                win.webContents.send('sync-progress-check', { progress: 22, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                win.webContents.send('connector-noissue', "no error in fetchAccountingDataFromTally");
            }
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }
        //INVENTORY
        try {
            const inventoryData = await incrementFetchVouchersInventoryDataFromTally(
                port,
                companyNameForTally,
                startDate,
                alterId,
                syncConfigInfo
            );
            if (inventoryData?.code === 400) {
                win.webContents.send('connector-error-check', inventoryData);
                return inventoryData
            } else {
                // console.log(inventoryData, "inventoryData");
                win.webContents.send('sync-progress-check', { progress: 28, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                const inventoryDataAllEmpty = checkEnvelopes(inventoryData);
                // console.log(inventoryDataAllEmpty.nonEmptyEnvelopes, "inventoryDataAllEmpty");

                win.webContents.send('sync-progress-check', { progress: 32, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                if (!inventoryDataAllEmpty.allEmpty) {
                    await updateInventoryDataInDb(companyNameForDb, inventoryDataAllEmpty.nonEmptyEnvelopes, token);
                } else {
                    console.log("no need to update inventory vouchers")
                }
                win.webContents.send('sync-progress-check', { progress: 38, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                win.webContents.send('connector-noissue', "no error in fetchVouchersInventoryDataFromTally");
            }
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }
        //BILL
        try {
            const billData = await incrementFetchVouchersBillDataFromTally(
                port,
                companyNameForTally,
                startDate,
                alterId,
                syncConfigInfo
            );
            if (billData?.code === 400) {
                win.webContents.send('connector-error-check', billData);
                return billData
            } else {
                win.webContents.send('sync-progress-check', { progress: 42, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                const billDataAllEmpty = checkEnvelopes(billData);
                win.webContents.send('sync-progress-check', { progress: 47, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                if (!billDataAllEmpty.allEmpty) {
                    await updateBillDataInDb(companyNameForDb, billDataAllEmpty.nonEmptyEnvelopes, token);
                } else {
                    console.log("no need to update bill vouchers")
                }
                win.webContents.send('sync-progress-check', { progress: 50, companyName: companyNameForTally, isCronJob: isCronJobStarted });
                win.webContents.send('connector-noissue', "no error in fetchVouchersBillDataFromTally");
            }
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }
        console.timeEnd("incrementSyncVouchers");
        return;
    } catch (error: any) {
        console.log(error);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
};

function checkEnvelopes(arr: any) {
    // Check if all ENVELOPE properties are empty
    const allEmpty = arr.every((obj: any) => obj?.ENVELOPE === '');

    // Filter objects that are not empty
    let nonEmptyEnvelopes: any = [];
    if (!allEmpty) {
        nonEmptyEnvelopes = arr.filter((obj: any) => obj?.ENVELOPE !== '');
    }

    let outputArray = nonEmptyEnvelopes.map((item: any) => {
        const envelope = item.ENVELOPE;
        // Use object destructuring to remove the FLDBLANK key
        const { FLDBLANK, ...newEnvelope } = envelope;
        return { ENVELOPE: newEnvelope };
    });

    nonEmptyEnvelopes = outputArray

    return { allEmpty, nonEmptyEnvelopes };
}

export { incrementSyncVouchers };
