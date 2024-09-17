const { parseString } = require("xml2js");


// const getLedgersDataFromTally = async () => {
//     try {
//         // Construct the XML payload
//         const xmlPayload = `<ENVELOPE>
//         <HEADER>
//             <VERSION>1</VERSION>
//             <TALLYREQUEST>EXPORT</TALLYREQUEST>
//             <TYPE>COLLECTION</TYPE>
//             <ID>Remote Ledger Coll</ID>
//         </HEADER>
//         <BODY>
//             <DESC>
//                 <STATICVARIABLES>
//                     <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>
//                 </STATICVARIABLES>
//                 <TDL>
//                     <TDLMESSAGE>
//                         <COLLECTION NAME="Remote Ledger Coll" ISINITIALIZE="Yes">
//                             <TYPE>Ledger</TYPE>
//                             <FETCH>Name</FETCH>
//                             <FETCH>OpeningBalance</FETCH>
//                             <FETCH>ClosingBalance</FETCH>
//                             <FETCH>Parent</FETCH>
//                             <FETCH>GSTIN</FETCH>
//                             <FETCH>Address</FETCH>
//                             <FETCH>Contact</FETCH>
//                             <FETCH>Email</FETCH>
//                         </COLLECTION>
//                     </TDLMESSAGE>
//                 </TDL>
//             </DESC>
//         </BODY>
//     </ENVELOPE>
//     `;
//         // Send the request to Tally
//         const response = await fetch("http://localhost:9000", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/xml",
//                 "Content-Length": xmlPayload.length,
//             },
//             body: xmlPayload,
//         });

//         // Handle the response from Tally
//         const data = await response.text();

//         const arr = [];

//         parseString(data, (err, result) => {
//             if (err) {
//                 console.error("Error parsing response XML:", err);
//                 return;
//             }
//             arr.push(result);
//         });

//         return arr;
//     } catch (error) {
//         console.log(error);
//         return error.message
//     }
// };



export const getLedgersDataFromTally = async (port: any, companyNameForTally: any) => {
    console.time("getLedgersDataFromTally")
    try {
        // Construct the XML payload
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
                        <FIELDS>Fld01,Fld02,Fld03,Fld04,Fld05,Fld06,Fld07,Fld08,Fld09,Fld10,Fld11,Fld12,Fld13,Fld14,Fld15,Fld16,Fld17,Fld18,Fld19,Fld20,Fld21,Fld22,Fld23,Fld24,Fld25,Fld26,Fld27,Fld28,Fld29,Fld30,Fld31,Fld32,Fld33</FIELDS>
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
                        <XMLTAG>LEDGERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld04">
                        <SET>if $$IsEqual:$Parent:$$SysName:Primary then "" else $Parent</SET>
                        <XMLTAG>PARENT</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld05">
                        <SET>if $$IsEqual:$Parent:$$SysName:Primary then "" else $Guid:Group:$Parent</SET>
                        <XMLTAG>PARENTGUID</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld06">
                        <SET>$OnlyAlias</SET>
                        <XMLTAG>ALIAS</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld07">
                        <SET>if $IsRevenue then 1 else 0</SET>
                        <XMLTAG>ISREVENUE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld08">
                        <SET>if $IsDeemedPositive then 1 else 0</SET>
                        <XMLTAG>ISDEEMEDPOSITIVE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld09">
                        <SET>$$StringFindAndReplace:(if $$IsDebit:$OpeningBalance then -$$NumValue:$OpeningBalance else $$NumValue:$OpeningBalance):"(-)":"-"</SET>
                        <XMLTAG>OPENINGBALANCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld10">
                        <SET>$Description</SET>
                        <XMLTAG>DESCRIPTION</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld11">
                        <SET>$MailingName</SET>
                        <XMLTAG>MAILINGNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld12">
                        <SET>if $$IsEmpty:$Address then "" else $$FullList:Address:$Address</SET>
                        <XMLTAG>MAILINGADDRESS</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld13">
                        <SET>$LedStateName</SET>
                        <XMLTAG>MAILINGSTATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld14">
                        <SET>$CountryName</SET>
                        <XMLTAG>MAILINGCOUNTRY</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld15">
                        <SET>$PinCode</SET>
                        <XMLTAG>MAILINGPINCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld16">
                        <SET>$Email</SET>
                        <XMLTAG>EMAIL</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld17">
                        <SET>$IncomeTaxNumber</SET>
                        <XMLTAG>INCOMTAXNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld18">
                        <SET>$Partygstin</SET>
                        <XMLTAG>GSTN</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld19">
                        <SET>$Gstregistrationtype</SET>
                        <XMLTAG>GSTREGTYP</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld20">
                        <SET>$Gsttypeofsupply</SET>
                        <XMLTAG>GSTSUPLLYTYP</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld21">
                        <SET>$Gstdutyhead</SET>
                        <XMLTAG>GSTDUTYHEAD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld22">
                        <SET>if $$IsEmpty:$RateOfTaxCalculation then "0" else $$String:$RateOfTaxCalculation</SET>
                        <XMLTAG>TAXRATE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld23">
                        <SET>$Bankaccholdername</SET>
                        <XMLTAG>BANKACCHOLDERNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld24">
                        <SET>$BankDetails</SET>
                        <XMLTAG>ACCNUMBER</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld25">
                        <SET>$Ifscode</SET>
                        <XMLTAG>IFSC</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld26">
                        <SET>$Swiftcode</SET>
                        <XMLTAG>SWIFTCODE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld27">
                        <SET>$Bankingconfigbank</SET>
                        <XMLTAG>BANKNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld28">
                        <SET>$BankBranchname</SET>
                        <XMLTAG>BRANCHNAME</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld29">
                        <SET>$$StringFindAndReplace:(if $$IsDebit:$ClosingBalance then -$$NumValue:$ClosingBalance else $$NumValue:$ClosingBalance):"(-)":"-"</SET>
                        <XMLTAG>CLOSINGBALANCE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld30">
                        <SET>$LedgerPhone</SET>
                        <XMLTAG>PHONE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld31">
                        <SET>$LedgerMobile</SET>
                        <XMLTAG>MOBILE</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld32">
                        <SET>$CreditPeriod</SET>
                        <XMLTAG>DEFAULTCREDITPERIOD</XMLTAG>
                    </FIELD>
                    <FIELD NAME="Fld33">
                        <SET>$CREDITLIMIT</SET>
                        <XMLTAG>DEFAULTCREDITLIMIT</XMLTAG>
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

        let ledgerData: any;

        parseString(data, (err: any, result: any) => {
            if (err) {
                console.error("Error parsing response XML:", err);
                return;
            }
            ledgerData = result
        });
        if (ledgerData?.ENVELOPE === '') {
            return []
        }

        console.timeEnd("getLedgersDataFromTally")
        let obj = converData(ledgerData?.ENVELOPE);

        return obj
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
            LEDGERNAME,
            PARENT,
            PARENTGUID,
            ALIAS,
            ISREVENUE,
            ISDEEMEDPOSITIVE,
            OPENINGBALANCE,
            DESCRIPTION,
            MAILINGNAME,
            MAILINGADDRESS,
            MAILINGSTATE,
            MAILINGCOUNTRY,
            MAILINGPINCODE,
            EMAIL,
            INCOMTAXNUMBER,
            GSTN,
            GSTREGTYP,
            GSTSUPLLYTYP,
            GSTDUTYHEAD,
            TAXRATE,
            BANKACCHOLDERNAME,
            ACCNUMBER,
            IFSC,
            SWIFTCODE,
            BANKNAME,
            BRANCHNAME,
            CLOSINGBALANCE,
            MOBILE,
            PHONE,
            DEFAULTCREDITPERIOD,
            DEFAULTCREDITLIMIT
        } = data
        ALTERID = (ALTERID).map((x: any) => parseInt(x))
        ISREVENUE = (ISREVENUE).map((x: any) => parseInt(x))
        ISDEEMEDPOSITIVE = (ISDEEMEDPOSITIVE).map((x: any) => parseInt(x))
        OPENINGBALANCE = (OPENINGBALANCE).map((x: any) => parseInt(x))
        TAXRATE = (TAXRATE).map((x: any) => parseInt(x))
        CLOSINGBALANCE = (CLOSINGBALANCE).map((x: any) => parseInt(x))
        return {
            GUID,
            ALTERID,
            LEDGERNAME,
            PARENT,
            PARENTGUID,
            ALIAS,
            ISREVENUE,
            ISDEEMEDPOSITIVE,
            OPENINGBALANCE,
            DESCRIPTION,
            MAILINGNAME,
            MAILINGADDRESS,
            MAILINGSTATE,
            MAILINGCOUNTRY,
            MAILINGPINCODE,
            EMAIL,
            INCOMTAXNUMBER,
            GSTN,
            GSTREGTYP,
            GSTSUPLLYTYP,
            GSTDUTYHEAD,
            TAXRATE,
            BANKACCHOLDERNAME,
            ACCNUMBER,
            IFSC,
            SWIFTCODE,
            BANKNAME,
            BRANCHNAME,
            CLOSINGBALANCE,
            MOBILE,
            PHONE,
            DEFAULTCREDITPERIOD,
            DEFAULTCREDITLIMIT
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getLedgersDataFromTally }