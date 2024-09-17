import axios from "axios";
import { ipProxy } from "../../../../../core/ipConfig";
import { win } from "../../../index";

const apiEndpoint = `${ipProxy}`;

export const pushCompanyToUserObject = async (InfoData: { email: any; machineId: any; tally_companyInfo: any; permissions: any; connectorConfig: any }, companyNameForDb: string, token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const companypush = await axios.patch(`${apiEndpoint}/user/updateuser?dbName=${companyNameForDb}`, InfoData, { headers });
        console.log("company pushed successfully ------------->", companypush.data.msg);
        win.webContents.send('connector-noissue', "no error in pushCompanyToUserObject");
        return companypush
    } catch (error: any) {
        console.log(error)
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application."
        }
    }
}

export const pushCompanyToRootCompanyCollection = async (rootCompanyObj: any, token: any) => {
    // console.log(rootCompanyObj)
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const rootCompanypush = await axios.post(`${apiEndpoint}/company/create`, rootCompanyObj, { headers });
        // console.log("company pushed successfully", rootCompanypush.data);
        win.webContents.send('connector-noissue', "no error in pushCompanyToRootCompanyCollection");
        return
    } catch (error: any) {
        console.log(error)
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application."
        }
    }
}
