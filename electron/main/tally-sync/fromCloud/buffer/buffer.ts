import axios from "axios";

import { addSalesVoucher, addPaymentVoucher, addPurchaseVoucher, addReceiptVoucher, addContraVoucher, addJournalVoucher } from "../../internal/toTally/transactions/voucher/addVoucher";
import { ipProxy } from "../../../../../core/ipConfig";
import { win } from "../../../index";
import { addLedgerToTally } from "../../internal/toTally/masters/addLedger";
import { addItemToTally } from "../../internal/toTally/masters/additem";

const apiEndpoint = `${ipProxy}/buffer`;
export const bufferLedgerCheck = async (companyNameDb: any, companyNameTally: any, isCronJobStarted: any, token: any, port: any) => {
  try {
    const data = await axios.get(
      `${apiEndpoint}/fetchbufferledgers?dbName=${companyNameDb}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(data.data, "data ledger 3")
    const bufferLedgerData = data.data.data;
    if (bufferLedgerData.length !== 0) {
      win.webContents.send('sync-progress-check', { progress: 3, companyName: companyNameTally, isCronJob: isCronJobStarted });
      const addLedgerTally: any = await addLedgerToTally(bufferLedgerData, companyNameTally, companyNameDb, token, port)
      if (addLedgerTally?.code === 400) {
        return addLedgerTally
      }
      console.log(addLedgerTally);
      return {
        code: 200,
        msg: "All ledger added successfully."
      }
    }
    return {
      code: 200,
      msg: "No ledger to add."
    }
  } catch (error: any) {
    console.error("An error occurred during the bufferVoucherCheck call:", error);
    win.webContents.send('connector-error-check', error.message);
    return {
      code: 400,
      msg: "Somthing went wrong, Please restart the application.",
      err: error.message
    }
  }
}

export const bufferItemCheck = async (companyNameDb: any, companyNameTally: any, isCronJobStarted: any, token: any, port: any) => {
  try {
    const data = await axios.get(
      `${apiEndpoint}/fetchbufferitems?dbName=${companyNameDb}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const bufferItemData = data.data.data;
    if (bufferItemData.length !== 0) {
      win.webContents.send('sync-progress-check', { progress: 3, companyName: companyNameTally, isCronJob: isCronJobStarted });
      const addItemToTallyBuffer = await addItemToTally(bufferItemData, companyNameTally, companyNameDb, token, port)
      if (addItemToTallyBuffer?.code === 400) {
        return addItemToTallyBuffer
      }
      console.log(addItemToTallyBuffer);
      return {
        code: 200,
        msg: "All ITEMS added successfully."
      }
    }
    return {
      code: 200,
      msg: "no item to add"
    }
  } catch (error: any) {
    console.error("An error occurred during the bufferVoucherCheck call:", error);
    win.webContents.send('connector-error-check', error.message);
    return {
      code: 400,
      msg: "Somthing went wrong, Please restart the application.",
      err: error.message
    }
  }
}

export const bufferVoucherCheck = async (companyNameDb: any, companyNameTally: any, isCronJobStarted: any, token: any, port: any) => {
  try {
    const data = await axios.get(
      `${apiEndpoint}/fetch?dbName=${companyNameDb}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    //voucher data is extracted
    const voucherData = data.data;
    const voucher = voucherData.data;
    //Check if voucher exists
    if (voucher.length !== 0) {
      console.log("Add voucher called..");
      const salesVoucher = voucher.filter(
        (obj: any) => obj.parentVoucherType === "Sales"
      );
      const paymentVoucher = voucher.filter(
        (obj: any) => obj.parentVoucherType === "Payment"
      );
      const purchaseVoucher = voucher.filter(
        (obj: any) => obj.parentVoucherType === "Purchase"
      );
      const receiptVoucher = voucher.filter(
        (obj: any) => obj.parentVoucherType === "Receipt"
      );
      const contraVoucher = voucher.filter(
        (obj: any) => obj.parentVoucherType === "Contra"
      );
      const journalVoucher = voucher.filter(
        (obj: any) => obj.parentVoucherType === "Journal"
      );
      console.log("sales--->", salesVoucher);

      //Sales voucher condition
      if (salesVoucher.length > 0) {
        const salesData: any = await addSalesVoucher(
          salesVoucher,
          companyNameTally,
          companyNameDb,
          token,
          port
        );
        if (salesData?.code === 400) {
          return salesData
        }
        console.log(salesData);
      }
      win.webContents.send('sync-progress-check', { progress: 3, companyName: companyNameTally, isCronJob: isCronJobStarted });

      console.log("payment--->", paymentVoucher);

      //Payment voucher condition
      if (paymentVoucher.length > 0) {
        const paymentData: any = await addPaymentVoucher(
          paymentVoucher,
          companyNameTally,
          companyNameDb,
          token,
          port
        );
        if (paymentData?.code === 400) {
          return paymentData
        }
        console.log(paymentData);
      }
      win.webContents.send('sync-progress-check', { progress: 4, companyName: companyNameTally, isCronJob: isCronJobStarted });

      console.log("Purchase--->", purchaseVoucher);

      //Purchase voucher condition
      if (purchaseVoucher.length > 0) {
        const purchaseData: any = await addPurchaseVoucher(
          purchaseVoucher,
          companyNameTally,
          companyNameDb,
          token,
          port
        );
        if (purchaseData?.code === 400) {
          return purchaseData
        }
        console.log(purchaseData);
      }
      win.webContents.send('sync-progress-check', { progress: 5, companyName: companyNameTally, isCronJob: isCronJobStarted });

      console.log("Receipt--->", receiptVoucher);

      //Purchase voucher condition
      if (receiptVoucher.length > 0) {
        const recieptData: any = await addReceiptVoucher(
          receiptVoucher,
          companyNameTally,
          companyNameDb,
          token,
          port
        );
        if (recieptData?.code === 400) {
          return recieptData
        }
        console.log(recieptData);
      }
      win.webContents.send('sync-progress-check', { progress: 6, companyName: companyNameTally, isCronJob: isCronJobStarted });

      console.log("Contra--->", contraVoucher);

      if (contraVoucher.length > 0) {
        const contraData: any = await addContraVoucher(
          contraVoucher,
          companyNameTally,
          companyNameDb,
          token,
          port
        );
        if (contraData?.code === 400) {
          return contraData
        }
        console.log(contraData);
      }
      win.webContents.send('sync-progress-check', { progress: 7, companyName: companyNameTally, isCronJob: isCronJobStarted });
      console.log("Journal--->", journalVoucher);

      if (journalVoucher.length > 0) {
        const journalData: any = await addJournalVoucher(
          journalVoucher,
          companyNameTally,
          companyNameDb,
          token,
          port
        );
        if (journalData?.code === 400) {
          return journalData
        }
        console.log(journalData);
      }
      win.webContents.send('sync-progress-check', { progress: 8, companyName: companyNameTally, isCronJob: isCronJobStarted });
      win.webContents.send('connector-noissue', "No error in buffer check");
      return {
        code: 200,
        msg: "all voucher added successfully."
      }
    } else {
      console.log("Nothing to create");
      return {
        code: 200,
        msg: "No vouchet to add."
      }
    }
  } catch (error: any) {
    console.error("An error occurred during the bufferVoucherCheck call:", error);
    win.webContents.send('connector-error-check', error.message);
    return {
      code: 400,
      msg: "Somthing went wrong, Please restart the application.",
      err: error.message
    }
  }
};
