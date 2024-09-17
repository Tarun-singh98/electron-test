import * as crypto from "crypto";

import { win } from "../electron/main/index"

export function decryptData(secretKey: any, encryptedData: any) {
  const decipher = crypto.createDecipher("aes-256-cbc", secretKey);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}



export function findMatchingObjects(array1: any[], array2: any[]) {
  const matchingObjects: any = [];
  const toLowerCaseKeys = (obj: any) => {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      newObj[key.toLowerCase()] = obj[key];
    }
    return newObj;
  };

  for (const item1 of array1) {
    for (const item2 of array2) {
      const lowerCaseItem1 = toLowerCaseKeys(item1);
      const lowerCaseItem2 = toLowerCaseKeys(item2.companyInfo);
      if (
        lowerCaseItem1.name === lowerCaseItem2.name &&
        lowerCaseItem1.guid === lowerCaseItem2.guid
      ) {
        matchingObjects.push(item2);
        break;
      }
    }
  }

  return matchingObjects;
}

export async function getTokenFromLocalStorage() {
  try {
    const data = await win?.webContents.executeJavaScript(
      'localStorage'
    );
    if (Object.keys(data).length !== 0) {
      const token = await win?.webContents.executeJavaScript(
        'localStorage.getItem("token")'
      );
      return token;
    } else {
      return null
    }

  } catch (error: any) {
    return {
      code: 400,
      msg: "err in getTokenFromLocalStorage",
      err: error.message
    }
  }
}

export async function getPortFromLocalStorage() {
  try {
    const port = await win?.webContents.executeJavaScript(
      'localStorage.getItem("port")'
    );
    return port;
  } catch (error: any) {
    return {
      code: 400,
      msg: "err in getPortFromLocalStorage",
      err: error.message
    }
  }
}

export async function getCaseIdFromLocalStorage() {
  try {
    const caseId = await win?.webContents.executeJavaScript(
      'localStorage.getItem("caseId")'
    );
    return caseId;
  } catch (error: any) {
    return {
      code: 400,
      msg: "err in getCaseIdFromLocalStorage",
      err: error.message
    }
  }
}