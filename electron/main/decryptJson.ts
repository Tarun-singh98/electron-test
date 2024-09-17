import CryptoJS from "crypto-js";

export function decryptJSON(encryptedData: any, secretKey: any) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    return decryptedData;
}