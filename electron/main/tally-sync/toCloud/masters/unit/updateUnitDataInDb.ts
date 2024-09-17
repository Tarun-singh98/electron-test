import { win } from "../../../../index";
import { ipProxy } from "../../../../../../core/ipConfig";
import { getAllUnitsDataFromTally } from "../../../internal/fromTally/XML/masters/unit/getAllUnits";
import axios from "axios";
const apiEndpoint = `${ipProxy}/godown`;

export const updateUnitsInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const UnitsData: any = await getAllUnitsDataFromTally(port, companyNameForTally);
        if (UnitsData?.code === 400) {
            win.webContents.send('connector-error-check', UnitsData);
            return UnitsData
        }
        if (UnitsData.length === 0) {
            console.log("No Units found in Tally");
            return;
        }
        const res = await axios.post(`${apiEndpoint}/createunit?companyName=${companyName}`, UnitsData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updateUnitsInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateUnitsInDb",
            err: error.message
        }
    }
}