const { parseString } = require("xml2js");

export const getAllStockItemsGroupDataFromTally = async (port:any, companyNameForTally: any) => {
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
                            <LINE NAME="MyLine01">
                                <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05</FIELDS>
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
                                <SET>$Name</SET>
                                <XMLTAG>NAME</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld04">
                                <SET>if $$IsEqual:$Parent:$$SysName:Primary then "" else $Parent</SET>
                                <XMLTAG>PARENT</XMLTAG>
                            </FIELD>
                            <FIELD NAME="Fld05">
                                <SET>if $$IsEqual:$Parent:$$SysName:Primary then "" else $Guid:StockGroup:$Parent</SET>
                                <XMLTAG>PARENTGUID</XMLTAG>
                            </FIELD>
                            <FIELD NAME="FldBlank">
                                <SET>""</SET>
                            </FIELD>
                            <COLLECTION NAME="MyCollection">
                                <TYPE>StockGroup</TYPE>
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
        if(groupData?.ENVELOPE === ''){
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
            GUID,
            ALTERID,
            NAME,
            PARENT,
            PARENTGUID,
        } = data
        ALTERID = (ALTERID).map((x: any) => parseInt(x))
        return {
            GUID,
            ALTERID,
            NAME,
            PARENT,
            PARENTGUID
        }
    } catch (error) {
        console.log(error);
    }
}