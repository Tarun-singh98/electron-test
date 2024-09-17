const { parseString } = require("xml2js");
import moment from 'moment';

export const fetchTrialBalanceFromTally = async (port: any, companyNameForTally: any, startDate: moment.MomentInput) => {
    console.time("fetchTrialBalanceFromTally")
    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        let currentYear = moment().format("YYYY");
        currentYear = moment(currentYear, 'YYYY').add(1, 'year').format('YYYY');

        const getFinancialYearStartDate = (date: moment.Moment) => {
            const financialYearStart = moment(`01-04-${date.format("YYYY")}`, "DD-MM-YYYY");
            return date.isBefore(financialYearStart)
                ? financialYearStart.clone().subtract(1, "years")
                : financialYearStart;
        };

        const financialYearStartDate = getFinancialYearStartDate(moment(fromDate, "DD-MM-YYYY"));
        const financialYearEndDate = (financialYearStartDate.format("YYYY") === currentYear) ? moment(`31-03-${currentYear}`, "DD-MM-YYYY").add(1, 'years') : moment(`31-03-${currentYear}`, "DD-MM-YYYY");

        const arr: any = [];

        const fetchPeriodData = async (startDate: moment.Moment, endDate: moment.Moment) => {
            const formattedFromDate = startDate.format("DD-MM-YYYY");
            const formattedToDate = endDate.format("DD-MM-YYYY");

            const xmlPayload = `<ENVELOPE>
            <HEADER>
                <VERSION>1</VERSION>
                <TALLYREQUEST>Export</TALLYREQUEST>
                <TYPE>Data</TYPE>
                <ID>Trial Balance</ID>
            </HEADER>
            <BODY>
                <DESC>
                    <STATICVARIABLES>
                        <SVEXPORTFORMAT>$$SysName:xml</SVEXPORTFORMAT>
                        <EXPLODEFLAG>Yes</EXPLODEFLAG>
                        <SVFROMDATE TYPE='Date'>${formattedFromDate}</SVFROMDATE>
                        <SVTODATE TYPE='Date'>${formattedToDate}</SVTODATE>
                        <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
                    </STATICVARIABLES>
                </DESC>
            </BODY>
        </ENVELOPE>`;

            const response = await fetch(`http://localhost:${port}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/xml",
                },
                body: xmlPayload,
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.text();

            parseString(data, (err: any, result: any) => {
                if (err) {
                    console.error("Error parsing response XML:", err);
                    return;
                }
                if (result?.ENVELOPE !== '') {
                    let dataObj = {
                        fromDate: formattedFromDate,
                        toDate: formattedToDate,
                        result
                    }
                    arr.push(dataObj);
                }
            });

            await new Promise(resolve => setTimeout(resolve, 200));
        };

        let currentDate = financialYearStartDate;
        const endDate = financialYearEndDate;

        //YEAR
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            // console.log("running for year ---------->trial balance");
            const next12MonthsEndDate = currentDate.clone().add(12, 'months').subtract(1, 'day');
            const endDate1 = moment.min(next12MonthsEndDate, endDate);

            await fetchPeriodData(currentDate, endDate1);
            currentDate = next12MonthsEndDate.clone().add(1, 'day');
        }

        currentDate = financialYearStartDate;

        //QUARTER
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            // console.log("running for quarter ---------->trial balance");
            const nextQuarterEndDate = currentDate.clone().endOf('quarter');
            const endDate1 = moment.min(nextQuarterEndDate, endDate);

            await fetchPeriodData(currentDate, endDate1);
            currentDate = nextQuarterEndDate.clone().add(1, 'day');
        }

        currentDate = financialYearStartDate;

        //MONTH
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            // console.log("running for month ---------->trial balance");
            const nextMonthEndDate = currentDate.clone().endOf('month');
            const endDate1 = moment.min(nextMonthEndDate, endDate);

            await fetchPeriodData(currentDate, endDate1);
            currentDate = nextMonthEndDate.clone().add(1, 'day');
        }


        console.timeEnd("fetchTrialBalanceFromTally");
        // console.log(arr);
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
