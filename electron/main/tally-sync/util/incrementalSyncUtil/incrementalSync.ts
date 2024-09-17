import axios from "axios";
import { ipProxy } from "../../../../../core/ipConfig";
import { win } from "../../../index";
import { getMachineId } from "../deviceInfo/uniqueIdFromDevice";
import { decryptJSON } from "../../../decryptJson";

export const fetchLetestAlterId = async (companyName: any, token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const data = await axios.get(`${ipProxy}/fetchletestalterid?companyName=${companyName}`, { headers })
        // console.log(data.data);
        win.webContents.send('connector-noissue', "no error in fetchLetestAlterId");
        return data.data
    } catch (error: any) {
        console.error(error);
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
}

export const checkIfcompanyExistunderUser = async (companyName: any, token: any, machineId: any, licenseNumber: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const data = await axios.get(`${ipProxy}/checkifcompanyexistsunderuser?dbName=${companyName}&machineId=${machineId}&tallyLicenseNumber=${licenseNumber}`, { headers })
        win.webContents.send('connector-noissue', "no error in checkIfcompanyExistunderUser");
        return data.data.companyExists;
    } catch (error: any) {
        console.error(error);
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
}

export const companiesInfoFromToken = async (token: any) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const data = await axios.get(`${ipProxy}/user/fetchuserconnector`, { headers })
        const secretKey = process.env.secretKey || "superSecretKey";

        const decryptedJSON = await decryptJSON(data?.data, secretKey);

        win.webContents.send('connector-noissue', "no error in companiesInfoFromToken");
        return decryptedJSON;
    } catch (error: any) {
        console.error(error);
        win.webContents.send('connector-error-check', error.message);
        return {
            code: 400,
            msg: "Somthing went wrong, Please restart the application.",
            err: error.message
        }
    }
}

export const companyUnderCurrentMachine = async (companiesInfo: any, storedActiveLicenseNumber: any) => {
    try {
        if (companiesInfo?.code === 400) {
            return companiesInfo
        }

        const licenses = companiesInfo?.data?.userData?.tallyLicenses;

        const findActiveLicense = licenses?.find((license: any) => license.tallyLicenseNumber === storedActiveLicenseNumber);
        if (!findActiveLicense) {
            return { finalData: [] }
        }

        const connectors = findActiveLicense?.connectors;
        const companiesArr = findActiveLicense?.companies;
        const currentMachineId = await getMachineId()
        const companyNamesAccordingTomachineId = connectors?.filter((connector: any) => connector.machineId === currentMachineId);
        if (companyNamesAccordingTomachineId?.length !== 0) {
            let companyNamesArr = companyNamesAccordingTomachineId?.[0]?.companies;
            let companyNames = companyNamesArr?.map((company: any) => company.companyName);
            let finalData = companiesArr?.filter((company: any) => companyNames?.includes(company.companyName));
            let config = companyNamesAccordingTomachineId[0]?.config?.tallyPort || "localhost"; //will send whole config in future for cloud tally
            return { finalData, config };
        } else {
            return { finalData: [] };
        }
    } catch (error) {
        console.log(error);
    }
}