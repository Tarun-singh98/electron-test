import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Company from "../Company/Company";
import { UserContext } from "@/Store/Context/UserContext";
const { ipcRenderer }: any = window;
import readytosync from "../../assets/readytosync.png";
import { SyncStatusContext } from "@/Store/Context/SyncStatusContext";
import { companyUnderCurrentMachine } from "electron/main/tally-sync/util/incrementalSyncUtil/incrementalSync";
const ReadyToSync = () => {
  const userCTX: any = useContext(UserContext);
  const syncStatusCtx: any = useContext(SyncStatusContext);
  const [loading, setLoading] = useState(true);
  const [readyToSync, setReadytosync] = useState([]);
  const [companiesUnderCurrentMachine, setCompaniesUnderCurrentMachine]: any[] =
    useState([]);
  const [tallyOverallStatus, setTallyOverallStatus]: any = useState(null);
  const [isTallyApplicationRunning, setIsTallyApplicationRunning]: any =
    useState(false);
  const [isTallyRunningOnGivenPort, setIsTallyRunningOnGivenPort] =
    useState(false);
  const [isTallyInEducationMode, setIsTallyInEducationMode]: any =
    useState(false);
  const [isTallyFinallyReady, setIsTallyFinallyReady]: any = useState(false);
  const [tallyCompanies, setTallyCompanies]: any[] = useState([]);

  const useEffectFunc = async () => {
    const tallyMainStatus: any = await isTallyOpenAndRunningOnCurrentPort();
    if (
      tallyMainStatus !== undefined &&
      tallyMainStatus.isTallyAppRunning === true &&
      tallyMainStatus.checkIfTallyIsConnectedInGivenPort === true &&
      tallyMainStatus.isTallyInEduMode === false &&
      tallyMainStatus.response.status === true
    ) {
      setIsTallyApplicationRunning(tallyMainStatus?.isTallyAppRunning);
      setIsTallyRunningOnGivenPort(
        tallyMainStatus?.checkIfTallyIsConnectedInGivenPort
      );
      setIsTallyInEducationMode(tallyMainStatus?.isTallyInEduMode);
      setTallyOverallStatus(tallyMainStatus);
      setIsTallyFinallyReady(true);
      setTallyCompanies(tallyMainStatus?.response?.info);
      companisToShowReadytosync();
      setLoading(false);
    } else if (tallyMainStatus === undefined) {
      setTallyOverallStatus(null);
      setIsTallyFinallyReady(false);
      setLoading(false);
    } else {
      setIsTallyFinallyReady(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    // const interval = setInterval(useEffectFunc, 4000); // Polling every 4 seconds
    useEffectFunc();
    // return () => clearInterval(interval);
  }, [isTallyFinallyReady, tallyCompanies.length, readyToSync]);

  // useEffect(() => {
  //   if(tallyCompanies.length > 0){
  //     companisToShowReadytosync();
  //   }
  // }, [tallyCompanies]);

  const isTallyOpenAndRunningOnCurrentPort = async () => {
    try {
      let isEduMode;
      const isTallyAppRunning = await ipcRenderer.tallyOpen();
      const currentMachineConfig = await fetchCurrentMachineConfig();
      if (isTallyAppRunning) {
        const checkIfTallyIsConnectedInGivenPort =
          await ipcRenderer.connectedToGivenPort(
            currentMachineConfig !== undefined
              ? currentMachineConfig?.tallyPort
              : localStorage.getItem("port")
          );
        if (checkIfTallyIsConnectedInGivenPort) {
          const tallyInfo = await ipcRenderer.fetchTallyInfo(
            currentMachineConfig !== undefined
              ? currentMachineConfig?.tallyPort
              : localStorage.getItem("port")
          );
          if (tallyInfo?.info?.licenseNumber !== "0") {
            isEduMode = false;
            const response = await ipcRenderer.fetchCompanyInfo(
              currentMachineConfig !== undefined
                ? currentMachineConfig?.tallyPort
                : localStorage.getItem("port")
            );
            return {
              isTallyAppRunning,
              checkIfTallyIsConnectedInGivenPort,
              isTallyInEduMode: isEduMode,
              response,
              tallyInfo,
            };
          } else {
            isEduMode = true;
            setLoading(false);
          }
          if (tallyInfo?.code === 400) {
            setLoading(false);
          } else {
            return {
              isTallyAppRunning,
              checkIfTallyIsConnectedInGivenPort,
              response: {},
              tallyInfo,
            };
          }
        }
      } else {
        return {
          isTallyAppRunning,
          checkIfTallyIsConnectedInGivenPort: false,
          response: {},
          tallyInfo: {},
        };
      }
    } catch (error) {
      console.error(
        error,
        "either tally is not open or is not running on the specified port"
      );
      setLoading(false);
      return false;
    }
  };
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
    return currentMachineConfig2?.config;
  };
  const getMachineId = async () => {
    try {
      const machineId = await ipcRenderer.getMachineId();
      return machineId;
    } catch (error) {
      console.error("Error ", error);
    }
  };

  const companisToShowReadytosync = async () => {
    let temArr: any[] = [];
    const currentMachineId = await getMachineId();
    const currentMachineConfig = await fetchCurrentMachineConfig();
    const findActiveLicense = userCTX?.userDetails?.tallyLicenses?.find(
      (license: any) =>
        license.tallyLicenseNumber ===
        tallyOverallStatus?.tallyInfo?.info?.licenseNumber
    );
    const companiesUnderCurrentLicense = await findActiveLicense?.companies;
    if(tallyCompanies.length > 0){
      const arr = await getUniqueCompanies(
        companiesUnderCurrentLicense,
        tallyCompanies
      );
      setReadytosync(arr);
    }
    return Promise.resolve();
  };

  async function getUniqueCompanies(companies1: any, companies2: any) {
    const namesInFirstArray = companies1?.map(
      (company: any) => company?.companyInfo?.Name
    );
    const uniqueCompanies = companies2?.filter(
      (company: any) => !namesInFirstArray?.includes(company?.Name)
    );
    return uniqueCompanies;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "96%",
        backgroundColor: "#F7FBFF",
        marginTop: "-20px",
        boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* {loading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : (

      )} */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#F7FBFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {isTallyFinallyReady ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                minHeight: "90%",
                backgroundColor: "#FAFBFD",
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingY: "10px",
                marginTop: "10px",
                overflowY: "scroll",
                scrollbarWidth: "thin",
                scrollbarColor: "darkgray lightgray",
                position: "relative",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "darkgray",
                  borderRadius: "6px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  backgroundColor: "gray",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "lightgray",
                  borderRadius: "6px",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                <Button
                  sx={{
                    alignSelf: "flex-end",
                    marginRight: 5,
                  }}
                  onClick={useEffectFunc}
                >
                  Refresh
                </Button>
              </Box>
              <Box
                sx={{
                  width: "90%",
                  marginBottom: "20px",
                  marginTop: 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    marginBottom: "10px",
                    gap: "25px",
                  }}
                >
                  <img
                    src={readytosync}
                    alt="sync icon"
                    width="20px"
                    height="20px"
                    style={{
                      marginTop: "-10px",
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        textAlign: "left",
                        color: "#000000",
                        fontSize: "16px",
                        fontWeight: "550",
                        fontFamily: "sans-serif",
                        marginTop: "5px",
                      }}
                    >
                      Ready To Sync
                    </Typography>
                    <Typography sx={{ color: "#7E7E7E", fontSize: "13px" }}>
                      Sync companies seamlessly from Tally for accurate
                      financial tracking
                    </Typography>
                  </Box>
                </Box>
                {readyToSync?.length > 0 ? 
                <Box>
                   {readyToSync?.map((company: any, index: any) => {
                  return (
                    <Company
                      key={index}
                      companies={company}
                      // isSyncing={
                      //   syncStatusCtx?.isSyncing?.companyName === company.Name
                      //     ? true
                      //     : false
                      // }
                      // showLastSyncedTime={false}
                      syncingStatus={syncStatusCtx.syncingStatus}
                      showSyncButton={true}
                    />
                  );
                })}
                </Box>:<Box>
                  <Typography>No companies</Typography>
                </Box>
                  }
               
              </Box>
            </Box>
          </Box>
        ) : loading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                sx={{
                  alignSelf: "flex-end",
                  marginRight: 5,
                }}
                onClick={useEffectFunc}
              >
                Refresh
              </Button>
            </Box>
            <Box
              sx={{
                width: "90%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: "40px",
                gap: 1,
              }}
            >
              <Typography
                // variant="h6"
                // component="h2"
                sx={{
                  fontWeight: 500,
                  fontSize: 18,
                  marginBottom: "10px",
                }}
              >
                Your companies are not showing up for one of the following
                reasons:-
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  // border: connected === false ? "1px solid red" : "none",
                  borderRadius:
                    isTallyApplicationRunning === false ? "5px" : "none",
                  paddingLeft:
                    isTallyApplicationRunning === false ? "5px" : "none",
                  backgroundColor:
                    isTallyApplicationRunning === false ? "#ffbfcb" : "none",
                  padding: "5px",
                }}
              >
                1. Check Tally software is open.
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  // border:
                  //   isInEducationMode === true ? "1px solid red" : "none",
                  borderRadius:
                    isTallyInEducationMode === true ? "5px" : "none",
                  paddingLeft: isTallyInEducationMode === true ? "5px" : "none",
                  backgroundColor:
                    isTallyInEducationMode === true ? "#ffbfcb" : "none",
                  padding: "5px",
                }}
              >
                2. Tally should not be open in education mode.
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                }}
              >
                3. ODBC and tally port should be enabled.
                <Typography
                  sx={{
                    backgroundColor: "#ededed",
                    paddingLeft: "5px",
                    fontSize: "14px",
                    fontStyle: "italic",
                    marginBottom: 1,
                    color: "grey",
                    borderRadius: "5px",
                    marginTop: 1,
                  }}
                >
                  Note:. Go to Settings -{">"} Connectivity -{">"} Set Tally
                  acts as option to both and enable ODBC to yes.
                </Typography>
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  // border: connected === false ? "1px solid red" : "none",
                  borderRadius:
                    isTallyRunningOnGivenPort === false ? "5px" : "none",
                  paddingLeft:
                    isTallyRunningOnGivenPort === false ? "5px" : "none",
                  backgroundColor:
                    isTallyRunningOnGivenPort === false ? "#ffbfcb" : "none",
                  padding: "5px",
                }}
              >
                4. The port on which tally is running and the port in your
                application settings must be same, (By default it is 9000).
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReadyToSync;
