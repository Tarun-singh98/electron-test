import axios from "axios";
import { ipProxy } from "../../../../../../core/ipConfig";

const { remove$ } = require("../../../util/remove$");
const { getGodownsFromTally } = require("../../../internal/fromTally/ODBC/masters/stockItems/fetchGodowns");

const apiEndpoint = `${ipProxy}/godown`;


const updateGodownsInDb = async (companyName: any) => {
    const stockData = await getGodownsFromTally()
    const godowns = remove$(stockData)
    await axios.post(`${apiEndpoint}/creategodown?companyName=${companyName}`, godowns);
    console.log("Initial API call successful in godown");
    return;
}

module.exports = { updateGodownsInDb }

