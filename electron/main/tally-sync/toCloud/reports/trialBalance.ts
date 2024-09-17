const axios = require("axios");

import { win } from "../../../index";
import { ipProxy } from "../../../../../core/ipConfig";
import { fetchTrialBalanceFromTally } from "../../internal/fromTally/XML/reports/trialBalance";

const apiEndpoint = `${ipProxy}/trialbalance`;

//---------------------------------------->sendTrialBalance<--------------------------------------------//
export const updateTrialBalanceInDb = async (port: any, companyNameForDb: any, companyNameForTally: any, startDate: any, isCronJobStarted: any, token: any) => {
    console.time("updateTrialBalanceInDb")
    try {
        const data = await fetchTrialBalanceFromTally(port, companyNameForTally, startDate);
        if (data?.code === 400) {
            return data
        }
        if (data.length === 0) {
            console.log("No Trial Balance data found in Tally");
            return;
        }
        win.webContents.send('sync-progress-check', { progress: 69, companyName: companyNameForTally, isCronJob: isCronJobStarted });    // 2> voucherSync will be called
        let finalData = []
        for (let i = 0; i < data.length; i++) {
            const convertedData = processAccountData(data[i].result, data[i].fromDate, data[i].toDate)
            finalData.push(convertedData)
        }
        const res = await axios.post(`${apiEndpoint}/fetchTrialBalance?companyName=${companyNameForDb}`, finalData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.timeEnd("updateTrialBalanceInDb")
    } catch (error: any) {
        console.error("An error occurred during the initial API call:", error);
        return {
            code: 400,
            msg: "err updateTrialBalanceInDb",
            err: error.message
        }
    }
};

//--------------------------------------------------------------------------------------------------------------//

function processAccountData(data: any, fromDate: any, toDate: any) {
    const accountNames = data.ENVELOPE?.DSPACCNAME.map((tb: { DSPDISPNAME: any[]; }) => tb.DSPDISPNAME[0]);
    const debit = data.ENVELOPE?.DSPACCINFO.map((amout: { DSPCLDRAMT: { DSPCLDRAMTA: any[]; }[]; }) => amout.DSPCLDRAMT[0].DSPCLDRAMTA[0]);
    const credit = data.ENVELOPE?.DSPACCINFO.map((amout: { DSPCLCRAMT: { DSPCLCRAMTA: any[]; }[]; }) => amout.DSPCLCRAMT[0].DSPCLCRAMTA[0]);

    const objectsArray = [];

    for (let i = 0; i < accountNames.length; i++) {
        const name = accountNames[i];
        const creditValue = credit[i] === '' ? 0 : parseFloat(credit[i]);
        const debitValue = debit[i] === '' ? 0 : parseFloat(debit[i]);

        objectsArray.push({ name, credit: creditValue, debit: debitValue });
    }

    return { fromDate, toDate, trialBalance: objectsArray };
}
