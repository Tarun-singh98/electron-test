import axios from "axios";
import { getGodownDataFromTally } from "../../../internal/fromTally/XML/masters/godown/getAllGodownData";
import { ipProxy } from "../../../../../../core/ipConfig";
import { win } from "../../../../index";

const apiEndpoint = `${ipProxy}/godown`;

export const updateGodownsInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const godownsData: any = await getGodownDataFromTally(port, companyNameForTally);
        if (godownsData?.code === 400) {
            win.webContents.send('connector-error-check', godownsData);
            return godownsData
        }
        if (godownsData.length === 0) {
            console.log("No Godowns found in Tally");
            return;
        }
        // const group = remove$(groupsData)
        const res = await axios.post(`${apiEndpoint}/creategodown?companyName=${companyName}`, godownsData,
            {
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
        console.log("response from updateGodownsInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateGodownsInDb",
            err: error.message
        }
    }
}
