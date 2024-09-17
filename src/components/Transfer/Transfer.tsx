import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { ipProxy } from "../../../core/ipConfig";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { ipcRenderer } from "electron";
const { ipcRenderer }: any = window;
import { UserContext } from "../../Store/Context/UserContext";
import { decryptJSON } from "../../../electron/main/decryptJson";
const Transfer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userCTX: any = useContext(UserContext);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue]: any = useState("");
  const [otp, setOtp]: any = useState("");
  const handlePhoneChange = (e: any) => {
    const digit = e.target.value;
    const validateDigit: any = /^\d{0,10}$/;
    if (validateDigit.test(digit)) {
      setInputValue(digit);
    }
  };

  const sendotp = async () => {
    try {
      const response: any = await axios.post(`${ipProxy}/user/emailotp`, {
        email: `${location.state}`,
      });
      const secretKey = "superSecretKey";
      const decriptedData = decryptJSON(response.data, secretKey);
      if (decriptedData?.otp !== "") {
        setOtp(decriptedData?.otp);
        setShowInput(true);
      } else {
        setOtp("");
      }
      // if (response.status === 200) {
      //   setOtp(response.data.otp);
      //   setShowInput(true);
      // }
    } catch (error) {}
  };

  const verifyotp = async () => {
    // console.log(inputValue, "input :", otp, "otp :");
    if (inputValue !== "" && inputValue === otp) {
      // console.log("otp verified");
      try {
        const tallyInfo = await ipcRenderer.fetchTallyInfo(
          localStorage.getItem("port")
        );
        const response = await axios.post(`${ipProxy}/user/licensetransfer`, {
          license: tallyInfo?.info?.licenseNumber,
          id: userCTX?.userDetails?._id,
        });
        if (response?.status === 200) {
          navigate("/companylist");
        }
      } catch (error) {
        console.log(error, "error -> ");
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "96%",
        marginTop: "-20px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "5px",
        boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFBFD",
          // backgroundColor: "red"
        }}
      >
        <Box
          sx={{
            // backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            width: "80%",
            // marginTop: 5,
            gap: 5,
            // border: "1px solid #4470AD",
            borderRadius: "6px",
            paddingX: "20px",
            paddingY: "20px",
          }}
        >
          <Typography style={{ fontSize: 15 }}>
            This license is currently associated with ({location.state}). To
            utilize this license, it must be transferred to your email. An OTP
            will be sent to the associated email address for verification.
          </Typography>
          {showInput ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // gap: 2,
              }}
            >
              <TextField
                label="OTP"
                variant="outlined"
                placeholder="Enter your OTP"
                value={inputValue}
                onChange={handlePhoneChange}
                inputProps={{ maxLength: 6 }}
                sx={{
                  width: "60%",
                  height: "40px",
                  "& input::placeholder": {
                    fontSize: "14px",
                  },
                  "& input": {
                    borderRadius: "5px",
                  },
                  "& label": {
                    fontSize: "14px",
                  },
                }}
                size="small"
              />
              <Button
                onClick={verifyotp}
                sx={{
                  border: "2px solid #4470AD",
                  borderRadius: "5px",
                  alignSelf: "center",
                  width: "20%",
                  color: "white",
                  backgroundColor: "#0E75A1",
                  textTransform: "none",
                  marginRight: "80px",
                  ":hover": {
                    backgroundColor: "#0E75A1",
                  },
                }}
              >
                <Typography style={{ fontSize: "14px" }}>Verify OTP</Typography>
              </Button>
            </Box>
          ) : (
            <Button
              onClick={sendotp}
              sx={{
                border: "2px solid #4470AD",
                borderRadius: "10px",
                marginTop: 2,
                alignSelf: "center",
                width: "50%",
                color: "white",
                backgroundColor: "#0E75A1",
                textTransform: "none",
                ":hover": {
                  backgroundColor: "#0E75A1",
                },
              }}
            >
              <Typography style={{ fontSize: "14px" }}>Send OTP</Typography>
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Transfer;
