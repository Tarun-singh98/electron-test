import { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ipProxy } from "../../../core/ipConfig";
const { ipcRenderer }: any = window;
import { UserContext } from "@/Store/Context/UserContext";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userCTX: any = useContext(UserContext);
  const token = localStorage.getItem("token");
  const [host, setHost] = useState("");
  const [port, setPort]: any = useState("");
  const [selectedSyncInterval, setSelectedSyncInterval] = useState(10);
  const [reportSyncInterval, setReportSyncInterval] = useState(3);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = React.useState("false");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    updateContext();
    fetchCurrentMachineConfig();
    updatePrePopulated();
  }, []);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, []);
  // function for change password
  const changePassword = async () => {
    if (oldPassword === "") {
      oldpasswordfieldempty();
    } else if (newPassword === "") {
      newPasswordFieldempty();
    } else if (confirmPassword === "") {
      confirmPasswordFieldempty();
    } else if (
      newPassword !== "" &&
      confirmPassword !== "" &&
      newPassword !== confirmPassword
    ) {
      passworddidnotmatch();
    } else {
      try {
        const response: any = await axios.put(
          `${ipProxy}/user/changepasswordconnector`,
          {
            password: newPassword,
            confirmPassword: confirmPassword,
            oldPassword: oldPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status) {
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowResetPassword(false);
          successResetPassword();
        }
      } catch (error: any) {
        console.log("Error -> ,", error);
        toast.error(error.response.data.message, {
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
    }
  };

  const reload = async () => {
    try {
      await ipcRenderer.appRestart();
    } catch (error) {
      console.log(error, "error");
    }
  };
  // function to be called when you click on the save button
  const handleSave = async () => {
    // window.alert(
    //   "If sync process is running on background than sync process will restart from beginning"
    // );
    handleClose();
    const machineId = await ipcRenderer.getMachineId();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.put(
        `${ipProxy}/companiesconfig/createconnectorconfig`,
        {
          machineId: machineId,
          email: localStorage.getItem("email"),
          config: {
            tallyHost: host || "localhost",
            tallyPort: port,
            syncInterval: selectedSyncInterval,
            reportSyncInterval: reportSyncInterval,
            notificationEnabled: value === "true" ? true : false
          },
        },
        { headers }
      );
      updateContext();
      success();
      localStorage.setItem("port", port);
      localStorage.setItem("interval", selectedSyncInterval.toString());
      reload();
    } catch (error) {
      console.log(error, "Error -> ");
      err();
    }
  };
  // function to update the context
  const updateContext = async () => {
    try {
      if (token) {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`${ipProxy}/user/fetchuserconnector`, {
          headers,
        });
        // console.log(response, 'response from settings page');
        userCTX.saveUserDetails(response?.data?.data?.userData);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // function to get the users config
  const fetchCurrentMachineConfig = async () => {
    const machineId = await ipcRenderer.getMachineId();
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const currentMachineConfig = userCTX.userDetails?.tallyLicenses?.find(
      (item: any) => item.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
    );
    const connectors = currentMachineConfig?.connectors;
    const currentMachineConfig2 = connectors?.find(
      (item: any) => item.machineId === machineId
    );
    setSelectedSyncInterval(
      currentMachineConfig2?.config?.syncInterval ||
      Number(localStorage.getItem("interval")) ||
      10
    );
    setValue(currentMachineConfig2?.config?.notificationEnabled === true ? "true" : "false")
    // console.log(currentMachineConfig2, 'ssss')
    return currentMachineConfig2?.config;
  };
  // console.log(value, 'value')
  const updatePrePopulated = async () => {
    const currentMachineConfig = await fetchCurrentMachineConfig();
    setHost(
      currentMachineConfig?.tallyHost ||
      localStorage.getItem("host") ||
      "localhost"
    );
    setPort(
      currentMachineConfig?.tallyPort || localStorage.getItem("port") || 9000
    );
  };
  // helper functions
  const success = () => {
    toast.success("Saved settings config successfully", {
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
  const err = () => {
    toast.error("There is some error ", {
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
  const oldpasswordfieldempty = () => {
    toast.error("oldpassword is required", {
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
  const newPasswordFieldempty = () => {
    toast.error("new password is required", {
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
  const confirmPasswordFieldempty = () => {
    toast.error("confirm password is required", {
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
  const passworddidnotmatch = () => {
    toast.error("new and confirm password didn't match", {
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
  const successResetPassword = () => {
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
  const failedResetPassword = () => {
    toast.error("something went wrong!", {
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
  useEffect(() => {
    setPort(localStorage.getItem("port"));
  }, []);
  const handleinputchange = (event: any) => {
    setPort(event.target.value);
  };

  const handleIntervalChange = (event: any) => {
    setSelectedSyncInterval(event.target.value);
    // window.alert(
    //   "Inorder to save sync process sync intrval application should be restart."
    // );
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
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%", // Center loader vertically
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            backgroundColor: "#FAFBFD",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              width: "60%",
              gap: 3,
              // marginTop: 5,
              // border: "1px solid #4470AD",
              borderRadius: "6px",
              paddingX: "50px",
              paddingY: "40px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Typography
                sx={{ color: "#333333", fontSize: "15px", fontWeight: 500 }}
              >
                Tally Host:
              </Typography>
              <TextField
                placeholder="Enter Tally Host"
                value={host || "localhost"}
                onChange={(e) => setHost(e.target.value)}
                disabled
                variant="standard"
                fullWidth
                style={{
                  width: "100%",
                }}
                InputProps={{
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <Typography
                sx={{ color: "#333333", fontSize: "15px", fontWeight: 500 }}
              >
                Tally Port:
              </Typography>
              <TextField
                placeholder="Enter your port"
                value={port}
                onChange={(e) => handleinputchange(e)}
                variant="standard"
                fullWidth
                InputProps={{
                  style: {
                    fontSize: "14px",
                    color: "#555555",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{ color: "#333333", fontSize: "15px", fontWeight: 500 }}
                  >
                    Sync Frequency
                  </Typography>
                  <Typography
                    sx={{ color: "#333333", fontSize: "15px", fontWeight: 500 }}
                  >
                    (In Minutes):
                  </Typography>
                </Box>
                <Select
                  value={selectedSyncInterval}
                  onChange={handleIntervalChange}
                  variant="standard"
                  style={{
                    width: "40%",
                    color: "#555555",
                    fontSize: "15px",
                  }}
                >
                  <MenuItem value={5} sx={{ fontSize: "14" }}>
                    5
                  </MenuItem>
                  <MenuItem value={10} sx={{ fontSize: "14" }}>
                    10
                  </MenuItem>
                  <MenuItem value={15} sx={{ fontSize: "14" }}>
                    15
                  </MenuItem>
                  <MenuItem value={20} sx={{ fontSize: "14px" }}>
                    20
                  </MenuItem>
                  <MenuItem value={25} sx={{ fontSize: "14px" }}>
                    25
                  </MenuItem>
                  <MenuItem value={30} sx={{ fontSize: "14px" }}>
                    30
                  </MenuItem>
                </Select>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography
                    sx={{ color: "#333333", fontSize: "15px", fontWeight: 500 }}
                  >
                    Sync reports
                  </Typography>
                  <Typography
                    sx={{ color: "#333333", fontSize: "15px", fontWeight: 500 }}
                  >
                    (In Hours):
                  </Typography>
                </Box>

                <Select
                  value={reportSyncInterval}
                  onChange={(event: any) =>
                    setReportSyncInterval(event.target.value)
                  }
                  variant="standard"
                  style={{
                    width: "50%",
                    color: "#555555",
                    fontSize: "15px",
                  }}
                >
                  <MenuItem value={3} sx={{ fontSize: "14" }}>
                    3
                  </MenuItem>
                  <MenuItem value={6} sx={{ fontSize: "14" }}>
                    6
                  </MenuItem>
                  <MenuItem value={9} sx={{ fontSize: "14" }}>
                    9
                  </MenuItem>
                  <MenuItem value={12} sx={{ fontSize: "14px" }}>
                    12
                  </MenuItem>
                  <MenuItem value={24} sx={{ fontSize: "14px" }}>
                    24
                  </MenuItem>
                </Select>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography
                onClick={() => navigate("/additionalsettings")}
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  cursor: "pointer",
                  color: "#4470AD",
                  marginTop: 15,
                }}
              >
                Advance settings
              </Typography>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FormLabel
                  id="demo-controlled-radio-buttons-group"
                  sx={{ fontSize: "15px", marginRight: "8px", fontWeight: "600", marginTop: "4px" }} // Reduce the label size and add spacing
                >
                  Send notification :
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio size="small" />}
                    label={<span style={{ fontSize: "12px" }}>Yes</span>}
                    sx={{ ".MuiFormControlLabel-label": { fontSize: "10px" }, marginTop: "4px" }}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio size="small" />}
                    label={<span style={{ fontSize: "12px" }}>No</span>}
                    sx={{ ".MuiFormControlLabel-label": { fontSize: "10px" }, marginTop: "4px" }}
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>

          <Box
            sx={{
              width: "60%",
              height: "50px",
              backgroundColor: "white",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingX: "50px",
              borderRadius: "5px",
            }}
          >
            <Typography
              sx={{ color: "#000", fontSize: "15px", fontWeight: 500 }}
            >
              Password
            </Typography>
            <Typography
              sx={{ color: "#4470AF", fontSize: "14px", cursor: "pointer" }}
              onClick={() => setShowResetPassword(true)}
            >
              reset
            </Typography>
          </Box>

          <Button
            onClick={handleClickOpen}
            // variant="contained"
            sx={{
              fontSize: "14px",
              backgroundColor: "#4470AD",
              color: "white",
              width: "30%",
              marginTop: "5px",
              borderRadius: 2,
              ":hover": {
                backgroundColor: "#4470AD",
                color: "white",
              },
            }}
          >
            Save
          </Button>
          <Modal
            open={showResetPassword}
            onClose={() => setShowResetPassword(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ outline: "none" }}
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
                outline: "none",
              }}
            >
              <Box>
                <Typography sx={{ color: "#555555", fontSize: "14px" }}>
                  old password
                </Typography>
                <TextField
                  size="small"
                  style={{ width: "100%" }}
                  // label="old password"
                  value={oldPassword}
                  variant="outlined"
                  onChange={(e: any) => setOldPassword(e.target.value)}
                  sx={{
                    width: "100%",
                    height: "40px",
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ color: "#555555", fontSize: "14px" }}>
                  new password
                </Typography>
                <TextField
                  size="small"
                  style={{ width: "100%" }}
                  // label="new password"
                  value={newPassword}
                  variant="outlined"
                  onChange={(e: any) => setNewPassword(e.target.value)}
                  sx={{
                    width: "100%",
                    height: "40px",
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ color: "#555555", fontSize: "14px" }}>
                  confirm password
                </Typography>
                <TextField
                  size="small"
                  style={{ width: "100%" }}
                  // label="confirm password"
                  value={confirmPassword}
                  variant="outlined"
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  sx={{
                    width: "100%",
                    height: "40px",
                  }}
                />
              </Box>
              <Button
                sx={{
                  fontSize: "14px",
                  width: "50%",
                  // border: "1px solid blue",
                  color: "white",
                  ":hover": { backgroundColor: "#4470AD", color: "white" },
                  backgroundColor: "#4470AD",
                  marginLeft: 10,
                }}
                onClick={() => changePassword()}
              >
                submit
              </Button>
            </div>
          </Modal>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Important Notice"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                ◾ If a sync process is currently running, it will be stopped as
                the application will restart to save the new sync interval.
              </DialogContentText>
              <DialogContentText
                style={{
                  fontSize: "0.875rem",
                  fontStyle: "italic",
                  marginTop: "1rem",
                }}
              >
                We do not recommend restarting the application while syncing a
                company for the first time. It's best to wait until the sync is
                complete before making changes to the sync interval.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Disagree</Button>
              <Button onClick={handleSave}>Agree</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      <ToastContainer style={{ width: "auto" }} />
    </Box>
  );
};

export default Settings;
