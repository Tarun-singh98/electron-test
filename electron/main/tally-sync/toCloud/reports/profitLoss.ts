import axios from "axios";

import { fetchProfitLossFromTally } from '../../internal/fromTally/XML/reports/profitLoss';
import { ipProxy } from "../../../../../core/ipConfig";
import { win } from "../../../index";
const apiEndpoint = `${ipProxy}/profitloss`;

//---------------------------------------->sendRatioData<--------------------------------------------//
export const updateProfitLossInDb = async (port: any, companyNameForDb: any, companyNameForTally: any, startDate: any, isCronJobStarted: any, token: any) => {
    console.time("updateProfitLossInDb")
    try {
        const data = await fetchProfitLossFromTally(port, companyNameForTally, startDate);
        if (data?.code === 400) {
            return data
        }
        if (data.length === 0) {
            console.log('No Profit and Loss data found in Tally');
            return;
        }
        win.webContents.send('sync-progress-check', { progress: 72, companyName: companyNameForTally, isCronJob: isCronJobStarted });
        let finalData = []
        for (let i = 0; i < data.length; i++) {
            const convertedData = processAccountData(data[i].result, data[i].fromDate, data[i].toDate)
            finalData.push(convertedData)
        }
        const res = await axios.post(`${apiEndpoint}/fetchProfitLoss?companyName=${companyNameForDb}`, finalData,
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
        console.timeEnd("updateProfitLossInDb")
    } catch (error: any) {
        console.error("An error occurred during the sendProfitLoss API call:", error);
        return {
            code: 400,
            msg: "err sendProfitLoss",
            err: error.message
        }
    }
};
//--------------------------------------------------------------------------------------------------------------//

function processAccountData(data: any, fromDate: any, toDate: any) {
    // console.log(data, "data");

    const accountNames = data.ENVELOPE?.DSPACCNAME.map((pl: any) => pl.DSPDISPNAME[0]);
    const debit = data.ENVELOPE?.PLAMT.map((amout: any) => (amout.PLSUBAMT[0]));
    const credit = data.ENVELOPE?.PLAMT.map((amout: any) => (amout.BSMAINAMT[0]));

    // const accountNames2 = data.ENVELOPE?.BSNAME.map((pl: any) => (pl?.DSPACCNAME?.[0]?.DSPDISPNAME[0]));
    // const debit1 = data.ENVELOPE?.PLAMT.map((amout: any) => Math.abs(amout?.PLSUBAMT[0]));
    // const credit1 = data.ENVELOPE?.PLAMT.map((amout: any) => Math.abs(amout?.BSMAINAMT[0]));

    const objectsArray = [];

    for (let i = 0; i < accountNames.length; i++) {
        const name = accountNames[i];
        const creditValue = credit[i] === '' ? 0 : parseFloat(credit[i]);
        const debitValue = debit[i] === '' ? 0 : parseFloat(debit[i]);

        objectsArray.push({ name, credit: creditValue, debit: debitValue });
    }

    // for (let j = 0; j < accountNames2.length; j++) {
    //     const name = accountNames2[j];
    //     const creditValue = credit1[j] === '' ? 0 : parseFloat(credit1[j]);
    //     const debitValue = debit1[j] === '' ? 0 : parseFloat(debit1[j]);

    //     objectsArray.push({ name, credit: creditValue, debit: debitValue });
    // }

    return { fromDate, toDate, profitLoss: objectsArray };
}