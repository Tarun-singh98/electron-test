  import axios from 'axios'
  import {ipProxy} from "../core/ipConfig"
  
  const { ipcRenderer }: any = window;

  // function to check server is up or not
  export const isServerActive = async () => {
    try {
      const response = await axios.get(ipProxy);
      if (response.status === 200) {
        return true;
    } else {
        return false;
      }
    } catch (error: any) {
      console.log(error, "------> error");
      return false;
    }
  };

  export const checkTallyOpen = async () => {
    const ans = await ipcRenderer.tallyOpen();
    return ans
};

export const isTallyRunningOnGivenPort = async () => {
    const x = localStorage.getItem('port')
    const res = await ipcRenderer.connectedToGivenPort(x)
}
// export const isTallyRunningOnGivenPort
// const checkIfTallyIsConnectedInGivenPort =
// await ipcRenderer.connectedToGivenPort(
//   currentMachineConfig !== undefined
//     ? currentMachineConfig?.tallyPort
//     : localStorage.getItem("port")
// );
