import { UserContext } from "@/Store/Context/UserContext";
import { Box, Button, Slider, Typography } from "@mui/material";
import axios from "axios";
import { ipProxy } from "../../../core/ipConfig";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const { ipcRenderer }: any = window;

const AdditionalSettings = () => {
  const userCTX: any = useContext(UserContext);
  const navigate = useNavigate();
  const [valueFromBackend, setValueFromBackend]: any = useState<any>({});
  const [value, setValue]: any = useState(222);
  const [mark, setMark]: any = useState([
    {
      caseId: 111,
      label: "200c",
      tooltip: "200",
    },
    {
      caseId: 222,
      label: "300c",
      tooltip: "300",
    },
    {
      caseId: 333,
      label: "400c",
      tooltip: "400",
    },
    {
      caseId: 444,
      label: "500c",
      tooltip: "500",
    },
    {
      caseId: 555,
      label: "600c",
      tooltip: "600",
    },
  ]);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const getConfig = async () => {
    const machineId = await ipcRenderer.getMachineId();
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const currentMachineConfig = userCTX.userDetails?.tallyLicenses?.find(
      (item: any) => item?.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
    );
    const connectors = currentMachineConfig?.connectors;
    const currentMachineConfig2 = connectors?.find(
      (item: any) => item?.machineId === machineId
    );
    // const syncConfig = currentMachineConfig2?.syncConfig;
    const caseId = currentMachineConfig2?.config?.syncConfigId || localStorage.getItem('caseId') || 222;
    const markData = mark?.find((item: any) => {
      return item?.caseId == caseId;
    });
    setValueFromBackend({
      value: markData?.caseId,
      label: markData?.label,
      tooltip: markData?.tooltip,
    });
    setValue(markData?.caseId);
  };
    // useEffect(() => {
    //   getConfig();
    // }, [userCTX])
  const syncConfig = async () => {
    try {
      const res = await axios.get(`${ipProxy}/syncconfig/getAllsyncconfigs`);
      const newMarks = res?.data?.data;
      setMark(newMarks);
      // console.log(res);
    } catch (error) {
      console.log(error, "error");
    }
  };
  useEffect(() => {
    getConfig();
    syncConfig();
  }, []);
  const saveConfig = async () => {
    try {
      const machineId = await ipcRenderer.getMachineId();
      const tallyInfo = await ipcRenderer.fetchTallyInfo(
        localStorage.getItem("port")
      );
      const currentMachineConfig = userCTX?.userDetails?.tallyLicenses?.find(
        (item: any) =>
          item?.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
      );
      const licenseId = currentMachineConfig?._id;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const endpoint = `${ipProxy}/user/updatesyncconfig`;
      const params = {
        caseId: value,
        licenseId: licenseId,
        machineId: machineId,
      };
      const response = await axios.put(endpoint, null, {
        params,
        headers: config.headers,
      });
      if (response.status === 200) {
        localStorage.setItem("caseId", value.toString());
        configSave();
      }
    } catch (error) {
      console.log(
        error,
        "Error while giving the put request for the slider value"
      );
    }
  };
  const Reset = async () => {
    try {
      const machineId = await ipcRenderer.getMachineId();
      const tallyInfo = await ipcRenderer.fetchTallyInfo(
        localStorage.getItem("port")
      );
      const currentMachineConfig = userCTX.userDetails?.tallyLicenses?.find(
        (item: any) =>
          item.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
      );
      const licenseId = currentMachineConfig?._id;
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const endpoint = `${ipProxy}/user/updatesyncconfig`;
      const params = {
        caseId: 222,
        licenseId: licenseId,
        machineId: machineId,
      };
      const response = await axios.put(endpoint, null, {
        params,
        headers: config.headers,
      });
      if (response.status === 200) {
        localStorage.setItem("caseId", value.toString());
        configSave();
      }
    } catch (error) {
      console.log(
        error,
        "Error while giving the put request for the slider value"
      );
    }
  };
  let backgroundColor;

  // Set background color based on value
  if (value === 111 || value === 222) {
    backgroundColor = "#DCFFE6";
  } else if (
    value === 333 ||
    value === 444
  ) {
    backgroundColor = "#FFE5CD";
  } else if (value === 555) {
    backgroundColor = "#FFCDCD";
  } else {
    backgroundColor = "#FFFFFF"; // default color
  }

  let backgroundColor2;
  if (value === 111 || value === 222) {
    backgroundColor2 = "#F6FFF9";
  } else if (
    value === 333 ||
    value === 444
  ) {
    backgroundColor2 = "#FFFAF5";
  } else if (value === 555) {
    backgroundColor2 = "#FFF9F9";
  } else {
    backgroundColor2 = "#FFFFFF";
  }
  // console.log(valueFromBackend, "default value");
  // console.log(value, "value");
  const labelStyle = {
    fontSize: 12, // Adjust the font size as needed
  };
  const configSave = () => {
    toast.success("Config saved", {
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
  // console.log(userCTX, 'context')
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
          justifyContent: "space-between",
          backgroundColor: "#FAFBFD",
        }}
      >
        {/* info section  */}
        <Box
          sx={{
            width: "90%",
            backgroundColor: "#F9F9F9",
            padding: 2,
            borderRadius: "8px",
          }}
        >
          <Typography
            style={{ fontSize: 14, color: "#666", fontStyle: "italic" }}
          >
            Note: The configurable slider bar allows users to adjust data sync
            time and Tally performance according to their preferences. The
            slider ranges from slow data sync and fast Tally performance at 200,
            transitioning to fast data sync and slow Tally performance at 600,
            with intermediate settings at 300, 400, and 500.
          </Typography>
        </Box>

        {/* reset default section  */}

        {/* slider section  */}
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Slider
            aria-label="Temperature"
            value={value !== undefined ? value : valueFromBackend.value}
            valueLabelDisplay="auto"
            step={111}
            marks={mark?.map((mark: any) => ({
              value: mark.caseId,
              label: mark.label,
            }))}
            min={111}
            max={555}
            onChange={(event, newValue) => handleChange(event, newValue)}
            valueLabelFormat={(value) =>
              mark.find((mark: any) => mark.caseId === value)?.tooltip || value
            }
          />
          <Box
            sx={{
              width: "100%",
              borderRadius: "10px",
              backgroundColor: "#F9F9F9",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Typography
              sx={{ fontSize: 12, color: "#666666", textAlign: "center" }}
            >
              'c' signifies 'chunk size', denoting the size of the data fetched
              from Tally.
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            sx={{
              border: "1px solid #4470AD",
              borderRadius: "5px",
              ":hover": {
                backgroundColor: "white",
              },
              // alignSelf: "flex-end",
              // marginRight: "18px",
              color: "#4470AD",
              fontSize: "10px",
              textTransform: "none",
            }}
            onClick={Reset}
          >
            Reset to Default
          </Button>
          <Button
            onClick={saveConfig}
            sx={{
              border: "1px solid #4470AD",
              borderRadius: "5px",
              ":hover": {
                backgroundColor: "white",
              },
              // alignSelf: "flex-end",
              // marginRight: "18px",
              color: "#4470AD",
              fontSize: "10px",
              textTransform: "none",
            }}
          >
            save config
          </Button>
        </Box>
        {/* subtext section  */}
        <Box
          sx={{
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* heading part  */}
          <Box
            sx={{
              backgroundColor: backgroundColor,
              borderRadius: "20px",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "70px",
            }}
          >
            {value === 111 ? (
              <Typography sx={{ fontSize: "13px", color: "#00A32E" }}>
                Advisory
              </Typography>
            ) : (
              ""
            )}
            {value === 222 ? (
              <Typography sx={{ fontSize: "13px", color: "#00A32E" }}>
                Advisory
              </Typography>
            ) : (
              ""
            )}
            {value === 333 ? (
              <Typography sx={{ fontSize: "13px", color: "#FF7A00" }}>
                Caution
              </Typography>
            ) : (
              ""
            )}
            {value === 444 ? (
              <Typography sx={{ fontSize: "13px", color: "#FF7A00" }}>
                Caution
              </Typography>
            ) : (
              ""
            )}
            {value === 555 ? (
              <Typography sx={{ fontSize: "13px", color: "#FF1E1E" }}>
                Warning
              </Typography>
            ) : (
              ""
            )}
          </Box>
          {/* subtext part  */}
          <Box
            sx={{
              padding: "10px",
              borderRadius: "7px",
              backgroundColor: backgroundColor2,
            }}
          >
            {/* <Typography
              sx={{
                fontSize: "14px",
                textAlign: "center",
                color: "#555555",
              }}
            >
              Tally is anticipated to experience significant lag, despite
              offering faster synchronization compared to the previous option
            </Typography> */}
            {value === 111 ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "center",
                  color: "#555555",
                }}
              >
                Anticipate significant lag in Tally performance despite improved
                data synchronization speed compared to the previous option
              </Typography>
            ) : (
              ""
            )}
            {value === 222 ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "center",
                  color: "#555555",
                }}
              >
                Anticipate significant lag in Tally performance despite improved
                data synchronization speed compared to the previous option
              </Typography>
            ) : (
              ""
            )}
            {value === 333 ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "center",
                  color: "#555555",
                }}
              >
                Be cautious of potential lag in Tally performance despite
                enhanced data synchronization speed relative to prior settings
              </Typography>
            ) : (
              ""
            )}
            {value === 444 ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "center",
                  color: "#555555",
                }}
              >
                Be cautious of potential lag in Tally performance despite
                enhanced data synchronization speed relative to prior settings
              </Typography>
            ) : (
              ""
            )}
            {value === 555 ? (
              <Typography
                sx={{
                  fontSize: "14px",
                  textAlign: "center",
                  color: "#555555",
                }}
              >
                Tally is anticipated to experience significant lag, despite
                offering faster synchronization compared to the previous option
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </Box>
        <ToastContainer style={{ width: "auto" }} />
      </Box>
    </Box>
  );
};

export default AdditionalSettings;
