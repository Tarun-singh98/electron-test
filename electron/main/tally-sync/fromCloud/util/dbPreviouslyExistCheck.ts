import axios from "axios";
import { win } from "../../../index";
import { ipProxy } from "../../../../../core/ipConfig";

export const companyPreviouslyExists = async (token: any, companyNameForDb: any, licenseNumber: any, machineId: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const data = await axios.get(`${ipProxy}/company/dbexistcheck?dbName=${companyNameForDb}&licenseNumber=${licenseNumber}&machineId=${machineId}`, { headers })
   
        if (data.data.status === true) {
            win.webContents.send('connector-error-check', data.data.msg);
            return {
                code: 400,
                status: data.data.status,
                msg: data.data.msg,
                data: data.data.data
            }
        }
        win.webContents.send('connector-noissue', "no error in company previously exist check");
        return {
            code: 200,
            status: data.data.status,
            msg: data.data.msg,
        };
    } catch (error: any) {
        console.error(error);
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err : error.message
        }
    }
}