import axios from "axios";
import { ipProxy } from "../../../../core/ipConfig";

export const fetchSyncMeterConfigByCaseId = async (caseId: any) => {
    try {
        const data = await axios.get(
            `${ipProxy}/syncconfig/getsyncConfigBycaseId/${caseId}`,
        );

        return data.data.data
    } catch (error: any) {
        console.log(error.message);
        return {
            code : 400,
            msg : "err in fetchSyncMeterConfigByCaseId function.",
            err : error.message
        }
    }
}