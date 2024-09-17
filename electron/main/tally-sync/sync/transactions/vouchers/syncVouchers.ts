import { win } from "../../../../index";
import {
    fetchCoreVouchersFromTally,
    fetchAccountingDataFromTally,
    fetchVouchersInventoryDataFromTally,
    fetchVouchersBillDataFromTally,
} from "../../../internal/fromTally/XML/transactions/getAllVouchersData";
import {
    updateCoreVouchersInDb,
    updateAccoutingDataInDb,
    updateInventoryDataInDb,
    updateBillDataInDb,
} from "../../../toCloud/transactions/updateVouchersInDb";

const syncVouchers = async (
    port: any,
    companyNameForDb: string,
    companyNameForTally: string,
    startDate: Date,
    isCronJobStarted: any,
    token: any,
    syncConfigInfo: any
) => {
    console.time("syncVouchers");
    try {
        let coreVoucherData: any;
        try {
            coreVoucherData = await fetchCoreVouchersFromTally(
                port,
                companyNameForTally,
                startDate,
                syncConfigInfo
            );
            if (coreVoucherData?.code === 400) {
                return coreVoucherData
            }
            win.webContents.send('sync-progress-check', { progress: 20, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in fetchCoreVouchersFromTally");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }

        let accoutingData: any;
        try {
            accoutingData = await fetchAccountingDataFromTally(
                port,
                companyNameForTally,
                startDate,
                syncConfigInfo
            );
            if (accoutingData?.code === 400) {
                return accoutingData
            }
            win.webContents.send('sync-progress-check', { progress: 26, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in fetchAccountingDataFromTally");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }

        let inventoryData: any;
        try {
            inventoryData = await fetchVouchersInventoryDataFromTally(
                port,
                companyNameForTally,
                startDate,
                syncConfigInfo
            );
            if (inventoryData?.code === 400) {
                return inventoryData
            }
            win.webContents.send('sync-progress-check', { progress: 32, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in fetchVouchersInventoryDataFromTally");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }

        let billData: any;
        try {
            billData = await fetchVouchersBillDataFromTally(
                port,
                companyNameForTally,
                startDate,
                syncConfigInfo
            );
            if (billData?.code === 400) {
                return billData
            }
            win.webContents.send('sync-progress-check', { progress: 38, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in fetchVouchersBillDataFromTally");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }

        try {
            const res = await updateCoreVouchersInDb(companyNameForDb, coreVoucherData, token);
            if (res?.code === 400) {
                return res
            }
            win.webContents.send('sync-progress-check', { progress: 42, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateCoreVouchersInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }
        try {
            const res = await updateAccoutingDataInDb(companyNameForDb, accoutingData, token);
            if (res?.code === 400) {
                return res
            }
            win.webContents.send('sync-progress-check', { progress: 43, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateAccoutingDataInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }
        try {
            const res = await updateInventoryDataInDb(companyNameForDb, inventoryData, token);
            if (res?.code === 400) {
                return res
            }
            win.webContents.send('sync-progress-check', { progress: 44, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateInventoryDataInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }
        try {
            const res = await updateBillDataInDb(companyNameForDb, billData, token);
            if (res?.code === 400) {
                return res
            }
            win.webContents.send('sync-progress-check', { progress: 45, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateBillDataInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Somthing went wrong, Please restart the application."
            }
        }

        console.timeEnd("syncVouchers");
        win.webContents.send('connector-noissue', "no error in syncVouchers");
        return {
            code: 200,
            msg: "All voucher sync done."
        }
    } catch (error: any) {
        console.log(error);
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application."
        }
    }
};

export { syncVouchers };
