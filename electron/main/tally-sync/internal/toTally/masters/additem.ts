import { UpdateBuffer, deleteBuffer } from "../../../fromCloud/buffer/bufferCrud";

const { parseString } = require("xml2js");

export const addItemToTally = async (
  ledgers: any,
  companyName: any,
  companyNameDb: any,
  token: any,
  port: any
) => {
  try {
    console.log("entered add Item to tally");
    let responseArr = [];
    for (let i = 0; i < ledgers.length; i++) {
      let ledger = ledgers[i];
      let {
        _id,
        name,
        type,
        parent,
        baseUnits,
        createdOn,
        openingBalance,
        openingValue,
        openingRate,
        priceDetails,
        gstAndTaxDetails,
        description
      } = ledger;

      // Construct the XML payload
      let xmlPayload = `<ENVELOPE>
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
            <TALLYMESSAGE xmlns:UDF="TallyUDF">
                <STOCKITEM NAME="${name}" RESERVEDNAME="">
                    <OLDAUDITENTRYIDS.LIST TYPE="Number">
                        <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                    </OLDAUDITENTRYIDS.LIST>
                    <NAME>${name}</NAME>
                    <PARENT>${parent}</PARENT>
                    <CATEGORY>&#4; Not Applicable</CATEGORY>`

      if (gstAndTaxDetails?.isApplicable) {
        xmlPayload += `
                        <GSTAPPLICABLE>&#4; Applicable</GSTAPPLICABLE>
                        `;
      } else {
        xmlPayload += `<GSTAPPLICABLE>&#4; Not Applicable</GSTAPPLICABLE>`

      }

      xmlPayload += ` <TAXCLASSIFICATIONNAME>&#4; Applicable</TAXCLASSIFICATIONNAME>
                    <DESCRIPTION>${description}</DESCRIPTION>
                    <BASEUNITS>${baseUnits}</BASEUNITS>
                    <ADDITIONALUNITS>&#4; Not Applicable</ADDITIONALUNITS>
                    <EXCISEITEMCLASSIFICATION>&#4; Not Applicable</EXCISEITEMCLASSIFICATION>
                    <VATBASEUNIT>${baseUnits}</VATBASEUNIT>
                    <ISCOSTCENTRESON>No</ISCOSTCENTRESON>
                    <ISBATCHWISEON>No</ISBATCHWISEON>
                    <ISPERISHABLEON>No</ISPERISHABLEON>
                    <ISENTRYTAXAPPLICABLE>No</ISENTRYTAXAPPLICABLE>
                    <ISCOSTTRACKINGON>Yes</ISCOSTTRACKINGON>
                    <ISUPDATINGTARGETID>No</ISUPDATINGTARGETID>
                    <ISDELETED>No</ISDELETED>
                    <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
                    <ASORIGINAL>Yes</ASORIGINAL>
                    <ISRATEINCLUSIVEVAT>No</ISRATEINCLUSIVEVAT>
                    <IGNOREPHYSICALDIFFERENCE>No</IGNOREPHYSICALDIFFERENCE>
                    <IGNORENEGATIVESTOCK>No</IGNORENEGATIVESTOCK>
                    <TREATSALESASMANUFACTURED>No</TREATSALESASMANUFACTURED>
                    <TREATPURCHASESASCONSUMED>No</TREATPURCHASESASCONSUMED>
                    <TREATREJECTSASSCRAP>No</TREATREJECTSASSCRAP>
                    <HASMFGDATE>No</HASMFGDATE>
                    <ALLOWUSEOFEXPIREDITEMS>No</ALLOWUSEOFEXPIREDITEMS>
                    <IGNOREBATCHES>No</IGNOREBATCHES>
                    <IGNOREGODOWNS>No</IGNOREGODOWNS>
                    <ADJDIFFINFIRSTSALELEDGER>No</ADJDIFFINFIRSTSALELEDGER>
                    <ADJDIFFINFIRSTPURCLEDGER>No</ADJDIFFINFIRSTPURCLEDGER>
                    <CALCONMRP>No</CALCONMRP>
                    <EXCLUDEJRNLFORVALUATION>No</EXCLUDEJRNLFORVALUATION>
                    <ISMRPINCLOFTAX>No</ISMRPINCLOFTAX>
                    <ISADDLTAXEXEMPT>No</ISADDLTAXEXEMPT>
                    <ISSUPPLEMENTRYDUTYON>No</ISSUPPLEMENTRYDUTYON>
                    <GVATISEXCISEAPPL>No</GVATISEXCISEAPPL>
                    <ISADDITIONALTAX>No</ISADDITIONALTAX>
                    <ISCESSEXEMPTED>No</ISCESSEXEMPTED>
                    <REORDERASHIGHER>No</REORDERASHIGHER>
                    <MINORDERASHIGHER>No</MINORDERASHIGHER>
                    <ISEXCISECALCULATEONMRP>No</ISEXCISECALCULATEONMRP>
                    <INCLUSIVETAX>No</INCLUSIVETAX>
                    <GSTCALCSLABONMRP>No</GSTCALCSLABONMRP>
                    <MODIFYMRPRATE>Yes</MODIFYMRPRATE>
                    <ALTERID> </ALTERID>
                    <DENOMINATOR> 1</DENOMINATOR>
                    <RATEOFVAT>0</RATEOFVAT>
                    <OPENINGBALANCE> ${openingBalance} ${baseUnits}</OPENINGBALANCE>
                    <OPENINGVALUE>-${openingValue}.00</OPENINGVALUE>
                    <OPENINGRATE>${openingRate}.00/${baseUnits}</OPENINGRATE>
                    <SERVICETAXDETAILS.LIST>      </SERVICETAXDETAILS.LIST>
                    <VATDETAILS.LIST>      </VATDETAILS.LIST>
                    <SALESTAXCESSDETAILS.LIST>      </SALESTAXCESSDETAILS.LIST>
                    `
      // console.log("isGst applciatble check")
      if (gstAndTaxDetails.isApplicable) {
        xmlPayload += `
                        <GSTDETAILS.LIST>
                            <APPLICABLEFROM>${createdOn}</APPLICABLEFROM>
                            <TAXABILITY>Taxable</TAXABILITY>
                            <SRCOFGSTDETAILS>Specify Details Here</SRCOFGSTDETAILS>
                            <GSTCALCSLABONMRP>No</GSTCALCSLABONMRP>
                            <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
                            <ISNONGSTGOODS>No</ISNONGSTGOODS>
                            <GSTINELIGIBLEITC>No</GSTINELIGIBLEITC>
                            <INCLUDEEXPFORSLABCALC>No</INCLUDEEXPFORSLABCALC>
                            <STATEWISEDETAILS.LIST>
                                <STATENAME>&#4; Any</STATENAME>
                                <RATEDETAILS.LIST>
                                    <GSTRATEDUTYHEAD>CGST</GSTRATEDUTYHEAD>
                                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                                    <GSTRATE>${gstAndTaxDetails?.CGST}</GSTRATE>
                                </RATEDETAILS.LIST>
                                <RATEDETAILS.LIST>
                                    <GSTRATEDUTYHEAD>SGST/UTGST</GSTRATEDUTYHEAD>
                                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                                    <GSTRATE>${gstAndTaxDetails?.SGST}</GSTRATE>
                                </RATEDETAILS.LIST>
                                <RATEDETAILS.LIST>
                                    <GSTRATEDUTYHEAD>IGST</GSTRATEDUTYHEAD>
                                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                                    <GSTRATE>${gstAndTaxDetails?.IGST}</GSTRATE>
                                </RATEDETAILS.LIST>
                                <RATEDETAILS.LIST>
                                    <GSTRATEDUTYHEAD>Cess</GSTRATEDUTYHEAD>
                                    <GSTRATEVALUATIONTYPE>&#4; Not Applicable</GSTRATEVALUATIONTYPE>
                              </RATEDETAILS.LIST>
                              <RATEDETAILS.LIST>
                                    <GSTRATEDUTYHEAD>State Cess</GSTRATEDUTYHEAD>
                                    <GSTRATEVALUATIONTYPE>Based on Value</GSTRATEVALUATIONTYPE>
                              </RATEDETAILS.LIST>
                                <GSTSLABRATES.LIST>        </GSTSLABRATES.LIST>
                            </STATEWISEDETAILS.LIST>
                            <TEMPGSTITEMSLABRATES.LIST>       </TEMPGSTITEMSLABRATES.LIST>
                            <TEMPGSTDETAILSLABRATES.LIST>       </TEMPGSTDETAILSLABRATES.LIST>
                        </GSTDETAILS.LIST>
                        <HSNDETAILS.LIST>
                            <APPLICABLEFROM>${createdOn}</APPLICABLEFROM>
                            <HSNCODE>${gstAndTaxDetails?.HSNCode}</HSNCODE>
                            <SRCOFHSNDETAILS>Specify Details Here</SRCOFHSNDETAILS>
                        </HSNDETAILS.LIST>
                        <LANGUAGENAME.LIST>
                        <NAME.LIST TYPE="String">
                             <NAME>${name}</NAME>
                        </NAME.LIST>
                        <LANGUAGEID></LANGUAGEID>
                   </LANGUAGENAME.LIST>
                   <SCHVIDETAILS.LIST> </SCHVIDETAILS.LIST>
                   <EXCISETARIFFDETAILS.LIST> </EXCISETARIFFDETAILS.LIST>
                   <TCSCATEGORYDETAILS.LIST> </TCSCATEGORYDETAILS.LIST>
                   <TDSCATEGORYDETAILS.LIST> </TDSCATEGORYDETAILS.LIST>
                   <EXCLUDEDTAXATIONS.LIST> </EXCLUDEDTAXATIONS.LIST>
                   <OLDAUDITENTRIES.LIST> </OLDAUDITENTRIES.LIST>
                   <ACCOUNTAUDITENTRIES.LIST> </ACCOUNTAUDITENTRIES.LIST>
                   <AUDITENTRIES.LIST> </AUDITENTRIES.LIST>
                   <OLDMRPDETAILS.LIST> </OLDMRPDETAILS.LIST>
                   <VATCLASSIFICATIONDETAILS.LIST> </VATCLASSIFICATIONDETAILS.LIST>
                        `
      } else {
        xmlPayload += `<GSTDETAILS.LIST></GSTDETAILS.LIST>
                        `
      }

      // console.log("mrp array check")
      if (priceDetails?.MRP?.length > 0) {
        priceDetails?.MRP.forEach((mrp: { MRPPrice: any; fromDate: any; }) => {
          xmlPayload += `<MRPDETAILS.LIST>
                            <FROMDATE>${mrp.fromDate}</FROMDATE>
                            <MRPRATEDETAILS.LIST>
                                <MRPRATE>${mrp.MRPPrice}</MRPRATE>
                            </MRPRATEDETAILS.LIST>
                        </MRPDETAILS.LIST>
                        `
        })

      } else {
        xmlPayload += `      <MRPDETAILS.LIST>      </MRPDETAILS.LIST>
                        `
      }
      xmlPayload += `
                    <REPORTINGUOMDETAILS.LIST>      </REPORTINGUOMDETAILS.LIST>
                    <COMPONENTLIST.LIST>      </COMPONENTLIST.LIST>
                    <ADDITIONALLEDGERS.LIST>      </ADDITIONALLEDGERS.LIST>
                    <SALESLIST.LIST>      </SALESLIST.LIST>
                    <PURCHASELIST.LIST>      </PURCHASELIST.LIST>
                    <FULLPRICELIST.LIST>      </FULLPRICELIST.LIST>
                    <BATCHALLOCATIONS.LIST>      </BATCHALLOCATIONS.LIST>
                    <TRADEREXCISEDUTIES.LIST>      </TRADEREXCISEDUTIES.LIST>
                    `
      // console.log("uying check", priceDetails?.standardBuyingCost.length)
      if (priceDetails?.standardBuyingCost.length > 0) {
        priceDetails?.standardBuyingCost?.forEach((standardCost: { fromDate: any; rate: any; }) => {
          console.log("standardBuyingCost loop", standardCost)
          xmlPayload += `<STANDARDCOSTLIST.LIST>
                            <DATE>${standardCost?.fromDate}</DATE>
                            <RATE>${standardCost?.rate}</RATE>
                        </STANDARDCOSTLIST.LIST>
                        `
        })
      } else {
        xmlPayload += `<STANDARDCOSTLIST.LIST>  </STANDARDCOSTLIST.LIST>
                        `
      }
      // console.log("selling check");

      if (priceDetails?.standardSellingPrice?.length > 0) {
        priceDetails?.standardBuyingCost?.forEach((standardSellingPrice: { fromDate: any; rate: any; }) => {
          console.log("standarff selling price looping");
          xmlPayload += `<STANDARDPRICELIST.LIST>
                            <DATE>${standardSellingPrice?.fromDate}</DATE>
                            <RATE>${standardSellingPrice?.rate}</RATE>
                            </STANDARDPRICELIST.LIST>
                            `
        })
      } else {
        xmlPayload += `<STANDARDPRICELIST.LIST></STANDARDPRICELIST.LIST>
                        `
      }
      xmlPayload += `
                    <EXCISEITEMGODOWN.LIST>      </EXCISEITEMGODOWN.LIST>
                    <MULTICOMPONENTLIST.LIST>      </MULTICOMPONENTLIST.LIST>
                    <LBTDETAILS.LIST>      </LBTDETAILS.LIST>
                    <PRICELEVELLIST.LIST>      </PRICELEVELLIST.LIST>
                    <GSTCLASSFNIGSTRATES.LIST>      </GSTCLASSFNIGSTRATES.LIST>
                    <EXTARIFFDUTYHEADDETAILS.LIST>      </EXTARIFFDUTYHEADDETAILS.LIST>
                    <TEMPGSTITEMSLABRATES.LIST>      </TEMPGSTITEMSLABRATES.LIST>
                </STOCKITEM>
            </TALLYMESSAGE>
        </DATA>
    </BODY>
</ENVELOPE>
                    `;
      // console.log(xmlPayload)
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
          msg: "err fetching item data from tally",
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
      //   console.log(res, "res")
      //   console.log(res?.ENVELOPE?.BODY[0].DATA[0].IMPORTRESULT[0].CREATED[0])
      // return
      const created = +res?.ENVELOPE?.BODY[0].DATA[0].IMPORTRESULT[0].CREATED[0];
      let obj = {
        msg: `Item: ${name} created successfully`,
        created: created,
      };
      if (created === 1) {
        console.log(created, "Item created ✔️✔️✔️✔️✔️")
        await UpdateBuffer(_id, companyNameDb, token, null, companyName, null, null, "item", null, name);
        await deleteBuffer(_id, companyNameDb, token);
        responseArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res.ENVELOPE.BODY);
        return { msg: "failed to create", res };
      }
    }
    // return responseArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong, Please restart the application.",
      err: error.message
    };
  }
};

