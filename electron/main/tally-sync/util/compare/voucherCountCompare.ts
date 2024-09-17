
export function voucherCountCompare(db : any, tally : any) {
    let isAllSame = true;
    let diffValues : any = {};

    if(!db){
        return { isSame: false, difference: diffValues }
    }
    const dbKeys = Object.keys(db);
    const tallykeys = Object.keys(tally);

    // Check if both objects have the same keys
    const isEqualKeys = dbKeys.every((key) => tallykeys.includes(key));

    if (!isEqualKeys) {
        console.log('Keys are not the same in both objects.');
        return;
    }



    dbKeys.forEach((key) => {
        if (db[key] !== tally[key]) {
            isAllSame = false;
            diffValues[key] = db[key] - tally[key];
        }
    });

    if (isAllSame) {
        console.log('All values are the same in both objects.');
        return { isSame: true }
    } else {
        console.log('Differences:', diffValues);
        return { isSame: false, difference: diffValues }
    }
}
