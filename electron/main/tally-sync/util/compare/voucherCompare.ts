export function compareVoucherArrays(tally: any, db: any) {
    let differentObjects = [];

    // Iterate over the objects in tally array
    for (let tallyObj of tally) {
        let found = false;

        // Compare the GUID of tallyObj with objects in db array
        for (let dbObj of db) {
            if (tallyObj.GUID === dbObj.GUID) {
                found = true;
                break;
            }
        }

        // If GUID not found in db array, push tallyObj to differentObjects array
        if (!found) {
            differentObjects.push(tallyObj);
        }
    }
    return differentObjects;
}

