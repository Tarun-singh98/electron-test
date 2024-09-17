import { win } from "../../../index";
import { ipProxy } from "../../../../../core/ipConfig"
import { fetchTallyAppInfo } from "../../internal/tallyInfo/tallyCompaniesInfo";
const { parseString } = require("xml2js");

const { default: axios } = require("axios")

export const checkCompanyExistenceBeforeSync = async (companyName: any) => {
    try {
        const companylistinDb = await axios.get(`${ipProxy}/checkcompanyexists?companyName=${companyName}`)
        win.webContents.send('connector-noissue', "no error in checkCompanyExistenceBeforeSync");
        return companylistinDb
    } catch (error: any) {
        console.error(error)
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application."
        }
    }
}

export const companyPermissionConfigFetch = async (companyName: any, token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const permissionConfig = await axios.post(`${ipProxy}/companiesconfig/createpermissionconfig?dbName=${companyName}`, {}, { headers })
        let permissions = permissionConfig.data.configInCompany.permissions
        permissions.isAdmin = true
        permissions.isOwner = true
        permissions.isRegister = true
        permissions.isDevice = false
        win.webContents.send('connector-noissue', "no error in companyPermissionConfigFetch");
        return permissions
    } catch (error: any) {
        console.error(error)
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
}

export const updateSyncTime = async (lastSynced: any, companyName: any, email: any, CLPCode: any, token: any) => {
    try {
        let data = { lastSynced, email }
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const updateTime = await axios.put(`${ipProxy}/user/updatesynctime?companyName=${companyName}&CLPCode=${CLPCode}`, data, { headers })
        console.log(updateTime.data);
        win.webContents.send('connector-noissue', "no error in updateSyncTime");
        return
    } catch (error: any) {
        console.error(error)
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application."
        }
    }
}

export const checKTallyConnection = async (port: any) => {
    try {
        if (!port) {
            return {
                code: 400,
                msg: "port is undefined."
            }
        }
        const checkConnection = await axios.get(`http://localhost:${port}`)
        const data = await checkConnection.data;
        let tallyResponse: any;
        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            tallyResponse = result
        });
        win.webContents.send('connector-noissue', "no error in checKTallyConnection");
        if (tallyResponse.RESPONSE === 'TallyPrime Server is Running') {
            return true
        } else {
            return false
        }
    } catch (error: any) {
        console.error(error.message)
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
}


export const educationModeCheck = async (port: any) => {
    try {
        if (!port) {
            return {
                code: 400,
                msg: "port is undefined."
            }
        }
        const tallyResponse: any = await fetchTallyAppInfo(port)
        if (tallyResponse.info.isEducationalMode.toLowerCase() === 'yes') {
            return true
        } else {
            return false
        }
    } catch (error: any) {
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
}

export const updatePemissionConfig = async (companyNameForDb: any, token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const updatedPermissionConfig = await axios.put(`${ipProxy}/companiesconfig/permission/update?dbName=${companyNameForDb}`, {}, { headers })
        console.log(updatedPermissionConfig.data);
        return
    } catch (error: any) {
        return {
            code: 400,
            msg: "error in updatePemissionConfig function. beforeSyncing.ts file.",
            error: error.message
        }
    }
}