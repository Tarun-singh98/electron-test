const { parseString } = require("xml2js");
import { UpdateBuffer, deleteBuffer } from "../../../../fromCloud/buffer/bufferCrud";

//------------------ADD SALES VOUCHER---------------------//
export const addSalesVoucher = async (vouchers: any, companyName: any, companyNameDb: any, token: any, port: any) => {
  try {
    let responceArr = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      let {
        _id,
        date,
        ledgerName,
        salesAccountLedgerName,
        partyAddress,
        partyCity,
        partyGSTIN,
        voucherNumber,
        narration,
        parentVoucherType,
        childrenVoucherType,
        isOptionalVoucher,
        grossTotal,
        items,
        taxLedgers,
        ewaybillDetails,
        orderDetails,
        despatchDetails,
        buyerDetails
      } = voucher;

      // Construct the XML payload
      let xmlPayload = `<ENVELOPE>
      <HEADER>
          <TALLYREQUEST>Import Data</TALLYREQUEST>
      </HEADER>
      <BODY>
          <IMPORTDATA>
              <REQUESTDESC>
                  <REPORTNAME>Vouchers</REPORTNAME>
                  <STATICVARIABLES>
                      <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                  </STATICVARIABLES>
              </REQUESTDESC>
              <REQUESTDATA>
                  <TALLYMESSAGE xmlns:UDF="TallyUDF">
                      <VOUCHER VCHTYPE="${childrenVoucherType}" ACTION="Create" >
                          <ADDRESS.LIST TYPE="String">
                              <ADDRESS>${partyAddress}</ADDRESS>
                              <ADDRESS>${partyCity}</ADDRESS>
                          </ADDRESS.LIST>
                          <BASICBUYERADDRESS.LIST TYPE="String">
                              <BASICBUYERADDRESS>${buyerDetails?.buyers?.address || ""}</BASICBUYERADDRESS>
                              <BASICBUYERADDRESS>${buyerDetails?.buyers?.city || ""}</BASICBUYERADDRESS>
                          </BASICBUYERADDRESS.LIST>
                          <BASICORDERTERMS.LIST TYPE="String">
                              <BASICORDERTERMS>${orderDetails?.termsOfDelivery || ""}</BASICORDERTERMS>
                          </BASICORDERTERMS.LIST>
                          <OLDAUDITENTRYIDS.LIST TYPE="Number">
                              <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                          </OLDAUDITENTRYIDS.LIST>
                          <DATE>${date}</DATE>
                          <BILLOFLADINGDATE>${despatchDetails?.LRDate || ""}</BILLOFLADINGDATE>
                          <VCHSTATUSDATE>${date}</VCHSTATUSDATE>
                          <GSTREGISTRATIONTYPE>Regular</GSTREGISTRATIONTYPE>
                          <NARRATION>${narration}</NARRATION>
                          <ENTEREDBY>${companyName}</ENTEREDBY>
                          <PARTYGSTIN>${partyGSTIN}</PARTYGSTIN>
                          <PARTYNAME>${ledgerName}</PARTYNAME>
                          <VOUCHERTYPENAME>${childrenVoucherType}</VOUCHERTYPENAME>
                          <PARTYLEDGERNAME>${ledgerName}</PARTYLEDGERNAME>
                          <VOUCHERNUMBER>${voucherNumber}</VOUCHERNUMBER>
                          <BASICBUYERNAME>${buyerDetails?.buyers?.name || ""}</BASICBUYERNAME>
                          <CMPGSTREGISTRATIONTYPE>Regular</CMPGSTREGISTRATIONTYPE>
                          <PARTYPINCODE>${buyerDetails?.buyers?.pincode || ""}</PARTYPINCODE>
                          <CONSIGNEEGSTIN>${buyerDetails?.consignee?.name || ""}</CONSIGNEEGSTIN>
                          <CONSIGNEEPINCODE>${buyerDetails?.consignee?.pincode || ""}</CONSIGNEEPINCODE>
                          <BASICBASEPARTYNAME>${buyerDetails?.buyers?.name || ""}</BASICBASEPARTYNAME>
                          <CONSIGNEECSTNUMBER>${buyerDetails?.consignee?.cstNumber || ""}</CONSIGNEECSTNUMBER>
                          <BUYERSCSTNUMBER>${buyerDetails?.buyers?.cstNumber || ""}</BUYERSCSTNUMBER>
                          <NUMBERINGSTYLE>Manual</NUMBERINGSTYLE>
                          <CSTFORMISSUETYPE>&#4; Not Applicable</CSTFORMISSUETYPE>
                          <CSTFORMRECVTYPE>&#4; Not Applicable</CSTFORMRECVTYPE>
                          <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
                          <BILLOFLADINGNO>${despatchDetails?.billOfLadingNo || ""}</BILLOFLADINGNO>
                          <VCHSTATUSTAXADJUSTMENT>Default</VCHSTATUSTAXADJUSTMENT>
                          <VCHSTATUSVOUCHERTYPE>${childrenVoucherType}</VCHSTATUSVOUCHERTYPE>
                          <BASICSHIPPEDBY>${despatchDetails?.despatchedThrough || ""}</BASICSHIPPEDBY>
                          <BASICSHIPDOCUMENTNO>${despatchDetails?.despatchDocumentNo || ""}</BASICSHIPDOCUMENTNO>
                          <BASICFINALDESTINATION>${despatchDetails?.destination || ""}</BASICFINALDESTINATION>
                          <BASICORDERREF>${orderDetails?.otherRefences || ""}</BASICORDERREF>
                          <BASICSHIPVESSELNO>${despatchDetails?.motorVehicleNo || ""}</BASICSHIPVESSELNO>
                          <BASICDUEDATEOFPYMT>${orderDetails?.modeOrtermsOfPayment || ""}</BASICDUEDATEOFPYMT>
                          <BASICBUYERSSALESTAXNO>${buyerDetails?.buyers?.tinOrSalesTaxNumber || ""}</BASICBUYERSSALESTAXNO>
                          <VCHGSTCLASS>&#4; Not Applicable</VCHGSTCLASS>
                          <VOUCHERTYPEORIGNAME>${childrenVoucherType}</VOUCHERTYPEORIGNAME>
                          <DIFFACTUALQTY>No</DIFFACTUALQTY>
                          <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
                          <ISDELETED>No</ISDELETED>
                          <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
                          <ASORIGINAL>No</ASORIGINAL>
                          <AUDITED>No</AUDITED>
                          <ISCOMMONPARTY>No</ISCOMMONPARTY>
                          <FORJOBCOSTING>No</FORJOBCOSTING>
                          <ISOPTIONAL>${isOptionalVoucher}</ISOPTIONAL>
                          <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
                          <USEFOREXCISE>No</USEFOREXCISE>
                          <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
                          <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
                          <USEFORINTEREST>No</USEFORINTEREST>
                          <USEFORGAINLOSS>No</USEFORGAINLOSS>
                          <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
                          <USEFORCOMPOUND>No</USEFORCOMPOUND>
                          <USEFORSERVICETAX>No</USEFORSERVICETAX>
                          <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
                          <ISSYSTEM>No</ISSYSTEM>
                          <ISFETCHEDONLY>No</ISFETCHEDONLY>
                          <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
                          <ISCANCELLED>No</ISCANCELLED>
                          <ISONHOLD>No</ISONHOLD>
                          <ISSUMMARY>No</ISSUMMARY>
                          <ISECOMMERCESUPPLY>No</ISECOMMERCESUPPLY>
                          <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
                          <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
                          <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
                          <CMPGSTISOTHTERRITORYASSESSEE>No</CMPGSTISOTHTERRITORYASSESSEE>
                          <PARTYGSTISOTHTERRITORYASSESSEE>No</PARTYGSTISOTHTERRITORYASSESSEE>
                          <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
                          <IRNCANCELLED>No</IRNCANCELLED>
                          <IGNOREGSTCONFLICTINMIG>No</IGNOREGSTCONFLICTINMIG>
                          <ISOPBALTRANSACTION>No</ISOPBALTRANSACTION>
                          <IGNOREGSTFORMATVALIDATION>No</IGNOREGSTFORMATVALIDATION>
                          <ISELIGIBLEFORITC>Yes</ISELIGIBLEFORITC>
                          <UPDATESUMMARYVALUES>No</UPDATESUMMARYVALUES>
                          <ISEWAYBILLAPPLICABLE>No</ISEWAYBILLAPPLICABLE>
                          <ISDELETEDRETAINED>No</ISDELETEDRETAINED>
                          <ISNULL>No</ISNULL>
                          <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
                          <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
                          <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
                          <ISEXER1NOPOVERWRITE>No</ISEXER1NOPOVERWRITE>
                          <ISEXF2NOPOVERWRITE>No</ISEXF2NOPOVERWRITE>
                          <ISEXER3NOPOVERWRITE>No</ISEXER3NOPOVERWRITE>
                          <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
                          <EXCISEOPENING>No</EXCISEOPENING>
                          <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
                          <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
                          <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
                          <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
                          <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
                          <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
                          <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
                          <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
                          <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
                          <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
                          <VATADVANCEPAYMENT>No</VATADVANCEPAYMENT>
                          <VATADVPAY>No</VATADVPAY>
                          <ISCSTDELCAREDGOODSSALES>No</ISCSTDELCAREDGOODSSALES>
                          <ISVATRESTAXINV>No</ISVATRESTAXINV>
                          <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
                          <ISISDVOUCHER>No</ISISDVOUCHER>
                          <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
                          <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
                          <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
                          <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
                          <ISGSTREFUND>No</ISGSTREFUND>
                          <OVRDNEWAYBILLAPPLICABILITY>No</OVRDNEWAYBILLAPPLICABILITY>
                          <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
                          <VCHSTATUSISVCHNUMUSED>No</VCHSTATUSISVCHNUMUSED>
                          <VCHGSTSTATUSISINCLUDED>No</VCHGSTSTATUSISINCLUDED>
                          <VCHGSTSTATUSISUNCERTAIN>No</VCHGSTSTATUSISUNCERTAIN>
                          <VCHGSTSTATUSISEXCLUDED>No</VCHGSTSTATUSISEXCLUDED>
                          <VCHGSTSTATUSISAPPLICABLE>No</VCHGSTSTATUSISAPPLICABLE>
                          <VCHGSTSTATUSISGSTR2BRECONCILED>No</VCHGSTSTATUSISGSTR2BRECONCILED>
                          <VCHGSTSTATUSISGSTR2BONLYINPORTAL>No</VCHGSTSTATUSISGSTR2BONLYINPORTAL>
                          <VCHGSTSTATUSISGSTR2BONLYINBOOKS>No</VCHGSTSTATUSISGSTR2BONLYINBOOKS>
                          <VCHGSTSTATUSISGSTR2BMISMATCH>No</VCHGSTSTATUSISGSTR2BMISMATCH>
                          <VCHGSTSTATUSISGSTR2BINDIFFPERIOD>No</VCHGSTSTATUSISGSTR2BINDIFFPERIOD>
                          <VCHGSTSTATUSISRETEFFDATEOVERRDN>No</VCHGSTSTATUSISRETEFFDATEOVERRDN>
                          <VCHGSTSTATUSISOVERRDN>No</VCHGSTSTATUSISOVERRDN>
                          <VCHGSTSTATUSISSTATINDIFFDATE>No</VCHGSTSTATUSISSTATINDIFFDATE>
                          <VCHGSTSTATUSISRETINDIFFDATE>No</VCHGSTSTATUSISRETINDIFFDATE>
                          <VCHGSTSTATUSMAINSECTIONEXCLUDED>No</VCHGSTSTATUSMAINSECTIONEXCLUDED>
                          <VCHGSTSTATUSISBRANCHTRANSFEROUT>No</VCHGSTSTATUSISBRANCHTRANSFEROUT>
                          <VCHGSTSTATUSISSYSTEMSUMMARY>No</VCHGSTSTATUSISSYSTEMSUMMARY>
                          <VCHSTATUSISUNREGISTEREDRCM>No</VCHSTATUSISUNREGISTEREDRCM>
                          <VCHSTATUSISOPTIONAL>Yes</VCHSTATUSISOPTIONAL>
                          <VCHSTATUSISCANCELLED>No</VCHSTATUSISCANCELLED>
                          <VCHSTATUSISDELETED>No</VCHSTATUSISDELETED>
                          <VCHSTATUSISOPENINGBALANCE>No</VCHSTATUSISOPENINGBALANCE>
                          <VCHSTATUSISFETCHEDONLY>No</VCHSTATUSISFETCHEDONLY>
                          <PAYMENTLINKHASMULTIREF>No</PAYMENTLINKHASMULTIREF>
                          <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
                          <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
                          <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
                          <HASCASHFLOW>No</HASCASHFLOW>
                          <ISPOSTDATED>No</ISPOSTDATED>
                          <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
                          <ISINVOICE>Yes</ISINVOICE>
                          <MFGJOURNAL>No</MFGJOURNAL>
                          <HASDISCOUNTS>Yes</HASDISCOUNTS>
                          <ASPAYSLIP>No</ASPAYSLIP>
                          <ISCOSTCENTRE>No</ISCOSTCENTRE>
                          <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
                          <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
                          <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
                          <ISVOID>No</ISVOID>
                          <ORDERLINESTATUS>No</ORDERLINESTATUS>
                          <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
                          <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
                          <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
                          <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
                          <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
                          <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
                          <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
                          <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
                          <CHANGEVCHMODE>No</CHANGEVCHMODE>
                          <RESETIRNQRCODE>No</RESETIRNQRCODE>
                          <VOUCHERNUMBERSERIES>Default</VOUCHERNUMBERSERIES>
                          <EWAYBILLDETAILS.LIST>
                              <BILLDATE>${date}</BILLDATE>
                              <DOCUMENTTYPE>${ewaybillDetails?.documentType || ""}</DOCUMENTTYPE>
                              <BILLNUMBER>${ewaybillDetails?.ewayBillNo || ""}</BILLNUMBER>
                              <SUBTYPE>${ewaybillDetails?.subType || ""}</SUBTYPE>
                              <BILLSTATUS>${ewaybillDetails?.statusOfBill || ""}</BILLSTATUS>
                              <ISCANCELLED>No</ISCANCELLED>
                              <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
                              <ISCANCELPENDING>No</ISCANCELPENDING>
                              <IGNOREGENERATIONVALIDATION>No</IGNOREGENERATIONVALIDATION>
                              <ISEXPORTEDFORGENERATION>No</ISEXPORTEDFORGENERATION>
                              <INTRASTATEAPPLICABILITY>No</INTRASTATEAPPLICABILITY>
                              <TRANSPORTDETAILS.LIST>       </TRANSPORTDETAILS.LIST>
                              <EXTENSIONDETAILS.LIST>       </EXTENSIONDETAILS.LIST>
                              <MULTIVEHICLEDETAILS.LIST>       </MULTIVEHICLEDETAILS.LIST>
                              <STATEWISETHRESHOLD.LIST>       </STATEWISETHRESHOLD.LIST>
                          </EWAYBILLDETAILS.LIST>
                          <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
                          <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
                          <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
                          <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
                          <DUTYHEADDETAILS.LIST>      </DUTYHEADDETAILS.LIST>
                          <GSTADVADJDETAILS.LIST>      </GSTADVADJDETAILS.LIST>`;

      // Loop through the itemField array and add entries for each item
      if (items && items.length > 0) {
        for (const itemEntry of items) {
          xmlPayload += `                        <ALLINVENTORYENTRIES.LIST>
        <BASICUSERDESCRIPTION.LIST TYPE="String">
            <BASICUSERDESCRIPTION>${itemEntry?.description || ""}</BASICUSERDESCRIPTION>
        </BASICUSERDESCRIPTION.LIST>
        <STOCKITEMNAME>${itemEntry?.itemName || ""}</STOCKITEMNAME>
        <GSTOVRDNISREVCHARGEAPPL>&#4; Not Applicable</GSTOVRDNISREVCHARGEAPPL>
        <GSTOVRDNTAXABILITY>Taxable</GSTOVRDNTAXABILITY>
        <GSTSOURCETYPE>Stock Item</GSTSOURCETYPE>
        <GSTITEMSOURCE>${itemEntry?.itemName || ""}</GSTITEMSOURCE>
        <HSNSOURCETYPE>Stock Item</HSNSOURCETYPE>
        <HSNITEMSOURCE>${itemEntry?.itemName || ""}</HSNITEMSOURCE>
        <GSTOVRDNSTOREDNATURE/>
        <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
        <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
        <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
        <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
        <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
        <ISAUTONEGATE>No</ISAUTONEGATE>
        <ISCUSTOMSCLEARANCE>No</ISCUSTOMSCLEARANCE>
        <ISTRACKCOMPONENT>No</ISTRACKCOMPONENT>
        <ISTRACKPRODUCTION>No</ISTRACKPRODUCTION>
        <ISPRIMARYITEM>No</ISPRIMARYITEM>
        <ISSCRAP>No</ISSCRAP>
        <RATE>${itemEntry?.rate || ""}</RATE>
        <DISCOUNT>${itemEntry?.disc || ""}</DISCOUNT>
        <AMOUNT>${itemEntry?.amount || ""}</AMOUNT>
        <ACTUALQTY>${itemEntry?.quantity || ""}</ACTUALQTY>
        <BILLEDQTY>${itemEntry?.quantity || ""}</BILLEDQTY>
        <BATCHALLOCATIONS.LIST>
            <GODOWNNAME>${itemEntry?.godownName || ""}</GODOWNNAME>
            <BATCHNAME>${itemEntry?.batchName || "Primary Batch"}</BATCHNAME>
            <INDENTNO>&#4; Not Applicable</INDENTNO>
            <ORDERNO>&#4; Not Applicable</ORDERNO>
            <TRACKINGNUMBER>&#4; Not Applicable</TRACKINGNUMBER>
            <DYNAMICCSTISCLEARED>No</DYNAMICCSTISCLEARED>
            <AMOUNT>${itemEntry?.amount || ""}</AMOUNT>
            <ACTUALQTY>${itemEntry?.quantity || ""}</ACTUALQTY>
            <BILLEDQTY>${itemEntry?.quantity || ""}</BILLEDQTY>
            <ADDITIONALDETAILS.LIST>        </ADDITIONALDETAILS.LIST>
            <VOUCHERCOMPONENTLIST.LIST>        </VOUCHERCOMPONENTLIST.LIST>
        </BATCHALLOCATIONS.LIST>
        <ACCOUNTINGALLOCATIONS.LIST>
            <OLDAUDITENTRYIDS.LIST TYPE="Number">
                <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
            </OLDAUDITENTRYIDS.LIST>
            <LEDGERNAME>${salesAccountLedgerName}</LEDGERNAME>
            <GSTCLASS>&#4; Not Applicable</GSTCLASS>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <LEDGERFROMITEM>No</LEDGERFROMITEM>
            <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
            <ISPARTYLEDGER>No</ISPARTYLEDGER>
            <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
            <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
            <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
            <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
            <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
            <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
            <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
            <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
            <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
            <AMOUNT>${itemEntry.amount || ""}</AMOUNT>
            <SERVICETAXDETAILS.LIST>        </SERVICETAXDETAILS.LIST>
            <BANKALLOCATIONS.LIST>        </BANKALLOCATIONS.LIST>
            <BILLALLOCATIONS.LIST>        </BILLALLOCATIONS.LIST>
            <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>
            <OLDAUDITENTRIES.LIST>        </OLDAUDITENTRIES.LIST>
            <ACCOUNTAUDITENTRIES.LIST>        </ACCOUNTAUDITENTRIES.LIST>
            <AUDITENTRIES.LIST>        </AUDITENTRIES.LIST>
            <INPUTCRALLOCS.LIST>        </INPUTCRALLOCS.LIST>
            <DUTYHEADDETAILS.LIST>        </DUTYHEADDETAILS.LIST>
            <EXCISEDUTYHEADDETAILS.LIST>        </EXCISEDUTYHEADDETAILS.LIST>
            <RATEDETAILS.LIST>        </RATEDETAILS.LIST>
            <SUMMARYALLOCS.LIST>        </SUMMARYALLOCS.LIST>
            <CENVATDUTYALLOCATIONS.LIST>        </CENVATDUTYALLOCATIONS.LIST>
            <STPYMTDETAILS.LIST>        </STPYMTDETAILS.LIST>
            <EXCISEPAYMENTALLOCATIONS.LIST>        </EXCISEPAYMENTALLOCATIONS.LIST>
            <TAXBILLALLOCATIONS.LIST>        </TAXBILLALLOCATIONS.LIST>
            <TAXOBJECTALLOCATIONS.LIST>        </TAXOBJECTALLOCATIONS.LIST>
            <TDSEXPENSEALLOCATIONS.LIST>        </TDSEXPENSEALLOCATIONS.LIST>
            <VATSTATUTORYDETAILS.LIST>        </VATSTATUTORYDETAILS.LIST>
            <COSTTRACKALLOCATIONS.LIST>        </COSTTRACKALLOCATIONS.LIST>
            <REFVOUCHERDETAILS.LIST>        </REFVOUCHERDETAILS.LIST>
            <INVOICEWISEDETAILS.LIST>        </INVOICEWISEDETAILS.LIST>
            <VATITCDETAILS.LIST>        </VATITCDETAILS.LIST>
            <ADVANCETAXDETAILS.LIST>        </ADVANCETAXDETAILS.LIST>
            <TAXTYPEALLOCATIONS.LIST>        </TAXTYPEALLOCATIONS.LIST>
        </ACCOUNTINGALLOCATIONS.LIST>
        <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
        <SUPPLEMENTARYDUTYHEADDETAILS.LIST>       </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
        <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
        <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
        <EXCISEALLOCATIONS.LIST>       </EXCISEALLOCATIONS.LIST>
        <EXPENSEALLOCATIONS.LIST>       </EXPENSEALLOCATIONS.LIST>
    </ALLINVENTORYENTRIES.LIST>`;
        }
      }

      xmlPayload += `
    <CONTRITRANS.LIST>      </CONTRITRANS.LIST>
    <EWAYBILLERRORLIST.LIST>      </EWAYBILLERRORLIST.LIST>
    <IRNERRORLIST.LIST>      </IRNERRORLIST.LIST>
    <HARYANAVAT.LIST>      </HARYANAVAT.LIST>
    <SUPPLEMENTARYDUTYHEADDETAILS.LIST>      </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
    <INVOICEDELNOTES.LIST>      </INVOICEDELNOTES.LIST>
    <INVOICEORDERLIST.LIST>      </INVOICEORDERLIST.LIST>
    <INVOICEINDENTLIST.LIST>      </INVOICEINDENTLIST.LIST>
    <ATTENDANCEENTRIES.LIST>      </ATTENDANCEENTRIES.LIST>
    <ORIGINVOICEDETAILS.LIST>      </ORIGINVOICEDETAILS.LIST>
    <INVOICEEXPORTLIST.LIST>      </INVOICEEXPORTLIST.LIST>
    <LEDGERENTRIES.LIST>
        <OLDAUDITENTRYIDS.LIST TYPE="Number">
            <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
        </OLDAUDITENTRYIDS.LIST>
        <LEDGERNAME>${ledgerName}</LEDGERNAME>
        <GSTCLASS>&#4; Not Applicable</GSTCLASS>
        <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
        <LEDGERFROMITEM>No</LEDGERFROMITEM>
        <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
        <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
        <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
        <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
        <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
        <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
        <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
        <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
        <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
        <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
        <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
        <AMOUNT>-${grossTotal}</AMOUNT>
        <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
        <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
        <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
        <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
        <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
        <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
        <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
        <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
        <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
        <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
        <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
        <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
        <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
        <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
        <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
        <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
        <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
        <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
        <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
        <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
        <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
        <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
        <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
        <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
        <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
    </LEDGERENTRIES.LIST>
    `

      if (taxLedgers && taxLedgers.length > 0) {
        // Loop through the taxField array for each item and add tax-related entries
        for (const taxEntry of taxLedgers) {
          xmlPayload += `
            <LEDGERENTRIES.LIST>
            <OLDAUDITENTRYIDS.LIST TYPE="Number">
                <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
            </OLDAUDITENTRYIDS.LIST>
            <LEDGERNAME>${taxEntry?.ledgerName || ""}</LEDGERNAME>
            <GSTCLASS>&#4; Not Applicable</GSTCLASS>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <LEDGERFROMITEM>No</LEDGERFROMITEM>
            <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
            <ISPARTYLEDGER>No</ISPARTYLEDGER>
            <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
            <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
            <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
            <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
            <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
            <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
            <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
            <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
            <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
            <AMOUNT>${taxEntry?.amount || ""}</AMOUNT>
            <VATEXPAMOUNT>${taxEntry?.amount || ""}</VATEXPAMOUNT>
            <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
            <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
            <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
            <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
            <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
            <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
            <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
            <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
            <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
            <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
            <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
            <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
            <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
            <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
            <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
            <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
            <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
            <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
            <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
            <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
            <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
            <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
            <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
            <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
            <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
        </LEDGERENTRIES.LIST>
        `;
        }
      }

      // Add the closing tags for the XML payload
      xmlPayload += `                        <GST.LIST>      </GST.LIST>
        <PAYROLLMODEOFPAYMENT.LIST>      </PAYROLLMODEOFPAYMENT.LIST>
        <ATTDRECORDS.LIST>      </ATTDRECORDS.LIST>
        <GSTEWAYCONSIGNORADDRESS.LIST>      </GSTEWAYCONSIGNORADDRESS.LIST>
        <GSTEWAYCONSIGNEEADDRESS.LIST>      </GSTEWAYCONSIGNEEADDRESS.LIST>
        <TEMPGSTRATEDETAILS.LIST>      </TEMPGSTRATEDETAILS.LIST>
        <TEMPGSTADVADJUSTED.LIST>      </TEMPGSTADVADJUSTED.LIST>
    </VOUCHER>
</TALLYMESSAGE>
</REQUESTDATA>
</IMPORTDATA>
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
      // console.log(data);

      let res: any;

      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing response XML:", err);
          return;
        }
        res = result;
      });
      const created = +res?.RESPONSE?.CREATED?.[0];
      const masterId = res?.RESPONSE?.LASTVCHID?.[0];
      let obj = {
        msg: `${parentVoucherType}voucher with voucherNumber : ${voucherNumber} created successfully`,
        created: created,
      };

      if (created === 1) {
        await UpdateBuffer(_id, companyNameDb, token, masterId, companyName, childrenVoucherType, voucherNumber, "voucher", null, null);
        await deleteBuffer(_id, companyNameDb, token);
        responceArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res);
        return { msg: "failed to create", res };
      }
    }
    return responceArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong in addSalesVoucher function , Please restart the application.",
      err: error.message
    }
  }
}

//------------------ADD PAYMENT VOUCHER------------------//
export const addPaymentVoucher = async (vouchers: any, companyName: any, companyNameDb: any, token: any, port: any) => {
  try {
    let responceArr = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      let {
        _id,
        date,
        partyLedgerName,
        bankOrCashName,
        narration,
        childrenVoucherType,
        parentVoucherType,
        voucherNumber,
        amount,
        paymentMode,
        instrumentNumber,
        instrumentDate,
        isOptionalVoucher,
        partyGSTIN,
        bills
      } = voucher;

      // console.log("In add voucher --->", vouchers);

      // Construct the XML payload
      let xmlPayload = `<ENVELOPE>
      <HEADER>
          <TALLYREQUEST>Import Data</TALLYREQUEST>
      </HEADER>
      <BODY>
          <IMPORTDATA>
              <REQUESTDESC>
                  <REPORTNAME>Vouchers</REPORTNAME>
                  <STATICVARIABLES>
                      <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                  </STATICVARIABLES>
              </REQUESTDESC>
              <REQUESTDATA>
                  <TALLYMESSAGE xmlns:UDF="TallyUDF">
                      <VOUCHER VCHTYPE="${childrenVoucherType}" ACTION="Create">
                          <OLDAUDITENTRYIDS.LIST TYPE="Number">
                              <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                          </OLDAUDITENTRYIDS.LIST>
                          <DATE>${date}</DATE>
                          <VCHSTATUSDATE>${date}</VCHSTATUSDATE>
                          <NARRATION>${narration}</NARRATION>
                          <ENTEREDBY>${companyName}</ENTEREDBY>
                          <PARTYGSTIN>${partyGSTIN}</PARTYGSTIN>
                          <VOUCHERTYPENAME>${childrenVoucherType}</VOUCHERTYPENAME>
                          <PARTYLEDGERNAME>${partyLedgerName}</PARTYLEDGERNAME>
                          <VOUCHERNUMBER>${voucherNumber}</VOUCHERNUMBER>
                          <CMPGSTREGISTRATIONTYPE>Regular</CMPGSTREGISTRATIONTYPE>
                          <NUMBERINGSTYLE>Auto Retain</NUMBERINGSTYLE>
                          <CSTFORMISSUETYPE>&#4; Not Applicable</CSTFORMISSUETYPE>
                          <CSTFORMRECVTYPE>&#4; Not Applicable</CSTFORMRECVTYPE>
                          <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
                          <VCHSTATUSTAXADJUSTMENT>Default</VCHSTATUSTAXADJUSTMENT>
                          <VCHSTATUSVOUCHERTYPE>${childrenVoucherType}</VCHSTATUSVOUCHERTYPE>
                          <VCHGSTCLASS>&#4; Not Applicable</VCHGSTCLASS>
                          <VOUCHERTYPEORIGNAME>${childrenVoucherType}</VOUCHERTYPEORIGNAME>
                          <DIFFACTUALQTY>No</DIFFACTUALQTY>
                          <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
                          <ISDELETED>No</ISDELETED>
                          <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
                          <ASORIGINAL>No</ASORIGINAL>
                          <AUDITED>No</AUDITED>
                          <ISCOMMONPARTY>No</ISCOMMONPARTY>
                          <FORJOBCOSTING>No</FORJOBCOSTING>
                          <ISOPTIONAL>${isOptionalVoucher}</ISOPTIONAL>
                          <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
                          <USEFOREXCISE>No</USEFOREXCISE>
                          <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
                          <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
                          <USEFORINTEREST>No</USEFORINTEREST>
                          <USEFORGAINLOSS>No</USEFORGAINLOSS>
                          <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
                          <USEFORCOMPOUND>No</USEFORCOMPOUND>
                          <USEFORSERVICETAX>No</USEFORSERVICETAX>
                          <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
                          <ISSYSTEM>No</ISSYSTEM>
                          <ISFETCHEDONLY>No</ISFETCHEDONLY>
                          <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
                          <ISCANCELLED>No</ISCANCELLED>
                          <ISONHOLD>No</ISONHOLD>
                          <ISSUMMARY>No</ISSUMMARY>
                          <ISECOMMERCESUPPLY>No</ISECOMMERCESUPPLY>
                          <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
                          <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
                          <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
                          <CMPGSTISOTHTERRITORYASSESSEE>No</CMPGSTISOTHTERRITORYASSESSEE>
                          <PARTYGSTISOTHTERRITORYASSESSEE>No</PARTYGSTISOTHTERRITORYASSESSEE>
                          <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
                          <IRNCANCELLED>No</IRNCANCELLED>
                          <IGNOREGSTCONFLICTINMIG>No</IGNOREGSTCONFLICTINMIG>
                          <ISOPBALTRANSACTION>No</ISOPBALTRANSACTION>
                          <IGNOREGSTFORMATVALIDATION>No</IGNOREGSTFORMATVALIDATION>
                          <ISELIGIBLEFORITC>Yes</ISELIGIBLEFORITC>
                          <UPDATESUMMARYVALUES>No</UPDATESUMMARYVALUES>
                          <ISEWAYBILLAPPLICABLE>No</ISEWAYBILLAPPLICABLE>
                          <ISDELETEDRETAINED>No</ISDELETEDRETAINED>
                          <ISNULL>No</ISNULL>
                          <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
                          <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
                          <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
                          <ISEXER1NOPOVERWRITE>No</ISEXER1NOPOVERWRITE>
                          <ISEXF2NOPOVERWRITE>No</ISEXF2NOPOVERWRITE>
                          <ISEXER3NOPOVERWRITE>No</ISEXER3NOPOVERWRITE>
                          <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
                          <EXCISEOPENING>No</EXCISEOPENING>
                          <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
                          <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
                          <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
                          <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
                          <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
                          <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
                          <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
                          <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
                          <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
                          <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
                          <VATADVANCEPAYMENT>No</VATADVANCEPAYMENT>
                          <VATADVPAY>No</VATADVPAY>
                          <ISCSTDELCAREDGOODSSALES>No</ISCSTDELCAREDGOODSSALES>
                          <ISVATRESTAXINV>No</ISVATRESTAXINV>
                          <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
                          <ISISDVOUCHER>No</ISISDVOUCHER>
                          <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
                          <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
                          <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
                          <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
                          <ISGSTREFUND>No</ISGSTREFUND>
                          <OVRDNEWAYBILLAPPLICABILITY>No</OVRDNEWAYBILLAPPLICABILITY>
                          <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
                          <VCHSTATUSISVCHNUMUSED>No</VCHSTATUSISVCHNUMUSED>
                          <VCHGSTSTATUSISINCLUDED>No</VCHGSTSTATUSISINCLUDED>
                          <VCHGSTSTATUSISUNCERTAIN>No</VCHGSTSTATUSISUNCERTAIN>
                          <VCHGSTSTATUSISEXCLUDED>No</VCHGSTSTATUSISEXCLUDED>
                          <VCHGSTSTATUSISAPPLICABLE>No</VCHGSTSTATUSISAPPLICABLE>
                          <VCHGSTSTATUSISGSTR2BRECONCILED>No</VCHGSTSTATUSISGSTR2BRECONCILED>
                          <VCHGSTSTATUSISGSTR2BONLYINPORTAL>No</VCHGSTSTATUSISGSTR2BONLYINPORTAL>
                          <VCHGSTSTATUSISGSTR2BONLYINBOOKS>No</VCHGSTSTATUSISGSTR2BONLYINBOOKS>
                          <VCHGSTSTATUSISGSTR2BMISMATCH>No</VCHGSTSTATUSISGSTR2BMISMATCH>
                          <VCHGSTSTATUSISGSTR2BINDIFFPERIOD>No</VCHGSTSTATUSISGSTR2BINDIFFPERIOD>
                          <VCHGSTSTATUSISRETEFFDATEOVERRDN>No</VCHGSTSTATUSISRETEFFDATEOVERRDN>
                          <VCHGSTSTATUSISOVERRDN>No</VCHGSTSTATUSISOVERRDN>
                          <VCHGSTSTATUSISSTATINDIFFDATE>No</VCHGSTSTATUSISSTATINDIFFDATE>
                          <VCHGSTSTATUSISRETINDIFFDATE>No</VCHGSTSTATUSISRETINDIFFDATE>
                          <VCHGSTSTATUSMAINSECTIONEXCLUDED>No</VCHGSTSTATUSMAINSECTIONEXCLUDED>
                          <VCHGSTSTATUSISBRANCHTRANSFEROUT>No</VCHGSTSTATUSISBRANCHTRANSFEROUT>
                          <VCHGSTSTATUSISSYSTEMSUMMARY>No</VCHGSTSTATUSISSYSTEMSUMMARY>
                          <VCHSTATUSISUNREGISTEREDRCM>No</VCHSTATUSISUNREGISTEREDRCM>
                          <VCHSTATUSISOPTIONAL>Yes</VCHSTATUSISOPTIONAL>
                          <VCHSTATUSISCANCELLED>No</VCHSTATUSISCANCELLED>
                          <VCHSTATUSISDELETED>No</VCHSTATUSISDELETED>
                          <VCHSTATUSISOPENINGBALANCE>No</VCHSTATUSISOPENINGBALANCE>
                          <VCHSTATUSISFETCHEDONLY>No</VCHSTATUSISFETCHEDONLY>
                          <PAYMENTLINKHASMULTIREF>No</PAYMENTLINKHASMULTIREF>
                          <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
                          <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
                          <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
                          <HASCASHFLOW>Yes</HASCASHFLOW>
                          <ISPOSTDATED>No</ISPOSTDATED>
                          <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
                          <ISINVOICE>No</ISINVOICE>
                          <MFGJOURNAL>No</MFGJOURNAL>
                          <HASDISCOUNTS>No</HASDISCOUNTS>
                          <ASPAYSLIP>No</ASPAYSLIP>
                          <ISCOSTCENTRE>No</ISCOSTCENTRE>
                          <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
                          <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
                          <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
                          <ISVOID>No</ISVOID>
                          <ORDERLINESTATUS>No</ORDERLINESTATUS>
                          <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
                          <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
                          <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
                          <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
                          <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
                          <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
                          <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
                          <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
                          <CHANGEVCHMODE>No</CHANGEVCHMODE>
                          <RESETIRNQRCODE>No</RESETIRNQRCODE>
                          <VOUCHERNUMBERSERIES>Default</VOUCHERNUMBERSERIES>
                          <EWAYBILLDETAILS.LIST>      </EWAYBILLDETAILS.LIST>
                          <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
                          <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
                          <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
                          <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
                          <DUTYHEADDETAILS.LIST>      </DUTYHEADDETAILS.LIST>
                          <GSTADVADJDETAILS.LIST>      </GSTADVADJDETAILS.LIST>
                          <CONTRITRANS.LIST>      </CONTRITRANS.LIST>
                          <EWAYBILLERRORLIST.LIST>      </EWAYBILLERRORLIST.LIST>
                          <IRNERRORLIST.LIST>      </IRNERRORLIST.LIST>
                          <HARYANAVAT.LIST>      </HARYANAVAT.LIST>
                          <SUPPLEMENTARYDUTYHEADDETAILS.LIST>      </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
                          <INVOICEDELNOTES.LIST>      </INVOICEDELNOTES.LIST>
                          <INVOICEORDERLIST.LIST>      </INVOICEORDERLIST.LIST>
                          <INVOICEINDENTLIST.LIST>      </INVOICEINDENTLIST.LIST>
                          <ATTENDANCEENTRIES.LIST>      </ATTENDANCEENTRIES.LIST>
                          <ORIGINVOICEDETAILS.LIST>      </ORIGINVOICEDETAILS.LIST>
                          <INVOICEEXPORTLIST.LIST>      </INVOICEEXPORTLIST.LIST>
                          <ALLLEDGERENTRIES.LIST>
                              <OLDAUDITENTRYIDS.LIST TYPE="Number">
                                  <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                              </OLDAUDITENTRYIDS.LIST>
                              <LEDGERNAME>${partyLedgerName}</LEDGERNAME>
                              <GSTCLASS>&#4; Not Applicable</GSTCLASS>
                              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
                              <LEDGERFROMITEM>No</LEDGERFROMITEM>
                              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
                              <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
                              <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
                              <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
                              <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
                              <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
                              <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
                              <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
                              <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
                              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
                              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
                              <AMOUNT>-${amount}</AMOUNT>
                              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
                              <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>`;

      if (bills && bills.length > 0) {
        bills.forEach((billDetail: { billName: any; billType: any; amount: any; }) => {
          xmlPayload += `
          <BILLALLOCATIONS.LIST>
            <NAME>${billDetail?.billName || ""}</NAME>
            <BILLTYPE>${billDetail?.billType || ""}</BILLTYPE>
            <TDSDEDUCTEEISSPECIALRATE>No</TDSDEDUCTEEISSPECIALRATE>
            <AMOUNT>-${billDetail?.amount || ""}</AMOUNT>
            <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>
            <STBILLCATEGORIES.LIST>        </STBILLCATEGORIES.LIST>
        </BILLALLOCATIONS.LIST>`;
        });
      }

      xmlPayload += `
      <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
      <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
      <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
      <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
      <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
      <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
      <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
      <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
      <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
      <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
      <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
      <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
      <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
      <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
      <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
      <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
      <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
      <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
      <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
      <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
      <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
      <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
  </ALLLEDGERENTRIES.LIST>
  <ALLLEDGERENTRIES.LIST>
      <OLDAUDITENTRYIDS.LIST TYPE="Number">
          <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
      </OLDAUDITENTRYIDS.LIST>
      <LEDGERNAME>${bankOrCashName}</LEDGERNAME>
      <GSTCLASS>&#4; Not Applicable</GSTCLASS>
      <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
      <LEDGERFROMITEM>No</LEDGERFROMITEM>
      <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
      <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
      <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
      <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
      <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
      <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
      <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
      <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
      <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
      <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
      <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
      <AMOUNT>${amount}</AMOUNT>
      <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
      <BANKALLOCATIONS.LIST>
          <DATE>${date}</DATE>
          <INSTRUMENTDATE>${instrumentDate}</INSTRUMENTDATE>
          <TRANSACTIONTYPE>${paymentMode}</TRANSACTIONTYPE>
          <INSTRUMENTNUMBER>${instrumentNumber}</INSTRUMENTNUMBER>
          <STATUS>No</STATUS>
          <PAYMENTMODE>Transacted</PAYMENTMODE>
          <ISCONNECTEDPAYMENT>No</ISCONNECTEDPAYMENT>
          <ISSPLIT>No</ISSPLIT>
          <ISCONTRACTUSED>No</ISCONTRACTUSED>
          <ISACCEPTEDWITHWARNING>No</ISACCEPTEDWITHWARNING>
          <ISTRANSFORCED>No</ISTRANSFORCED>
          <AMOUNT>${amount}</AMOUNT>
          <CONTRACTDETAILS.LIST>        </CONTRACTDETAILS.LIST>
          <BANKSTATUSINFO.LIST>        </BANKSTATUSINFO.LIST>
      </BANKALLOCATIONS.LIST>
      <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
      <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
      <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
      <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
      <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
      <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
      <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
      <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
      <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
      <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
      <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
      <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
      <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
      <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
      <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
      <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
      <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
      <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
      <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
      <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
      <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
      <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
      <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
  </ALLLEDGERENTRIES.LIST>
  <GST.LIST>      </GST.LIST>
  <PAYROLLMODEOFPAYMENT.LIST>      </PAYROLLMODEOFPAYMENT.LIST>
  <ATTDRECORDS.LIST>      </ATTDRECORDS.LIST>
  <GSTEWAYCONSIGNORADDRESS.LIST>      </GSTEWAYCONSIGNORADDRESS.LIST>
  <GSTEWAYCONSIGNEEADDRESS.LIST>      </GSTEWAYCONSIGNEEADDRESS.LIST>
  <TEMPGSTRATEDETAILS.LIST>      </TEMPGSTRATEDETAILS.LIST>
  <TEMPGSTADVADJUSTED.LIST>      </TEMPGSTADVADJUSTED.LIST>`;
      // Add the closing tags for the XML payload
      xmlPayload += `                    
              </VOUCHER>
          </TALLYMESSAGE>
        </REQUESTDATA>
    </IMPORTDATA>
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
      // console.log(data);

      let res: any;

      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing response XML:", err);
          return;
        }
        // console.log("voucher details:", JSON.stringify(result));
        // return res.status(200).send(result);
        res = result;
      });

      // console.log("res-->", res.ENVELOPE.BODY[0].DESC[0]);

      const created = +res.RESPONSE.CREATED[0];
      const masterId = res.RESPONSE.LASTVCHID[0];

      // console.log(res);

      let obj = {
        msg: `${parentVoucherType}voucher with voucherNumber : ${voucherNumber} created successfully`,
        created: created,
      };

      if (created === 1) {
        await UpdateBuffer(_id, companyNameDb, token, masterId, companyName, childrenVoucherType, voucherNumber, "voucher", null, null);
        await deleteBuffer(_id, companyNameDb, token);
        // return obj;
        responceArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res);
        return { msg: "failed to create", res };
      }
    }
    return responceArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong in addPaymentVoucher fundtion, Please restart the application.",
      err: error.message
    }
  }
};

//------------------ADD PURCHASE VOUCHER-----------------//
export const addPurchaseVoucher = async (vouchers: any, companyName: any, companyNameDb: any, token: any, port: any) => {
  try {
    let responceArr = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      let {
        _id,
        date,
        ledgerName,
        purchaseAccountLedgerName,
        partyAddress,
        partyGSTIN,
        voucherNumber,
        narration,
        parentVoucherType,
        childrenVoucherType,
        isOptionalVoucher,
        grossTotal,
        items,
        taxLedgers,
        ewaybillDetails,
        orderDetails,
        despatchDetails,
        buyerDetails
      } = voucher;

      // Construct the XML payload
      let xmlPayload = `<ENVELOPE>
      <HEADER>
          <TALLYREQUEST>Import Data</TALLYREQUEST>
      </HEADER>
      <BODY>
          <IMPORTDATA>
              <REQUESTDESC>
                  <REPORTNAME>Vouchers</REPORTNAME>
                  <STATICVARIABLES>
                      <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                  </STATICVARIABLES>
              </REQUESTDESC>
              <REQUESTDATA>
                  <TALLYMESSAGE xmlns:UDF="TallyUDF">
                      <VOUCHER VCHTYPE="${childrenVoucherType}" ACTION="Create" >
                          <ADDRESS.LIST TYPE="String">
                              <ADDRESS>${partyAddress}</ADDRESS>
                          </ADDRESS.LIST>
                          <BASICBUYERADDRESS.LIST TYPE="String">
                              <BASICBUYERADDRESS>${buyerDetails?.buyers?.address || ""}</BASICBUYERADDRESS>
                          </BASICBUYERADDRESS.LIST>
                          <BASICORDERTERMS.LIST TYPE="String">
                              <BASICORDERTERMS>${orderDetails?.termsOfDelivery || ""}</BASICORDERTERMS>
                          </BASICORDERTERMS.LIST>
                          <OLDAUDITENTRYIDS.LIST TYPE="Number">
                              <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                          </OLDAUDITENTRYIDS.LIST>
                          <DATE>${date}</DATE>
                          <BILLOFLADINGDATE>${despatchDetails?.LRDate || ""}</BILLOFLADINGDATE>
                          <VCHSTATUSDATE>${date}</VCHSTATUSDATE>
                          <GSTREGISTRATIONTYPE>Regular</GSTREGISTRATIONTYPE>
                          <NARRATION>${narration}</NARRATION>
                          <ENTEREDBY>${companyName}</ENTEREDBY>
                          <PARTYGSTIN>${partyGSTIN}</PARTYGSTIN>
                          <PARTYNAME>${ledgerName}</PARTYNAME>
                          <VOUCHERTYPENAME>${childrenVoucherType}</VOUCHERTYPENAME>
                          <PARTYLEDGERNAME>${ledgerName}</PARTYLEDGERNAME>
                          <VOUCHERNUMBER>${voucherNumber}</VOUCHERNUMBER>
                          <BASICBUYERNAME>${buyerDetails?.buyers?.name || ""}</BASICBUYERNAME>
                          <CMPGSTREGISTRATIONTYPE>Regular</CMPGSTREGISTRATIONTYPE>
                          <PARTYPINCODE>${buyerDetails?.buyers?.pincode || ""}</PARTYPINCODE>
                          <CONSIGNEEGSTIN>${buyerDetails?.consignee?.name || ""}</CONSIGNEEGSTIN>
                          <CONSIGNEEPINCODE>${buyerDetails?.consignee?.pincode || ""}</CONSIGNEEPINCODE>
                          <BASICBASEPARTYNAME>${buyerDetails?.buyers?.name || ""}</BASICBASEPARTYNAME>
                          <CONSIGNEECSTNUMBER>${buyerDetails?.consignee?.cstNumber || ""}</CONSIGNEECSTNUMBER>
                          <BUYERSCSTNUMBER>${buyerDetails?.buyers?.cstNumber || ""}</BUYERSCSTNUMBER>
                          <NUMBERINGSTYLE>Manual</NUMBERINGSTYLE>
                          <CSTFORMISSUETYPE>&#4; Not Applicable</CSTFORMISSUETYPE>
                          <CSTFORMRECVTYPE>&#4; Not Applicable</CSTFORMRECVTYPE>
                          <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
                          <BILLOFLADINGNO>${despatchDetails?.billOfLadingNo || ""}</BILLOFLADINGNO>
                          <VCHSTATUSTAXADJUSTMENT>Default</VCHSTATUSTAXADJUSTMENT>
                          <VCHSTATUSVOUCHERTYPE>${childrenVoucherType}</VCHSTATUSVOUCHERTYPE>
                          <BASICSHIPPEDBY>${despatchDetails?.despatchedThrough || ""}</BASICSHIPPEDBY>
                          <BASICSHIPDOCUMENTNO>${despatchDetails?.despatchDocumentNo || ""}</BASICSHIPDOCUMENTNO>
                          <BASICFINALDESTINATION>${despatchDetails?.destination || ""}</BASICFINALDESTINATION>
                          <BASICORDERREF>${orderDetails?.otherRefences || ""}</BASICORDERREF>
                          <BASICSHIPVESSELNO>${despatchDetails?.motorVehicleNo || ""}</BASICSHIPVESSELNO>
                          <BASICDUEDATEOFPYMT>${orderDetails?.modeOrtermsOfPayment || ""}</BASICDUEDATEOFPYMT>
                          <BASICBUYERSSALESTAXNO>${buyerDetails?.buyers?.tinOrSalesTaxNumber || ""}</BASICBUYERSSALESTAXNO>
                          <VCHGSTCLASS>&#4; Not Applicable</VCHGSTCLASS>
                          <VOUCHERTYPEORIGNAME>${childrenVoucherType}</VOUCHERTYPEORIGNAME>
                          <DIFFACTUALQTY>No</DIFFACTUALQTY>
                          <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
                          <ISDELETED>No</ISDELETED>
                          <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
                          <ASORIGINAL>No</ASORIGINAL>
                          <AUDITED>No</AUDITED>
                          <ISCOMMONPARTY>No</ISCOMMONPARTY>
                          <FORJOBCOSTING>No</FORJOBCOSTING>
                          <ISOPTIONAL>${isOptionalVoucher}</ISOPTIONAL>
                          <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
                          <USEFOREXCISE>No</USEFOREXCISE>
                          <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
                          <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
                          <USEFORINTEREST>No</USEFORINTEREST>
                          <USEFORGAINLOSS>No</USEFORGAINLOSS>
                          <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
                          <USEFORCOMPOUND>No</USEFORCOMPOUND>
                          <USEFORSERVICETAX>No</USEFORSERVICETAX>
                          <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
                          <ISSYSTEM>No</ISSYSTEM>
                          <ISFETCHEDONLY>No</ISFETCHEDONLY>
                          <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
                          <ISCANCELLED>No</ISCANCELLED>
                          <ISONHOLD>No</ISONHOLD>
                          <ISSUMMARY>No</ISSUMMARY>
                          <ISECOMMERCESUPPLY>No</ISECOMMERCESUPPLY>
                          <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
                          <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
                          <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
                          <CMPGSTISOTHTERRITORYASSESSEE>No</CMPGSTISOTHTERRITORYASSESSEE>
                          <PARTYGSTISOTHTERRITORYASSESSEE>No</PARTYGSTISOTHTERRITORYASSESSEE>
                          <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
                          <IRNCANCELLED>No</IRNCANCELLED>
                          <IGNOREGSTCONFLICTINMIG>No</IGNOREGSTCONFLICTINMIG>
                          <ISOPBALTRANSACTION>No</ISOPBALTRANSACTION>
                          <IGNOREGSTFORMATVALIDATION>No</IGNOREGSTFORMATVALIDATION>
                          <ISELIGIBLEFORITC>Yes</ISELIGIBLEFORITC>
                          <UPDATESUMMARYVALUES>No</UPDATESUMMARYVALUES>
                          <ISEWAYBILLAPPLICABLE>No</ISEWAYBILLAPPLICABLE>
                          <ISDELETEDRETAINED>No</ISDELETEDRETAINED>
                          <ISNULL>No</ISNULL>
                          <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
                          <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
                          <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
                          <ISEXER1NOPOVERWRITE>No</ISEXER1NOPOVERWRITE>
                          <ISEXF2NOPOVERWRITE>No</ISEXF2NOPOVERWRITE>
                          <ISEXER3NOPOVERWRITE>No</ISEXER3NOPOVERWRITE>
                          <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
                          <EXCISEOPENING>No</EXCISEOPENING>
                          <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
                          <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
                          <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
                          <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
                          <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
                          <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
                          <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
                          <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
                          <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
                          <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
                          <VATADVANCEPAYMENT>No</VATADVANCEPAYMENT>
                          <VATADVPAY>No</VATADVPAY>
                          <ISCSTDELCAREDGOODSSALES>No</ISCSTDELCAREDGOODSSALES>
                          <ISVATRESTAXINV>No</ISVATRESTAXINV>
                          <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
                          <ISISDVOUCHER>No</ISISDVOUCHER>
                          <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
                          <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
                          <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
                          <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
                          <ISGSTREFUND>No</ISGSTREFUND>
                          <OVRDNEWAYBILLAPPLICABILITY>No</OVRDNEWAYBILLAPPLICABILITY>
                          <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
                          <VCHSTATUSISVCHNUMUSED>No</VCHSTATUSISVCHNUMUSED>
                          <VCHGSTSTATUSISINCLUDED>No</VCHGSTSTATUSISINCLUDED>
                          <VCHGSTSTATUSISUNCERTAIN>No</VCHGSTSTATUSISUNCERTAIN>
                          <VCHGSTSTATUSISEXCLUDED>No</VCHGSTSTATUSISEXCLUDED>
                          <VCHGSTSTATUSISAPPLICABLE>No</VCHGSTSTATUSISAPPLICABLE>
                          <VCHGSTSTATUSISGSTR2BRECONCILED>No</VCHGSTSTATUSISGSTR2BRECONCILED>
                          <VCHGSTSTATUSISGSTR2BONLYINPORTAL>No</VCHGSTSTATUSISGSTR2BONLYINPORTAL>
                          <VCHGSTSTATUSISGSTR2BONLYINBOOKS>No</VCHGSTSTATUSISGSTR2BONLYINBOOKS>
                          <VCHGSTSTATUSISGSTR2BMISMATCH>No</VCHGSTSTATUSISGSTR2BMISMATCH>
                          <VCHGSTSTATUSISGSTR2BINDIFFPERIOD>No</VCHGSTSTATUSISGSTR2BINDIFFPERIOD>
                          <VCHGSTSTATUSISRETEFFDATEOVERRDN>No</VCHGSTSTATUSISRETEFFDATEOVERRDN>
                          <VCHGSTSTATUSISOVERRDN>No</VCHGSTSTATUSISOVERRDN>
                          <VCHGSTSTATUSISSTATINDIFFDATE>No</VCHGSTSTATUSISSTATINDIFFDATE>
                          <VCHGSTSTATUSISRETINDIFFDATE>No</VCHGSTSTATUSISRETINDIFFDATE>
                          <VCHGSTSTATUSMAINSECTIONEXCLUDED>No</VCHGSTSTATUSMAINSECTIONEXCLUDED>
                          <VCHGSTSTATUSISBRANCHTRANSFEROUT>No</VCHGSTSTATUSISBRANCHTRANSFEROUT>
                          <VCHGSTSTATUSISSYSTEMSUMMARY>No</VCHGSTSTATUSISSYSTEMSUMMARY>
                          <VCHSTATUSISUNREGISTEREDRCM>No</VCHSTATUSISUNREGISTEREDRCM>
                          <VCHSTATUSISOPTIONAL>Yes</VCHSTATUSISOPTIONAL>
                          <VCHSTATUSISCANCELLED>No</VCHSTATUSISCANCELLED>
                          <VCHSTATUSISDELETED>No</VCHSTATUSISDELETED>
                          <VCHSTATUSISOPENINGBALANCE>No</VCHSTATUSISOPENINGBALANCE>
                          <VCHSTATUSISFETCHEDONLY>No</VCHSTATUSISFETCHEDONLY>
                          <PAYMENTLINKHASMULTIREF>No</PAYMENTLINKHASMULTIREF>
                          <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
                          <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
                          <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
                          <HASCASHFLOW>No</HASCASHFLOW>
                          <ISPOSTDATED>No</ISPOSTDATED>
                          <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
                          <ISINVOICE>Yes</ISINVOICE>
                          <MFGJOURNAL>No</MFGJOURNAL>
                          <HASDISCOUNTS>Yes</HASDISCOUNTS>
                          <ASPAYSLIP>No</ASPAYSLIP>
                          <ISCOSTCENTRE>No</ISCOSTCENTRE>
                          <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
                          <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
                          <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
                          <ISVOID>No</ISVOID>
                          <ORDERLINESTATUS>No</ORDERLINESTATUS>
                          <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
                          <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
                          <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
                          <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
                          <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
                          <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
                          <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
                          <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
                          <CHANGEVCHMODE>No</CHANGEVCHMODE>
                          <RESETIRNQRCODE>No</RESETIRNQRCODE>
                          <VOUCHERNUMBERSERIES>Default</VOUCHERNUMBERSERIES>
                          <EWAYBILLDETAILS.LIST>
                              <BILLDATE>${date}</BILLDATE>
                              <DOCUMENTTYPE>${ewaybillDetails?.documentType || ""}</DOCUMENTTYPE>
                              <BILLNUMBER>${ewaybillDetails?.ewayBillNo || ""}</BILLNUMBER>
                              <SUBTYPE>${ewaybillDetails?.subType || ""}</SUBTYPE>
                              <BILLSTATUS>${ewaybillDetails?.statusOfBill || ""}</BILLSTATUS>
                              <ISCANCELLED>No</ISCANCELLED>
                              <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
                              <ISCANCELPENDING>No</ISCANCELPENDING>
                              <IGNOREGENERATIONVALIDATION>No</IGNOREGENERATIONVALIDATION>
                              <ISEXPORTEDFORGENERATION>No</ISEXPORTEDFORGENERATION>
                              <INTRASTATEAPPLICABILITY>No</INTRASTATEAPPLICABILITY>
                              <TRANSPORTDETAILS.LIST>       </TRANSPORTDETAILS.LIST>
                              <EXTENSIONDETAILS.LIST>       </EXTENSIONDETAILS.LIST>
                              <MULTIVEHICLEDETAILS.LIST>       </MULTIVEHICLEDETAILS.LIST>
                              <STATEWISETHRESHOLD.LIST>       </STATEWISETHRESHOLD.LIST>
                          </EWAYBILLDETAILS.LIST>
                          <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
                          <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
                          <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
                          <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
                          <DUTYHEADDETAILS.LIST>      </DUTYHEADDETAILS.LIST>
                          <GSTADVADJDETAILS.LIST>      </GSTADVADJDETAILS.LIST>`;

      // Loop through the itemField array and add entries for each item
      if (items && items.length > 0) {
        for (const itemEntry of items) {
          xmlPayload += `                              
          <ALLINVENTORYENTRIES.LIST>
              <BASICUSERDESCRIPTION.LIST TYPE="String">
                    <BASICUSERDESCRIPTION>${itemEntry?.description || ""}
              </BASICUSERDESCRIPTION>
              </BASICUSERDESCRIPTION.LIST>
              <STOCKITEMNAME>${itemEntry?.itemName || ""}</STOCKITEMNAME>
              <GSTOVRDNSTOREDNATURE/>
              <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
              <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
              <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
              <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
              <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
              <ISAUTONEGATE>No</ISAUTONEGATE>
              <ISCUSTOMSCLEARANCE>No</ISCUSTOMSCLEARANCE>
              <ISTRACKCOMPONENT>No</ISTRACKCOMPONENT>
              <ISTRACKPRODUCTION>No</ISTRACKPRODUCTION>
              <ISPRIMARYITEM>No</ISPRIMARYITEM>
              <ISSCRAP>No</ISSCRAP>
              <RATE>${itemEntry?.rate || ""}</RATE>
              <DISCOUNT>${itemEntry?.disc || ""}</DISCOUNT>
              <AMOUNT>-${itemEntry?.amount || ""}</AMOUNT>
              <ACTUALQTY>${itemEntry?.quantity || ""}</ACTUALQTY>
              <BILLEDQTY>${itemEntry?.quantity || ""}</BILLEDQTY>
              <BATCHALLOCATIONS.LIST>
                  <GODOWNNAME>${itemEntry?.godownName || ""}</GODOWNNAME>
                  <BATCHNAME>${itemEntry?.batchName || "Primary Batch"}</BATCHNAME>
                  <INDENTNO>&#4; Not Applicable</INDENTNO>
                  <ORDERNO>&#4; Not Applicable</ORDERNO>
                  <TRACKINGNUMBER>&#4; Not Applicable</TRACKINGNUMBER>
                  <DYNAMICCSTISCLEARED>No</DYNAMICCSTISCLEARED>
                  <AMOUNT>-${itemEntry?.amount || ""}</AMOUNT>
                  <ACTUALQTY>${itemEntry?.quantity || ""}</ACTUALQTY>
                  <BILLEDQTY>${itemEntry?.quantity || ""}</BILLEDQTY>
                  <ADDITIONALDETAILS.LIST>        </ADDITIONALDETAILS.LIST>
                  <VOUCHERCOMPONENTLIST.LIST>        </VOUCHERCOMPONENTLIST.LIST>
              </BATCHALLOCATIONS.LIST>
              <ACCOUNTINGALLOCATIONS.LIST>
                  <OLDAUDITENTRYIDS.LIST TYPE="Number">
                    <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                  </OLDAUDITENTRYIDS.LIST>
                  <LEDGERNAME>${purchaseAccountLedgerName}</LEDGERNAME>
                  <GSTCLASS>&#4; Not Applicable</GSTCLASS>
                  <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
                  <LEDGERFROMITEM>No</LEDGERFROMITEM>
                  <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
                  <ISPARTYLEDGER>No</ISPARTYLEDGER>
                  <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
                  <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
                  <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
                  <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
                  <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
                  <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
                  <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
                  <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
                  <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
                  <AMOUNT>-${itemEntry.amount || ""}</AMOUNT>
                  <SERVICETAXDETAILS.LIST>        </SERVICETAXDETAILS.LIST>
                  <BANKALLOCATIONS.LIST>        </BANKALLOCATIONS.LIST>
                  <BILLALLOCATIONS.LIST>        </BILLALLOCATIONS.LIST>
                  <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>
                  <OLDAUDITENTRIES.LIST>        </OLDAUDITENTRIES.LIST>
                  <ACCOUNTAUDITENTRIES.LIST>        </ACCOUNTAUDITENTRIES.LIST>
                  <AUDITENTRIES.LIST>        </AUDITENTRIES.LIST>
                  <INPUTCRALLOCS.LIST>        </INPUTCRALLOCS.LIST>
                  <DUTYHEADDETAILS.LIST>        </DUTYHEADDETAILS.LIST>
                  <EXCISEDUTYHEADDETAILS.LIST>        </EXCISEDUTYHEADDETAILS.LIST>
                  <RATEDETAILS.LIST>        </RATEDETAILS.LIST>
                  <SUMMARYALLOCS.LIST>        </SUMMARYALLOCS.LIST>
                  <CENVATDUTYALLOCATIONS.LIST>        </CENVATDUTYALLOCATIONS.LIST>
                  <STPYMTDETAILS.LIST>        </STPYMTDETAILS.LIST>
                  <EXCISEPAYMENTALLOCATIONS.LIST>        </EXCISEPAYMENTALLOCATIONS.LIST>
                  <TAXBILLALLOCATIONS.LIST>        </TAXBILLALLOCATIONS.LIST>
                  <TAXOBJECTALLOCATIONS.LIST>        </TAXOBJECTALLOCATIONS.LIST>
                  <TDSEXPENSEALLOCATIONS.LIST>        </TDSEXPENSEALLOCATIONS.LIST>
                  <VATSTATUTORYDETAILS.LIST>        </VATSTATUTORYDETAILS.LIST>
                  <COSTTRACKALLOCATIONS.LIST>        </COSTTRACKALLOCATIONS.LIST>
                  <REFVOUCHERDETAILS.LIST>        </REFVOUCHERDETAILS.LIST>
                  <INVOICEWISEDETAILS.LIST>        </INVOICEWISEDETAILS.LIST>
                  <VATITCDETAILS.LIST>        </VATITCDETAILS.LIST>
                  <ADVANCETAXDETAILS.LIST>        </ADVANCETAXDETAILS.LIST>
                  <TAXTYPEALLOCATIONS.LIST>        </TAXTYPEALLOCATIONS.LIST>
              </ACCOUNTINGALLOCATIONS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <SUPPLEMENTARYDUTYHEADDETAILS.LIST>       </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <EXCISEALLOCATIONS.LIST>       </EXCISEALLOCATIONS.LIST>
              <EXPENSEALLOCATIONS.LIST>       </EXPENSEALLOCATIONS.LIST>
         </ALLINVENTORYENTRIES.LIST>`;
        }
      }

      xmlPayload += `
      <CONTRITRANS.LIST>      </CONTRITRANS.LIST>
      <EWAYBILLERRORLIST.LIST>      </EWAYBILLERRORLIST.LIST>
      <IRNERRORLIST.LIST>      </IRNERRORLIST.LIST>
      <HARYANAVAT.LIST>      </HARYANAVAT.LIST>
      <SUPPLEMENTARYDUTYHEADDETAILS.LIST>      </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
      <INVOICEDELNOTES.LIST>      </INVOICEDELNOTES.LIST>
      <INVOICEORDERLIST.LIST>      </INVOICEORDERLIST.LIST>
      <INVOICEINDENTLIST.LIST>      </INVOICEINDENTLIST.LIST>
      <ATTENDANCEENTRIES.LIST>      </ATTENDANCEENTRIES.LIST>
      <ORIGINVOICEDETAILS.LIST>      </ORIGINVOICEDETAILS.LIST>
      <INVOICEEXPORTLIST.LIST>      </INVOICEEXPORTLIST.LIST>
      <LEDGERENTRIES.LIST>
       <OLDAUDITENTRYIDS.LIST TYPE="Number">
        <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
       </OLDAUDITENTRYIDS.LIST>
       <LEDGERNAME>${ledgerName}</LEDGERNAME>
       <GSTCLASS>&#4; Not Applicable</GSTCLASS>
       <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
       <LEDGERFROMITEM>No</LEDGERFROMITEM>
       <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
       <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
       <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
       <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
       <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
       <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
       <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
       <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
       <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
       <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
       <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
       <AMOUNT>${grossTotal}</AMOUNT>
       <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
       <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
       <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
       <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
       <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
       <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
       <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
       <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
       <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
       <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
       <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
       <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
       <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
       <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
       <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
       <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
       <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
       <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
       <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
       <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
       <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
       <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
       <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
       <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
       <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
      </LEDGERENTRIES.LIST>
    `;
      if (taxLedgers && taxLedgers.length > 0) {
        // Loop through the taxField array for each item and add tax-related entries
        for (const taxEntry of taxLedgers) {
          xmlPayload += `
          <LEDGERENTRIES.LIST>
          <OLDAUDITENTRYIDS.LIST TYPE="Number">
           <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
          </OLDAUDITENTRYIDS.LIST>
          <LEDGERNAME>${taxEntry?.ledgerName || ""}</LEDGERNAME>
          <GSTCLASS>&#4; Not Applicable</GSTCLASS>
          <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
          <LEDGERFROMITEM>No</LEDGERFROMITEM>
          <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
          <ISPARTYLEDGER>No</ISPARTYLEDGER>
          <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
          <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
          <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
          <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
          <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
          <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
          <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
          <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
          <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
          <AMOUNT>-${taxEntry?.amount || ""}</AMOUNT>
          <VATEXPAMOUNT>-${taxEntry?.amount || ""}</VATEXPAMOUNT>
          <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
          <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
          <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
          <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
          <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
          <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
          <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
          <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
          <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
          <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
          <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
          <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
          <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
          <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
          <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
          <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
          <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
          <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
          <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
          <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
          <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
          <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
          <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
          <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
          <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
         </LEDGERENTRIES.LIST>
        `;
        }
      }
      // Add the closing tags for the XML payload
      xmlPayload += `                        <GST.LIST>      </GST.LIST>
        <PAYROLLMODEOFPAYMENT.LIST>      </PAYROLLMODEOFPAYMENT.LIST>
        <ATTDRECORDS.LIST>      </ATTDRECORDS.LIST>
        <GSTEWAYCONSIGNORADDRESS.LIST>      </GSTEWAYCONSIGNORADDRESS.LIST>
        <GSTEWAYCONSIGNEEADDRESS.LIST>      </GSTEWAYCONSIGNEEADDRESS.LIST>
        <TEMPGSTRATEDETAILS.LIST>      </TEMPGSTRATEDETAILS.LIST>
        <TEMPGSTADVADJUSTED.LIST>      </TEMPGSTADVADJUSTED.LIST>
    </VOUCHER>
</TALLYMESSAGE>
</REQUESTDATA>
</IMPORTDATA>
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
      // console.log(data);

      let res: any;

      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing response XML:", err);
          return;
        }
        res = result;
      });
      const created = +res.RESPONSE.CREATED[0];
      const masterId = res.RESPONSE.LASTVCHID[0];

      let obj = {
        msg: `${parentVoucherType}voucher with voucherNumber : ${voucherNumber} created successfully`,
        created: created,
      };

      if (created === 1) {
        await UpdateBuffer(_id, companyNameDb, token, masterId, companyName, childrenVoucherType, voucherNumber, "voucher", null, null);;
        await deleteBuffer(_id, companyNameDb, token);
        responceArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res);
        return { msg: "failed to create", res };
      }
    }
    return responceArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong in addPurchaseVoucher, Please restart the application.",
      err: error.message
    }
  }
}

//------------------ADD RECEIPT VOUCHER-----------------//
export const addReceiptVoucher = async (vouchers: any, companyName: any, companyNameDb: any, token: any, port: any) => {
  console.log("add receipt triggered");
  try {
    let responceArr = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      let {
        _id,
        date,
        partyLedgerName,
        bankOrCashName,
        narration,
        childrenVoucherType,
        parentVoucherType,
        voucherNumber,
        amount,
        paymentMode,
        instrumentNumber,
        instrumentDate,
        isOptionalVoucher,
        partyGSTIN,
        bills
      } = voucher;

      // console.log("In add voucher --->", vouchers);

      // Construct the XML payload
      let xmlPayload = `<ENVELOPE>
      <HEADER>
       <TALLYREQUEST>Import Data</TALLYREQUEST>
      </HEADER>
      <BODY>
       <IMPORTDATA>
        <REQUESTDESC>
         <REPORTNAME>Vouchers</REPORTNAME>
         <STATICVARIABLES>
          <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
         </STATICVARIABLES>
        </REQUESTDESC>
        <REQUESTDATA>
         <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="${childrenVoucherType}" ACTION="Create" >
           <OLDAUDITENTRYIDS.LIST TYPE="Number">
            <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
           </OLDAUDITENTRYIDS.LIST>
           <DATE>${date}</DATE>
           <VCHSTATUSDATE>${date}</VCHSTATUSDATE>
           <NARRATION>${narration}</NARRATION>
           <ENTEREDBY>${companyName}</ENTEREDBY>
           <GSTREGISTRATIONTYPE>Regular</GSTREGISTRATIONTYPE>
           <COUNTRYOFRESIDENCE>India</COUNTRYOFRESIDENCE>
           <PARTYGSTIN>${partyGSTIN}</PARTYGSTIN>
           <VOUCHERTYPENAME>${childrenVoucherType}</VOUCHERTYPENAME>
           <PARTYLEDGERNAME>${partyLedgerName}</PARTYLEDGERNAME>
           <VOUCHERNUMBER>${voucherNumber}</VOUCHERNUMBER>
           <CMPGSTREGISTRATIONTYPE>Regular</CMPGSTREGISTRATIONTYPE>
           <NUMBERINGSTYLE>Auto Retain</NUMBERINGSTYLE>
           <CSTFORMISSUETYPE>&#4; Not Applicable</CSTFORMISSUETYPE>
           <CSTFORMRECVTYPE>&#4; Not Applicable</CSTFORMRECVTYPE>
           <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
           <VCHSTATUSTAXADJUSTMENT>Default</VCHSTATUSTAXADJUSTMENT>
           <VCHSTATUSVOUCHERTYPE>${childrenVoucherType}</VCHSTATUSVOUCHERTYPE>
           <VCHGSTCLASS>&#4; Not Applicable</VCHGSTCLASS>
           <DIFFACTUALQTY>No</DIFFACTUALQTY>
           <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
           <ISDELETED>No</ISDELETED>
           <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
           <ASORIGINAL>No</ASORIGINAL>
           <AUDITED>No</AUDITED>
           <ISCOMMONPARTY>No</ISCOMMONPARTY>
           <FORJOBCOSTING>No</FORJOBCOSTING>
           <ISOPTIONAL>${isOptionalVoucher}</ISOPTIONAL>
           <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
           <USEFOREXCISE>No</USEFOREXCISE>
           <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
           <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
           <USEFORINTEREST>No</USEFORINTEREST>
           <USEFORGAINLOSS>No</USEFORGAINLOSS>
           <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
           <USEFORCOMPOUND>No</USEFORCOMPOUND>
           <USEFORSERVICETAX>No</USEFORSERVICETAX>
           <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
           <ISSYSTEM>No</ISSYSTEM>
           <ISFETCHEDONLY>No</ISFETCHEDONLY>
           <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
           <ISCANCELLED>No</ISCANCELLED>
           <ISONHOLD>No</ISONHOLD>
           <ISSUMMARY>No</ISSUMMARY>
           <ISECOMMERCESUPPLY>No</ISECOMMERCESUPPLY>
           <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
           <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
           <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
           <CMPGSTISOTHTERRITORYASSESSEE>No</CMPGSTISOTHTERRITORYASSESSEE>
           <PARTYGSTISOTHTERRITORYASSESSEE>No</PARTYGSTISOTHTERRITORYASSESSEE>
           <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
           <IRNCANCELLED>No</IRNCANCELLED>
           <IGNOREGSTCONFLICTINMIG>No</IGNOREGSTCONFLICTINMIG>
           <ISOPBALTRANSACTION>No</ISOPBALTRANSACTION>
           <IGNOREGSTFORMATVALIDATION>No</IGNOREGSTFORMATVALIDATION>
           <ISELIGIBLEFORITC>No</ISELIGIBLEFORITC>
           <UPDATESUMMARYVALUES>No</UPDATESUMMARYVALUES>
           <ISEWAYBILLAPPLICABLE>No</ISEWAYBILLAPPLICABLE>
           <ISDELETEDRETAINED>No</ISDELETEDRETAINED>
           <ISNULL>No</ISNULL>
           <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
           <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
           <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
           <ISEXER1NOPOVERWRITE>No</ISEXER1NOPOVERWRITE>
           <ISEXF2NOPOVERWRITE>No</ISEXF2NOPOVERWRITE>
           <ISEXER3NOPOVERWRITE>No</ISEXER3NOPOVERWRITE>
           <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
           <EXCISEOPENING>No</EXCISEOPENING>
           <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
           <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
           <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
           <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
           <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
           <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
           <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
           <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
           <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
           <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
           <VATADVANCEPAYMENT>No</VATADVANCEPAYMENT>
           <VATADVPAY>No</VATADVPAY>
           <ISCSTDELCAREDGOODSSALES>No</ISCSTDELCAREDGOODSSALES>
           <ISVATRESTAXINV>No</ISVATRESTAXINV>
           <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
           <ISISDVOUCHER>No</ISISDVOUCHER>
           <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
           <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
           <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
           <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
           <ISGSTREFUND>No</ISGSTREFUND>
           <OVRDNEWAYBILLAPPLICABILITY>No</OVRDNEWAYBILLAPPLICABILITY>
           <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
           <VCHSTATUSISVCHNUMUSED>No</VCHSTATUSISVCHNUMUSED>
           <VCHGSTSTATUSISINCLUDED>No</VCHGSTSTATUSISINCLUDED>
           <VCHGSTSTATUSISUNCERTAIN>No</VCHGSTSTATUSISUNCERTAIN>
           <VCHGSTSTATUSISEXCLUDED>No</VCHGSTSTATUSISEXCLUDED>
           <VCHGSTSTATUSISAPPLICABLE>No</VCHGSTSTATUSISAPPLICABLE>
           <VCHGSTSTATUSISGSTR2BRECONCILED>No</VCHGSTSTATUSISGSTR2BRECONCILED>
           <VCHGSTSTATUSISGSTR2BONLYINPORTAL>No</VCHGSTSTATUSISGSTR2BONLYINPORTAL>
           <VCHGSTSTATUSISGSTR2BONLYINBOOKS>No</VCHGSTSTATUSISGSTR2BONLYINBOOKS>
           <VCHGSTSTATUSISGSTR2BMISMATCH>No</VCHGSTSTATUSISGSTR2BMISMATCH>
           <VCHGSTSTATUSISGSTR2BINDIFFPERIOD>No</VCHGSTSTATUSISGSTR2BINDIFFPERIOD>
           <VCHGSTSTATUSISRETEFFDATEOVERRDN>No</VCHGSTSTATUSISRETEFFDATEOVERRDN>
           <VCHGSTSTATUSISOVERRDN>No</VCHGSTSTATUSISOVERRDN>
           <VCHGSTSTATUSISSTATINDIFFDATE>No</VCHGSTSTATUSISSTATINDIFFDATE>
           <VCHGSTSTATUSISRETINDIFFDATE>No</VCHGSTSTATUSISRETINDIFFDATE>
           <VCHGSTSTATUSMAINSECTIONEXCLUDED>No</VCHGSTSTATUSMAINSECTIONEXCLUDED>
           <VCHGSTSTATUSISBRANCHTRANSFEROUT>No</VCHGSTSTATUSISBRANCHTRANSFEROUT>
           <VCHGSTSTATUSISSYSTEMSUMMARY>No</VCHGSTSTATUSISSYSTEMSUMMARY>
           <VCHSTATUSISUNREGISTEREDRCM>No</VCHSTATUSISUNREGISTEREDRCM>
           <VCHSTATUSISOPTIONAL>No</VCHSTATUSISOPTIONAL>
           <VCHSTATUSISCANCELLED>No</VCHSTATUSISCANCELLED>
           <VCHSTATUSISDELETED>No</VCHSTATUSISDELETED>
           <VCHSTATUSISOPENINGBALANCE>No</VCHSTATUSISOPENINGBALANCE>
           <VCHSTATUSISFETCHEDONLY>No</VCHSTATUSISFETCHEDONLY>
           <PAYMENTLINKHASMULTIREF>No</PAYMENTLINKHASMULTIREF>
           <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
           <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
           <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
           <HASCASHFLOW>Yes</HASCASHFLOW>
           <ISPOSTDATED>No</ISPOSTDATED>
           <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
           <ISINVOICE>No</ISINVOICE>
           <MFGJOURNAL>No</MFGJOURNAL>
           <HASDISCOUNTS>No</HASDISCOUNTS>
           <ASPAYSLIP>No</ASPAYSLIP>
           <ISCOSTCENTRE>No</ISCOSTCENTRE>
           <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
           <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
           <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
           <ISVOID>No</ISVOID>
           <ORDERLINESTATUS>No</ORDERLINESTATUS>
           <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
           <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
           <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
           <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
           <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
           <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
           <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
           <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
           <CHANGEVCHMODE>No</CHANGEVCHMODE>
           <RESETIRNQRCODE>No</RESETIRNQRCODE>
           <VOUCHERNUMBERSERIES>Default</VOUCHERNUMBERSERIES>
           <EWAYBILLDETAILS.LIST>      </EWAYBILLDETAILS.LIST>
           <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
           <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
           <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
           <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
           <DUTYHEADDETAILS.LIST>      </DUTYHEADDETAILS.LIST>
           <GSTADVADJDETAILS.LIST>      </GSTADVADJDETAILS.LIST>
           <CONTRITRANS.LIST>      </CONTRITRANS.LIST>
           <EWAYBILLERRORLIST.LIST>      </EWAYBILLERRORLIST.LIST>
           <IRNERRORLIST.LIST>      </IRNERRORLIST.LIST>
           <HARYANAVAT.LIST>      </HARYANAVAT.LIST>
           <SUPPLEMENTARYDUTYHEADDETAILS.LIST>      </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
           <INVOICEDELNOTES.LIST>      </INVOICEDELNOTES.LIST>
           <INVOICEORDERLIST.LIST>      </INVOICEORDERLIST.LIST>
           <INVOICEINDENTLIST.LIST>      </INVOICEINDENTLIST.LIST>
           <ATTENDANCEENTRIES.LIST>      </ATTENDANCEENTRIES.LIST>
           <ORIGINVOICEDETAILS.LIST>      </ORIGINVOICEDETAILS.LIST>
           <INVOICEEXPORTLIST.LIST>      </INVOICEEXPORTLIST.LIST>
           <ALLLEDGERENTRIES.LIST>
            <OLDAUDITENTRYIDS.LIST TYPE="Number">
             <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
            </OLDAUDITENTRYIDS.LIST>
            <APPROPRIATEFOR>&#4; Not Applicable</APPROPRIATEFOR>
            <LEDGERNAME>${partyLedgerName}</LEDGERNAME>
            <GSTCLASS>&#4; Not Applicable</GSTCLASS>
            <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
            <LEDGERFROMITEM>No</LEDGERFROMITEM>
            <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
            <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
            <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
            <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
            <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
            <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
            <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
            <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
            <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
            <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
            <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
            <AMOUNT>${amount}</AMOUNT>
            <VATEXPAMOUNT>${amount}</VATEXPAMOUNT>
            <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
            <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>`;

      if (bills && bills.length > 0) {
        bills.forEach((billDetail: { billName: any; billType: any; amount: any; }) => {
          xmlPayload += `
          <BILLALLOCATIONS.LIST>
              <NAME>${billDetail?.billName || ""}</NAME>
              <BILLTYPE>${billDetail?.billType || ""}</BILLTYPE>
              <TDSDEDUCTEEISSPECIALRATE>No</TDSDEDUCTEEISSPECIALRATE>
              <AMOUNT>${billDetail?.amount || ""}</AMOUNT>
              <INTERESTCOLLECTION.LIST>        </INTERESTCOLLECTION.LIST>
              <STBILLCATEGORIES.LIST>        </STBILLCATEGORIES.LIST>
       </BILLALLOCATIONS.LIST>`;
        });
      }

      xmlPayload += `
      <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
      <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
      <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
      <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
      <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
      <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
      <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
      <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
      <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
      <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
      <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
      <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
      <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
      <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
      <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
      <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
      <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
      <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
      <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
      <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
      <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
      <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
  </ALLLEDGERENTRIES.LIST>
  <ALLLEDGERENTRIES.LIST>
      <OLDAUDITENTRYIDS.LIST TYPE="Number">
          <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
      </OLDAUDITENTRYIDS.LIST>
      <APPROPRIATEFOR>&#4; Not Applicable</APPROPRIATEFOR>
      <LEDGERNAME>${bankOrCashName}</LEDGERNAME>
      <GSTCLASS>&#4; Not Applicable</GSTCLASS>
      <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
      <LEDGERFROMITEM>No</LEDGERFROMITEM>
      <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
      <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
      <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
      <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
      <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
      <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
      <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
      <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
      <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
      <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
      <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
      <AMOUNT>-${amount}</AMOUNT>
      <VATEXPAMOUNT>-${amount}</VATEXPAMOUNT>
      <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
      <BANKALLOCATIONS.LIST>
          <DATE>${date}</DATE>
          <INSTRUMENTDATE>${instrumentDate}</INSTRUMENTDATE>
          <TRANSACTIONTYPE>${paymentMode}</TRANSACTIONTYPE>
          <PAYMENTFAVOURING>${partyLedgerName}</PAYMENTFAVOURING>
          <UNIQUEREFERENCENUMBER>${instrumentNumber}</UNIQUEREFERENCENUMBER>
          <STATUS>No</STATUS>
          <PAYMENTMODE>Transacted</PAYMENTMODE>
          <BANKPARTYNAME>${partyLedgerName}</BANKPARTYNAME>
          <ISCONNECTEDPAYMENT>No</ISCONNECTEDPAYMENT>
          <ISSPLIT>No</ISSPLIT>
          <ISCONTRACTUSED>No</ISCONTRACTUSED>
          <ISACCEPTEDWITHWARNING>No</ISACCEPTEDWITHWARNING>
          <ISTRANSFORCED>No</ISTRANSFORCED>
          <CHEQUEPRINTED> 1</CHEQUEPRINTED>
          <AMOUNT>-${amount}</AMOUNT>
          <CONTRACTDETAILS.LIST>        </CONTRACTDETAILS.LIST>
          <BANKSTATUSINFO.LIST>        </BANKSTATUSINFO.LIST>
      </BANKALLOCATIONS.LIST>
      <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
      <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
      <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
      <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
      <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
      <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
      <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
      <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
      <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
      <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
      <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
      <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
      <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
      <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
      <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
      <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
      <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
      <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
      <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
      <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
      <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
      <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
      <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
  </ALLLEDGERENTRIES.LIST>
  <GST.LIST>      </GST.LIST>
  <PAYROLLMODEOFPAYMENT.LIST>      </PAYROLLMODEOFPAYMENT.LIST>
  <ATTDRECORDS.LIST>      </ATTDRECORDS.LIST>
  <GSTEWAYCONSIGNORADDRESS.LIST>      </GSTEWAYCONSIGNORADDRESS.LIST>
  <GSTEWAYCONSIGNEEADDRESS.LIST>      </GSTEWAYCONSIGNEEADDRESS.LIST>
  <TEMPGSTRATEDETAILS.LIST>      </TEMPGSTRATEDETAILS.LIST>
  <TEMPGSTADVADJUSTED.LIST>      </TEMPGSTADVADJUSTED.LIST>`;
      // Add the closing tags for the XML payload
      xmlPayload += `                    
              </VOUCHER>
          </TALLYMESSAGE>
        </REQUESTDATA>
    </IMPORTDATA>
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
      // console.log(data);

      let res: any;

      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing response XML:", err);
          return;
        }
        // console.log("voucher details:", JSON.stringify(result));
        // return res.status(200).send(result);
        res = result;
      });

      // console.log("res-->", res.ENVELOPE.BODY[0].DESC[0]);

      const created = +res.RESPONSE.CREATED[0];
      const masterId = res.RESPONSE.LASTVCHID[0];

      // console.log(res);

      let obj = {
        msg: `${parentVoucherType}voucher with voucherNumber : ${voucherNumber} created successfully`,
        created: created,
      };

      if (created === 1) {
        await UpdateBuffer(_id, companyNameDb, token, masterId, companyName, childrenVoucherType, voucherNumber, "voucher", null, null);;
        await deleteBuffer(_id, companyNameDb, token);
        // return obj;
        responceArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res);
        return { msg: "failed to create", res };
      }
    }
    return responceArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong in addReceiptVoucher , Please restart the application.",
      err: error.message
    }
  }
};

//------------------ADD CONTRA VOUCHER-----------------//
export const addContraVoucher = async (vouchers: any, companyName: any, companyNameDb: any, token: any, port: any) => {
  try {
    let responceArr = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      let {
        _id,
        date,
        Narration,
        childrenVoucherType,
        parentVoucherType,
        partyLedgerName,
        voucherNumber,
        amount,
        isOptionalVoucher,
        billDetails,
        sourceLedger,
        transactionLedgerType,
        transactionType,
        AccountNumber,
        InstrumentDetail,
      } = voucher;

      // console.log("In add voucher --->", vouchers);

      // Construct the XML payload
      let xmlPayload = `<ENVELOPE>
          <HEADER>
           <TALLYREQUEST>Import Data</TALLYREQUEST>
          </HEADER>
          <BODY>
           <IMPORTDATA>
            <REQUESTDESC>
             <REPORTNAME>Vouchers</REPORTNAME>
             <STATICVARIABLES>
              <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
             </STATICVARIABLES>
            </REQUESTDESC>
            <REQUESTDATA>
             <TALLYMESSAGE xmlns:UDF="TallyUDF">
              <VOUCHER VCHTYPE="${childrenVoucherType}" ACTION="Create">
               <OLDAUDITENTRYIDS.LIST TYPE="Number">
                <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
               </OLDAUDITENTRYIDS.LIST>
               <DATE>${date}</DATE>
               <VOUCHERTYPENAME>${childrenVoucherType}</VOUCHERTYPENAME>
               <NARRATION>${Narration}</NARRATION>
               <PARTYLEDGERNAME>${partyLedgerName}</PARTYLEDGERNAME>
               <VOUCHERNUMBER>${voucherNumber}</VOUCHERNUMBER>
               <CSTFORMISSUETYPE/>
               <CSTFORMRECVTYPE/>
               <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
               <VCHGSTCLASS/>
               <DIFFACTUALQTY>No</DIFFACTUALQTY>
               <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
               <ISDELETED>No</ISDELETED>
               <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
               <ASORIGINAL>No</ASORIGINAL>
               <AUDITED>No</AUDITED>
               <FORJOBCOSTING>No</FORJOBCOSTING>
               <ISOPTIONAL>${isOptionalVoucher}</ISOPTIONAL>
               <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
               <USEFOREXCISE>No</USEFOREXCISE>
               <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
               <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
               <USEFORINTEREST>No</USEFORINTEREST>
               <USEFORGAINLOSS>No</USEFORGAINLOSS>
               <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
               <USEFORCOMPOUND>No</USEFORCOMPOUND>
               <USEFORSERVICETAX>No</USEFORSERVICETAX>
               <ISONHOLD>No</ISONHOLD>
               <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
               <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
               <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
               <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
               <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
               <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
               <EXCISEOPENING>No</EXCISEOPENING>
               <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
               <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
               <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
               <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
               <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
               <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
               <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
               <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
               <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
               <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
               <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
               <ISISDVOUCHER>No</ISISDVOUCHER>
               <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
               <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
               <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
               <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
               <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
               <ISGSTREFUND>No</ISGSTREFUND>
               <OVRDNEWAYBILLAPPLICABILITY>No</OVRDNEWAYBILLAPPLICABILITY>
               <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
               <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
               <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
               <IRNCANCELLED>No</IRNCANCELLED>
               <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
               <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
               <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
               <ISCANCELLED>No</ISCANCELLED>
               <HASCASHFLOW>Yes</HASCASHFLOW>
               <ISPOSTDATED>No</ISPOSTDATED>
               <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
               <ISINVOICE>No</ISINVOICE>
               <MFGJOURNAL>No</MFGJOURNAL>
               <HASDISCOUNTS>No</HASDISCOUNTS>
               <ASPAYSLIP>No</ASPAYSLIP>
               <ISCOSTCENTRE>No</ISCOSTCENTRE>
               <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
               <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
               <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
               <ISVOID>No</ISVOID>
               <ORDERLINESTATUS>No</ORDERLINESTATUS>
               <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
               <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
               <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
               <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
               <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
               <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
               <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
               <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
               <CHANGEVCHMODE>No</CHANGEVCHMODE>
               <RESETIRNQRCODE>No</RESETIRNQRCODE>
               <EWAYBILLDETAILS.LIST>      </EWAYBILLDETAILS.LIST>
               <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
               <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
               <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
               <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
               <DUTYHEADDETAILS.LIST>      </DUTYHEADDETAILS.LIST>
               <SUPPLEMENTARYDUTYHEADDETAILS.LIST>      </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
               <EWAYBILLERRORLIST.LIST>      </EWAYBILLERRORLIST.LIST>
               <IRNERRORLIST.LIST>      </IRNERRORLIST.LIST>
               <INVOICEDELNOTES.LIST>      </INVOICEDELNOTES.LIST>
               <INVOICEORDERLIST.LIST>      </INVOICEORDERLIST.LIST>
               <INVOICEINDENTLIST.LIST>      </INVOICEINDENTLIST.LIST>
               <ATTENDANCEENTRIES.LIST>      </ATTENDANCEENTRIES.LIST>
               <ORIGINVOICEDETAILS.LIST>      </ORIGINVOICEDETAILS.LIST>
               <INVOICEEXPORTLIST.LIST>      </INVOICEEXPORTLIST.LIST>
               `;

      if (billDetails && billDetails.length > 0) {
        billDetails.forEach((billDetail: { ledgerName: any; amount: any; date: any; transactionType: any; accountNumber: any; uniqueRef: any; }) => {
          console.log(billDetail, "billdetail");
          xmlPayload += `      <ALLLEDGERENTRIES.LIST>
              <OLDAUDITENTRYIDS.LIST TYPE="Number">
               <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
              </OLDAUDITENTRYIDS.LIST>
              <LEDGERNAME>${billDetail?.ledgerName}</LEDGERNAME>
              <GSTCLASS/>
              <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
              <LEDGERFROMITEM>No</LEDGERFROMITEM>
              <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
              <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
              <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
              <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
              <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
              <AMOUNT>${billDetail?.amount}</AMOUNT>
              <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
              <BANKALLOCATIONS.LIST>
               <DATE>${billDetail?.date}</DATE>
               <INSTRUMENTDATE>${billDetail?.date}</INSTRUMENTDATE>
               <TRANSACTIONTYPE>${billDetail?.transactionType}</TRANSACTIONTYPE>
               <ACCOUNTNUMBER>${billDetail?.accountNumber}</ACCOUNTNUMBER>
               <PAYMENTFAVOURING>Self</PAYMENTFAVOURING>
               <TRANSFERMODE>NEFT</TRANSFERMODE>
               <BANKID>5</BANKID>
               <INSTRUMENTNUMBER>212344444</INSTRUMENTNUMBER>
               <UNIQUEREFERENCENUMBER>${billDetail?.uniqueRef}</UNIQUEREFERENCENUMBER>
               <STATUS>No</STATUS>
               <PAYMENTMODE>Transacted</PAYMENTMODE>
               <SECONDARYSTATUS/>
               <ISCONNECTEDPAYMENT>No</ISCONNECTEDPAYMENT>
               <ISSPLIT>No</ISSPLIT>
               <ISCONTRACTUSED>No</ISCONTRACTUSED>
               <ISACCEPTEDWITHWARNING>No</ISACCEPTEDWITHWARNING>
               <ISTRANSFORCED>No</ISTRANSFORCED>
               <AMOUNT>${billDetail?.amount}</AMOUNT>
               <CONTRACTDETAILS.LIST>        </CONTRACTDETAILS.LIST>
               <BANKSTATUSINFO.LIST>        </BANKSTATUSINFO.LIST>
              </BANKALLOCATIONS.LIST>
              <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
              <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
              <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
              <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
              <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
              <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
              <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
              <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
              <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
              <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
              <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
              <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
              <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
              <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
              <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
              <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
              <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
              <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
              <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
              <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
              <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
             </ALLLEDGERENTRIES.LIST>
             `;
        });
      }

      xmlPayload += `
          <ALLLEDGERENTRIES.LIST>
          <OLDAUDITENTRYIDS.LIST TYPE="Number">
           <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
          </OLDAUDITENTRYIDS.LIST>
          <LEDGERNAME>${sourceLedger?.name}</LEDGERNAME>
          <GSTCLASS/>
          <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
          <LEDGERFROMITEM>No</LEDGERFROMITEM>
          <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
          <ISPARTYLEDGER>Yes</ISPARTYLEDGER>
          <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
          <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
          <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
          <AMOUNT>-${sourceLedger?.substractedAmount}</AMOUNT>
          <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
          <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
          <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
          <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
          <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
          <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
          <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
          <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
          <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
          <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
          <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
          <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
          <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
          <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
          <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
          <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
          <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
          <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
          <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
          <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
          <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
          <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
          <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
         </ALLLEDGERENTRIES.LIST>
          <PAYROLLMODEOFPAYMENT.LIST>      </PAYROLLMODEOFPAYMENT.LIST>
          <ATTDRECORDS.LIST>      </ATTDRECORDS.LIST>
          <GSTEWAYCONSIGNORADDRESS.LIST>      </GSTEWAYCONSIGNORADDRESS.LIST>
          <GSTEWAYCONSIGNEEADDRESS.LIST>      </GSTEWAYCONSIGNEEADDRESS.LIST>
          <TEMPGSTRATEDETAILS.LIST>      </TEMPGSTRATEDETAILS.LIST>
         </VOUCHER>
        </TALLYMESSAGE>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
         <COMPANY>
          <REMOTECMPINFO.LIST MERGE="Yes">
           <REMOTECMPNAME>Test</REMOTECMPNAME>
           <REMOTECMPSTATE>Odisha</REMOTECMPSTATE>
          </REMOTECMPINFO.LIST>
         </COMPANY>
        </TALLYMESSAGE>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
         <COMPANY>
          <REMOTECMPINFO.LIST MERGE="Yes">
           <REMOTECMPNAME>${companyName}</REMOTECMPNAME>
          </REMOTECMPINFO.LIST>
         </COMPANY>
        </TALLYMESSAGE>
       </REQUESTDATA>
      </IMPORTDATA>
     </BODY>
    </ENVELOPE>`;
      // Add the closing tags for the XML payload
      // xmlPayload += `
      //                     </VOUCHER>
      //                 </TALLYMESSAGE>
      //             </REQUESTDATA>
      //         </IMPORTDATA>
      //     </BODY>
      // </ENVELOPE>`;

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
      // console.log(data);

      let res: any;

      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing response XML:", err);
          return;
        }
        // console.log("voucher details:", JSON.stringify(result));
        // return res.status(200).send(result);
        res = result;
      });

      //   console.log("res-->", res.ENVELOPE.BODY[0].DESC[0]);
      const created = +res.RESPONSE.CREATED[0];
      const masterId = res.RESPONSE.LASTVCHID[0];

      //   console.log(res, "res from contra");

      let obj = {
        msg: `${parentVoucherType}voucher with voucherNumber : ${voucherNumber} created successfully`,
        created: created,
      };

      if (created === 1) {
        await UpdateBuffer(_id, companyNameDb, token, masterId, companyName, childrenVoucherType, voucherNumber, "voucher", null, null);;
        await deleteBuffer(_id, companyNameDb, token);
        // return obj;
        responceArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res);
        return { msg: "failed to create", res };
      }
    }
    return responceArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong in addContraVoucher, Please restart the application.",
      err: error.message
    }
  }
};

//------------------ADD JOURNAL VOUCHER-----------------//
export const addJournalVoucher = async (vouchers: any, companyName: any, companyNameDb: any, token: any, port: any) => {
  try {
    let responceArr = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      let {
        _id,
        date,
        narration,
        childrenVoucherType,
        parentVoucherType,
        voucherNumber,
        isOptionalVoucher,
        ledgers
      } = voucher;

      // console.log("In add voucher --->", vouchers);

      // Construct the XML payload
      let xmlPayload = `<ENVELOPE>
      <HEADER>
          <TALLYREQUEST>Import Data</TALLYREQUEST>
      </HEADER>
      <BODY>
          <IMPORTDATA>
              <REQUESTDESC>
                  <REPORTNAME>Vouchers</REPORTNAME>
                  <STATICVARIABLES>
                      <SVCURRENTCOMPANY>${companyName}</SVCURRENTCOMPANY>
                  </STATICVARIABLES>
              </REQUESTDESC>
              <REQUESTDATA>
                  <TALLYMESSAGE xmlns:UDF="TallyUDF">
                      <VOUCHER VCHTYPE="${childrenVoucherType}" ACTION="Create" >
                          <OLDAUDITENTRYIDS.LIST TYPE="Number">
                              <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
                          </OLDAUDITENTRYIDS.LIST>
                          <DATE>${date}</DATE>
                          <VCHSTATUSDATE>${date}</VCHSTATUSDATE>
                          <NARRATION>${narration}</NARRATION>
                          <VOUCHERTYPENAME>${childrenVoucherType}</VOUCHERTYPENAME>
                          <VOUCHERNUMBER>${voucherNumber}</VOUCHERNUMBER>
                          <CMPGSTREGISTRATIONTYPE>Regular</CMPGSTREGISTRATIONTYPE>
                          <NUMBERINGSTYLE>Auto Retain</NUMBERINGSTYLE>
                          <CSTFORMISSUETYPE>&#4; Not Applicable</CSTFORMISSUETYPE>
                          <CSTFORMRECVTYPE>&#4; Not Applicable</CSTFORMRECVTYPE>
                          <FBTPAYMENTTYPE>Default</FBTPAYMENTTYPE>
                          <VCHSTATUSTAXADJUSTMENT>Default</VCHSTATUSTAXADJUSTMENT>
                          <VCHSTATUSVOUCHERTYPE>${childrenVoucherType}</VCHSTATUSVOUCHERTYPE>
                          <VCHGSTCLASS>&#4; Not Applicable</VCHGSTCLASS>
                          <VCHENTRYMODE>As Voucher</VCHENTRYMODE>
                          <DIFFACTUALQTY>No</DIFFACTUALQTY>
                          <ISMSTFROMSYNC>No</ISMSTFROMSYNC>
                          <ISDELETED>No</ISDELETED>
                          <ISSECURITYONWHENENTERED>No</ISSECURITYONWHENENTERED>
                          <ASORIGINAL>No</ASORIGINAL>
                          <AUDITED>No</AUDITED>
                          <ISCOMMONPARTY>No</ISCOMMONPARTY>
                          <FORJOBCOSTING>No</FORJOBCOSTING>
                          <ISOPTIONAL>${isOptionalVoucher}</ISOPTIONAL>
                          <EFFECTIVEDATE>${date}</EFFECTIVEDATE>
                          <USEFOREXCISE>No</USEFOREXCISE>
                          <ISFORJOBWORKIN>No</ISFORJOBWORKIN>
                          <ALLOWCONSUMPTION>No</ALLOWCONSUMPTION>
                          <USEFORINTEREST>No</USEFORINTEREST>
                          <USEFORGAINLOSS>No</USEFORGAINLOSS>
                          <USEFORGODOWNTRANSFER>No</USEFORGODOWNTRANSFER>
                          <USEFORCOMPOUND>No</USEFORCOMPOUND>
                          <USEFORSERVICETAX>No</USEFORSERVICETAX>
                          <ISREVERSECHARGEAPPLICABLE>No</ISREVERSECHARGEAPPLICABLE>
                          <ISSYSTEM>No</ISSYSTEM>
                          <ISFETCHEDONLY>No</ISFETCHEDONLY>
                          <ISGSTOVERRIDDEN>No</ISGSTOVERRIDDEN>
                          <ISCANCELLED>No</ISCANCELLED>
                          <ISONHOLD>No</ISONHOLD>
                          <ISSUMMARY>No</ISSUMMARY>
                          <ISECOMMERCESUPPLY>No</ISECOMMERCESUPPLY>
                          <ISBOENOTAPPLICABLE>No</ISBOENOTAPPLICABLE>
                          <ISGSTSECSEVENAPPLICABLE>No</ISGSTSECSEVENAPPLICABLE>
                          <IGNOREEINVVALIDATION>No</IGNOREEINVVALIDATION>
                          <CMPGSTISOTHTERRITORYASSESSEE>No</CMPGSTISOTHTERRITORYASSESSEE>
                          <PARTYGSTISOTHTERRITORYASSESSEE>No</PARTYGSTISOTHTERRITORYASSESSEE>
                          <IRNJSONEXPORTED>No</IRNJSONEXPORTED>
                          <IRNCANCELLED>No</IRNCANCELLED>
                          <IGNOREGSTCONFLICTINMIG>No</IGNOREGSTCONFLICTINMIG>
                          <ISOPBALTRANSACTION>No</ISOPBALTRANSACTION>
                          <IGNOREGSTFORMATVALIDATION>No</IGNOREGSTFORMATVALIDATION>
                          <ISELIGIBLEFORITC>No</ISELIGIBLEFORITC>
                          <UPDATESUMMARYVALUES>No</UPDATESUMMARYVALUES>
                          <ISEWAYBILLAPPLICABLE>No</ISEWAYBILLAPPLICABLE>
                          <ISDELETEDRETAINED>No</ISDELETEDRETAINED>
                          <ISNULL>No</ISNULL>
                          <ISEXCISEVOUCHER>No</ISEXCISEVOUCHER>
                          <EXCISETAXOVERRIDE>No</EXCISETAXOVERRIDE>
                          <USEFORTAXUNITTRANSFER>No</USEFORTAXUNITTRANSFER>
                          <ISEXER1NOPOVERWRITE>No</ISEXER1NOPOVERWRITE>
                          <ISEXF2NOPOVERWRITE>No</ISEXF2NOPOVERWRITE>
                          <ISEXER3NOPOVERWRITE>No</ISEXER3NOPOVERWRITE>
                          <IGNOREPOSVALIDATION>No</IGNOREPOSVALIDATION>
                          <EXCISEOPENING>No</EXCISEOPENING>
                          <USEFORFINALPRODUCTION>No</USEFORFINALPRODUCTION>
                          <ISTDSOVERRIDDEN>No</ISTDSOVERRIDDEN>
                          <ISTCSOVERRIDDEN>No</ISTCSOVERRIDDEN>
                          <ISTDSTCSCASHVCH>No</ISTDSTCSCASHVCH>
                          <INCLUDEADVPYMTVCH>No</INCLUDEADVPYMTVCH>
                          <ISSUBWORKSCONTRACT>No</ISSUBWORKSCONTRACT>
                          <ISVATOVERRIDDEN>No</ISVATOVERRIDDEN>
                          <IGNOREORIGVCHDATE>No</IGNOREORIGVCHDATE>
                          <ISVATPAIDATCUSTOMS>No</ISVATPAIDATCUSTOMS>
                          <ISDECLAREDTOCUSTOMS>No</ISDECLAREDTOCUSTOMS>
                          <VATADVANCEPAYMENT>No</VATADVANCEPAYMENT>
                          <VATADVPAY>No</VATADVPAY>
                          <ISCSTDELCAREDGOODSSALES>No</ISCSTDELCAREDGOODSSALES>
                          <ISVATRESTAXINV>No</ISVATRESTAXINV>
                          <ISSERVICETAXOVERRIDDEN>No</ISSERVICETAXOVERRIDDEN>
                          <ISISDVOUCHER>No</ISISDVOUCHER>
                          <ISEXCISEOVERRIDDEN>No</ISEXCISEOVERRIDDEN>
                          <ISEXCISESUPPLYVCH>No</ISEXCISESUPPLYVCH>
                          <GSTNOTEXPORTED>No</GSTNOTEXPORTED>
                          <IGNOREGSTINVALIDATION>No</IGNOREGSTINVALIDATION>
                          <ISGSTREFUND>No</ISGSTREFUND>
                          <OVRDNEWAYBILLAPPLICABILITY>No</OVRDNEWAYBILLAPPLICABILITY>
                          <ISVATPRINCIPALACCOUNT>No</ISVATPRINCIPALACCOUNT>
                          <VCHSTATUSISVCHNUMUSED>No</VCHSTATUSISVCHNUMUSED>
                          <VCHGSTSTATUSISINCLUDED>No</VCHGSTSTATUSISINCLUDED>
                          <VCHGSTSTATUSISUNCERTAIN>No</VCHGSTSTATUSISUNCERTAIN>
                          <VCHGSTSTATUSISEXCLUDED>No</VCHGSTSTATUSISEXCLUDED>
                          <VCHGSTSTATUSISAPPLICABLE>No</VCHGSTSTATUSISAPPLICABLE>
                          <VCHGSTSTATUSISGSTR2BRECONCILED>No</VCHGSTSTATUSISGSTR2BRECONCILED>
                          <VCHGSTSTATUSISGSTR2BONLYINPORTAL>No</VCHGSTSTATUSISGSTR2BONLYINPORTAL>
                          <VCHGSTSTATUSISGSTR2BONLYINBOOKS>No</VCHGSTSTATUSISGSTR2BONLYINBOOKS>
                          <VCHGSTSTATUSISGSTR2BMISMATCH>No</VCHGSTSTATUSISGSTR2BMISMATCH>
                          <VCHGSTSTATUSISGSTR2BINDIFFPERIOD>No</VCHGSTSTATUSISGSTR2BINDIFFPERIOD>
                          <VCHGSTSTATUSISRETEFFDATEOVERRDN>No</VCHGSTSTATUSISRETEFFDATEOVERRDN>
                          <VCHGSTSTATUSISOVERRDN>No</VCHGSTSTATUSISOVERRDN>
                          <VCHGSTSTATUSISSTATINDIFFDATE>No</VCHGSTSTATUSISSTATINDIFFDATE>
                          <VCHGSTSTATUSISRETINDIFFDATE>No</VCHGSTSTATUSISRETINDIFFDATE>
                          <VCHGSTSTATUSMAINSECTIONEXCLUDED>No</VCHGSTSTATUSMAINSECTIONEXCLUDED>
                          <VCHGSTSTATUSISBRANCHTRANSFEROUT>No</VCHGSTSTATUSISBRANCHTRANSFEROUT>
                          <VCHGSTSTATUSISSYSTEMSUMMARY>No</VCHGSTSTATUSISSYSTEMSUMMARY>
                          <VCHSTATUSISUNREGISTEREDRCM>No</VCHSTATUSISUNREGISTEREDRCM>
                          <VCHSTATUSISOPTIONAL>No</VCHSTATUSISOPTIONAL>
                          <VCHSTATUSISCANCELLED>No</VCHSTATUSISCANCELLED>
                          <VCHSTATUSISDELETED>No</VCHSTATUSISDELETED>
                          <VCHSTATUSISOPENINGBALANCE>No</VCHSTATUSISOPENINGBALANCE>
                          <VCHSTATUSISFETCHEDONLY>No</VCHSTATUSISFETCHEDONLY>
                          <PAYMENTLINKHASMULTIREF>No</PAYMENTLINKHASMULTIREF>
                          <ISSHIPPINGWITHINSTATE>No</ISSHIPPINGWITHINSTATE>
                          <ISOVERSEASTOURISTTRANS>No</ISOVERSEASTOURISTTRANS>
                          <ISDESIGNATEDZONEPARTY>No</ISDESIGNATEDZONEPARTY>
                          <HASCASHFLOW>No</HASCASHFLOW>
                          <ISPOSTDATED>No</ISPOSTDATED>
                          <USETRACKINGNUMBER>No</USETRACKINGNUMBER>
                          <ISINVOICE>No</ISINVOICE>
                          <MFGJOURNAL>No</MFGJOURNAL>
                          <HASDISCOUNTS>No</HASDISCOUNTS>
                          <ASPAYSLIP>No</ASPAYSLIP>
                          <ISCOSTCENTRE>No</ISCOSTCENTRE>
                          <ISSTXNONREALIZEDVCH>No</ISSTXNONREALIZEDVCH>
                          <ISEXCISEMANUFACTURERON>No</ISEXCISEMANUFACTURERON>
                          <ISBLANKCHEQUE>No</ISBLANKCHEQUE>
                          <ISVOID>No</ISVOID>
                          <ORDERLINESTATUS>No</ORDERLINESTATUS>
                          <VATISAGNSTCANCSALES>No</VATISAGNSTCANCSALES>
                          <VATISPURCEXEMPTED>No</VATISPURCEXEMPTED>
                          <ISVATRESTAXINVOICE>No</ISVATRESTAXINVOICE>
                          <VATISASSESABLECALCVCH>No</VATISASSESABLECALCVCH>
                          <ISVATDUTYPAID>Yes</ISVATDUTYPAID>
                          <ISDELIVERYSAMEASCONSIGNEE>No</ISDELIVERYSAMEASCONSIGNEE>
                          <ISDISPATCHSAMEASCONSIGNOR>No</ISDISPATCHSAMEASCONSIGNOR>
                          <ISDELETEDVCHRETAINED>No</ISDELETEDVCHRETAINED>
                          <CHANGEVCHMODE>No</CHANGEVCHMODE>
                          <RESETIRNQRCODE>No</RESETIRNQRCODE>
                          <VOUCHERNUMBERSERIES>Default</VOUCHERNUMBERSERIES>
                          <EWAYBILLDETAILS.LIST>      </EWAYBILLDETAILS.LIST>
                          <EXCLUDEDTAXATIONS.LIST>      </EXCLUDEDTAXATIONS.LIST>
                          <OLDAUDITENTRIES.LIST>      </OLDAUDITENTRIES.LIST>
                          <ACCOUNTAUDITENTRIES.LIST>      </ACCOUNTAUDITENTRIES.LIST>
                          <AUDITENTRIES.LIST>      </AUDITENTRIES.LIST>
                          <DUTYHEADDETAILS.LIST>      </DUTYHEADDETAILS.LIST>
                          <GSTADVADJDETAILS.LIST>      </GSTADVADJDETAILS.LIST>
                          <CONTRITRANS.LIST>      </CONTRITRANS.LIST>
                          <EWAYBILLERRORLIST.LIST>      </EWAYBILLERRORLIST.LIST>
                          <IRNERRORLIST.LIST>      </IRNERRORLIST.LIST>
                          <HARYANAVAT.LIST>      </HARYANAVAT.LIST>
                          <SUPPLEMENTARYDUTYHEADDETAILS.LIST>      </SUPPLEMENTARYDUTYHEADDETAILS.LIST>
                          <INVOICEDELNOTES.LIST>      </INVOICEDELNOTES.LIST>
                          <INVOICEORDERLIST.LIST>      </INVOICEORDERLIST.LIST>
                          <INVOICEINDENTLIST.LIST>      </INVOICEINDENTLIST.LIST>
                          <ATTENDANCEENTRIES.LIST>      </ATTENDANCEENTRIES.LIST>
                          <ORIGINVOICEDETAILS.LIST>      </ORIGINVOICEDETAILS.LIST>
                          <INVOICEEXPORTLIST.LIST>      </INVOICEEXPORTLIST.LIST>
                `;

      if (ledgers && ledgers.length > 0) {
        ledgers.forEach((ledger: { ledgerName: any, ledgerType: any, amount: any }) => {
          if (ledger?.ledgerType === "by ledger") {
            xmlPayload += `
          <ALLLEDGERENTRIES.LIST>
          <OLDAUDITENTRYIDS.LIST TYPE="Number">
           <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
          </OLDAUDITENTRYIDS.LIST>
          <APPROPRIATEFOR>&#4; Not Applicable</APPROPRIATEFOR>
          <LEDGERNAME>${ledger?.ledgerName}</LEDGERNAME>
          <GSTCLASS>&#4; Not Applicable</GSTCLASS>
          <ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
          <LEDGERFROMITEM>No</LEDGERFROMITEM>
          <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
          <ISPARTYLEDGER>No</ISPARTYLEDGER>
          <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
          <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
          <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
          <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
          <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
          <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
          <ISLASTDEEMEDPOSITIVE>Yes</ISLASTDEEMEDPOSITIVE>
          <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
          <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
          <AMOUNT>${ledger?.amount}</AMOUNT>
          <VATEXPAMOUNT>${ledger?.amount}</VATEXPAMOUNT>
          <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
          <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
          <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
          <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
          <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
          <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
          <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
          <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
          <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
          <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
          <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
          <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
          <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
          <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
          <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
          <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
          <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
          <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
          <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
          <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
          <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
          <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
          <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
          <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
          <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
         </ALLLEDGERENTRIES.LIST>`;
          } else if (ledger?.ledgerType === "to ledger") {
            xmlPayload += `
          <ALLLEDGERENTRIES.LIST>
          <OLDAUDITENTRYIDS.LIST TYPE="Number">
           <OLDAUDITENTRYIDS>-1</OLDAUDITENTRYIDS>
          </OLDAUDITENTRYIDS.LIST>
          <APPROPRIATEFOR>&#4; Not Applicable</APPROPRIATEFOR>
          <LEDGERNAME>${ledger?.ledgerName}</LEDGERNAME>
          <GSTCLASS>&#4; Not Applicable</GSTCLASS>
          <ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
          <LEDGERFROMITEM>No</LEDGERFROMITEM>
          <REMOVEZEROENTRIES>No</REMOVEZEROENTRIES>
          <ISPARTYLEDGER>No</ISPARTYLEDGER>
          <GSTOVERRIDDEN>No</GSTOVERRIDDEN>
          <ISGSTASSESSABLEVALUEOVERRIDDEN>No</ISGSTASSESSABLEVALUEOVERRIDDEN>
          <STRDISGSTAPPLICABLE>No</STRDISGSTAPPLICABLE>
          <STRDGSTISPARTYLEDGER>No</STRDGSTISPARTYLEDGER>
          <STRDGSTISDUTYLEDGER>No</STRDGSTISDUTYLEDGER>
          <CONTENTNEGISPOS>No</CONTENTNEGISPOS>
          <ISLASTDEEMEDPOSITIVE>No</ISLASTDEEMEDPOSITIVE>
          <ISCAPVATTAXALTERED>No</ISCAPVATTAXALTERED>
          <ISCAPVATNOTCLAIMED>No</ISCAPVATNOTCLAIMED>
          <AMOUNT>-${ledger?.amount}</AMOUNT>
          <VATEXPAMOUNT>-${ledger?.amount}</VATEXPAMOUNT>
          <SERVICETAXDETAILS.LIST>       </SERVICETAXDETAILS.LIST>
          <BANKALLOCATIONS.LIST>       </BANKALLOCATIONS.LIST>
          <BILLALLOCATIONS.LIST>       </BILLALLOCATIONS.LIST>
          <INTERESTCOLLECTION.LIST>       </INTERESTCOLLECTION.LIST>
          <OLDAUDITENTRIES.LIST>       </OLDAUDITENTRIES.LIST>
          <ACCOUNTAUDITENTRIES.LIST>       </ACCOUNTAUDITENTRIES.LIST>
          <AUDITENTRIES.LIST>       </AUDITENTRIES.LIST>
          <INPUTCRALLOCS.LIST>       </INPUTCRALLOCS.LIST>
          <DUTYHEADDETAILS.LIST>       </DUTYHEADDETAILS.LIST>
          <EXCISEDUTYHEADDETAILS.LIST>       </EXCISEDUTYHEADDETAILS.LIST>
          <RATEDETAILS.LIST>       </RATEDETAILS.LIST>
          <SUMMARYALLOCS.LIST>       </SUMMARYALLOCS.LIST>
          <CENVATDUTYALLOCATIONS.LIST>       </CENVATDUTYALLOCATIONS.LIST>
          <STPYMTDETAILS.LIST>       </STPYMTDETAILS.LIST>
          <EXCISEPAYMENTALLOCATIONS.LIST>       </EXCISEPAYMENTALLOCATIONS.LIST>
          <TAXBILLALLOCATIONS.LIST>       </TAXBILLALLOCATIONS.LIST>
          <TAXOBJECTALLOCATIONS.LIST>       </TAXOBJECTALLOCATIONS.LIST>
          <TDSEXPENSEALLOCATIONS.LIST>       </TDSEXPENSEALLOCATIONS.LIST>
          <VATSTATUTORYDETAILS.LIST>       </VATSTATUTORYDETAILS.LIST>
          <COSTTRACKALLOCATIONS.LIST>       </COSTTRACKALLOCATIONS.LIST>
          <REFVOUCHERDETAILS.LIST>       </REFVOUCHERDETAILS.LIST>
          <INVOICEWISEDETAILS.LIST>       </INVOICEWISEDETAILS.LIST>
          <VATITCDETAILS.LIST>       </VATITCDETAILS.LIST>
          <ADVANCETAXDETAILS.LIST>       </ADVANCETAXDETAILS.LIST>
          <TAXTYPEALLOCATIONS.LIST>       </TAXTYPEALLOCATIONS.LIST>
         </ALLLEDGERENTRIES.LIST>`
          }
        })
      }

      // Add the closing tags for the XML payload
      xmlPayload += `
                                          <GST.LIST>      </GST.LIST>
                                        <PAYROLLMODEOFPAYMENT.LIST>      </PAYROLLMODEOFPAYMENT.LIST>
                                      <ATTDRECORDS.LIST>      </ATTDRECORDS.LIST>
                                    <GSTEWAYCONSIGNORADDRESS.LIST>      </GSTEWAYCONSIGNORADDRESS.LIST>
                                  <GSTEWAYCONSIGNEEADDRESS.LIST>      </GSTEWAYCONSIGNEEADDRESS.LIST>
                                <TEMPGSTRATEDETAILS.LIST>      </TEMPGSTRATEDETAILS.LIST>
                              <TEMPGSTADVADJUSTED.LIST>      </TEMPGSTADVADJUSTED.LIST>
                          </VOUCHER>
                      </TALLYMESSAGE>
                  </REQUESTDATA>
                </IMPORTDATA>
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
      // console.log(data);

      let res: any;

      parseString(data, (err: any, result: any) => {
        if (err) {
          console.error("Error parsing response XML:", err);
          return;
        }
        // console.log("voucher details:", JSON.stringify(result));
        // return res.status(200).send(result);
        res = result;
      });

      const created = +res.RESPONSE.CREATED[0];
      const masterId = res.RESPONSE.LASTVCHID[0];

      let obj = {
        msg: `${parentVoucherType}voucher with voucherNumber : ${voucherNumber} created successfully`,
        created: created,
      };

      if (created === 1) {
        await UpdateBuffer(_id, companyNameDb, token, masterId, companyName, childrenVoucherType, voucherNumber, "voucher", null, null);;
        await deleteBuffer(_id, companyNameDb, token);
        // return obj;
        responceArr.push(obj);
      } else if (created === 0) {
        console.log("failed to create", res);
        return { msg: "failed to create", res };
      }
    }
    return responceArr;
  } catch (error: any) {
    console.log(error);
    return {
      code: 400,
      msg: "Somthing went wrong in addJournalVoucher, Please restart the application.",
      err: error.message
    }
  }
};

