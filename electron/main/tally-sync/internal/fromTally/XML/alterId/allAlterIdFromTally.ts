const { parseString } = require("xml2js");
import moment from "moment";

export const groupAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>groupGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>groupAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>Group</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let groupAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            groupAlterId = result
        });

        return groupAlterId.ENVELOPE
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

export const ledgerAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>ledgerGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>ledgerAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>Ledger</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let ledgerAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            ledgerAlterId = result
        });

        return ledgerAlterId.ENVELOPE
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

export const voucherTypeAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>voucherTypeGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>voucherTypeAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>VoucherType</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let voucherTypeAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            voucherTypeAlterId = result
        });

        return voucherTypeAlterId.ENVELOPE
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

export const unitAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
            <TDLMESSAGE>
                <REPORT NAME="MyReportLedgerTable">
                    <FORMS>MyForm</FORMS>
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
                    <FIELDS>Fld01,Fld02</FIELDS>
                </LINE>
                <FIELD NAME="Fld01">
                    <SET>$Guid</SET>
                    <XMLTAG>unitGuid</XMLTAG>
                </FIELD>
                <FIELD NAME="Fld02">
                    <SET>$AlterId</SET>
                    <XMLTAG>unitAlterId</XMLTAG>
                </FIELD>
                <FIELD NAME="FldBlank">
                    <SET>""</SET>
                </FIELD>
                <COLLECTION NAME="MyCollection">
                    <TYPE>Unit</TYPE>
                    <FETCH>AlterId</FETCH>
                </COLLECTION>
            </TDLMESSAGE>
        </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let unitAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            unitAlterId = result
        });

        return unitAlterId.ENVELOPE
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

export const godownAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>godownGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>godownalterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>Godown</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let godownAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            godownAlterId = result
        });

        return godownAlterId.ENVELOPE
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

export const stockGroupAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>stockGroupGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>StockGroupAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>StockGroup</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let stockGroupAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            stockGroupAlterId = result
        });

        return stockGroupAlterId.ENVELOPE
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

export const stockCategoryAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>stockCategoryGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>StockCategoryAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>StockCategory</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let stockGroupAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            stockGroupAlterId = result
        });

        return stockGroupAlterId.ENVELOPE
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

export const stockItemAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>stockItemGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>stockItemAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>StockItem</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let stockItemAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            stockItemAlterId = result
        });

        return stockItemAlterId.ENVELOPE
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

export const costCategoryAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>costCatGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>costCatAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>CostCategory</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let costCategoryAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            costCategoryAlterId = result
        });

        return costCategoryAlterId.ENVELOPE
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

export const costCenterAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>costCenGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>costCenAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>CostCategory</TYPE>
                        <FETCH>AlterId</FETCH>
                    </COLLECTION>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let costCenterAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            costCenterAlterId = result
        });

        return costCenterAlterId.ENVELOPE
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

export const voucherAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {

    try {
        const fromDate = moment(startDate, "YYYYMMDD").format("DD-MM-YYYY");
        const toDate = moment().format("DD-MM-YYYY");
        const xmlPayload = `
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
                <SVFROMDATE>${fromDate}</SVFROMDATE>
                <SVTODATE>${toDate}</SVTODATE>
                <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
            </STATICVARIABLES>
            <TDL>
                <TDLMESSAGE>
                    <REPORT NAME="MyReportLedgerTable">
                        <FORMS>MyForm</FORMS>
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
                        <FIELDS>Fld01,Fld02</FIELDS>
                    </LINE>
                    <FIELD NAME="Fld01">
                        <SET>$Guid</SET>
                        <XMLTAG>voucherGuid</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld02">
                        <SET>$AlterId</SET>
                        <XMLTAG>voucherAlterId</XMLTAG>
                    </FIELD>
                    <FIELD NAME="FldBlank">
                        <SET>""</SET>
                    </FIELD>
                    <COLLECTION NAME="MyCollection">
                        <TYPE>Voucher</TYPE>
                        <FETCH>AlterId</FETCH>
                        <FILTER>Fltr01,Fltr02</FILTER>
                    </COLLECTION>
                    <SYSTEM TYPE="Formulae" NAME="Fltr01">NOT $IsCancelled</SYSTEM>
                    <SYSTEM TYPE="Formulae" NAME="Fltr02">NOT $IsOptional</SYSTEM>
                </TDLMESSAGE>
            </TDL>
        </DESC>
    </BODY>
</ENVELOPE>
    `;
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

        let voucherAlterId: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            voucherAlterId = result
        });

        return voucherAlterId.ENVELOPE
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


export const MasterAndVoucherAlterIdFromTally = async (port: any, companyNameForTally: any, startDate: any) => {
    try {
        let groupAlterIdData = await groupAlterIdFromTally(port, companyNameForTally, startDate);
        if (!groupAlterIdData) groupAlterIdData = { GROUPALTERID: [] };

        let ledgerAlterIdData = await ledgerAlterIdFromTally(port, companyNameForTally, startDate);
        if (!ledgerAlterIdData) ledgerAlterIdData = { LEDGERALTERID: [] }

        let voucherTypeAlterIdData = await voucherTypeAlterIdFromTally(port, companyNameForTally, startDate);
        if (!voucherTypeAlterIdData) voucherTypeAlterIdData = { VOUCHERTYPEALTERID: [] }

        let unitAlterIdData = await unitAlterIdFromTally(port, companyNameForTally, startDate);
        if (!unitAlterIdData) unitAlterIdData = { UNITALTERID: [] }

        let godownAlterIdData = await godownAlterIdFromTally(port, companyNameForTally, startDate);
        if (!godownAlterIdData) godownAlterIdData = { GODOWNALTERID: [] }

        let stockGroupAlterIdData = await stockGroupAlterIdFromTally(port, companyNameForTally, startDate);
        if (!stockGroupAlterIdData) stockGroupAlterIdData = { STOCKGROUPALTERID: [] }

        let stockCategoryAlterIdData = await stockCategoryAlterIdFromTally(port, companyNameForTally, startDate);
        if (!stockCategoryAlterIdData) stockCategoryAlterIdData = { STOCKCATEGORYALTERID: [] }

        let stockItemAlterIdData = await stockItemAlterIdFromTally(port, companyNameForTally, startDate);
        if (!stockItemAlterIdData) stockItemAlterIdData = { STOCKITEMALTERID: [] }

        let costCategoryAlterIdData = await costCategoryAlterIdFromTally(port, companyNameForTally, startDate);
        if (!costCategoryAlterIdData) costCategoryAlterIdData = { COSTCATALTERID: [] }

        let costCenterAlterIdData = await costCenterAlterIdFromTally(port, companyNameForTally, startDate);
        if (!costCenterAlterIdData) costCenterAlterIdData = { COSTCENALTERID: [] }

        let voucherAlterIdData = await voucherAlterIdFromTally(port, companyNameForTally, startDate);
        if (!voucherAlterIdData) voucherAlterIdData = { VOUCHERALTERID: [] }

        const allMasterIds = [
            ...groupAlterIdData.GROUPALTERID,
            ...ledgerAlterIdData.LEDGERALTERID,
            ...voucherTypeAlterIdData.VOUCHERTYPEALTERID,
            ...unitAlterIdData.UNITALTERID,
            ...godownAlterIdData.GODOWNALTERID,
            ...stockGroupAlterIdData.STOCKGROUPALTERID,
            ...stockCategoryAlterIdData?.STOCKCATEGORYALTERID,
            ...stockItemAlterIdData.STOCKITEMALTERID,
            ...costCategoryAlterIdData.COSTCATALTERID,
            ...costCenterAlterIdData.COSTCENALTERID
        ]

        const parsedNumbers = allMasterIds.map(Number);
        const maxMasterAlterId = Math.max(...parsedNumbers);

        let maxVoucherAlterId = 0
        if (voucherAlterIdData.VOUCHERALTERID.length !== 0) {
            const voucherParsedNumbers = voucherAlterIdData.VOUCHERALTERID.map(Number);
            maxVoucherAlterId = Math.max(...voucherParsedNumbers);
        }

        return { maxMasterAlterId, maxVoucherAlterId }

    } catch (error: any) {
        console.log(error.message, "error in MasterAndVoucherAlterIdFromTally");
        return {
            code: 400,
            msg: 'Somthing went wrong, Please restart the application.',
            err: error.message
        }
    }
}