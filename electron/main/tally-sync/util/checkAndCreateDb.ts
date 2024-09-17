import axios from "axios";
import { ipProxy } from "../../../../core/ipConfig";
import { win } from "../../index";


export const checkAndCreateDb = async (companyNameAsTally: any, companyName_lowerCase: any, licenseNumber: any, phoneNumber: any, token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const body = {
            companyNameAsTally,
            companyName: companyName_lowerCase,
            licenseNumber,
            phoneNumber
        }
        const data = await axios.post(`${ipProxy}/db/checkandcreatedb`, body, { headers })
        win.webContents.send('connector-noissue', "no error in checkAndCreateDb");
        console.log(data.data.data.dbName, "data from checkAndCreateDb");
        return data.data.data.dbName;
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