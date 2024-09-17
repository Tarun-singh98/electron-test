import { Box, Button, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/Store/Context/UserContext";
// import { ipcRenderer, shell } from "electron";
const { ipcRenderer }: any = window;
import axios from "axios";
import { shell } from "electron";
const Pricing = () => {
  const userCTX: any = useContext(UserContext);
  const [tallyInfo, setTallyInfo]: any = useState([]);
  const [userData, setUserData]: any = useState("");
  // useEffect(() => {
  //   // const tallyDataArray = userCTX.companyDetails.map(
  //   //   (tallyData: any) => tallyData.tally_companyInfo
  //   // );

  //   setTallyInfo(tallyDataArray);
  //   setUserData(userCTX?.userDetails?.email);
  // }, [userCTX.companyDetails]);
  const getTallyInfo = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    setTallyInfo(tallyInfo.info);
  };
  useEffect(() => {
    getTallyInfo();
    setUserData(localStorage.getItem("email"));
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: "100%",
        height: "96%",
        boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
      }}
    >
      <Button
        onClick={() => {
          const params = new URLSearchParams({
            tallyInfo: JSON.stringify(tallyInfo),
            userData: JSON.stringify(userData),
            token: JSON.stringify(localStorage.getItem('token'))
          });
          const url = `https://www.accosync-test.xyz?${params.toString()}`;
          // const url = `http://localhost:3000/purchase?${params.toString()}`;
          window.open(url, "_blank");
          // shell.openExternal(url);
        }}
        variant="contained"
        sx={{
          backgroundColor: "#4470AD",
          width: "auto",
          ":hover": {
            backgroundColor: "#335c85",
          },
        }}
      >
        Buy Now
      </Button>
      {/* <Button
        onClick={() => {
          const requestData = {
            tallyInfo: tallyInfo,
            userData: userData,
            token: localStorage.getItem("token"),
          };
          axios
            .post("https://accosync.com", requestData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              // Handle response if needed
              console.log(response, "response");
            })
            .catch((error) => {
              // Handle error if needed
              console.log(error, "error");
            });
        }}
        variant="contained"
        sx={{
          backgroundColor: "#4470AD",
          width: "auto",
          ":hover": {
            backgroundColor: "#335c85",
          },
        }}
      >
        Buy Now
      </Button> */}
    </Box>
  );
};

export default Pricing;

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const tallyInfo = JSON.parse(urlParams.get('tallyInfo'));
// const userData = JSON.parse(urlParams.get('userData'));
