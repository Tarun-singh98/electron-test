import React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import {Mobile_Otp_Verification} from '../../../core/appConfig'
const LoginStepper = ({
  currentStep,
  step1Completed,
  step2Completed,
  step3Completed,
}: any) => {
  const otpVerificationValue: any = Mobile_Otp_Verification;
  const isStep1Active = currentStep === 1 || step1Completed;
  const isStep2Active = currentStep === 2 || step2Completed;
  const isStep3Active = currentStep === 3 || step3Completed;

  return (
    <Box
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 20,
      }}
    >
      <Box
        sx={{
          width: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          fontSize={14}
          sx={{
            border: 2,
            borderColor: isStep1Active ? "#0E75A1" : "lightgrey",
            borderRadius: 10,
            width: "20px",
            height: "20px",
            backgroundColor: isStep1Active ? "#0E75A1" : "",
            color: isStep1Active ? "white" : "",
          }}
        >
          1
        </Typography>
        <Typography
          fontSize={10}
          color={isStep1Active ? "#0E75A1" : ""}
          sx={{ marginTop: 1 }}
        >
          Email / Password{" "}
        </Typography>
        <Typography fontSize={10} color={isStep1Active ? "#0E75A1" : ""}>
          Verification
        </Typography>
      </Box>
      <svg
        height="100%"
        width={otpVerificationValue === true ? "12%" : "27%"}
        style={{ position: "absolute", top: -83, left: 328 }}
      >
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          style={{
            stroke: isStep2Active ? "#0E75A1" : "lightgrey",
            strokeWidth: 1,
          }}
        />
      </svg>
      <Box
        sx={{
          width: 90,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          fontSize={14}
          sx={{
            border: 2,
            borderColor: isStep2Active ? "#0E75A1" : "lightgrey",
            borderRadius: 10,
            width: "20px",
            height: "20px",
            backgroundColor: isStep2Active ? "#0E75A1" : "",
            color: isStep2Active ? "white" : "",
          }}
        >
          2
        </Typography>
        <Typography
          fontSize={10}
          color={isStep2Active ? "#0E75A1" : ""}
          sx={{ marginTop: 1 }}
        >
          Phone OTP{" "}
        </Typography>
        <Typography fontSize={10} color={isStep2Active ? "#0E75A1" : ""}>
          Generation
        </Typography>
      </Box>
      {otpVerificationValue === true && (
        <>
          <svg
            height="100%"
            width="12%"
            style={{ position: "absolute", top: -83, right: 328 }}
          >
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              style={{
                stroke: isStep3Active ? "#0E75A1" : "lightgrey",
                strokeWidth: 1,
              }}
            />
          </svg>
          <Box
            sx={{
              width: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              fontSize={14}
              sx={{
                border: 2,
                borderColor: isStep3Active ? "#0E75A1" : "lightgrey",
                borderRadius: 10,
                width: "20px",
                height: "20px",
                backgroundColor: isStep3Active ? "#0E75A1" : "",
                color: isStep3Active ? "white" : "",
              }}
            >
              3
            </Typography>
            <Typography
              fontSize={10}
              color={isStep3Active ? "#0E75A1" : ""}
              sx={{ marginTop: 1 }}
            >
              Phone OTP
            </Typography>
            <Typography fontSize={10} color={isStep3Active ? "#0E75A1" : ""}>
              Verification
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default LoginStepper;
