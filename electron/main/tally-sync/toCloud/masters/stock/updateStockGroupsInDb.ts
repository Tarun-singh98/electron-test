const axios = require("axios");
import { win } from "../../../../index";
import { ipProxy } from "../../../../../../core/ipConfig";
import { getAllStockItemsGroupDataFromTally } from "../../../internal/fromTally/XML/masters/stockItems/getAllStockItemsGroupData";

const apiEndpoint = `${ipProxy}/stock`;

export const updateStockItemsGroupsInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const groupData: any = await getAllStockItemsGroupDataFromTally(port, companyNameForTally)
        if (groupData?.code === 400) {
            win.webContents.send('connector-error-check', groupData);
            return groupData
        }
        if (groupData.length === 0) {
            console.log("No Stock Item Groups found in Tally");
            return;
        }
        const response = await axios.post(`${apiEndpoint}/fetchStockGrouplist?companyName=${companyName}`,
            groupData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status !== 200) {
            return {
                code: 400,
                err: response.data
            }
        }

        console.log("response from updateStockItemsGroupsInDb", response.data);
        return;
    } catch (error: any) {
        console.log(error);
        return {
            code: 400,
            msg: "err in updateStockItemsGroupsInDb",
            err: error.message
        }
    }
}