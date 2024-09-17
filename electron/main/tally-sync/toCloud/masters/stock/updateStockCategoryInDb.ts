const axios = require("axios");
import { win } from "../../../../index";
import { ipProxy } from "../../../../../../core/ipConfig";
import { getAllStockItemsCategoryDataFromTally } from "../../../internal/fromTally/XML/masters/stockItems/getAllStockCategories";

const apiEndpoint = `${ipProxy}/stock`;

export const updateStockItemsCategoryInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const categoryData: any = await getAllStockItemsCategoryDataFromTally(port, companyNameForTally)
        if (categoryData?.code === 400) {
            win.webContents.send('connector-error-check', categoryData);
            return categoryData
        }
        if (categoryData.length === 0) {
            console.log("No stock category data found in Tally, No need to sync.");
            return;
        }
        const response = await axios.post(`${apiEndpoint}/addstockcategoryindb?companyName=${companyName}`,
            categoryData,
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

        console.log("response from updateStockItemsCategoryInDb", response.data);
        return;
    } catch (error: any) {
        console.log(error);
        return {
            code: 400,
            msg: "err in updateStockItemsCategoryInDb",
            err: error.message
        }
    }
}