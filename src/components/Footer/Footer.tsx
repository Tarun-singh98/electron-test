import { Typography, Box } from "@mui/material";
// import { ipcRenderer } from "electron";
const { ipcRenderer }: any = window;
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/Store/Context/UserContext";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import { ipProxy } from "../../../core/ipConfig";

const Footer = (screen: any) => {
  const userCTX: any = useContext(UserContext);
  const [connected, setConnected] = useState(userCTX?.tallyOpened);
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [currentVersionFromApp, setCurrentVersionFromApp] = useState();
  const [helpContact, setHelpContact] = useState({
    email: "",
    mobile: ""
  });
  useEffect(() => {
    const fetchVersionFromApp = async () => {
      try {
        const checkCurrentVersion = await ipcRenderer.currentVersion();
        setCurrentVersionFromApp(checkCurrentVersion);
      } catch (error) {
        console.error("Error fetching version from the database:", error);
      }
    };
    fetchVersionFromApp();
    const intervalId = setInterval(fetchVersionFromApp, 50000);
    const interval2 = setInterval(getAppConfig, 50000);
    return () => {clearInterval(intervalId); clearInterval(interval2)};
  }, []);
  const getAppConfig = async () => {
    try{
      const response = await axios.get(`${ipProxy}/appconfig/get`);
      if(response.status === 200){
        setHelpContact({
          ...helpContact,
          email: response?.data?.data?.connector?.helpContactInfo?.email,
          mobile: response?.data?.data?.connector?.helpContactInfo?.mobileNumber
        })
      }
    }catch(error){
      console.log(error, 'Error -----footer');
    }
  }
  useEffect(() => {
    getAppConfig();
  },[]);
  const fetchCurrentMachineConfig = async () => {
    const machineId = await ipcRenderer.getMachineId();
    const currentMachineConfig = userCTX.userDetails?.connectors?.find(
      (connector: any) => connector.machineId === machineId
    );
    return currentMachineConfig?.config;
  };

  const checkIfTallyIsConnectedOnCurrentPort = async () => {
    const currentMachineConfig = await fetchCurrentMachineConfig();
    // console.log(currentMachineConfig.TallyPort, "fsdnklfjdk");
    const checkIfTallyIsConnected = await ipcRenderer.connectedToGivenPort(
      currentMachineConfig?.tallyPort
    );
    // console.log(checkIfTallyIsConnected)
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      currentMachineConfig?.tallyPort
    );
    // console.log(tallyInfo);
    if (checkIfTallyIsConnected) {
      // setConnected(true);
    } else {
      // setConnected(false);
    }

    // return currentMachineConfig;
  };
  useEffect(() => {
    checkIfTallyIsConnectedOnCurrentPort();
  }, [userCTX]);

  const checkInternet = async () => {
    if (userCTX?.isInternetConnected) {
      setIsInternetConnected(true);
    } else {
      setIsInternetConnected(false);
    }
  };
  const checkTally = async () => {
    if (userCTX?.tallyOpened) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  };
  useEffect(() => {
    checkTally();
    checkInternet();
  }, [userCTX]);
  return (
    <Box
      sx={{
        width: "100%",
        height: "10px",
        backgroundColor: "#FFFFFF",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingY: "20px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        // alignItems: "center",
        position: "fixed",
        bottom: 0,
        zIndex: 100,
        boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
      }}
    >
      {isInternetConnected === true &&
      screen?.screen !== "login" &&
      screen?.screen !== "signup" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WifiIcon
            sx={{ marginLeft: "15px", color: "#04C12E", fontSize: "16px" }}
          />
          <Typography
            sx={{
              marginLeft: "5px",
              color: "#000000",
              fontWeight: "500",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
              INTERNET
            </Typography>{" "}
            : CONNECTED
          </Typography>
        </Box>
      ) : screen?.screen === "login" || screen?.screen === "signup" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              marginLeft: "5px",
              color: "#000000",
              fontWeight: "500",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmailIcon
              sx={{ height: 18, width: 18, marginRight: 0.5, marginLeft: 2 }}
            />{" "}
            : {helpContact.email}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WifiOffIcon
            sx={{ marginLeft: "15px", color: "red", fontSize: "16px" }}
          />
          <Typography
            sx={{
              marginLeft: "5px",
              color: "#000000",
              fontWeight: "500",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
              INTERNET
            </Typography>{" "}
            : DISCONNECTED
          </Typography>
        </Box>
      )}
      <Typography
        sx={{
          marginLeft: "5px",
          color: "#000000",
          fontWeight: "500",
          fontSize: "13px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "13px", marginRight: 1 }}>
          Version:
        </Typography>{" "}
        {currentVersionFromApp}
      </Typography>
      {connected &&
      screen?.screen !== "login" &&
      screen?.screen !== "signup" ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            marginRight: "20px",
          }}
        >
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#04C12E",
            }}
          ></Box>
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "500",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
              TALLY
            </Typography>{" "}
            : CONNECTED
          </Typography>
        </Box>
      ) : screen?.screen === "login" || screen?.screen === "signup" ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginRight: "20px",
          }}
        >
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "500",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PhoneIcon sx={{ height: 18, width: 18, marginRight: 0.5 }} />: +91
            {helpContact.mobile}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginRight: "20px",
          }}
        >
          <Box
            sx={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "red",
            }}
          ></Box>
          <Typography
            sx={{
              color: "#000000",
              fontWeight: "500",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "13px" }}>
              TALLY
            </Typography>{" "}
            : DISCONNECTED
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Footer;
