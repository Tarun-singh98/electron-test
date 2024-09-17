import  { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography,  } from "@mui/material";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import {  ipcRenderer } from "electron";
const {ipcRenderer}: any = window;
const System = () => {
  const [windowsVersion, setWindowsVersion] = useState(0);
  const [totalMemory, setTotalMemory] = useState(0);
  const navigate = useNavigate();
  const handleClick = async () => {
    const deviceInfo = await ipcRenderer.getUniqueMachineId();
    console.log(deviceInfo);
  }
  useEffect(() => {
    handleClick();
  },[]);
  return (
    <Box
      sx={{
        width: "100%",
        height: "80%",
        marginTop: 2.3,
      }}
    >
      <Box
        sx={{
          marginLeft: "20px",
          marginTop: "20px",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          color: "#333",
          transition: "background-color 0.3s, color 0.3s",
          ":hover": {
            cursor: "pointer",
            color: "black",
          },
        }}
        onClick={() => navigate(-1)}
      >
        <KeyboardBackspaceIcon sx={{ width: "20px", height: "20px" }} />
        <Typography>Back</Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "85%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "80%",
            height: "100%",
            backgroundColor: "transparent",
            borderRadius: "5px",
            textAlign: "right",
            padding: "20px",
          }}
        >
          <Typography sx={{ marginBottom: "10px" }}>
            Current System info
          </Typography>
          <Box
            sx={{
              width: "90%",
              height: "auto",
              margin: "auto",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid black",
                paddingBottom: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <CheckCircleOutlineIcon />
                <Typography>Windows 7 or above</Typography>
              </Box>

              {windowsVersion >= 7 ? (
                <Typography sx={{ color: "green" }}>Good</Typography>
              ) : (
                <Typography sx={{ color: "red" }}>Bad</Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid black",
                paddingBottom: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <CheckCircleOutlineIcon />
                <Typography>Mininum 4 GB RAM, Recommended 8 GB RAM</Typography>
              </Box>

              {totalMemory >= 4 ? (
                <Typography sx={{ color: "green" }}>Good</Typography>
              ) : (
                <Typography sx={{ color: "red" }}>Bad</Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: "20px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <CheckCircleOutlineIcon />
                <Typography>Tally: Tally ERP 9 / Tally Prime License</Typography>
              </Box>

              <Typography>OK</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default System;
