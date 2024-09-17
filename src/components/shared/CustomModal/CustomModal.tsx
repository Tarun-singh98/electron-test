import { Box, Typography, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { ipProxy } from "../../../../core/ipConfig";

// Types of modal-:
// 1.error
// 2.confirmation
// 3.prompt

const CustomModal = ({
  isOpen,
  onClose,
  title,
  content,
  type,
  hasOkButton,
  okButtonText,
  okButtonHandler,
  hasCancelButton,
  cancelButtonText,
  cancelButtonHandler,
  handleOtpSection,
  showbutton
}: any) => {
  // const [modalState, setModalState] = useState<any>(false);

  // const handleClose: any = () => setModalState(false);
  const [showInputOtpField, setShowInputOtpField] = useState(false);
  const [otpInputValue, setOtpInputValue]: any = useState("");
  const [otpFromRes, setOtpFromRes]: any = useState("");
  const handlePhoneChange = (e: any) => {
    const digit = e.target.value;
    const validateDigit: any = /^\d{0,10}$/;
    if (validateDigit.test(digit)) {
      setOtpInputValue(digit);
    }
  };
  const sendotp = async () => {
    // console.log("inside the otp function ");
    const response: any = await axios.post(`${ipProxy}/user/emailotp`, {
      email: "surajnayak7879@gmail.com",
    });
    // console.log(response, "res");
    if (response.status === 200) {
      setShowInputOtpField(true);
      setOtpFromRes(response.data.otp);
    }
  };
  const verifyotp = () => {
    if (otpInputValue !== "" && otpInputValue === otpFromRes) {
      () => onClose();
    }
  };
  // console.log(otpFromRes, 'resotp')
  // console.log(otpInputValue, 'value')
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          // boxShadow: 24,
          // p: 2,
          paddingX: 2,
          paddingTop: 3,
          paddingBottom: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          border: "none",
          outline: "none",
          width: "380px",
          gap: showbutton ? 1 : 3
        }}
      >
        <Typography
          sx={{
            color: type === "error" ? "#FF2424" : "#000000",
            fontWeight: 600,
            fontSize: 17,
          }}
        >
          {title}
        </Typography>
        {/* <Divider sx={{ width: "100%" }} /> */}
        <Typography style={{ fontSize: 14, textAlign: "center", marginTop: "10px" }}>{content}</Typography>
        {
          showbutton ? <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: 10,
            visibility: showbutton ? "visible" : "hidden"
          }}
        >
          {hasOkButton ? (
            <Button
              onClick={okButtonHandler}
              sx={{
                backgroundColor: "#89CFF0",
                color: "white",
                ":hover": { backgroundColor: "#89CFF0" },
              }}
            >
              <Typography style={{ fontSize: 14 }}>{okButtonText}</Typography>
            </Button>
          ) : (
            <></>
          )}

          {hasCancelButton ? (
            <Button
              onClick={cancelButtonHandler}
              sx={{
                backgroundColor: "#FF2424",
                color: "white",
                width: "100px",
                ":hover": { backgroundColor: "#FF2424" },
              }}
            >
              <Typography style={{ fontSize: 14 }}>
                {cancelButtonText}
              </Typography>
            </Button>
          ) : (
            <></>
          )}
          {handleOtpSection ? (
            <Box>
              {showInputOtpField ? (
                <TextField
                  label="OTP"
                  variant="outlined"
                  placeholder="Enter your OTP"
                  value={otpInputValue}
                  onChange={handlePhoneChange}
                  inputProps={{ maxLength: 6 }}
                  sx={{
                    width: "100%",
                    height: "40px",
                  }}
                  size="small"
                />
              ) : (
                <Button onClick={sendotp}>Send OTP</Button>
              )}
            </Box>
          ) : (
            ""
          )}
          {otpInputValue !== "" ? (
            <Button onClick={verifyotp}>Verify OTP</Button>
          ) : (
            ""
          )}
        </Box> : ""
        }
        
      </Box>
    </Modal>
  );
};

export default CustomModal;
