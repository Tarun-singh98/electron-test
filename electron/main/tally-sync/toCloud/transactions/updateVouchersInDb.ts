import { win } from "../../../index";
import { ipProxy } from "../../../../../core/ipConfig";

const axios = require("axios");

const apiEndpoint = `${ipProxy}/voucher`;
export const updateCoreVouchersInDb = async (companyNameForDb: any, vouchers: any, token: any) => {
    try {
        // console.log(companyNameForDb, "company name from update");
        const data = await axios.post(
            `${apiEndpoint}/addcorevouchers?companyName=${companyNameForDb}`,
            vouchers,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (data.status !== 200) {
            return {
                code: 400,
                err: data.data
            }
        }
        // console.log("response from updateCoreVouchersInDb", data.data);
        win.webContents.send('connector-noissue', "no error in updateCoreVouchersInDb");
    } catch (error: any) {
        win.webContents.send('connector-error-check', "error in updateCoreVouchersInDb");
        console.error("An error occurred during updateVouchersInDb:", error);
        return {
            code: 400,
            msg: "Error in updateCoreVouchersInDb",
            err: error.message
        }
    }
};

export const updateAccoutingDataInDb = async (companyNameForDb: any, vouchers: any, token: any) => {
    try {
        // console.log(companyNameForDb, "company name from update");
        const data = await axios.post(
            `${apiEndpoint}/addaccountingvouchers?companyName=${companyNameForDb}`,
            vouchers,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (data.status !== 200) {
            return {
                code: 400,
                err: data.data
            }
        }
        // console.log("response from updateAccoutingDataInDb", data.data);
        win.webContents.send('connector-noissue', "no error in updateAccoutingDataInDb");
    } catch (error: any) {
        win.webContents.send('connector-error-check', "error in updateAccoutingDataInDb");
        console.error("An error occurred during updateAccoutingDataInDb:", error);
        return {
            code: 400,
            msg: "Error in updateAccoutingDataInDb",
            err: error.message
        }
    }
};

export const updateInventoryDataInDb = async (companyNameForDb: any, vouchers: any, token: any) => {
    try {
        // console.log(companyNameForDb, "company name from update");
        const data = await axios.post(
            `${apiEndpoint}/addinventoryvouchers?companyName=${companyNameForDb}`,
            vouchers,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (data.status !== 200) {
            return {
                code: 400,
                err: data.data
            }
        }
        // console.log("response from updateInventoryDataInDb", data.data);
        win.webContents.send('connector-noissue', "no error in updateInventoryDataInDb");
    } catch (error: any) {
        win.webContents.send('connector-error-check', "error in updateInventoryDataInDb");
        console.error("An error occurred during updateInventoryDataInDb:", error);
        return {
            code: 400,
            msg: "Error in updateInventoryDataInDb",
            err: error.message
        }
    }
};

export const updateBillDataInDb = async (companyNameForDb: any, vouchers: any, token: any) => {
    try {
        // console.log(companyNameForDb, "company name from update");
        const data = await axios.post(
            `${apiEndpoint}/addbillvouchers?companyName=${companyNameForDb}`,
            vouchers,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (data.status !== 200) {
            return {
                code: 400,
                err: data.data
            }
        }
        // console.log("response from updateBillDataInDb", data.data);
        win.webContents.send('connector-noissue', "no error in updateBillDataInDb");
    } catch (error: any) {
        win.webContents.send('connector-error-check', "error in updateBillDataInDb");
        console.error("An error occurred during updateBillDataInDb:", error);
        return {
            code: 400,
            msg: "Error in updateBillDataInDb",
            err: error.message
        }
    }
};

