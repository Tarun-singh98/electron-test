import { ipProxy } from "../../../../../../core/ipConfig";

const axios = require("axios");
const { getSalesLedgerFromTallyOdbc } = require("../../../internal/fromTally/ODBC/masters/ledgers/fetchSalesLedgerTypes");

const { remove$ } = require("../../../util/remove$")

const apiEndpoint = `${ipProxy}/accvoucherledger`;

const updateSalesLedgerDataInDb = async (companyName:any) => {
    const salesLedgerData = await getSalesLedgerFromTallyOdbc()
    const salesLedger = remove$(salesLedgerData)
    await axios.post(`${apiEndpoint}/fetch?companyName=${companyName}`, salesLedger);
    console.log("Initial API call successful in stock");
    return;
}


module.exports = { updateSalesLedgerDataInDb }