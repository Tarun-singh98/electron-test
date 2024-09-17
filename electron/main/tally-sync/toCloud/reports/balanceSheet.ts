const axios = require("axios");

import { win } from "../../../index";
import { ipProxy } from "../../../../../core/ipConfig";
import { fetchBalanceSheetFromTally } from "../../internal/fromTally/XML/reports/balanceSheet";

const apiEndpoint = `${ipProxy}/balancesheet`;

//---------------------------------------->sendBalanceSheetData<--------------------------------------------//
export const updateBalanceSheetInDb = async (port: any, companyNameForDb: any, companyNameForTally: any, startDate: any, isCronJobStarted: any, token: any) => {
    console.time("updateBalanceSheetInDb")
    try {
        const data = await fetchBalanceSheetFromTally(port, companyNameForTally, startDate);
        if (data?.code === 400) {
            return data
        }
        if (data.length === 0) {
            console.log("No Balance Sheet data found in Tally");
            return;
        }
        win.webContents.send('sync-progress-check', { progress: 75, companyName: companyNameForTally, isCronJob: isCronJobStarted });    // 2> voucherSync will be called
        let finalData = []
        for (let i = 0; i < data.length; i++) {
            const convertedData = processAccountData(data[i].result, data[i].fromDate, data[i].toDate)
            finalData.push(convertedData)
        }
        const res = await axios.post(`${apiEndpoint}/fetchbalancesheet?dbName=${companyNameForDb}`, finalData,
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
        console.timeEnd("updateBalanceSheetInDb")
    } catch (error: any) {
        console.error("An error occurred during the sendBalanceSheet API call:", error);
        return {
            code: 400,
            msg: "err sendBalanceSheet",
            err: error.message
        }
    }
};

//--------------------------------------------------------------------------------------------------------------//

function processAccountData(data: any, fromDate: any, toDate: any) {
    const accountNames = data.ENVELOPE?.BSNAME.map((bs: any) => bs?.DSPACCNAME?.[0]?.DSPDISPNAME?.[0]);
    const subAmount = data.ENVELOPE?.BSAMT.map((amout: any) => amout?.BSSUBAMT?.[0]);
    const mainAmount = data.ENVELOPE?.BSAMT.map((amout: any) => amout?.BSMAINAMT?.[0]);

    const objectsArray = [];

    for (let i = 0; i < accountNames.length; i++) {
        const name = accountNames[i];
        const subAmountValue = subAmount[i] === '' ? 0 : parseFloat(subAmount[i]);
        const mainAmountValue = mainAmount[i] === '' ? 0 : parseFloat(mainAmount[i]);

        objectsArray.push({ name, subAmountValue: subAmountValue, mainAmountValue: mainAmountValue });
    }

    return { fromDate, toDate, balanceSheet: objectsArray };
}