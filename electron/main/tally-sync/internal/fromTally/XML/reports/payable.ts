import moment from "moment";
const { parseString } = require("xml2js");

export const fetchPayableDataFromTally = async (port: any, companyNameForTally: any, startDate: moment.MomentInput, syncConfigInfo: any) => {
    console.time("fetchPayableDataFromTally")
    try {
        const fromDate = moment(startDate, 'YYYYMMDD').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');

        let payableResult

        const xmlPayload = `<ENVELOPE>
    <HEADER>
        <TALLYREQUEST>Export Data</TALLYREQUEST>
    </HEADER>
    <BODY>
        <EXPORTDATA>
            <REQUESTDESC>
                <STATICVARIABLES>
                    <SVFROMDATE>${fromDate}</SVFROMDATE>
                    <SVTODATE>${toDate}</SVTODATE>
                    <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                    <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
                </STATICVARIABLES>
                <REPORTNAME>Bills Payable</REPORTNAME>
            </REQUESTDESC>
        </EXPORTDATA>
    </BODY>
</ENVELOPE>`;

        // Add a 1-second delay using setTimeout
        await new Promise(resolve => setTimeout(resolve, +syncConfigInfo.report.payableInMs));

        // Send the request to Tally
        const response = await fetch(`http://localhost:${port}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
                "Content-Length": xmlPayload.length.toString(),
            },
            body: xmlPayload,
        });

        // Handle the response from Tally
        const data = await response.text();

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            payableResult = result
        });
        console.timeEnd("fetchPayableDataFromTally")
        return payableResult;
    } catch (error: any) {
        console.log(error.message);
        if (error.message === 'fetch failed') {
            return {
                code: 400,
                msg: 'Tally is not running'
            }
        } else {
            return {
                code: 400,
                msg: 'Somthing went wrong, Please restart the application.'
            }
        }
    }
};

