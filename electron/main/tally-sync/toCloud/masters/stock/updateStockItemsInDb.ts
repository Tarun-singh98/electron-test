const axios = require("axios");

import { win } from "../../../../index";
import { ipProxy } from "../../../../../../core/ipConfig";
import { getAllStockItemsDataFromTally } from "../../../internal/fromTally/XML/masters/stockItems/getAllStockItems";

const apiEndpoint = `${ipProxy}/stock`;

export const updateStockItemsInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {

        const stockData: any = await getAllStockItemsDataFromTally(port, companyNameForTally)
        if (stockData?.code === 400) {
            win.webContents.send('connector-error-check', stockData);
            return stockData
        }
        if (stockData.length === 0) {
            console.log("No Stock Items found in Tally");
            return;
        }
        const res = await axios.post(`${apiEndpoint}/addstockitemindb?companyName=${companyName}`,
            stockData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updateStockItemsInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateStockItemsInDb",
            err: error.message
        }
    }
}