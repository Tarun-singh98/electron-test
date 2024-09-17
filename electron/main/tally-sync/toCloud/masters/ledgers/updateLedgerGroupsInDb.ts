import axios from "axios";

import { getLedgersGroupDataFromTally } from "../../../internal/fromTally/XML/masters/ledgers/getAllLedgerGroupData";
import { ipProxy } from "../../../../../../core/ipConfig";
import { win } from "../../../../index";

const apiEndpoint = `${ipProxy}/group`;

export const updateLedgerGroupsInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const groupsData: any = await getLedgersGroupDataFromTally(port, companyNameForTally);
        if (groupsData?.code === 400) {
            win.webContents.send('connector-error-check', groupsData);
            return groupsData
        }
        if (groupsData.length === 0) {
            console.log("No Ledger Groups found in Tally");
            return;
        }
        // const group = remove$(groupsData)
        const data = await axios.post(`${apiEndpoint}/fetch?companyName=${companyName}`,
            groupsData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if(data.status !== 200){
            return {
                code : 400,
                err : data.data
            }
        }
        console.log("response from updateLedgerGroupsInDb", data.data);
        return;

    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateLedgerGroupsInDb function",
            err: error.message
        }
    }
}

export const updateEmptyGroupReserveName = async (companyName: any, token: any) => {
    try {
        const res = await axios.put(`${apiEndpoint}/updateemptygroupreservename?companyName=${companyName}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("response from updateEmptyGroupReserveName", res.data);
        return;

    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateEmptyGroupReserveName function",
            err: error.message
        }
    }
}
