const { parseString } = require("xml2js");


export const getAllStockItemsDataFromTally = async (port: any, companyNameForTally: any) => {
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
                            <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06,Fld07,Fld08,Fld09,Fld10,Fld11,Fld12,Fld13,Fld14,Fld15,
                            Fld16,Fld17,Fld18,Fld19,Fld20,Fld21,Fld22,Fld23,Fld24,Fld25,Fld26,Fld27</FIELDS>
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
                        <FIELD NAME="Fld06">
                            <SET>$OnlyAlias</SET>
                            <XMLTAG>ALIAS</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld07">
                            <SET>$BaseUnits</SET>
                            <XMLTAG>UNIT</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld08">
                            <SET>$Guid:Unit:$BaseUnits</SET>
                            <XMLTAG>UNITGUID</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld09">
                            <SET>$$StringFindAndReplace:($$Number:$$String:$OpeningBalance):"(-)":"-"</SET>
                            <XMLTAG>OPENINGBALENCE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld10">
                            <SET>if $$IsEmpty:$OpeningRate then 0 else $$Number:$OpeningRate</SET>
                            <XMLTAG>OPENINGRATE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld11">
                            <SET>$$StringFindAndReplace:(if $$IsDebit:$OpeningValue then -$$NumValue:$OpeningValue else $$NumValue:$OpeningValue):"(-)":"-"</SET>
                            <XMLTAG>OPENINGVALUE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld12">
                            <SET>if ($$IsEqual:$GstApplicable:($$SysName:Applicable) AND NOT $$IsEmpty:$GstDetails[Last].Natureofgoods) then $GstDetails[Last].Natureofgoods else ""</SET>
                            <XMLTAG>GSTNATUREOFGOODS</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld13">
                            <SET>if ($$IsEqual:$GstApplicable:($$SysName:Applicable) AND NOT $$IsEmpty:$GstDetails[Last].Hsncode) then $GstDetails[Last].Hsncode else ""</SET>
                            <XMLTAG>GSTHSNCODE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld14">
                            <SET>if ($$IsEqual:$GstApplicable:($$SysName:Applicable) AND NOT $$IsEmpty:$GstDetails[Last].Taxability) then $GstDetails[Last].Taxability else ""</SET>
                            <XMLTAG>GSTTEXABILITY</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld15">
                            <SET>$ClosingBalance</SET>
                            <XMLTAG>CLOSINGBALANCE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld16">
                            <SET>if $$IsEmpty:$ClosingValue then 0 else $$Number:$ClosingValue</SET>
                            <XMLTAG>CLOSINGVALUE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld17">
                            <SET>$LastSaleParty</SET>
                            <XMLTAG>LASTSALEPARTY</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld18">
                            <SET>$LastPurcParty</SET>
                            <XMLTAG>LASTPURCHASEPARTY</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld19">
                            <SET>$ClosingRate</SET>
                            <XMLTAG>CLOSINGRATE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld20">
                            <SET>$ReorderLevel</SET>
                            <XMLTAG>REORDERLEVEL</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld21">
                            <SET>$Category</SET>
                            <XMLTAG>CATEGORY</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld22">
                            <SET>$LastSaleDate</SET>
                            <XMLTAG>LASTSALEDATE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld23">
                            <SET>$LastPurcDate</SET>
                            <XMLTAG>LASTPURCDATE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld24">
                            <SET>$LastSalePrice</SET>
                            <XMLTAG>LASTSALEPRICE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld25">
                            <SET>$LastSaleQty</SET>
                            <XMLTAG>LASTSALEQTY</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld26">
                            <SET>$LastPurcPrice</SET>
                            <XMLTAG>LASTPURCPRICE</XMLTAG>
                        </FIELD>
                        <FIELD NAME="Fld27">
                            <SET>$LastPurcQty</SET>
                            <XMLTAG>LASTPURCQTY</XMLTAG>
                        </FIELD>
                        <FIELD NAME="FldBlank">
                            <SET>""</SET>
                        </FIELD>
                        <COLLECTION NAME="MyCollection">
                            <TYPE>StockItem</TYPE>
                            <FETCH>GstDetails</FETCH>
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
            ALIAS,
            UNIT,
            UNITGUID,
            OPENINGBALENCE,
            OPENINGRATE,
            OPENINGVALUE,
            GSTNATUREOFGOODS,
            GSTHSNCODE,
            GSTTEXABILITY,
            CLOSINGBALANCE,
            CLOSINGVALUE,
            LASTSALEPARTY,
            LASTPURCHASEPARTY,
            CLOSINGRATE,
            REORDERLEVEL,
            CATEGORY,
            LASTSALEDATE,
            LASTPURCDATE,
            LASTSALEPRICE,
            LASTSALEQTY,
            LASTPURCPRICE,
            LASTPURCQTY
        } = data
        ALTERID = (ALTERID)?.map((x: any) => parseInt(x))
        OPENINGBALENCE = (OPENINGBALENCE)?.map((x: any) => parseInt(x))
        OPENINGRATE = (OPENINGRATE)?.map((x: any) => parseInt(x))
        OPENINGVALUE = (OPENINGVALUE)?.map((x: any) => parseInt(x))
        CLOSINGVALUE = (CLOSINGVALUE)?.map((x: any) => parseInt(x))
        return {
            GUID,
            ALTERID,
            NAME,
            PARENT,
            PARENTGUID,
            ALIAS,
            UNIT,
            UNITGUID,
            OPENINGBALENCE,
            OPENINGRATE,
            OPENINGVALUE,
            GSTNATUREOFGOODS,
            GSTHSNCODE,
            GSTTEXABILITY,
            CLOSINGBALANCE,
            CLOSINGVALUE,
            LASTSALEPARTY,
            LASTPURCHASEPARTY,
            CLOSINGRATE,
            REORDERLEVEL,
            CATEGORY,
            LASTSALEDATE,
            LASTPURCDATE,
            LASTSALEPRICE,
            LASTSALEQTY,
            LASTPURCPRICE,
            LASTPURCQTY
        }
    } catch (error) {
        console.log(error);
    }
}