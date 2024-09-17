import axios from 'axios';
import { ipProxy } from '../../../../../core/ipConfig';

const apiEndpoint = `${ipProxy}/buffer`;
export const UpdateBuffer = async (id: any, companyName: any, token: any, masterId: any, companyNameTally: any, voucherType: any, voucherNumber: any, type: any, ledgerName: any, itemName: any) => {
    try {

        const data = await axios.put(`${apiEndpoint}/update/${id}?dbName=${companyName}&masterId=${masterId}&companyName=${companyNameTally}&voucherType=${voucherType}&voucherNumber=${voucherNumber}&type=${type}&ledgerName=${ledgerName}&itemName=${itemName}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        const voucherUpdateData = data.data
        if (voucherUpdateData) {
            console.log("updated..");
            return "updated"
        }

        // console.log("voucherUpdateData-->", voucherUpdateData);
    } catch (error) {
        console.error('An error occurred during the bufferCheck call:', error);
    }
}

export const deleteBuffer = async (id: any, companyName: any, token: any) => {
    try {
        const data = await axios.put(`${apiEndpoint}/delete/${id}?dbName=${companyName}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        const voucherdeleteData = data.data
        if (voucherdeleteData) {
            console.log("deleted..");
            return "deleted"
        }

        // console.log("voucherdeleteData-->", voucherdeleteData);
    } catch (error) {
        console.error('An error occurred during the bufferCheck call:', error);
    }
}