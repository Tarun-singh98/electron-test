import axios from "axios";
import { fetchVoucherTypesFromTallyXml } from "../../../internal/fromTally/XML/transactions/voucherTypes";
import { ipProxy } from "../../../../../../core/ipConfig";
import { win } from "../../../../index";

const apiEndpoint = `${ipProxy}/vouchertype`;

export const updateVoucherTypesInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const voucherTypesData: any = await fetchVoucherTypesFromTallyXml(port, companyNameForTally)
        if (voucherTypesData?.code === 400) {
            win.webContents.send('connector-error-check', voucherTypesData);
            return voucherTypesData
        }
        if (voucherTypesData.length === 0) {
            console.log("No Voucher Types found in Tally");
            return;
        }
        const res = await axios.post(`${apiEndpoint}/addvouchertypeindb?companyName=${companyName}`, voucherTypesData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updateVoucherTypesInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateVoucherTypesInDb",
            err: error.message
        }
    }
}

export const updateEmptyReserveName = async (companyName: any, token: any) => {
    try {
        const res = await axios.put(`${apiEndpoint}/updateemptyreservename?companyName=${companyName}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        console.log("response from updateEmptyReserveName", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateEmptyReserveName",
            err: error.message
        }
    }
}