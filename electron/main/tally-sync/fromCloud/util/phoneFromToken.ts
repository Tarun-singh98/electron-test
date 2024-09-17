import axios from "axios";
import { win } from "../../../index";
import { ipProxy } from "../../../../../core/ipConfig";
import { app } from "electron";

export const phoneFromToken = async (token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const data = await axios.get(`${ipProxy}/user/phone`, { headers })
        if (data.data.status === false) {
            win.webContents.send('connector-error-check', data.data.msg);
            return {
                code: 400,
                msg: data.data.msg
            }
        }
        win.webContents.send('connector-noissue', "no error in Phone number fetched from token");
        return data.data.phone;
    } catch (error: any) {
        console.error(error);
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
}

export const fetchConnectorVersionInfo = async () => {
    try {
        const latestVersion: any = await axios.get(`${ipProxy}/currentConnectorVersion/getconnectorversion`);
        if (latestVersion?.status !== 200) {
            return false
        }
        const currentVersion: any = app.getVersion();
        const liveVersion = latestVersion?.data?.data?.version
        console.log(currentVersion, "<-- currentVersion -- LiveVersion -->", liveVersion);
        const cronJobSkip = latestVersion?.data?.data?.cronJobSkip;
        if (currentVersion === liveVersion) {
            return true
        } else {
            return cronJobSkip;
        }
    } catch (error: any) {
        console.log(error.message, "Error while getting the current name");
        return {
            code: 400,
            err: error.message
        }
    }
}

export const checkGlobalCronAllow = async () => {
    try {
        const appConfig: any = await axios.get(`${ipProxy}/appconfig/get`);
        if (appConfig?.status === 200) {
            return appConfig?.data?.data?.connector?.globalCronJobAllow || false
        } else {
            return false
        }
    } catch (error: any) {
        return {
            code: 400,
            err: error.message
        }
    }
}