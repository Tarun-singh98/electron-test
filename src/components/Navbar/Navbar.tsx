import { useEffect, useState } from "react";
import { Stack, Typography, Box, Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
// import { ipcRenderer } from "electron";
const { ipcRenderer }: any = window;
import Accosync from "../../assets/accosynclogo2.png";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import "./Navbar.css";
import RefreshIcon from "@mui/icons-material/Refresh";
// Import necessary components and icons
const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isRefreshClicked, setIsRefreshedClicked] = useState(false);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const clearLocalStorage = () => {
    localStorage.clear();
  };
  const minimize = async () => {
    try {
      await ipcRenderer.appMinimize();
    } catch (error) {
      console.log(error, "error");
    }
  };
  const closeapp = async () => {
    try {
      await ipcRenderer.appClose();
    } catch (error) {
      console.log(error, "error");
    }
  };
  const reloadapp = async () => {
    try {
      await ipcRenderer.appReload();
    } catch (error) {
      console.log(error);
    }
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const updateToken = () => {
    const newToken = localStorage.getItem("token");
    setToken(newToken);
  };
  useEffect(() => {
    updateToken();
    const intervalId = setInterval(updateToken, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <Stack
      sx={{
        width: "100%",
        height: "auto",
        // backgroundColor: "#4470AD",
        backgroundColor: "white",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.09)",
        position: "fixed",
        top: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: "50px",
        paddingRight: "50px",
        paddingTop: "5px",
        paddingBottom: "5px",
      }}
    >
      <img
        // className="colorChangedImage"
        src={Accosync}
        style={{
          width: "160px",
          height: "50px",
          objectFit: "contain",
          marginLeft: "20px",
          marginTop: "-5px",
        }}
      />
      <Box
        sx={{
          width: "80%",
          height: "40px",
          "-webkit-app-region": "drag",
        }}
      ></Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          marginRight: "20px",
          transition: "all 0.3s ease-in-out",
          ":hover": {
            // cursor: "pointer",
            // backgroundColor: "#4470AD",
          },
        }}
      >
        {/* <Box
        sx={{
          cursor: "pointer",
        }}>
          <Typography variant="h5">Update</Typography>
        </Box> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "7px",
              border: "1px solid #4470AD",
              position: "relative",
              width: "15px",
              height: "15px",
              padding: "3px"
            }}
          >
            <MinimizeIcon
              onClick={() => {
                minimize();
              }}
              sx={{
                // color: "#4470AF",
                position: "absolute",
                bottom: "5px",
                // ":hover": {
                //   // backgroundColor: "#4470AD",
                // },
                // cursor: "pointer",
                // width: "20px",
                // height: "20px",
                color: "#4470AF",
                cursor: "pointer",
                // width: "20px",
                // height: "20px",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "7px",
              border: "1px solid #4470AD",
              padding: "3px"
            }}
          >
            <RefreshIcon
              onClick={() => {
                reloadapp();
              }}
              sx={{
                color: "#4470AF",
                ":active": { transform: "rotate(360deg)" },
                transition: "transform 0.3s ease", // Add a smooth transition for better user experience
                cursor: "pointer",
                width: "15px",
                height: "15px",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "7px",
              border: "1px solid #4470AD",
              padding: "3px"
            }}
          >
            <CloseIcon
              onClick={() => {
                closeapp();
              }}
              sx={{
                color: "#4470AF",
                cursor: "pointer",
                width: "15px",
                height: "15px",
              }}
            />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
};

export default Navbar;
