import * as machineId from 'node-machine-id';

export async function getMachineId() {
    try {
        const uuid = await machineId.machineId();
        // console.log('Machine ID : ===========>', uuid);
        return uuid;
    } catch (error: any) {
        console.error('Error:', error.message);
        return {
            code: 400,
            msg: "err in getMachineId function.",
            err: error.message
        }
    }
}