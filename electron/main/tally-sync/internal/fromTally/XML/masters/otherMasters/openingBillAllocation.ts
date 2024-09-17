const { parseString } = require("xml2js");


export const getOpeningBillAllocationDataFromTally = async (port: any, companyNameForTally: any) => {
    try {
        // Construct the XML payload
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
                    <SVCURRENTCOMPANY>${companyNameForTally}</SVCURRENTCOMPANY>
                </STATICVARIABLES>
                <TDL>
                    <TDLMESSAGE>
                        <REPORT NAME="MyReportLedgerTable">
                            <FORMS>MyForm</FORMS>
                            <VARIABLE>SVEXPORTFORMAT,SVCURRENTCOMPANY</VARIABLE>
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
                            <REPEAT>MyLine02 : BillAllocations</REPEAT>
                            <SCROLLED>Vertical</SCROLLED>
                        </PART>
                        <LINE NAME="MyLine01">
                            <FIELDS>FldBlank</FIELDS>
                            <EXPLODE>MyPart02</EXPLODE>
                        </LINE>
                        <LINE NAME="MyLine02">
                            <FIELDS>Fld01,Fld02,Fld03,Fld04</FIELDS>
                        </LINE>
                        <FIELD NAME="Fld01">
                            <SET>$..Name</SET>
                            <XMLTAG>LEDGER</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld02">
                            <SET>$Guid:Ledger:$..Name</SET>
                            <XMLTAG>LEDGERGUID</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld03">
                            <SET>$$StringFindAndReplace:(if $$IsDebit:$OpeningBalance then -$$NumValue:$OpeningBalance else $$NumValue:$OpeningBalance):"(-)":"-"</SET>
                            <XMLTAG>OPENINGBALANCE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld04">
                            <SET>if $$IsEmpty:$BillDate then $$StrByCharCode:241 else $$PyrlYYYYMMDDFormat:$BillDate:"-"</SET>
                            <XMLTAG>BILLDATE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="FldBlank">
                            <SET>""</SET>
                        </FIELD>
                        <COLLECTION NAME="MyCollection">
                            <TYPE>Ledger</TYPE>
                        </COLLECTION>
                    </TDLMESSAGE>
                </TDL>
            </DESC>
        </BODY>
    </ENVELOPE>`;
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

        let groupData: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            groupData = result
        });
        if (groupData?.ENVELOPE === '') {
            return []
        }
        const obj = converData(groupData?.ENVELOPE)
        return obj;
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

const converData = (data: any) => {
    try {
        let {
            LEDGER,
            LEDGERGUID,
            OPENINGBALANCE,
            BILLDATE
        } = data
        OPENINGBALANCE = (OPENINGBALANCE)?.map((x: string) => parseInt(x))
        return {
            LEDGER,
            LEDGERGUID,
            OPENINGBALANCE,
            BILLDATE,
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getOpeningBillAllocationDataFromTally }