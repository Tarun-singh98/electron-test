const { parseString } = require("xml2js");


export const getOpeningBatchAllocationDataFromTally = async (port: any, companyNameForTally: any) => {
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
                            <REPEAT>MyLine02 : BatchAllocations</REPEAT>
                            <SCROLLED>Vertical</SCROLLED>
                        </PART>
                        <LINE NAME="MyLine01">
                            <FIELDS>FldBlank</FIELDS>
                            <EXPLODE>MyPart02</EXPLODE>
                        </LINE>
                        <LINE NAME="MyLine02">
                            <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06,Fld07,Fld08</FIELDS>
                        </LINE>
                        <FIELD NAME="Fld01">
                            <SET>$..Name</SET>
                            <XMLTAG>ITEMNAME</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld02">
                            <SET>$Guid:StockItem:$..Name</SET>
                            <XMLTAG>ITEMGUID</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld03">
                            <SET>$$StringFindAndReplace:($$Number:$$String:$OpeningBalance):"(-)":"-"</SET>
                            <XMLTAG>OPENINGBALANCE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld04">
                            <SET>if $$IsEmpty:$OpeningRate then 0 else $$Number:$OpeningRate</SET>
                            <XMLTAG>OPENINGRATE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld05">
                            <SET>$$StringFindAndReplace:(if $$IsDebit:$OpeningValue then -$$NumValue:$OpeningValue else $$NumValue:$OpeningValue):"(-)":"-"</SET>
                            <XMLTAG>OPENINGVALUE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld06">
                            <SET>$GodownName</SET>
                            <XMLTAG>GODOWNNAME</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld07">
                            <SET>$Guid:Godown:$GodownName</SET>
                            <XMLTAG>GODOWNGUID</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld08">
                            <SET>if $$IsEmpty:$MfdOn then $$StrByCharCode:241 else $$PyrlYYYYMMDDFormat:$MfdOn:"-"</SET>
                            <XMLTAG>MANUFACTUREDON</XMLTAG>
                        </FIELD>
                        <FIELD NAME="FldBlank">
                            <SET>""</SET>
                        </FIELD>
                        <COLLECTION NAME="MyCollection">
                            <TYPE>StockItem</TYPE>
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
            ITEMNAME,
            ITEMGUID,
            OPENINGBALANCE,
            OPENINGRATE,
            OPENINGVALUE,
            GODOWNNAME,
            GODOWNGUID,
            MANUFACTUREDON
        } = data
        OPENINGBALANCE = (OPENINGBALANCE)?.map((x: any) => parseInt(x))
        OPENINGRATE = (OPENINGRATE)?.map((x: any) => parseInt(x))
        OPENINGVALUE = (OPENINGVALUE)?.map((x: any) => parseInt(x))
        MANUFACTUREDON = MANUFACTUREDON?.map((x: any) => (x == "�" ? null : x));
        return {
            ITEMNAME,
            ITEMGUID,
            OPENINGBALANCE,
            OPENINGRATE,
            OPENINGVALUE,
            GODOWNNAME,
            GODOWNGUID,
            MANUFACTUREDON
        }
    } catch (error) {
        console.log(error);
    }
}