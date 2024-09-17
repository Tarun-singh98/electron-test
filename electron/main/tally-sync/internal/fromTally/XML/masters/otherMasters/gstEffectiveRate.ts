const { parseString } = require("xml2js");


export const getAllGstEffectiveRateDataFromTally = async (port: any, companyNameForTally: any) => {
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
                            <REPEAT>MyLine02 : GstDetails</REPEAT>
                            <SCROLLED>Vertical</SCROLLED>
                        </PART>
                        <LINE NAME="MyLine01">
                            <FIELDS>FldBlank</FIELDS>
                            <EXPLODE>MyPart02</EXPLODE>
                        </LINE>
                        <LINE NAME="MyLine02">
                            <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06,Fld07,Fld08,Fld09,Fld10,Fld11</FIELDS>
                        </LINE>
                        <FIELD NAME="Fld01">
                            <SET>$Name</SET>
                            <XMLTAG>ITEMNAME</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld02">
                            <SET>$Guid:StockItem:$Name</SET>
                            <XMLTAG>ITEMGUID</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld03">
                            <SET>if $$IsEmpty:$Applicablefrom then $$StrByCharCode:241 else $$PyrlYYYYMMDDFormat:$Applicablefrom:"-"</SET>
                            <XMLTAG>APPLICABLEFROM</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld04">
                            <SET>$Hsn</SET>
                            <XMLTAG>HSN</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld05">
                            <SET>$HsnCode</SET>
                            <XMLTAG>HSNCODE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld06">
                            <SET>if NOT $$IsEmpty:$StateWiseDetails then $StateWiseDetails[First].RateDetails[3].GstRate else 0</SET>
                            <XMLTAG>RATE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld07">
                            <SET>if $IsReverseChargeApplicable then 1 else 0</SET>
                            <XMLTAG>ISRCMAPPLICABLE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld08">
                            <SET>$GstNatureOfTransaction</SET>
                            <XMLTAG>NATUREOFTRANSCATION</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld09">
                            <SET>$NatureOfGoods</SET>
                            <XMLTAG>NATUREOFGOODS</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld10">
                            <SET>$SupplyType</SET>
                            <XMLTAG>SUPPLYTYPE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld11">
                            <SET>$Taxability</SET>
                            <XMLTAG>TAXABILITY</XMLTAG>
                        </FIELD>
                        <FIELD NAME="FldBlank">
                            <SET>""</SET>
                        </FIELD>
                        <COLLECTION NAME="MyCollection">
                            <TYPE>StockItem</TYPE>
                            <FILTER>Fltr01</FILTER>
                        </COLLECTION>
                        <SYSTEM TYPE="Formulae" NAME="Fltr01">NOT $$IsEmpty:$GstApplicable</SYSTEM>
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
            APPLICABLEFROM,
            HSN,
            HSNCODE,
            RATE,
            ISRCMAPPLICABLE,
            NATUREOFTRANSCATION,
            NATUREOFGOODS,
            SUPPLYTYPE,
            TAXABILITY
        } = data
        RATE = (RATE).map((x: any) => parseInt(x))
        ISRCMAPPLICABLE = (ISRCMAPPLICABLE).map((x: any) => parseInt(x))
        return {
            ITEMNAME,
            ITEMGUID,
            APPLICABLEFROM,
            HSN,
            HSNCODE,
            RATE,
            ISRCMAPPLICABLE,
            NATUREOFTRANSCATION,
            NATUREOFGOODS,
            SUPPLYTYPE,
            TAXABILITY
        }
    } catch (error) {
        console.log(error);
    }
}