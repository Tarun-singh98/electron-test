import axios from "axios";
import { getAllcostCategoryDataFromTally } from "../../../internal/fromTally/XML/masters/otherMasters/costCategory";
import { getAllcostCentreDataFromTally } from "../../../internal/fromTally/XML/masters/otherMasters/costCentre";
import { getAllGstEffectiveRateDataFromTally } from "../../../internal/fromTally/XML/masters/otherMasters/gstEffectiveRate";
import { getOpeningBatchAllocationDataFromTally } from "../../../internal/fromTally/XML/masters/otherMasters/openingBatchAllocation";
import { getOpeningBillAllocationDataFromTally } from "../../../internal/fromTally/XML/masters/otherMasters/openingBillAllocation";
import { ipProxy } from "../../../../../../core/ipConfig";
import { win } from "../../../../index";

const apiEndpoint = `${ipProxy}/othermaster`;

export const updatecostCategoryInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const costCategoryData: any = await getAllcostCategoryDataFromTally(port, companyNameForTally);
        if (costCategoryData?.code === 400) {
            win.webContents.send('connector-error-check', costCategoryData);
            return costCategoryData
        }
        if (costCategoryData.length === 0) {
            console.log("No Cost Category found in Tally");
            return;
        }
        const res = await axios.post(
            `${apiEndpoint}/createcostcategory?companyName=${companyName}`,
            costCategoryData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updatecostCategoryInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updatecostCategoryInDb",
            err: error.message
        }
    }
};
export const updatecostCentreInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const costCentreData: any = await getAllcostCentreDataFromTally(port, companyNameForTally);
        if (costCentreData?.code === 400) {
            win.webContents.send('connector-error-check', costCentreData);
            return costCentreData
        }
        if (costCentreData.length === 0) {
            console.log("No Cost Centre found in Tally");
            return;
        }
        const res = await axios.post(
            `${apiEndpoint}/createcostcentre?companyName=${companyName}`,
            costCentreData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updatecostCentreInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err updatecostCentreInDb",
            err: error.message
        }
    }
};
export const updateGstEffectiveRateInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const GstEffectiveRateData: any = await getAllGstEffectiveRateDataFromTally(port, companyNameForTally);
        if (GstEffectiveRateData?.code === 400) {
            win.webContents.send('connector-error-check', GstEffectiveRateData);
            return GstEffectiveRateData
        }
        if (GstEffectiveRateData.length === 0) {
            console.log("No Gst Effective Rate found in Tally");
            return;
        }
        const res = await axios.post(
            `${apiEndpoint}/creategsteffectiverate?companyName=${companyName}`,
            GstEffectiveRateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updateGstEffectiveRateInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateGstEffectiveRateInDb",
            err: error.message
        }
    }
};
export const updateOpeningBatchAllocationInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {
        const openingBatchData: any = await getOpeningBatchAllocationDataFromTally(port, companyNameForTally);
        if (openingBatchData?.code === 400) {
            win.webContents.send('connector-error-check', openingBatchData);
            return openingBatchData
        }
        if (openingBatchData.length === 0) {
            console.log("No Opening Batch Allocation found in Tally");
            return;
        }
        const res = await axios.post(
            `${apiEndpoint}/createopeningbatchallocation?companyName=${companyName}`,
            openingBatchData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updateOpeningBatchAllocationInDb", res.data);
        return;
    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateOpeningBatchAllocationInDb",
            err: error.message
        }
    }
};
export const updateOpeningBillAllocationInDb = async (port: any, companyName: any, companyNameForTally: any, token: any) => {
    try {

        const openingBillData: any = await getOpeningBillAllocationDataFromTally(port, companyNameForTally);
        if (openingBillData?.code === 400) {
            win.webContents.send('connector-error-check', openingBillData);
            return openingBillData
        }
        if (openingBillData.length === 0) {
            console.log("No Opening Bill Allocation found in Tally");
            return;
        }
        const res = await axios.post(
            `${apiEndpoint}/createopeningbillallocation?companyName=${companyName}`,
            openingBillData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.status !== 200) {
            return {
                code: 400,
                err: res.data
            }
        }
        console.log("response from updateOpeningBillAllocationInDb", res.data);
        return;

    } catch (error: any) {
        return {
            code: 400,
            msg: "err in updateOpeningBillAllocationInDb",
            err: error.message
        }
    }
};

