import axios from "axios";
import { ipProxy } from "../../../../../core/ipConfig";

const apiEndpoint = `${ipProxy}/ledger`;

export const ledgerFromCloud = async (companyNameDb: any, token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        }
        const data = await axios.get(
            `${apiEndpoint}/ledgerforconnector?companyName=${companyNameDb}`, { headers }
        );

        return data
    } catch (error: any) {
        console.log(error.message);
    }
}