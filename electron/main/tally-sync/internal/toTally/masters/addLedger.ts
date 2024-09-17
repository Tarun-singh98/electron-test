import { UpdateBuffer, deleteBuffer } from "../../../fromCloud/buffer/bufferCrud";

const { parseString } = require("xml2js");

export const addLedgerToTally = async (
  ledgers: any,
  companyName: any,
  companyNameDb: any,
  token: any,
  port: any
) => {
  console.log("add Ledger tally")
  try {
    let responseArr = [];
    for (let i = 0; i < ledgers.length; i++) {
      let ledger = ledgers[i];
      let {
        _id,
        ledgerName,
        type,
        group,
        openingBalance,
        taxRegistrationDetails,
        contactDetails,
        creditDetails,
        createdOn
      } = ledger;
      // Construct the XML payload
      let xmlPayload = `
               <ENVELOPE>
               <HEADER>
                   <VERSION>1</VERSION>
                   <TALLYREQUEST>Import</TALLYREQUEST>
                   <TYPE>Data</TYPE>
                   <ID>All Masters</ID>
               </HEADER>
               <BODY>
                   <DESC>
                       <STATICVARIABLES>
                           <IMPORTDUPS>@@DUPCOMBINE</IMPORTDUPS>
                           <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                       </STATICVARIABLES>
                   </DESC>
                   <DATA>
                       <TALLYMESSAGE>
                           <LEDGER NAME="${ledgerName}" Action = "Create">
                               <NAME>${ledgerName}</NAME>
                               <PARENT>${group}</PARENT>
                               <LEDGERPHONE>${contactDetails.phone}</LEDGERPHONE>
                               <LEDGERCONTACT>${contactDetails.contactPersonName}</LEDGERCONTACT>
                               <COUNTRYOFRESIDENCE>${contactDetails.country}</COUNTRYOFRESIDENCE>
                               <PRIORSTATENAME>${contactDetails.state}</PRIORSTATENAME>
                               <TAXTYPE>Others</TAXTYPE>
                               <OPENINGBALANCE>${openingBalance}</OPENINGBALANCE>
                               <BILLCREDITPERIOD>${creditDetails.creditPeriod} Days</BILLCREDITPERIOD>
                               <CREDITLIMIT>${creditDetails.creditLimit}</CREDITLIMIT>
                               <LEDMAILINGDETAILS.LIST>
                                   <ADDRESS.LIST TYPE="String">
                                       <ADDRESS>${contactDetails.address}</ADDRESS>
                                   </ADDRESS.LIST>
                                   <APPLICABLEFROM>${createdOn}</APPLICABLEFROM>
                                   <PINCODE>${contactDetails.pinCode}</PINCODE>
                                   <STATE>${contactDetails.state}</STATE>
                                   <COUNTRY>${contactDetails.country}</COUNTRY>
                               </LEDMAILINGDETAILS.LIST>
                               <LEDGSTREGDETAILS.LIST>
                                   <APPLICABLEFROM>${createdOn}</APPLICABLEFROM>
                                   <GSTREGISTRATIONTYPE>${taxRegistrationDetails.registrationType}</GSTREGISTRATIONTYPE>
                                   <GSTIN>${taxRegistrationDetails.gstNumber}</GSTIN>
                               </LEDGSTREGDETAILS.LIST>
                           </LEDGER>
                       </TALLYMESSAGE>
                   </DATA>
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

      if (!response.ok) {
        return {
          code: 400,
          msg: "err fetching ledger data from tally",
          err: response
        }
      }

      // Handle the response from Tally
      const data = await response.text();
      // console.log(data);

      let res: any;

      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing response XML:", err);
          return;
        }
        res = result;
      });
      //   console.log(typeof(res?.ENVELOPE?.BODY[0].DATA[0].IMPORTRESULT[0].CREATED[0]))
      const created = +res?.ENVELOPE?.BODY[0].DATA[0].IMPORTRESULT[0].CREATED[0];
      let obj = {
        msg: `${group} ledger: ${ledgerName} created successfully`,
        created: created,
      };
      //   console.log(created, "created")
      if (created === 1) {
        await UpdateBuffer(_id, companyNameDb, token, null, companyName, null, null, "ledger", ledgerName, null);
        await deleteBuffer(_id, companyNameDb, token);
        responseArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res);
        return { msg: "failed to create", res };
      }
    }
    return responseArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong in addLedgerToTally function., Please restart the application.",
      err: error.message
    };
  }
};

