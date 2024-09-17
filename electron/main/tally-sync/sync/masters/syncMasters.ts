//--------sync functions--------//
import { updateEmptyGroupReserveName, updateLedgerGroupsInDb } from "../../toCloud/masters/ledgers/updateLedgerGroupsInDb";
import { updateLedgersInDb } from "../../toCloud/masters/ledgers/updateLedgersInDb";
import { updateStockItemsGroupsInDb } from "../../toCloud/masters/stock/updateStockGroupsInDb";
import { updateStockItemsInDb } from "../../toCloud/masters/stock/updateStockItemsInDb";
import { updateEmptyReserveName, updateVoucherTypesInDb } from "../../toCloud/masters/voucherTypes/updateVoucherTypesInDb";
import { updateGodownsInDb } from "../../toCloud/masters/godown/updateGodownDataInDb";
import { updateUnitsInDb } from "../../toCloud/masters/unit/updateUnitDataInDb";
import { updateStockItemsCategoryInDb } from "../../toCloud/masters/stock/updateStockCategoryInDb";
import { updatecostCategoryInDb, updatecostCentreInDb, updateGstEffectiveRateInDb, updateOpeningBatchAllocationInDb, updateOpeningBillAllocationInDb } from "../../toCloud/masters/otherMasters/updateOtherMasters";
import { win } from "../../../index";

//----------MASTER Sync FUNCTION-------------//

export const syncMasters = async (port: any, companyNameForDb: any, companyNameForTally: any, isCronJobStarted: any, token: any) => {
    try {
        console.time("syncMasters");
        try {
            const storeLedgerIndb = await updateLedgersInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeLedgerIndb?.code === 400) {
                return storeLedgerIndb
            }
            win.webContents.send('sync-progress-check', { progress: 52, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateLedgersInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating ledgers in database",
                err: error.message
            }
        }

        try {
            const storeLedgerGroupIndb = await updateLedgerGroupsInDb(port, companyNameForDb, companyNameForTally, token);
            const updateEmpty: any = await updateEmptyGroupReserveName(companyNameForDb, token)
            if (storeLedgerGroupIndb?.code === 400) {
                return storeLedgerGroupIndb
            }
            if (updateEmpty?.code === 400) {
                return updateEmpty
            }
            win.webContents.send('sync-progress-check', { progress: 53, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateLedgerGroupsInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating ledger groups in database",
                err: error.message
            }
        }

        try {
            const storeStockGroup = await updateStockItemsGroupsInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeStockGroup?.code === 400) {
                return storeStockGroup
            }
            win.webContents.send('sync-progress-check', { progress: 54, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateStockItemsGroupsInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating stock item groups in database",
                err: error.message
            }
        }

        try {
            const storeStockItemCategory: any = await updateStockItemsCategoryInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeStockItemCategory?.code === 400) {
                return storeStockItemCategory
            }
            win.webContents.send('sync-progress-check', { progress: 54, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateStockItemsCategoryInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating stock item category in database",
                err: error.message
            }
        }

        try {
            const storeStockItemInDb = await updateStockItemsInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeStockItemInDb?.code === 400) {
                return storeStockItemInDb
            }
            win.webContents.send('sync-progress-check', { progress: 55, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateStockItemsInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating stock items in database",
                err: error.message
            }
        }

        try {
            const storeVoucherTypeInDb = await updateVoucherTypesInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeVoucherTypeInDb?.code === 400) {
                return storeVoucherTypeInDb
            }
            const updateEmpty: any = await updateEmptyReserveName(companyNameForDb, token);
            if (updateEmpty?.code === 400) {
                return updateEmpty
            }
            win.webContents.send('sync-progress-check', { progress: 56, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateVoucherTypesInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating voucher types in database",
                err: error.message
            }
        }

        try {
            const storeGodownInDb = await updateGodownsInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeGodownInDb?.code === 400) {
                return storeGodownInDb
            }
            win.webContents.send('sync-progress-check', { progress: 57, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateGodownsInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating godowns in database",
                err: error.message
            }
        }

        try {
            const storeUnitInDb = await updateUnitsInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeUnitInDb?.code === 400) {
                return storeUnitInDb
            }
            win.webContents.send('sync-progress-check', { progress: 58, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateUnitsInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating units in database",
                err: error.message
            }
        }

        try {
            const storeCCenIndb = await updatecostCategoryInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeCCenIndb?.code === 400) {
                return storeCCenIndb
            }
            win.webContents.send('sync-progress-check', { progress: 60, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updatecostCategoryInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating cost category in database",
                err: error.message
            }
        }

        try {
            const storeCCent = await updatecostCentreInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeCCent?.code === 400) {
                return storeCCent
            }
            win.webContents.send('sync-progress-check', { progress: 62, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updatecostCentreInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating cost centre in database",
                err: error.message
            }
        }

        try {
            const storeGE = await updateGstEffectiveRateInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeGE?.code === 400) {
                return storeGE
            }
            win.webContents.send('sync-progress-check', { progress: 64, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateGstEffectiveRateInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating GST effective rate in database",
                err: error.message
            }
        }

        try {
            const storeOB = await updateOpeningBatchAllocationInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeOB?.code === 400) {
                return storeOB
            }
            win.webContents.send('sync-progress-check', { progress: 66, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateOpeningBatchAllocationInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating opening batch allocation in database",
                err: error.message
            }
        }

        try {
            const storeOBA = await updateOpeningBillAllocationInDb(port, companyNameForDb, companyNameForTally, token);
            if (storeOBA?.code === 400) {
                return storeOBA
            }
            win.webContents.send('sync-progress-check', { progress: 68, companyName: companyNameForTally, isCronJob: isCronJobStarted });
            win.webContents.send('connector-noissue', "no error in updateOpeningBillAllocationInDb");
        } catch (error: any) {
            console.log(error);
            win.webContents.send('connector-error-check', error.message);
            return {
                code: 400,
                msg: "Error updating opening bill allocation in database",
                err: error.message
            }
        }

        console.timeEnd("syncMasters");
        return {
            code: 200,
            msg: "sync master complete"
        }
    } catch (error: any) {
        console.log(error);
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application."
        }
    };
};
