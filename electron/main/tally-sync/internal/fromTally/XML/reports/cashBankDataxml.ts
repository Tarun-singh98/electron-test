import moment from "moment";
const { parseString } = require("xml2js");

export const fetchCashBankDataFromTally = async (port:any, companyNameForTally: any, startDate: moment.MomentInput) => {
    console.time("fetchCashBankDataFromTally")
    try {
        const fromDate = moment(startDate, 'YYYYMMDD').format('DD-MM-YYYY');
        const toDate = moment().format('DD-MM-YYYY');

        const arr: any = [];

        // Loop through each day within the date range
        let currentDate = moment(fromDate, 'DD-MM-YYYY');
        const endDate = moment(toDate, 'DD-MM-YYYY');

        while (currentDate.isSameOrBefore(endDate, "day")) {
            const formattedDate = currentDate.format("YYYYMMDD");

            // console.log("currentDate -->", formattedDate);

            // Construct the XML payload with the current date
            const xmlPayload = `<ENVELOPE>
        <HEADER>
            <TALLYREQUEST>Export Data</TALLYREQUEST>
        </HEADER>
        <BODY>
            <EXPORTDATA>
                <REQUESTDESC>
                    <STATICVARIABLES>
                        <SVFROMDATE>${formattedDate}</SVFROMDATE>
                        <SVTODATE>${formattedDate}</SVTODATE>
                        <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
                        <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
                    </STATICVARIABLES>
                    <REPORTNAME>Bank Group summary</REPORTNAME>
                </REQUESTDESC>
            </EXPORTDATA>
        </BODY>
    </ENVELOPE>`;

            // Add a 1-second delay using setTimeout

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
                const finalData = {
                    res: result,
                    date: formattedDate
                }
                if (result.ENVELOPE.length != 0) {
                    arr.push(finalData);
                }
            });

            // await new Promise(resolve => setTimeout(resolve, 150));

            // Move to the next day
            currentDate.add(1, "day");

            // console.timeEnd('fetchOtmizedVoucherData');
        }
        console.log(arr.length);
        console.timeEnd("fetchCashBankDataFromTally")
        return arr;
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
