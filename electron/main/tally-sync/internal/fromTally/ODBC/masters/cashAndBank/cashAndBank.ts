const odbc = require("odbc");
const connectionString =
    "DSN=TallyODBC64_9000;Url='http://localhost:9000';";

export const getCashLedgerFromTally = () => {
    return new Promise((resolve, reject) => {
        odbc.connect(connectionString, (err: any, connection: any) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                connection.query(
                    "SELECT $StartingFrom,$AlteredBy,$EnteredBy,$NAME,$PARENT,$_ClosingBalance,$OpeningBalance,$_ClosingBalance,$_OnAccountValue,$_ThisYearBalance,$_PrevYearBalance,$_ThisQuarterBalance,$_ThisQuarterBalance,$_PrevQuarterBalance FROM CashLedgerVouchers",
                    (err: any, rows: unknown, moreResultSets: any) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.close((err:any) => {
                            if (err) {
                                console.error(err);
                            } else {
                                // console.log("Connection closed successfully");
                            }
                        });
                    }
                );
            }
        });
    });
};

export const getBankLedgerFromTally = () => {
    return new Promise((resolve, reject) => {
        odbc.connect(connectionString, (err : any, connection : any) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                connection.query(
                    "SELECT $StartingFrom,$AlteredBy,$EnteredBy,$NAME,$PARENT,$_ClosingBalance,$OpeningBalance,$_ClosingBalance,$_OnAccountValue,$_ThisYearBalance,$_PrevYearBalance,$_ThisQuarterBalance,$_ThisQuarterBalance,$_PrevQuarterBalance FROM LedgerUnderBankGroups",
                    (err: any, rows: unknown, moreResultSets: any) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.close((err: any) => {
                            if (err) {
                                console.error(err);
                            } else {
                                // console.log("Connection closed successfully");
                            }
                        });
                    }
                );
            }
        });
    });
};

