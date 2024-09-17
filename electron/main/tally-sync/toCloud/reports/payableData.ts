const axios = require('axios');
import moment from 'moment';

import { fetchPayableDataFromTally } from '../../internal/fromTally/XML/reports/payable';
import { ipProxy } from '../../../../../core/ipConfig';
import { win } from '../../../index';

const apiEndpoint = `${ipProxy}/payable`;

export const updatePayableInDB = async (port: any, companyNameForDb: any, companyNameForTally: any, startDate: any, isCronJobStarted: any, token: any, syncConfigInfo: any) => {
    console.time('updatePayableInDB');
    try {
        const data: any = await fetchPayableDataFromTally(port, companyNameForTally, startDate, syncConfigInfo);
        if (data?.code === 400) {
            return data
        }
        if (data?.ENVELOPE === '') {
            console.log('No Payable data found in Tally');
            return;
        }
        win.webContents.send('sync-progress-check', { progress: 88, companyName: companyNameForTally, isCronJob: isCronJobStarted });    // 2> voucherSync will be called
        let payableArr = await extractData(data)
        const res = await axios.post(`${apiEndpoint}/fetch?companyName=${companyNameForDb}`, payableArr,
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
        console.timeEnd('updatePayableInDB');
        return
    } catch (error: any) {
        console.log(error);
        console.error('An error occurred during the sendReceivableData API call:');
        return {
            code: 400,
            msg: "err sendReceivableData",
            err: error.message
        }
    }
};


function extractData(obj: any) {
    const data = obj.ENVELOPE.BILLFIXED?.map((bill: any, index: any) => {
        let date = bill.BILLDATE[0];
        date = moment(date, 'DD-MMM-YY').format('YYYYMMDD');
        const referenceNumber = bill.BILLREF[0];
        const partyName = bill.BILLPARTY[0];
        const pendingAmount = obj.ENVELOPE.BILLCL[index];
        let dueOn = obj.ENVELOPE.BILLDUE[index];
        dueOn = moment(dueOn, 'DD-MMM-YY').format('YYYYMMDD');
        const overDueByDays = obj.ENVELOPE.BILLOVERDUE[index];

        return {
            date,
            referenceNumber,
            partyName,
            pendingAmount,
            dueOn,
            overDueByDays
        };
    });

    return data;
}