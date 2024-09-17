import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Modal,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ipProxy } from "../../../core/ipConfig";
import { toast, ToastContainer } from "react-toastify";
import BackgroungImageSignUp from "../../assets/background.png";
import IconButton from "@mui/material/IconButton";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Email_Otp_Verification,
  Mobile_Otp_Verification,
} from "../../../core/appConfig";
import StepperComponent from "../Stepper/Stepper";
const { ipcRenderer }: any = window;
import { decryptJSON } from "../../../electron/main/decryptJson";
import Footer from "../Footer/Footer";
const Signup = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isValidemail, setIsValidemail] = useState(true);
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [OTP, setOTP] = useState("");
  const [mobileOTP, setMobileOTP] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [isValidMobile, setIsValidMobile] = useState(true);
  const [emailTime, setEmailTime] = useState(60);
  const [mobileTime, setMobileTime] = useState(60);

  const [stepOne, setStpeOne] = useState(true);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);
  const [steponeModal, setStepOneModal] = useState(false);
  const [steptwoModal, setStepTwoModal] = useState(false);
  // timer for the email resend otp
  const startTimer = () => {
    const interval = setInterval(() => {
      setEmailTime((prevTime) => {
        const current = prevTime - 1;
        if (current <= 0) {
          clearInterval(interval);
          // setOtpvisible(false);
          setOTP("");
        }
        return current;
      });
    }, 1000);
  };
  // timer for the mobile resend otp
  const startTimer2 = () => {
    const interval = setInterval(() => {
      setMobileTime((prevTime) => {
        const current = prevTime - 1;
        if (current <= 0) {
          clearInterval(interval);
          // setOtpvisible(false);
          setMobileOTP("");
        }
        return current;
      });
    }, 1000);
  };

  // function to send otp to mobile number
  const sendMobileOtp = async () => {
    // console.log(Mobile_Otp_Verification, "mobile otp");
    if (Mobile_Otp_Verification) {
      if (number === "") {
        emptyMobileNumberField();
      } else if (number.length < 10) {
        lessthan10digits();
      } else {
        try {
          const res = await axios.get(
            `${ipProxy}/user/isnumberregistered?phoneNumber=${number}`
          );
          if (res.data.isExist) {
            pholealreadyexist();
            setNumber("");
          } else {
            const response = await axios.post(
              `${ipProxy}/user/mobileotp`,
              null,
              {
                params: {
                  phoneNumber: `+91${number}`,
                },
              }
            );
            const secretKey = "superSecretKey";
            const decriptedData = decryptJSON(response.data, secretKey);
            setMobileOTP(decriptedData?.data);
            setMobileTime(60);
            startTimer2();
            setStepTwoModal(true);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      if (number === "") {
        emptyMobileNumberField();
      } else if (number.length < 10) {
        lessthan10digits();
      } else {
        setStpeOne(false);
        setStepTwo(false);
        setStepThree(true);
      }
    }
  };
  // function to send otp to email
  const sendOTP = async () => {
    if (Email_Otp_Verification) {
      if (email === "") {
        emptyEmailField();
      } else if (name === "") {
        toast.error("Name Field can't be empty ", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        try {
          const res = await axios.get(
            `${ipProxy}/user/isemailregistered?email=${email}`
          );
          if (res.data.isExist) {
            emailalreadyexist();
            setEmail("");
          } else {
            const response = await axios.post(
              `${ipProxy}/user/emailotpsignup`,
              {
                email: email,
              }
            );
            // console.log(response);
            const secretKey = "superSecretKey";
            const decriptedData = decryptJSON(response.data, secretKey);
            setOTP(decriptedData.data);
            setStepOneModal(true);
            setEmailTime(60);
            startTimer();
          }
        } catch (error: any) {
          console.log("Error -> , ", error);
        }
      }
    } else {
      if (email === "") {
        emptyEmailField();
      } else if (name === "") {
        toast.error("Name Field can't be empty ", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setStpeOne(false);
        setStepTwo(true);
        setStepThree(false);
      }
    }
  };
  const verifyEmailOtp = async () => {
    if (emailOtp === OTP && emailOtp !== "") {
      OtpVerified();
      setStpeOne(false);
      setStepTwo(true);
      setStepThree(false);
      setStepOneModal(false);
    } else {
      OtpNotVerified();
    }
  };
  const verifyMobileOtp = async () => {
    if (mobileOtp === mobileOTP && mobileOtp !== "") {
      OtpVerified();
      setStpeOne(false);
      setStepTwo(false);
      setStepThree(true);
      setStepTwoModal(false);
    }
  };
  const validateEmail = (email: any) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = (e: any) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidemail(newEmail === "" || validateEmail(newEmail));
  };
  const validateMobile = (mobile: any) => {
    if (mobile.trim() === "") {
      return true;
    }
    const mobileRegex = /^\d{0,10}$/;
    return mobileRegex.test(mobile);
  };
  const handleMobileChange = (e: any) => {
    const newMobile = e.target.value;
    const validateMobileNumber: any = /^\d{0,10}$/;
    if (validateMobileNumber.test(newMobile)) {
      setNumber(newMobile);
    }
    setIsValidMobile(validateMobile(newMobile));
  };
  // function to signup
  const handleClick = async () => {
    try {
      if (
        password !== "" &&
        confirmPassword !== "" &&
        password !== confirmPassword
      ) {
        passwordNotMatched();
        return;
      }
      const response = await axios.post(`${ipProxy}/user/signup`, {
        name: name,
        email: email,
        phoneNumber: number,
        password: password,
      });
      if (response?.data?.message === "User registered successfully") {
        Signupsuccess();
        setName("");
        setEmail("");
        setPassword("");
        setNumber("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        SignupNotsuccess();
        navigate("/signup");
      }
    } catch (error: any) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // these are all the helper function to show error or success notification
  const Signupsuccess = () => {
    toast.success("Signup successfully", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const SignupNotsuccess = () => {
    toast.error("Something went wrong while Signup", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const OtpVerified = () => {
    toast.success("OTP verified successfully", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const OtpNotVerified = () => {
    toast.error("email OTP didn't match", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const MobileOtpNotVerified = () => {
    toast.error("mobile OTP didn't match", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const passwordMatched = () => {
    toast.success("Password matched", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const passwordNotMatched = () => {
    toast.error("Password didn't match", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const emptyMobileNumberField = () => {
    toast.error("Mobile number is required", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const emptyEmailField = () => {
    toast.error("Email is required", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const lessthan10digits = () => {
    toast.error("Phone number cannot be less than 10 digits", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const emailalreadyexist = () => {
    toast.error("Email already exist. Please login ", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const pholealreadyexist = () => {
    toast.error("Phone number alredy exist. Please login", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "110%",
        backgroundImage: `url(${BackgroungImageSignUp})`,
        // backgroundColor: "red",
        backgroundSize: "cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <Typography
        sx={{
          color: "#0E75A1",
          fontSize: "30px",
          fontWeight: 500,
          // marginTop: "-10px",
          marginBottom: "15px",
        }}
      >
        SIGN UP
      </Typography>
      <Box
        sx={{
          width: "50%",
          height: "50%",
          backgroundColor: "#FFFFFF",
          borderRadius: 3,
          // paddingY: 1,
          // paddingX: 3,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 1,
          textAlign: "center",
          // marginTop: "10px",
          // paddingY: 1,
          boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {stepOne === true && stepTwo === false && stepThree === false ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 5,
            }}
          >
            <StepperComponent
              activeStep={0}
              steps={["Email verification", "Phone no ", "Password "]}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <TextField
                label="Name"
                variant="outlined"
                sx={{
                  width: "80%",
                  height: "40px",
                  borderRadius: "10px",
                  alignSelf: "center",
                }}
                value={name}
                onChange={(e: any) => setName(e.target.value)}
                size="small"
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
              />
              <TextField
                label="Email"
                variant="outlined"
                sx={{
                  width: "80%",
                  height: "40px",
                  alignSelf: "center",
                  // marginBottom: "10px"
                }}
                value={email}
                onChange={handleEmailChange}
                error={!isValidemail}
                helperText={
                  !isValidemail && (
                    <Typography
                      fontSize={10}
                      sx={{ marginLeft: "-10px", marginTop: "-4px" }}
                    >
                      Invalid email address
                    </Typography>
                  )
                }
                size="small"
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
            <Box>
              <Button
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  border: "2px solid #4470AD",
                  borderRadius: "10px",
                  color: "white",
                  backgroundColor: "#0E75A1",
                  textTransform: "none",
                  ":hover": {
                    backgroundColor: "#0E75A1",
                  },
                }}
                onClick={sendOTP}
              >
                Next
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "baseline",
                  gap: 0.1,
                  marginTop: "10px",
                }}
              >
                <Typography sx={{ fontSize: "11px", color: "#A1A1A1" }}>
                  Already have an account?
                </Typography>
                <Button
                  onClick={() => navigate("/")}
                  style={{
                    backgroundColor: "transparent",
                    width: 50,
                    padding: 0,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#0E75A1",
                      fontSize: "13px",
                      textDecoration: "none",
                      textTransform: "none",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Log In
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}

        {stepOne === false && stepTwo === true && stepThree === false ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 5,
            }}
          >
            <StepperComponent
              activeStep={1}
              steps={["Email verification", "Phone no", "Password "]}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Button
                  sx={{
                    alignSelf: "flex-start",
                    marginLeft: 5,
                  }}
                  onClick={() => {
                    setStpeOne(true);
                    setStepTwo(false);
                    setStepThree(false);
                  }}
                >
                  Go Back
                </Button>
              </Box>
              <TextField
                label="Mobile"
                variant="outlined"
                sx={{
                  width: "80%",
                  height: "40px",
                  alignSelf: "center",
                }}
                value={number}
                onChange={handleMobileChange}
                size="small"
                type="text"
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
                inputProps={{
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
              />
              <Box>
                <Button
                  sx={{
                    width: "80%",
                    alignSelf: "center",
                    border: "2px solid #4470AD",
                    borderRadius: "10px",
                    color: "white",
                    backgroundColor: "#0E75A1",
                    textTransform: "none",
                    ":hover": {
                      backgroundColor: "#0E75A1",
                    },
                  }}
                  onClick={sendMobileOtp}
                >
                  Next
                </Button>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "baseline",
                    gap: 0.1,
                    marginTop: "10px",
                  }}
                >
                  <Typography sx={{ fontSize: "11px", color: "#A1A1A1" }}>
                    Already have an account?
                  </Typography>
                  <Button
                    onClick={() => navigate("/")}
                    style={{
                      backgroundColor: "transparent",
                      width: 50,
                      padding: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#0E75A1",
                        fontSize: "13px",
                        textDecoration: "none",
                        textTransform: "none",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Log In
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}

        {stepOne === false && stepTwo === false && stepThree === true ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 3,
            }}
          >
            <StepperComponent
              activeStep={2}
              steps={["Email verification", "Phone no ", "Password "]}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                  justifyContent: "flex-start",
                  width: "100%",
                }}
              >
                <Button
                  sx={{
                    alignSelf: "flex-start",
                    marginLeft: 5,
                  }}
                  onClick={() => {
                    setStpeOne(false);
                    setStepTwo(true);
                    setStepThree(false);
                  }}
                >
                  Go Back
                </Button>
              </Box>
              <TextField
                label="Password"
                variant="outlined"
                sx={{
                  width: "80%",
                  height: "30px",
                  alignSelf: "center",
                }}
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                type={visible ? "text" : "password"}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setVisible(!visible)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {visible ? (
                          <VisibilityIcon
                            style={{ width: "17px", height: "17px" }}
                          />
                        ) : (
                          <VisibilityOffIcon
                            style={{
                              width: "17px",
                              height: "17px",
                              color: "#b8b6b6",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                    borderRadius: "5px",
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                sx={{
                  width: "80%",
                  height: "30px",
                  marginTop: 1.5,
                  alignSelf: "center",
                }}
                value={confirmPassword}
                onChange={(e: any) => setconfirmPassword(e.target.value)}
                type={confirmPasswordVisible ? "text" : "password"}
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setConfirmPasswordVisible(!confirmPasswordVisible)
                        }
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {confirmPasswordVisible ? (
                          <VisibilityIcon
                            style={{ width: "17px", height: "17px" }}
                          />
                        ) : (
                          <VisibilityOffIcon
                            style={{
                              width: "17px",
                              height: "17px",
                              color: "#b8b6b6",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
              />
            </Box>
            <Box>
              <Button
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  border: "2px solid #4470AD",
                  borderRadius: "10px",
                  color: "white",
                  backgroundColor: "#0E75A1",
                  textTransform: "none",
                  ":hover": {
                    backgroundColor: "#0E75A1",
                  },
                }}
                onClick={handleClick}
              >
                Next
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "baseline",
                  gap: 0.1,
                  marginTop: "10px",
                }}
              >
                <Typography sx={{ fontSize: "11px", color: "#A1A1A1" }}>
                  Already have an account?
                </Typography>
                <Button
                  onClick={() => navigate("/")}
                  style={{
                    backgroundColor: "transparent",
                    width: 50,
                    padding: 0,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#0E75A1",
                      fontSize: "13px",
                      textDecoration: "none",
                      textTransform: "none",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Log In
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}

        <Modal
          open={steponeModal}
          onClose={() => setStepOneModal(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          style={{ outline: "none" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                width: "400px",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                sx={{ fontSize: "20px", color: "#000000", fontWeight: "500" }}
              >
                OTP Verification
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  backgroundColor: "#F4FFF7",
                  paddingX: "40px",
                  paddingY: "20px",
                }}
              >
                <Typography
                  sx={{ color: "#2C6F71", fontSize: 12, textAlign: "center" }}
                >
                  We’ve sent a verification code to your email-{email}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: "#CBCBCB",
                  fontSize: 12,
                  display: "flex",
                  gap: 0.5,
                }}
              >
                Want to change email?{" "}
                <Typography
                  sx={{ fontSize: 13, color: "#0470EE", cursor: "pointer" }}
                  onClick={() => setStepOneModal(false)}
                >
                  edit
                </Typography>
              </Typography>

              <TextField
                label="email OTP"
                value={emailOtp}
                variant="outlined"
                inputProps={{
                  maxLength: 6,
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
                onChange={(e: any) => setEmailOtp(e.target.value)}
                sx={{
                  width: "80%",
                  height: "40px",
                  // marginTop: "-10px",
                  // visibility: showOtpSection ? "visible" : "hidden",
                  marginBottom: "10px",
                }}
                size="small"
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
              />

              <Box sx={{ alignSelf: "flex-end", marginRight: "50px" }}>
                {emailTime <= 0 ? (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      textDecorationLine: "none",
                      color: "#4470AD",
                      "&:hover": {
                        textDecorationLine: "underline",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => sendOTP()}
                  >
                    Resend OTP
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Typography
                      style={{
                        color: emailTime < 60 ? "red" : "#4470AD",
                        fontSize: "12px",
                      }}
                    >
                      {Math.floor(emailTime / 60) < 10
                        ? `0${Math.floor(emailTime / 60)}`
                        : Math.floor(emailTime / 60)}
                      :
                      {emailTime % 60 < 10
                        ? `0${emailTime % 60}`
                        : emailTime % 60}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Button
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  border: "2px solid #4470AD",
                  borderRadius: "10px",
                  color: "white",
                  backgroundColor: "#0E75A1",
                  textTransform: "none",
                  ":hover": {
                    backgroundColor: "#0E75A1",
                  },
                }}
                onClick={verifyEmailOtp}
              >
                Verify
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={steptwoModal}
          onClose={() => setStepTwoModal(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          style={{ outline: "none" }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 2,
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                width: "400px",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                sx={{ fontSize: "20px", color: "#000000", fontWeight: "500" }}
              >
                OTP Verification
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  backgroundColor: "#F4FFF7",
                  paddingX: "40px",
                  paddingY: "20px",
                }}
              >
                <Typography
                  sx={{ color: "#2C6F71", fontSize: 12, textAlign: "center" }}
                >
                  We’ve sent a verification code to your mobile number-{number}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#CBCBCB",
                  fontSize: 12,
                  display: "flex",
                  gap: 0.5,
                }}
              >
                Want to change mobile number?{" "}
                <Typography
                  sx={{ fontSize: 13, color: "#0470EE", cursor: "pointer" }}
                  onClick={() => setStepTwoModal(false)}
                >
                  edit
                </Typography>
              </Typography>

              <TextField
                label="mobile OTP"
                value={mobileOtp}
                variant="outlined"
                inputProps={{
                  maxLength: 6,
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
                onChange={(e: any) => setMobileOtp(e.target.value)}
                sx={{
                  width: "80%",
                  height: "25px",
                  // marginTop: "-10px",
                  // visibility: showMobileOtp ? "visible" : "hidden",
                  marginBottom: "10px",
                }}
                size="small"
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
              />

              <Box sx={{ alignSelf: "flex-end", marginRight: "50px" }}>
                {mobileTime <= 0 ? (
                  <Typography
                    sx={{
                      fontSize: "13px",
                      textDecorationLine: "none",
                      color: "#4470AD",
                      "&:hover": {
                        textDecorationLine: "underline",
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => sendMobileOtp()}
                  >
                    Resend OTP
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Typography
                      style={{
                        color: mobileTime < 60 ? "red" : "#4470AD",
                        fontSize: "12px",
                      }}
                    >
                      {Math.floor(mobileTime / 60) < 10
                        ? `0${Math.floor(mobileTime / 60)}`
                        : Math.floor(mobileTime / 60)}
                      :
                      {mobileTime % 60 < 10
                        ? `0${mobileTime % 60}`
                        : mobileTime % 60}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Button
                sx={{
                  width: "80%",
                  alignSelf: "center",
                  border: "2px solid #4470AD",
                  borderRadius: "10px",
                  color: "white",
                  backgroundColor: "#0E75A1",
                  textTransform: "none",
                  ":hover": {
                    backgroundColor: "#0E75A1",
                  },
                }}
                onClick={verifyMobileOtp}
              >
                Verify
              </Button>
            </Box>
          </Box>
        </Modal>

        <ToastContainer style={{ width: "auto" }} />
      </Box>
      <Footer screen="signup" />
    </Box>
  );
};

export default Signup;
