const cron = require("cron");
const axios = require("axios");

import { fetchCashBankDataFromTally } from "../../internal/fromTally/XML/reports/cashBankDataxml";
import { ipProxy } from "../../../../../core/ipConfig";
import { ledgerFromCloud } from "../../fromCloud/ledger/ledgerFromCloud";
import { win } from "../../../index";

const apiEndpoint = `${ipProxy}/cashbank`;

//---------------------------------------->sendCashBankData<--------------------------------------------//
export const updateCashBankdataInDb = async (port: any, companyNameForDb: any, companyNameForTally: any, startDate: any, isCronJobStarted: any, token: any) => {
    console.time("updateCashBankdataInDb")
    try {
        const data = await fetchCashBankDataFromTally(port, companyNameForTally, startDate);
        if (data?.code === 400) {
            return data
        }
        if (data.length === 0) {
            console.log("No Cash Bank data found in Tally");
            return;
        }
        win.webContents.send('sync-progress-check', { progress: 80, companyName: companyNameForTally, isCronJob: isCronJobStarted });    // 2> voucherSync will be called

        let cashBankArr = []

        const ledgerData = await ledgerFromCloud(companyNameForDb, token);

        // console.log(ledgerData?.data);

        if (data) {

            for (let i = 0; i < data.length; i++) {
                const cleanUpData = await cleanUp(data[i].res, ledgerData?.data.data)

                const finalData = {
                    cashBank: cleanUpData,
                    date: data[i].date
                }

                cashBankArr.push(finalData)
            }
        }
        const res = await axios.post(`${apiEndpoint}/fetchcashbankdata?dbName=${companyNameForDb}`, cashBankArr,
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
        console.timeEnd("updateCashBankdataInDb")
        return
    } catch (error: any) {
        console.error("An error occurred during the initial API call:", error);
        return {
            code: 400,
            msg: "err updateCashBankdataInDb",
            err: error.message
        }
    }
};

//--------------------------------------------------------------------------------------------------------------//

const cleanUp = async (data: any, ledgerData: any) => {
    const extractedData = data?.ENVELOPE?.DSPACCNAME?.map((account: any, index: any) => ({
        name: account.DSPDISPNAME[0],
        closingBalance: data?.ENVELOPE?.DSPACCINFO[index]?.DSPCLDRAMT[0]?.DSPCLDRAMTA[0],
        balance: data?.ENVELOPE?.DSPACCINFO[index]?.DSPCLCRAMT[0]?.DSPCLCRAMTA[0]
    }));

    // const odbcData = await cashBankLedgerMerge()

    // console.log(ledgerData, "ledger data");


    const withParentData = addParentField(extractedData, ledgerData)

    return withParentData
}


function addParentField(array1: any, array2: any) {
    const parentMap = new Map(array2?.map((item: { name: any; parent: any; }) => [item.name, item.parent]));

    const newArray1 = array1?.map((item: { name: unknown; }) => ({
        ...item,
        parent: parentMap.get(item.name) || null,
    }));

    // console.log(newArray1);
    return newArray1;
}

