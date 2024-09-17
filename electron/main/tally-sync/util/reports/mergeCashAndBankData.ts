import { getCashLedgerFromTally, getBankLedgerFromTally } from "../../internal/fromTally/ODBC/masters/cashAndBank/cashAndBank"
import { remove$ } from "../remove$"


export const cashBankLedgerMerge = async () => {
    try {
        const cashLedgerData = await getCashLedgerFromTally()
        const bankLedgerData = await getBankLedgerFromTally()

        const cash = remove$(cashLedgerData)
        const bank = remove$(bankLedgerData)

        let data = [...cash, ...bank]
        
        return data;
    } catch (error) {
        console.log(error);
    }
}