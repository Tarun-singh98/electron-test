const axios = require('axios');
import { win } from "../../../../index";
import { ipProxy } from "../../../../../../core/ipConfig";
import { getLedgersDataFromTally } from "../../../internal/fromTally/XML/masters/ledgers/getAllLedgersData";

const apiEndpoint = `${ipProxy}/ledger`;

export const updateLedgersInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const data: any = await getLedgersDataFromTally(port, companyNameForTally);
        if (data?.code === 400) {
            win.webContents.send('connector-error-check', data);
            return data
        }
        if (data.length === 0) {
            console.log("No Ledgers found in Tally");
            return;
        }
        const response = await axios.post(`${apiEndpoint}/fetchallledgerdata?companyName=${companyName}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        if(response.status !== 200){
            return {
                code : 400,
                err : response.data
            }
        }
        console.log("response from updateLedgersInDb", response.data);
        return;
    } catch (error: any) {
        console.error('An error occurred during the initial API call:', error);
        return {
            code: 400,
            msg: "Err in updateLedgersInDb",
            err: error.message
        }
    }
};