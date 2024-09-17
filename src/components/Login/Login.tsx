import { useContext, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Box, Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Accosync from "../../assets/accosynclogo2.png";
import BackgroungImageSignUp from "../../assets/background.png";
import { ipProxy } from "../../../core/ipConfig";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import "../Navbar/Navbar.css";
import LoginStepper from "../LoginStepper/LoginStepper";
import StepperComponent from "../Stepper/Stepper";
const { ipcRenderer }: any = window;
import { UserContext } from "../../Store/Context/UserContext";
import { Mobile_Otp_Verification } from "../../../core/appConfig";
import { decryptJSON } from "../../../electron/main/decryptJson";

import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "@/Store/Context/AuthContext";
import Footer from "../Footer/Footer";

const Login = () => {
  const userCTX = useContext(UserContext);
  const authCtx = useContext(AuthContext);

  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [mobilenumber, setMobilenumber] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileOtp, setMobileOtp] = useState("");
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [OTP, setOTP] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [time, setTime] = useState(60);

  const [stepOne, setStepOne] = useState(true);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepTwoModal, setStepTwoModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otp, setOtp]: any = useState();
  const [mobileTime, setMobileTime] = useState(60);

  // function to handle forgotpassword
  const handleForgetPassword = async () => {
    try {
      const response = await axios.put(`${ipProxy}/user/forgotpassword`, {
        phoneNumber: mobilenumber,
        password: newpassword,
      });

      if (response.data.msg === "Password update successfully") {
        setOpenModal(false);
        setNewpassword("");
        setMobilenumber("");
        setMobileOtp("");
        setShowNewPassword(false);
        setShowOtpSection(false);
        Updatedpassword();
      }
    } catch (error: any) {
      console.error(error, "error");
      if (error.response.status === 403) {
        ErrorMobile();
      }
    }
  };

  const startTimer2 = () => {
    const interval = setInterval(() => {
      setMobileTime((prevTime) => {
        const current = prevTime - 1;
        if (current <= 0) {
          clearInterval(interval);
          // setOtpvisible(false);
          setOtp("");
        }
        return current;
      });
    }, 1000);
  };

  // function to login
  const handleClick = async () => {
    if (email === "") {
      emptyEmailField();
    } else if (password === "") {
      passwordFieldEmpty();
    } else {
      try {
        const res = await axios.get(
          `${ipProxy}/user/isemailregistered?email=${email
            .toLowerCase()
            .trim()}`
        );
        if (res.data.isExist) {
          const response = await axios.post(`${ipProxy}/user/verifyemail`, {
            email: email.toLowerCase().trim(),
            password: password,
          });
          if (response?.data?.auth) {
            successEmail();
            localStorage.setItem("email", email);
            setStepOne(false);
            setStepTwo(true);
          }
        } else {
          unregisteredemail();
          setEmail("");
          setPassword("");
        }
      } catch (error: any) {
        console.error(error);
        if (error.response.data.message === "Authentication failed") {
          setIsValidEmail(false);
          ErrorEmail();
          setEmail("");
        } else if (error.response.data.message === "Incorrect Password.") {
          WrongPassword();
          setPassword("");
          setShowNewPassword(false);
          setShowOtpSection(false);
        }
      }
    }
  };
  const restart = async () => {
    try {
      await ipcRenderer.appRestart();
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleSubmitClick = async () => {
    const deviceInfo = await ipcRenderer.getUniqueMachineId();
    const machineId = await ipcRenderer.getMachineId();
    try {
      const response = await axios.post(`${ipProxy}/user/connectorlogin`, {
        email: email,
        phoneNumber: phone,
        machineId: machineId,
        deviceInfo: {
          deviceName: deviceInfo.deviceName,
          deviceModel: deviceInfo.deviceModel,
        },
      });
      if (response?.data?.status) {
        localStorage.setItem("token", response.data.token);
        const userDataForCTX = await axios.get(
          `${ipProxy}/user/fetchuserconnector`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const secretKey = "superSecretKey";
        const decryptedJSON = decryptJSON(userDataForCTX.data, secretKey);
        if (decryptedJSON?.status) {
          userCTX.saveUserDetails(decryptedJSON?.data?.userData);
          userCTX.saveCompanyDetails(decryptedJSON?.data?.companiesInfo);
          const machineId = await ipcRenderer.getMachineId();
          // console.log(decryptedJSON?.data?.userData?.tallyLicenses, 'ssss');
          let currentConfigFromCTX;
          if (decryptedJSON?.data?.userData?.tallyLicenses?.length > 0) {
            currentConfigFromCTX =
              await decryptedJSON?.data?.userData?.tallyLicenses?.[0].connectors.find(
                (obj: any) => obj.machineId === machineId
              );
          }
          // const currentConfigFromCTX = await decryptedJSON?.data?.userData?.tallyLicenses?.[0].connectors.find((obj: any) => obj.machineId === machineId)
          const portFromMachineInfo = currentConfigFromCTX?.config?.tallyPort;
          // console.log(portFromMachineInfo, "port in login");
          console.log(currentConfigFromCTX, "ssss");
          const host = localStorage.getItem("host");
          const port = localStorage.getItem("port");
          const caseId = localStorage.getItem("caseId");
          host === null
            ? localStorage.setItem("host", "localhost")
            : localStorage.setItem("host", host);
          port === null
            ? localStorage.setItem("port", portFromMachineInfo || "9000")
            : localStorage.setItem("port", port);
          caseId === null
            ? localStorage.setItem(
                "caseId",
                currentConfigFromCTX?.config?.syncConfigId || "444"
              )
            : localStorage.setItem("caseId", caseId);
          // localStorage.setItem("caseId", "444");
          // userCTX.saveConnectorDetails(userDataForCTX?.data?.user?.connectors);
          // userCTX.saveCompanyDetails(userDataForCTX?.data?.companiesInfo);
          successPhone();
          // restart();
          // navigate("/companylist");
          authCtx.updateTokenValidity(true);
        }

        // setTimeout(() => {
        //   localStorage.setItem("token", response.data.token);
        //   userCTX.saveUserDetails(response?.data?.user);
        //   userCTX.saveConnectorDetails(response?.data?.user?.connectors);
        //   userCTX.saveCompanyDetails(response?.data?.companiesInfo);
        // }, 2000);
        // const machineId = await ipcRenderer.invoke("get-machineid");
        // const headers = {
        //   Authorization: `Bearer ${response.data.token}`,
        // };
        // const currentMachineConfig = await fetchCurrentMachineConfig(
        //   response?.data?.user
        // );
        // if (!currentMachineConfig) {
        //   const tallyConfigResponse = await axios.put(
        //     `${ipProxy}/companiesconfig/createconnectorconfig`,
        //     {
        //       machineId: machineId,
        //       email: response?.data?.user?.email,
        //       config: {
        //         TallyHost: "localhost",
        //         TallyPort: "9000",
        //         syncInterval: 10,
        //       },
        //     },
        //     { headers }
        //   );
        //   if (tallyConfigResponse?.data?.status) {
        //     navigate("/companylist");
        //     console.log("navigate to the companylist");
        //     setTimeout(() => {
        //       reload();
        //     }, 2000);
        //   }
        // } else {
        //   navigate("/companylist");
        // }
      }
    } catch (error: any) {
      console.log(error, "from the verify phone");
      if (error?.response?.status === 401) {
        ErrorPhone();
        setPhone("");
      }
    }
  };

  const sendPhoneNumber = async () => {
    if (Mobile_Otp_Verification) {
      if (phone === "") {
        phoneFieldEmpty();
      } else {
        try {
          const res = await axios.get(
            `${ipProxy}/user/isnumberregistered?phoneNumber=${phone}`
          );
          // console.log(res, "res is exist ");
          if (res?.data?.isExist) {
            const response = await axios.post(
              `${ipProxy}/user/mobileotp`,
              null,
              {
                params: {
                  phoneNumber: `+91${phone}`,
                },
              }
            );
            const secretKey = "superSecretKey";
            const decriptedData = decryptJSON(response.data, secretKey);
            console.log(decriptedData, "dec dat");
            if (decriptedData.data !== "") {
              setStepTwoModal(true);
              setOtp(decriptedData?.data);
              setMobileTime(60);
              startTimer2();
            }
            // if (response?.data?.otp !== "") {
            //   setStepTwoModal(true);
            //   setOtp(response?.data?.otp);
            //   setMobileTime(60);
            //   startTimer2();
            // }
          }
        } catch (error) {
          console.log(error, "error");
        }
      }
    } else {
      if (phone === "") {
        phoneFieldEmpty();
      } else {
        try {
          const isValidPhoneNumber = /^[0-9]{10}$/.test(phone);
          if (isValidPhoneNumber) {
            handleSubmitClick();
            return;
          } else {
            ErrorPhone();
          }
        } catch (error) {
          console.log(error, "error");
        }
      }
    }
    // if (Mobile_Otp_Verification) {
    //   if (phone === "") {
    //     phoneFieldEmpty();
    //   } else {
    //     try {
    //       const res = await axios.get(
    //         `${ipProxy}//user/isnumberregistered?phoneNumber=${phone}`
    //       );
    //     } catch (error) {
    //       console.log(error, "error");
    //     }
    //     // const res = await axios.get(
    //     //   `${ipProxy}/user/isnumberregistered?phoneNumber=${phone}`
    //     // );
    //     // try {
    //     //   const isValidPhoneNumber = /^[0-9]{10}$/.test(phone);
    //     //   if (!isValidPhoneNumber && res.data.isExist === false) {
    //     //     ErrorPhone();
    //     //     return;
    //     //   } else {
    //     //     successPhone();
    //     //     setStepTwoModal(true);

    //     //     // phone && navigate("/otp-verification", { state: { phone } });
    //     //   }
    //     // } catch (error) {
    //     //   console.log(error);
    //     // }
    //   }
    // } else {
    //   if (phone === "") {
    //     phoneFieldEmpty();
    //   } else {
    //     try {
    //       const isValidPhoneNumber = /^[0-9]{10}$/.test(phone);
    //       console.log(
    //         isValidPhoneNumber,
    //         "isValidPhoneNumber from else condition"
    //       );
    //       if (isValidPhoneNumber) {
    //         handleSubmitClick();
    //         return;
    //       } else {
    //         ErrorPhone();
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // }
  };
  const verifymobileotp = async () => {
    if (phoneOtp === otp && phoneOtp !== "") {
      setStepTwoModal(false);
      // navigate('/companylist');
      handleSubmitClick();
    } else {
      console.log("otp not verified");
    }
  };
  const sendMobileOtp = async () => {
    try {
      const response = await axios.post(`${ipProxy}/user/mobileotp`, null, {
        params: {
          phoneNumber: `+91${phone}`,
        },
      });
      const secretKey = "superSecretKey";
      const decriptedData = decryptJSON(response.data, secretKey);
      if (decriptedData.data !== "") {
        setOtp(decriptedData?.data);
      }
      // if (response?.data?.otp !== "") {
      //   setOtp(response?.data?.otp);
      // }
    } catch (error) {
      console.log(error, "error");
    }
  };

  // function to check if email is valid or not
  const validateEmail = (email: any) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: any) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValidEmail(newEmail === "" || validateEmail(newEmail));
  };
  // function to start timer after get the otp for resend otp for email
  const startTimer = () => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
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

  // function to send otp for email
  const sendOtp = async () => {
    if (mobilenumber === "") {
      mobileNumberEmpty();
    } else if (mobilenumber.length < 10) {
      mobileNumberlessthan10();
    } else {
      try {
        const res = await axios.get(
          `${ipProxy}/user/isnumberregistered?phoneNumber=${mobilenumber}`
        );
        if (res.data.isExist) {
          const response = await axios.post(`${ipProxy}/user/mobileotp`, null, {
            params: {
              phoneNumber: `+91${mobilenumber}`,
            },
          });
          const secretKey = "superSecretKey";
          const decriptedData = decryptJSON(response.data, secretKey);
          setOTP(decriptedData?.data);
          setTime(60);
          startTimer();
          setShowOtpSection(true);
        } else {
          ErrorMobile();
          setMobilenumber("");
        }
      } catch (error) {
        console.log(error, "error ");
      }
    }
  };

  // function to verify otp for email
  const verifyOTP = async () => {
    if (mobileOtp !== "" && mobileOtp === OTP) {
      setShowNewPassword(true);
    }
  };
  // for email part
  const handlePhoneChange = (e: any) => {
    const digit = e.target.value;
    const validateDigit: any = /^\d{0,10}$/;
    if (validateDigit.test(digit)) {
      setMobilenumber(digit);
    }
  };
  // for phone part
  const handlePhoneChange2 = (e: any) => {
    const digit = e.target.value;
    const validateDigit: any = /^\d{0,10}$/;
    if (validateDigit.test(digit)) {
      setPhone(digit);
    }
  };

  const handleOTPChange = (e: any) => {
    const digit = e.target.value;
    const validateDigit: any = /^\d{0,10}$/;
    if (validateDigit.test(digit)) {
      setMobileOtp(digit);
    }
  };

  const openForgotPasswordModal = () => {
    setOpenModal(true);
  };

  const closeForgotPasswordModal = () => {
    setOpenModal(false);
  };

  // these are all the function to show error or success notification
  const successEmail = () => {
    toast.success("Email and password verified successfully", {
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
  const ErrorEmail = () => {
    toast.error("Invalid email, please provide a registered email", {
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
  const ErrorMobile = () => {
    toast.error(
      "Invalid mobile number, please provide a registered mobile number",
      {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };
  const WrongPassword = () => {
    toast.error("Password is incorrect, please provide the correct password", {
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
  const Updatedpassword = () => {
    toast.success("Password updated successfully", {
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
    toast.error("Eamil is required", {
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
  const passwordFieldEmpty = () => {
    toast.error("Password is required", {
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
  const unregisteredemail = () => {
    toast.error("This email is not registered. Please sign up", {
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
  const mobileNumberEmpty = () => {
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
  const mobileNumberlessthan10 = () => {
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
  const phoneFieldEmpty = () => {
    toast.error("Phone is required", {
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
  const ErrorPhone = () => {
    toast.error(
      "🦄 mobile number can't verified provide registered mobile number",
      {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  };
  const successPhone = () => {
    toast.success("🦄 mobile number varified successfully", {
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
        backgroundColor: "#FAFBFD",
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
        Login
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
        {stepOne === true && stepTwo === false ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 4,
            }}
          >
            <StepperComponent
              activeStep={0}
              steps={[`Email verification`, "Phone number "]}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              <TextField
                variant="outlined"
                label="Email Address"
                placeholder=""
                size="small"
                value={email}
                onChange={handleEmailChange}
                error={!isValidEmail}
                helperText={
                  !isValidEmail && (
                    <Typography
                      fontSize={10}
                      sx={{ marginLeft: "-10px", marginTop: "-4px" }}
                    >
                      Invalid email address
                    </Typography>
                  )
                }
                inputProps={{
                  style: {
                    fontSize: "15px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                  onKeyPress: (e) => {
                    if (e.key === "Enter" && isValidEmail && password) {
                      handleClick();
                    }
                  },
                }}
                sx={{
                  width: "80%",
                  height: "20px",
                  alignSelf: "center",
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
              />
              <TextField
                label="Password"
                variant="outlined"
                size="small"
                placeholder=""
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  width: "80%",
                  height: "40px",
                  alignSelf: "center",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setVisible(!visible)}
                        edge="end"
                        aria-label="toggle password visibility"
                        tabIndex={-1}
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
                    fontSize: "15px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                  onKeyPress: (e) => {
                    if (e.key === "Enter" && isValidEmail && password) {
                      handleClick();
                    }
                  },
                }}
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
                  },
                }}
              />
              <Typography
                onClick={openForgotPasswordModal}
                sx={{
                  marginRight: "50px",
                  marginTop: "-20px",
                  fontSize: "11px",
                  alignSelf: "flex-end",
                  color: "#4470AD",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                Forgot Password
              </Typography>
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
                  Don't have an account?
                </Typography>
                <Button
                  onClick={() => navigate("/signup")}
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
                    Sign Up
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}

        {stepOne === false && stepTwo === true ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              gap: 5,
            }}
          >
            <ArrowBackIcon
              sx={{ color: "#0E75A1", outline: "none" }}
              onClick={() => {
                setStepOne(true);
                setStepTwo(false);
              }}
              tabIndex={-1}
            />
            <StepperComponent
              activeStep={1}
              steps={["Email", "Phone number"]}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
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
                    setStepOne(true);
                    setStepTwo(false);
                  }}
                  tabIndex={-1}
                >
                  Go Back
                </Button>
              </Box> */}
              <TextField
                label="Phone Number"
                variant="outlined"
                value={phone}
                onChange={handlePhoneChange2}
                inputProps={{
                  maxLength: 10,
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                  onKeyPress: (e) => {
                    if (e.key === "Enter" && phone !== "") {
                      sendPhoneNumber();
                    }
                  },
                }}
                sx={{
                  width: "80%",
                  height: "40px",
                  alignSelf: "center",
                }}
                size="small"
                InputLabelProps={{
                  style: {
                    fontSize: "13px",
                    color: "#b8b6b6",
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
                  onClick={sendPhoneNumber}
                >
                  Login
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
                    Don't have an account?
                  </Typography>
                  <Button
                    onClick={() => navigate("/signup")}
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
                      Sign Up
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}

        <Modal
          open={stepTwoModal}
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
                  We’ve sent a verification code to your mobile number-{phone}
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
                value={phoneOtp}
                variant="outlined"
                inputProps={{
                  maxLength: 6,
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
                onChange={(e: any) => setPhoneOtp(e.target.value)}
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
                onClick={verifymobileotp}
              >
                Verify
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={openModal}
          onClose={closeForgotPasswordModal}
          style={{ outline: "none" }}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 350,
              height: "auto",
              backgroundColor: "white",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 10,
              borderRadius: 5,
            }}
          >
            {showNewPassword === false ? (
              <Box>
                {showOtpSection ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Typography>
                      OTP has been send to your registered mobile number.
                    </Typography>
                    <TextField
                      label="OTP"
                      value={mobileOtp}
                      variant="outlined"
                      inputProps={{ maxLength: 6 }}
                      onChange={handleOTPChange}
                      sx={{
                        width: "100%",
                        height: "40px",
                      }}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      disabled={mobileOtp.length < 6}
                      sx={{
                        borderRadius: "5px",
                        backgroundColor: "#0E75A1",
                        ":hover": {
                          backgroundColor: "#0E75A1",
                        },
                      }}
                      onClick={() => verifyOTP()}
                    >
                      Verify
                    </Button>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    ></Box>
                    {time <= 0 ? (
                      <Typography
                        style={{
                          textDecorationLine: "underline",
                        }}
                        onClick={() => sendOtp()}
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
                          style={{ color: time < 60 ? "red" : "black" }}
                        >
                          Resend in:{" "}
                        </Typography>
                        <Typography
                          style={{ color: time < 60 ? "red" : "black" }}
                        >
                          {Math.floor(time / 60) < 10
                            ? `0${Math.floor(time / 60)}`
                            : Math.floor(time / 60)}
                          :{time % 60 < 10 ? `0${time % 60}` : time % 60}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Typography>
                      Enter your registered mobile number.
                    </Typography>
                    <TextField
                      placeholder="Enter your mobile number"
                      label="Mobile Number"
                      variant="outlined"
                      value={mobilenumber}
                      inputProps={{ maxLength: 10 }}
                      onChange={handlePhoneChange}
                      sx={{
                        width: "100%",
                        height: "40px",
                      }}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      disabled={mobilenumber.length < 10}
                      sx={{
                        borderRadius: "5px",
                        backgroundColor: "#0E75A1",
                        width: "100%",
                        ":hover": {
                          backgroundColor: "#0E75A1",
                        },
                      }}
                      onClick={() => sendOtp()}
                    >
                      SEND OTP
                    </Button>
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography>Enter new password.</Typography>
                <TextField
                  label="New Password"
                  variant="outlined"
                  placeholder="Enter new password"
                  value={newpassword}
                  onChange={(e) => setNewpassword(e.target.value)}
                  sx={{
                    width: "100%",
                    height: "40px",
                  }}
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleForgetPassword}
                  disabled={OTP === "" || mobileOtp === ""}
                  sx={{
                    backgroundColor: "#4470AD",
                    width: "100%",
                    alignSelf: "flex-end",
                    ":hover": {
                      backgroundColor: "#4470AD",
                    },
                  }}
                >
                  submit
                </Button>
              </Box>
            )}
          </div>
        </Modal>

        <ToastContainer style={{ width: "auto" }} />
      </Box>
      <Footer screen="login" />
    </Box>
  );
};

export default Login;
