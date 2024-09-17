const { parseString } = require("xml2js");
import moment from "moment";

//FETCHING CORE VOUCHER DATA 10 DAY INTERVAL
export const incrementFetchCoreVouchersFromTally = async (port:any,companyName: any, startDate: any, alterId: any, syncConfigInfo : any) => {
    console.time("fetchVouchersFromTally");
    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const arr: any = [];

        const fetchPeriodData = async (startDate: moment.Moment, endDate: moment.Moment) => {
            const formattedFromDate = startDate.format("DD-MM-YYYY");
            const formattedToDate = endDate.format("DD-MM-YYYY");

            const xmlPayload = `<ENVELOPE>
            <HEADER>
                <VERSION>1</VERSION>
                <TALLYREQUEST>Export</TALLYREQUEST>
                <TYPE>Data</TYPE>
                <ID>MyReportLedgerTable</ID>
            </HEADER>
            <BODY>
                <DESC>
                    <STATICVARIABLES>
                        <SVEXPORTFORMAT>XML (Data Interchange)</SVEXPORTFORMAT>
                        <SVFROMDATE>${formattedFromDate}</SVFROMDATE>
                        <SVTODATE>${formattedToDate}</SVTODATE>
                        <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                    </STATICVARIABLES>
                    <TDL>
                        <TDLMESSAGE>
                            <REPORT NAME="MyReportLedgerTable">
                                <FORMS>MyForm</FORMS>
                                <VARIABLE>SVEXPORTFORMAT,SVCURRENTCOMPANY,SVFROMDATE,SVTODATE</VARIABLE>
                            </REPORT>
                            <FORM NAME="MyForm">
                                <PARTS>MyPart01</PARTS>
                            </FORM>
                            <PART NAME="MyPart01">
                                <LINES>MyLine01</LINES>
                                <REPEAT>MyLine01 : MyCollection</REPEAT>
                                <SCROLLED>Vertical</SCROLLED>
                            </PART>
                            <LINE NAME="MyLine01">
                                <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06,Fld07,Fld08,Fld09,Fld10,Fld11,Fld12,Fld13,Fld14,Fld15,Fld16,Fld17</FIELDS>
                            </LINE>
                            <FIELD NAME="Fld01">
                                <SET>$Guid</SET>
                                <XMLTAG>GUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld02">
                                <SET>if $$IsEmpty:$AlterId then "0" else $$String:$AlterId</SET>
                                <XMLTAG>ALTERID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld03">
                                <SET>if $$IsEmpty:$Date then $$StrByCharCode:241 else $$PyrlYYYYMMDDFormat:$Date:""</SET>
                                <XMLTAG>DATE</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld04">
                                <SET>$VoucherTypeName</SET>
                                <XMLTAG>VOUCHERTYPENAME</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld05">
                                <SET>$Guid:VoucherType:$VoucherTypeName</SET>
                                <XMLTAG>VOUCHERTYPEGUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld06">
                                <SET>$VoucherNumber</SET>
                                <XMLTAG>VOUCHERNUMBER</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld07">
                                <SET>$Reference</SET>
                                <XMLTAG>REFERENCE</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld08">
                                <SET>if $$IsEmpty:$ReferenceDate then $$StrByCharCode:241 else $$PyrlYYYYMMDDFormat:$ReferenceDate:""</SET>
                                <XMLTAG>REFERENCEDATE</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld09">
                                <SET>$Narration</SET>
                                <XMLTAG>NARRATION</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld10">
                                <SET>$PartyLedgerName</SET>
                                <XMLTAG>PARTYLEDGERNAME</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld11">
                                <SET>if $$IsEmpty:$PartyLedgerName then "" else $Guid:Ledger:$PartyLedgerName</SET>
                                <XMLTAG>PARTYLEDGERNAMEGUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld12">
                                <SET>$PlaceOfSupply</SET>
                                <XMLTAG>PLACEOFSUPPLY</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld13">
                                <SET>if $IsInvoice then 1 else 0</SET>
                                <XMLTAG>ISINVOICE</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld14">
                                <SET>if $$IsAccountingVch:$VoucherTypeName then 1 else 0</SET>
                                <XMLTAG>ISACCOUNTINGVOUCHER</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld15">
                                <SET>if $$IsInventoryVch:$VoucherTypeName then 1 else 0</SET>
                                <XMLTAG>ISINVENTORYVOUCHER</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld16">
                                <SET>if $$IsOrderVch:$VoucherTypeName then 1 else 0</SET>
                                <XMLTAG>ISORDERVOUCHER</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld17">
                                <SET>$MASTERID</SET>
                                <XMLTAG>MASTERID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="FldBlank">
                                <SET>""</SET>
                            </FIELD>
                            <COLLECTION NAME="MyCollection">
                                <TYPE>Voucher</TYPE>
                                <FETCH>AlterId,Narration,PartyLedgerName,PlaceOfSupply,Reference,ReferenceDate</FETCH>
                                <FILTER>Fltr01,Fltr02,Fltr03</FILTER>
                            </COLLECTION>
                            <SYSTEM TYPE="Formulae" NAME="Fltr01">NOT $IsCancelled</SYSTEM>
                            <SYSTEM TYPE="Formulae" NAME="Fltr02">NOT $IsOptional</SYSTEM>
                            <SYSTEM TYPE="Formulae" NAME="Fltr03">$AlterID > ${alterId}</SYSTEM>
                        </TDLMESSAGE>
                    </TDL>
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
                // throw new Error(`HTTP Error: ${response.status}`);
                return {
                    code: 400,
                    msg: 'something went wrong on tally side.'
                }
            }

            const data = await response.text();
            const parsedData = await parseXmlAsync(data);

            arr.push(parsedData);

            await new Promise(resolve => setTimeout(resolve, +syncConfigInfo.vouchers.intervalForIncrInMs));
        };

        // Loop through each 10-day period within the date range
        let currentDate = moment(fromDate, "DD-MM-YYYY");
        const endDate = moment(toDate, "DD-MM-YYYY");

        while (currentDate.isSameOrBefore(endDate, "day")) {
            const endDateOfPeriod = currentDate.clone().add(+syncConfigInfo.vouchers.core - 1, "days");
            await fetchPeriodData(currentDate, endDateOfPeriod);
            currentDate.add(+syncConfigInfo.vouchers.core, "days");
        }

        console.timeEnd("fetchVouchersFromTally");
        return arr;
    } catch (error: any) {
        console.error("Error:", error.message);
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

//FETCHING ACCOUNTING VOUCHER DATA 2 DAY INTERVAL
export const incrementFetchAccountingDataFromTally = async (port:any, companyName: any, startDate: any, alterId: any, syncConfigInfo : any) => {
    console.time("fetchAccountingDataFromTally");
    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const arr: any = [];

        for (let currentDate = moment(fromDate, "DD-MM-YYYY"); currentDate.isSameOrBefore(moment(toDate, "DD-MM-YYYY"), "day"); currentDate.add(+syncConfigInfo.vouchers.accounting, "days")) {
            const formattedFromDate = currentDate.format("DD-MM-YYYY");
            const formattedToDate = currentDate.clone().add(+syncConfigInfo.vouchers.accounting - 1, "days").format("DD-MM-YYYY");

            const xmlPayload = `<?xml version="1.0" encoding="utf-8"?>
            <ENVELOPE>
                <HEADER>
                    <VERSION>1</VERSION>
                    <TALLYREQUEST>Export</TALLYREQUEST>
                    <TYPE>Data</TYPE>
                    <ID>MyReportLedgerTable</ID>
                </HEADER>
                <BODY>
                    <DESC>
                        <STATICVARIABLES>
                            <SVEXPORTFORMAT>XML (Data Interchange)</SVEXPORTFORMAT>
                            <SVFROMDATE>${formattedFromDate}</SVFROMDATE>
                            <SVTODATE>${formattedToDate}</SVTODATE>
                            <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                        </STATICVARIABLES>
                        <TDL>
                            <TDLMESSAGE>
                                <REPORT NAME="MyReportLedgerTable">
                                    <FORMS>MyForm</FORMS>
                                    <VARIABLE>SVEXPORTFORMAT,SVCURRENTCOMPANY,SVFROMDATE,SVTODATE</VARIABLE>
                                </REPORT>
                                <FORM NAME="MyForm">
                                    <PARTS>MyPart01</PARTS>
                                </FORM>
                                <PART NAME="MyPart01">
                                    <LINES>MyLine01</LINES>
                                    <REPEAT>MyLine01 : MyCollection</REPEAT>
                                    <SCROLLED>Vertical</SCROLLED>
                                </PART>
                                <PART NAME="MyPart02">
                                    <LINES>MyLine02</LINES>
                                    <REPEAT>MyLine02 : AllLedgerEntries</REPEAT>
                                    <SCROLLED>Vertical</SCROLLED>
                                </PART>
                                <PART NAME="MyPart03">
                                    <LINES>MyLine03</LINES>
                                    <REPEAT>MyLine03 : BankAllocations</REPEAT>
                                    <SCROLLED>Vertical</SCROLLED>
                                </PART>
                                <LINE NAME="MyLine01">
                                    <FIELDS>FldBlank</FIELDS>
                                    <EXPLODE>MyPart02</EXPLODE>
                                </LINE>
                                <LINE NAME="MyLine02">
                                    <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06</FIELDS>
                                    <EXPLODE>MyPart03</EXPLODE>
                                </LINE>
                                <LINE NAME="MyLine03">
                                    <FIELDS>Fld07, Fld08,Fld09,Fld10,Fld11,Fld12,Fld13,Fld14, Fld15, Fld16</FIELDS>
                                </LINE>
                                <FIELD NAME="Fld01">
                                    <SET>$Guid</SET>
                                    <XMLTAG>GUID</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld02">
                                    <SET>$LedgerName</SET>
                                    <XMLTAG>ACCOUNTLEDGERNAME</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld03">
                                    <SET>$Guid:Ledger:$LedgerName</SET>
                                    <XMLTAG>ACCOUNTLEDGERGUID</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld04">
                                    <SET>$$StringFindAndReplace:(if $$IsDebit:$Amount then -$$NumValue:$Amount else $$NumValue:$Amount):"(-)":"-"</SET>
                                    <XMLTAG>AMOUNT</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld05">
                                    <SET>if $$IsEmpty:$$ForexValue:$Amount then 0 else $$StringFindAndReplace:(if $$IsDebit:$Amount then -$$ForexValue:$Amount else $$ForexValue:$Amount):"(-)":"-"</SET>
                                    <XMLTAG>AMOUNTFOREX</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld06">
                                    <SET>$$Currency:$Amount</SET>
                                    <XMLTAG>CURRENCY</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld07">
                                    <SET>$Name</SET>
                                    <XMLTAG>BANKALLOCATIONNAME</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld08">
                                    <SET>$Date</SET>
                                    <XMLTAG>BANKDATE</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld09">
                                    <SET>$InstrumentDate</SET>
                                    <XMLTAG>BANKINSTRUMENTDATE</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld10">
                                    <SET>$Transactiontype</SET>
                                    <XMLTAG>TRANSACTIONTYPE</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld11">
                                    <SET>$BankName</SET>
                                    <XMLTAG>BANKNAME</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld12">
                                    <SET>$InstrumentNumber</SET>
                                    <XMLTAG>INSTRUMENTNUMBER</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld13">
                                    <SET>$UniqueReferenceNumber</SET>
                                    <XMLTAG>UNIQUEREFERENCENUMBER</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld14">
                                    <SET>$PaymentMode</SET>
                                    <XMLTAG>PAYMENTMODE</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld15">
                                    <SET>$BankPartyName</SET>
                                    <XMLTAG>BANKPARTYNAME</XMLTAG>
                                </FIELD>
                                <FIELD NAME="Fld16">
                                    <SET>$Amount</SET>
                                    <XMLTAG>BANKAMOUNT</XMLTAG>
                                </FIELD>
                                <FIELD NAME="FldBlank">
                                    <SET>""</SET>
                                </FIELD>
                                <COLLECTION NAME="MyCollection">
                                    <TYPE>Voucher</TYPE>
                                    <FETCH>AllLedgerEntries</FETCH>
                                    <FILTER>Fltr01,Fltr02,Fltr03</FILTER>
                                </COLLECTION>
                                <SYSTEM TYPE="Formulae" NAME="Fltr01">NOT $IsCancelled</SYSTEM>
                                <SYSTEM TYPE="Formulae" NAME="Fltr02">NOT $IsOptional</SYSTEM>
                                <SYSTEM TYPE="Formulae" NAME="Fltr03">$AlterID > ${alterId}</SYSTEM>
                            </TDLMESSAGE>
                        </TDL>
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
                return {
                    code: 400,
                    msg: 'something went wrong on tally side.'
                }
                // throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.text();
            const parsedData = await parseXmlAsync(data); // Function to parse XML as JSON

            arr.push(parsedData);

            await new Promise(resolve => setTimeout(resolve, +syncConfigInfo.vouchers.intervalForIncrInMs));
        }

        console.timeEnd("fetchAccountingDataFromTally");
        return arr;
    } catch (error: any) {
        console.error("Error:", error.message);
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

//FETCHING INVENTORY VOUCHER DATA 2 DAY INTERVAL
export const incrementFetchVouchersInventoryDataFromTally = async (port:any, companyName: any, startDate: any, alterId: any, syncConfigInfo : any) => {
    console.time("fetchVouchersInventoryDataFromTally");
    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const arr: any = [];

        const fetchPeriodData = async (startDate: moment.Moment, endDate: moment.Moment) => {
            const formattedFromDate = startDate.format("DD-MM-YYYY");
            const formattedToDate = endDate.format("DD-MM-YYYY");

            const xmlPayload = `<ENVELOPE>
            <HEADER>
                <VERSION>1</VERSION>
                <TALLYREQUEST>Export</TALLYREQUEST>
                <TYPE>Data</TYPE>
                <ID>MyReportLedgerTable</ID>
            </HEADER>
            <BODY>
                <DESC>
                    <STATICVARIABLES>
                        <SVEXPORTFORMAT>XML (Data Interchange)</SVEXPORTFORMAT>
                        <SVFROMDATE>${formattedFromDate}</SVFROMDATE>
                        <SVTODATE>${formattedToDate}</SVTODATE>
                        <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                    </STATICVARIABLES>
                    <TDL>
                        <TDLMESSAGE>
                            <REPORT NAME="MyReportLedgerTable">
                                <FORMS>MyForm</FORMS>
                                <VARIABLE>SVEXPORTFORMAT,SVCURRENTCOMPANY,SVFROMDATE,SVTODATE</VARIABLE>
                            </REPORT>
                            <FORM NAME="MyForm">
                                <PARTS>MyPart01</PARTS>
                            </FORM>
                            <PART NAME="MyPart01">
                                <LINES>MyLine01</LINES>
                                <REPEAT>MyLine01 : MyCollection</REPEAT>
                                <SCROLLED>Vertical</SCROLLED>
                            </PART>
                            <PART NAME="MyPart02">
                                <LINES>MyLine02</LINES>
                                <REPEAT>MyLine02 : AllInventoryEntries</REPEAT>
                                <SCROLLED>Vertical</SCROLLED>
                            </PART>
                            <LINE NAME="MyLine01">
                                <FIELDS>FldBlank</FIELDS>
                                <EXPLODE>MyPart02</EXPLODE>
                            </LINE>
                            <LINE NAME="MyLine02">
                                <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06,Fld07,Fld08,Fld09,Fld10,Fld11,Fld12,Fld13</FIELDS>
                            </LINE>
                            <FIELD NAME="Fld01">
                                <SET>$Guid</SET>
                                <XMLTAG>GUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld02">
                                <SET>$StockItemName</SET>
                                <XMLTAG>STOCKITEMNAME</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld03">
                                <SET>$Guid:StockItem:$StockItemName</SET>
                                <XMLTAG>STOCKITEMGUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld04">
                                <SET>$$StringFindAndReplace:(if $$IsInwards:$ActualQty then $$Number:$$String:$ActualQty:"TailUnits" else -$$Number:$$String:$ActualQty:"TailUnits"):"(-)":"-"</SET>
                                <XMLTAG>QUANTITY</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld05">
                                <SET>if $$IsEmpty:$Rate then 0 else $$Number:$Rate</SET>
                                <XMLTAG>RATE</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld06">
                                <SET>$$StringFindAndReplace:(if $$IsDebit:$Amount then -$$NumValue:$Amount else $$NumValue:$Amount):"(-)":"-"</SET>
                                <XMLTAG>AMOUNT</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld07">
                                <SET>$$StringFindAndReplace:(if $$IsDebit:$AddlAmount then -$$NumValue:$AddlAmount else $$NumValue:$AddlAmount):"(-)":"-"</SET>
                                <XMLTAG>ADDITIONALAMOUNT</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld08">
                                <SET>if $$IsEmpty:$Discount then "0" else $$String:$Discount</SET>
                                <XMLTAG>DISCOUNTAMOUNT</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld09">
                                <SET>$GodownName</SET>
                                <XMLTAG>GODOWNNAME</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld10">
                                <SET>$Guid:Godown:$GodownName</SET>
                                <XMLTAG>GODOWNGUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld11">
                                <SET>if ($$IsEmpty:$TrackingNumber or $$IsNotApplicable:$TrackingNumber) then "" else $TrackingNumber</SET>
                                <XMLTAG>TRACKINGNUMBER</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld12">
                                <SET>if ($$IsEmpty:$OrderNo or $$IsNotApplicable:$OrderNo) then "" else $OrderNo</SET>
                                <XMLTAG>ORDERNUMBER</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld13">
                                <SET>if $$IsEmpty:$OrderDueDate then $$StrByCharCode:241 else $$PyrlYYYYMMDDFormat:$OrderDueDate:"-"</SET>
                                <XMLTAG>ORDERDUEDATE</XMLTAG>
                            </FIELD>
                            <FIELD NAME="FldBlank">
                                <SET>""</SET>
                            </FIELD>
                            <COLLECTION NAME="MyCollection">
                                <TYPE>Voucher</TYPE>
                                <FETCH>AllInventoryEntries</FETCH>
                                <FILTER>Fltr01,Fltr02,Fltr03</FILTER>
                            </COLLECTION>
                            <SYSTEM TYPE="Formulae" NAME="Fltr01">NOT $IsCancelled</SYSTEM>
                            <SYSTEM TYPE="Formulae" NAME="Fltr02">NOT $IsOptional</SYSTEM>
                            <SYSTEM TYPE="Formulae" NAME="Fltr03">$AlterID > ${alterId}</SYSTEM>
                        </TDLMESSAGE>
                    </TDL>
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
                // throw new Error(`HTTP Error: ${response.status}`);
                return {
                    code: 400,
                    msg: 'something went wrong on tally side.'
                }
            }

            const data = await response.text();
            const parsedData = await parseXmlAsync(data);

            arr.push(parsedData);

            await new Promise(resolve => setTimeout(resolve, +syncConfigInfo.vouchers.intervalForIncrInMs));
        };

        // Loop through each 10-day period within the date range
        let currentDate = moment(fromDate, "DD-MM-YYYY");
        const endDate = moment(toDate, "DD-MM-YYYY");

        while (currentDate.isSameOrBefore(endDate, "day")) {
            const endDateOfPeriod = currentDate.clone().add(+syncConfigInfo.vouchers.inventory - 1, "days");
            await fetchPeriodData(currentDate, endDateOfPeriod);
            currentDate.add(+syncConfigInfo.vouchers.inventory, "days");
        }

        console.timeEnd("fetchVouchersInventoryDataFromTally");
        return arr;
    } catch (error: any) {
        console.error("Error:", error.message);
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

//FETCHING BILL VOUCHER DATA 5 DAY INTERVAL
export const incrementFetchVouchersBillDataFromTally = async (port:any, companyName: any, startDate: any, alterId: any, syncConfigInfo : any) => {
    console.time("fetchVouchersBillDataFromTally");

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const arr: any = [];

        const fetchPeriodData = async (startDate: moment.Moment, endDate: moment.Moment) => {
            const formattedFromDate = startDate.format("DD-MM-YYYY");
            const formattedToDate = endDate.format("DD-MM-YYYY");

            const xmlPayload = `<ENVELOPE>
            <HEADER>
                <VERSION>1</VERSION>
                <TALLYREQUEST>Export</TALLYREQUEST>
                <TYPE>Data</TYPE>
                <ID>MyReportLedgerTable</ID>
            </HEADER>
            <BODY>
                <DESC>
                    <STATICVARIABLES>
                        <SVEXPORTFORMAT>XML (Data Interchange)</SVEXPORTFORMAT>
                        <SVFROMDATE>${formattedFromDate}</SVFROMDATE>
                        <SVTODATE>${formattedToDate}</SVTODATE>
                        <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                    </STATICVARIABLES>
                    <TDL>
                        <TDLMESSAGE>
                            <REPORT NAME="MyReportLedgerTable">
                                <FORMS>MyForm</FORMS>
                                <VARIABLE>SVEXPORTFORMAT,SVCURRENTCOMPANY,SVFROMDATE,SVTODATE</VARIABLE>
                            </REPORT>
                            <FORM NAME="MyForm">
                                <PARTS>MyPart01</PARTS>
                            </FORM>
                            <PART NAME="MyPart01">
                                <LINES>MyLine01</LINES>
                                <REPEAT>MyLine01 : MyCollection</REPEAT>
                                <SCROLLED>Vertical</SCROLLED>
                            </PART>
                            <PART NAME="MyPart02">
                                <LINES>MyLine02</LINES>
                                <REPEAT>MyLine02 : AllLedgerEntries</REPEAT>
                                <SCROLLED>Vertical</SCROLLED>
                            </PART>
                            <PART NAME="MyPart03">
                                <LINES>MyLine03</LINES>
                                <REPEAT>MyLine03 : BillAllocations</REPEAT>
                                <SCROLLED>Vertical</SCROLLED>
                            </PART>
                            <LINE NAME="MyLine01">
                                <FIELDS>FldBlank</FIELDS>
                                <EXPLODE>MyPart02</EXPLODE>
                            </LINE>
                            <LINE NAME="MyLine02">
                                <FIELDS>FldBlank</FIELDS>
                                <EXPLODE>MyPart03</EXPLODE>
                            </LINE>
                            <LINE NAME="MyLine03">
                                <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06</FIELDS>
                            </LINE>
                            <FIELD NAME="Fld01">
                                <SET>$Guid</SET>
                                <XMLTAG>GUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld02">
                                <SET>$LedgerName</SET>
                                <XMLTAG>BILLLEDGER</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld03">
                                <SET>$Guid:Ledger:$LedgerName</SET>
                                <XMLTAG>BILLLEDGERGUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld04">
                                <SET>$Name</SET>
                                <XMLTAG>BILLNAME</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld05">
                                <SET>$$StringFindAndReplace:(if $$IsDebit:$Amount then -$$NumValue:$Amount else $$NumValue:$Amount):"(-)":"-"</SET>
                                <XMLTAG>AMOUNT</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld06">
                                <SET>$BillType</SET>
                                <XMLTAG>BILLTYPE</XMLTAG>
                            </FIELD>
                            <FIELD NAME="FldBlank">
                                <SET>""</SET>
                            </FIELD>
                            <COLLECTION NAME="MyCollection">
                                <TYPE>Voucher</TYPE>
                                <FETCH>AllLedgerEntries</FETCH>
                                <FILTER>Fltr01,Fltr02,Fltr03</FILTER>
                            </COLLECTION>
                            <SYSTEM TYPE="Formulae" NAME="Fltr01">NOT $IsCancelled</SYSTEM>
                            <SYSTEM TYPE="Formulae" NAME="Fltr02">NOT $IsOptional</SYSTEM>
                            <SYSTEM TYPE="Formulae" NAME="Fltr03">$AlterID > ${alterId}</SYSTEM>
                        </TDLMESSAGE>
                    </TDL>
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
                // throw new Error(`HTTP Error: ${response.status}`);
                return {
                    code: 400,
                    msg: 'something went wrong on tally side.'
                }
            }

            const data = await response.text();
            const parsedData = await parseXmlAsync(data);

            arr.push(parsedData);

            await new Promise(resolve => setTimeout(resolve, +syncConfigInfo.vouchers.intervalForIncrInMs));
        };

        // Loop through each 10-day period within the date range
        let currentDate = moment(fromDate, "DD-MM-YYYY");
        const endDate = moment(toDate, "DD-MM-YYYY");

        while (currentDate.isSameOrBefore(endDate, "day")) {
            const endDateOfPeriod = currentDate.clone().add(+syncConfigInfo.vouchers.bill - 1, "days");
            await fetchPeriodData(currentDate, endDateOfPeriod);
            currentDate.add(+syncConfigInfo.vouchers.bill, "days");
        }

        console.timeEnd("fetchVouchersBillDataFromTally");
        return arr;
    } catch (error: any) {
        console.error("Error:", error.message);
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

//UTIL
const parseXmlAsync = (xmlData: any) => {
    return new Promise((resolve, reject) => {
        parseString(xmlData, (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

