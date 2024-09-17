// // import { ipcRenderer } from "electron";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// const {ipcRenderer}: any = window;
// const CompanyList = () => {
//   const [isTallyConnected, setIsTallyConnected] = useState();

//   const test = async() =>{
//     console.log("kfsdkbf")
//     ipcRenderer.invoke("sync-company");
//   }
//   const checkTallyStatus = async () => {
//     try {
//       ipcRenderer.invoke("is-tally-open");
//     } catch (error) {
//       console.log(error, "Error from the check tally status");
//     }
//   };

//   useEffect(() => {
//     checkTallyStatus();
//   });
//   return (
//     <div>
//       CompanyList
//       <button onClick={test}>Test</button>
//     </div>
//   );
// };

// export default CompanyList;
