import { useEffect, useState, useContext, useSyncExternalStore } from "react";
import Company from "../Company/Company";
import { Box, Button, Divider, Typography } from "@mui/material";
// import { ipcRenderer } from "electron";
const { ipcRenderer }: any = window;
import { UserContext } from "@/Store/Context/UserContext";
import CircularProgress from "@mui/material/CircularProgress";
import { SyncStatusContext } from "@/Store/Context/SyncStatusContext";
import syncIcon from "../../assets/syncIcon.svg";
import readytosync from "../../assets/readytosync.png";
import notsyncing from "../../assets/notsyncing.png";
import { useLocation } from "react-router-dom";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CompanyList = ({ tallyAppInfo, Router }: any) => {
  //Context and local storage
  const syncStatusCtx: any = useContext(SyncStatusContext);
  const userCTX: any = useContext(UserContext);

  //STATES
  //Tally States
  const [cronJobStart, setCronJobStart] = useState(false);
  const [tallyOverallStatus, setTallyOverallStatus]: any = useState(null);
  const [isTallyApplicationRunning, setIsTallyApplicationRunning]: any =
    useState(false);
  const [isTallyRunningOnGivenPort, setIsTallyRunningOnGivenPort] =
    useState(false);
  const [isTallyInEducationMode, setIsTallyInEducationMode]: any =
    useState(false);
  const [isTallyFinallyReady, setIsTallyFinallyReady]: any = useState(false);
  const [tallyCompanies, setTallyCompanies]: any[] = useState([]);
  const [tallyConnectionIsChecked, setTallyConnectionIsChecked] =
    useState(false);

  //Internal and context derived variables
  const [loading, setIsLoading]: any = useState(true);
  const [companiesUnderCurrentMachine, setCompaniesUnderCurrentMachine]: any[] =
    useState([]);
  const [
    companiesNotUnderCurrentMachine,
    setCompaniesNotUnderCurrentMachine,
  ]: any = useState([]);

  const [companiesUnderOtherLicenses, setCompaniesUnderOtherLicenses]: any =
    useState([]);
  //Company App states
  const [isCurrentlySyncing, setIsCurrentlySyncing]: any = useState([]);
  const [isSyncing, setIsSyncing]: any[] = useState([]);
  const [notSyncing, setNotSyncing]: any[] = useState([]);

  const x = useLocation();

  useEffect(() => {
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
        setIsLoading(false);
      } else if (tallyMainStatus === undefined) {
        setTallyOverallStatus(null);
        setIsTallyFinallyReady(false);
        setIsLoading(false);
      } else {
        setIsTallyFinallyReady(false);
        setIsLoading(false);
      }
    };
    const interval = setInterval(useEffectFunc, 4000); // Polling every 4 seconds

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const useEffectFunc = async () => {
      if (isTallyFinallyReady) {
        await updateCurrentConfigStatesAndCurrentlySyncingCompany();
        const handleCurrentSyncingCompany = (event: any, params: any) => {
          if (params.action === "sync-start") {
            setCronJobStart(true);
            let temp: any[] = [];
            temp.push(params.companyData);
            setIsCurrentlySyncing(temp);
          } else if ((params.action = "sync-end")) {
            setCronJobStart(false);
            setIsCurrentlySyncing([]);
          }
        };
        ipcRenderer.on("current-syncing-company", handleCurrentSyncingCompany);
        return () => {
          ipcRenderer.removeAllListeners(
            "current-syncing-company",
            handleCurrentSyncingCompany
          );
        };
      } else {
        // console.log("notReady");
      }
    };
    useEffectFunc();
  }, [
    isTallyFinallyReady,
    tallyCompanies.length,
    isCurrentlySyncing,
    loading,
    isSyncing.length,
    notSyncing.length,
    x,
    companiesUnderCurrentMachine?.length,
    companiesNotUnderCurrentMachine?.length,
  ]);
  const getMachineId = async () => {
    try {
      const machineId = await ipcRenderer.getMachineId();
      return machineId;
    } catch (error) {
      console.error("Error ", error);
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
            setIsLoading(false);
          }
          if (tallyInfo?.code === 400) {
            setIsLoading(false);
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
      setIsLoading(false);
      return false;
    }
  };
  const updateCurrentConfigStatesAndCurrentlySyncingCompany = async () => {
    let temArr: any[] = [];
    let otherLicenses: any = [];
    let allCompaniesUnderOtherLicenses: any = [];
    const currentMachineId = await getMachineId();
    userCTX?.userDetails?.tallyLicenses?.find((license: any) => {
      if (
        license.tallyLicenseNumber !==
        tallyOverallStatus?.tallyInfo?.info?.licenseNumber
      ) {
        otherLicenses.push(license);
      }
    });
    if (otherLicenses.length > 0) {
      otherLicenses.forEach((obj: any) => {
        if (Array.isArray(obj["companies"])) {
          allCompaniesUnderOtherLicenses =
            allCompaniesUnderOtherLicenses.concat(obj["companies"]);
        }
      });
      setCompaniesUnderOtherLicenses(allCompaniesUnderOtherLicenses);
    }

    const currentLicense = userCTX?.userDetails?.tallyLicenses?.find(
      (license: any) => {
        if (
          license.tallyLicenseNumber ===
          tallyOverallStatus?.tallyInfo?.info?.licenseNumber
        ) {
          return license;
        }
      }
    );
    if (currentLicense) {
      const findActiveLicense = userCTX?.userDetails?.tallyLicenses?.find(
        (license: any) =>
          license.tallyLicenseNumber ===
          tallyOverallStatus?.tallyInfo?.info?.licenseNumber
      );
      const companiesUnderCurrentLicense = findActiveLicense?.companies;
      const connectors = findActiveLicense?.connectors;

      const temp = connectors?.filter(
        (connector: any) => connector.machineId === currentMachineId
      );
      if (temp?.length > 0) {
        const companiesUnderCurrentMachineId = temp?.[0]?.companies;
        let companiesUnderCurrentMachineDetailed =
          await companiesUnderCurrentLicense?.filter((obj1: any) => {
            return companiesUnderCurrentMachineId?.some(
              (obj2: any) => obj2?.companyName === obj1?.companyName
            );
          });

        if (companiesUnderCurrentMachineDetailed?.length > 0) {
          setCompaniesUnderCurrentMachine(companiesUnderCurrentMachineDetailed);
        }

        //NotSyncing
        const companyNamesAccrodingToNotMachineId = connectors?.filter(
          (connector: any) => connector.machineId !== currentMachineId
        );
        if (companyNamesAccrodingToNotMachineId?.length !== 0) {
          let companynamesarr: any = [];
          companyNamesAccrodingToNotMachineId?.forEach((element: any) => {
            element?.companies?.forEach((e: any, i: any) => {
              companynamesarr.push(e.companyName);
            });
          });
          let companiesNotUnderCurrentMachineDetailed =
            companiesUnderCurrentLicense?.filter((company: any) =>
              companynamesarr?.includes(company.companyName)
            );
          const yy = await removeDuplicates(
            companiesUnderCurrentMachine,
            tallyCompanies
          );
          setNotSyncing(companiesNotUnderCurrentMachineDetailed);
          setNotSyncing((prevComp: any) => [...prevComp, ...yy]);
        } else {
          const yy = await removeDuplicates(
            companiesUnderCurrentMachine,
            tallyCompanies
          );
          setNotSyncing(yy);
        }
      } else {
        const companyNamesAccrodingToNotMachineId = connectors?.filter(
          (connector: any) => connector.machineId !== currentMachineId
        );
        if (companyNamesAccrodingToNotMachineId?.length !== 0) {
          let companynamesarr: any = [];
          companyNamesAccrodingToNotMachineId?.forEach((element: any) => {
            element?.companies?.forEach((e: any, i: any) => {
              companynamesarr.push(e.companyName);
            });
          });
          let companiesNotUnderCurrentMachineDetailed =
            companiesUnderCurrentLicense?.filter((company: any) =>
              companynamesarr?.includes(company.companyName)
            );
          setNotSyncing(companiesNotUnderCurrentMachineDetailed);
        }
      }
    } else {
      setIsSyncing([]);
      setIsCurrentlySyncing([]);
    }
    const currentMachineTallyCompare = removeDuplicates2(
      companiesUnderCurrentMachine,
      tallyCompanies
    );
    const zz = await removeDuplicates(
      currentMachineTallyCompare,
      isCurrentlySyncing
    );
    const finalSyncing: any = [];
    if (zz.length !== 0) {
      zz.map((element: any) => {
        finalSyncing.push(element?.companyInfo);
      });
    }
    setIsSyncing(finalSyncing);
    return Promise.resolve();
  };

  async function removeDuplicates(arr1: any, arr2: any) {
    const guids = arr2.map((item: any) => item.Name);
    return arr1.filter((item: any) => !guids.includes(item.companyInfo.Name));
  }

  function removeDuplicates2(arr1: any, arr2: any) {
    const guids = arr2.map((item: any) => item.Name);
    return arr1.filter((item: any) => guids.includes(item.companyInfo.Name));
  }
  const handleSyncStart = () => {
    // setIsSyncing(true);
    syncStatusCtx.updateSyncingStatus(true);
  };

  const syncCompleteCallback = () => {
    // setIsSyncing(false);
    syncStatusCtx.updateSyncingStatus(false);
  };

  const updateLastSyncTime = async (companyName: any) => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    let syncedTime = null;
    const findActiveLicense = userCTX?.userDetails?.tallyLicenses?.find(
      (license: any) =>
        license.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
    );
    const companiesArr = findActiveLicense?.companies;
    const time = companiesArr?.find((item: any) => {
      if (item.companyInfo.Name === companyName) {
        return item;
      }
    });
    if (time) {
      syncedTime = time.lastSyncedTime;
      return syncedTime;
    } else {
      let otherLicenses: any = [];
      let otherLicensesCompanies: any = [];
      userCTX?.userDetails?.tallyLicenses?.find((license: any) => {
        if (
          license.tallyLicenseNumber !== tallyInfo?.info?.licenseNumber &&
          license?.tallyLicenseNumber !== "123456789"
        ) {
          otherLicenses.push(license);
        }
      });
      otherLicenses?.map((item: any) => {
        otherLicensesCompanies.push(...item?.companies);
      });
      const time = otherLicensesCompanies?.find((item: any) => {
        if (item.companyInfo.Name === companyName) {
          return item;
        }
      });
      syncedTime = time?.lastSyncedTime;
      return syncedTime;
    }
  };
  // console.log(userCTX, 'context');
  // console.log(notSyncing, 'not syncing');
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
                overflowX: "hidden",
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
                    src={syncIcon}
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
                      Syncing
                    </Typography>
                    <Typography sx={{ color: "#7E7E7E", fontSize: "13px" }}>
                      Companies eligible to get synced will automatically come
                      into syncing.
                    </Typography>
                  </Box>
                </Box>
                {isCurrentlySyncing?.length > 0 ? (
                  <Box>
                    {isCurrentlySyncing?.map((syncingName: any, index: any) => {
                      const key = index;
                      return (
                        <Company
                          key={key}
                          companies={syncingName}
                          isSyncing={
                            syncStatusCtx?.isSyncing?.companyName ===
                            syncingName.Name
                              ? true
                              : false
                          }
                          syncingStatus={syncStatusCtx.syncingStatus}
                          handleSyncStart={handleSyncStart}
                          showSyncButton={cronJobStart ? true : false}
                          showDeleteStatus={cronJobStart ? true : false}
                          // showSyncButton={true}
                          // showDeleteStatus={true}
                          setIsSyncing={syncCompleteCallback}
                          lastSyncTime={updateLastSyncTime(syncingName?.Name)}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      sx={{
                        color: "#7E7E7E",
                        fontSize: "13px",
                        alignContent: "center",
                        justifyContent: "center",
                        width: "80%",
                        marginLeft: "30%",
                        marginTop: 4,
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      No companies are currently syncing.{" "}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider
                sx={{
                  borderColor: "#F0F0F0;",
                  width: "100%",
                  height: "2px",
                }}
              />
              <Box
                sx={{
                  width: "90%",
                  marginTop: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "25px",
                  }}
                >
                  <img
                    src={readytosync}
                    alt="notsyncing logo"
                    width="20px"
                    height="20px"
                    style={{
                      marginTop: "-15px",
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
                      }}
                    >
                      Ready to Sync
                    </Typography>
                    <Typography sx={{ color: "#7E7E7E", fontSize: "13px" }}>
                      These companies opened in tally and ready to sync.
                    </Typography>
                  </Box>
                </Box>
                {isSyncing.length > 0 ? (
                  <Box>
                    {isSyncing?.map((notSyncedName: any, index: any) => {
                      const key = index;
                      return (
                        <Company
                          key={key}
                          companies={notSyncedName}
                          isSyncing={
                            syncStatusCtx?.isSyncing?.companyName ===
                            notSyncedName.Name
                              ? true
                              : false
                          }
                          syncingStatus={syncStatusCtx.syncingStatus}
                          showDeleteStatus={true}
                          handleSyncStart={handleSyncStart}
                          setIsSyncing={syncCompleteCallback}
                          showSyncButton={true}
                          lastSyncTime={updateLastSyncTime(notSyncedName?.Name)}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      sx={{
                        color: "#7E7E7E",
                        fontSize: "13px",
                        alignContent: "center",
                        justifyContent: "center",
                        width: "80%",
                        marginLeft: "32%",
                        marginTop: 4,
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      The companies must be syncing.{" "}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  width: "90%",
                  marginTop: "20px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: "25px",
                  }}
                >
                  <img
                    src={notsyncing}
                    alt="notsyncing logo"
                    width="17px"
                    height="17px"
                    style={{
                      marginTop: "-15px",
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
                      }}
                    >
                      Not Syncing
                    </Typography>
                    <Typography sx={{ color: "#7E7E7E", fontSize: "13px" }}>
                      These companies are not syncing or not opened in tally.
                    </Typography>
                  </Box>
                </Box>
                {notSyncing.length > 0 || isSyncing.length > 0 ? (
                  <Box>
                    {notSyncing?.length > 0 && (
                      <Box
                        sx={{
                          width: "100%",
                          marginTop: "20px",
                        }}
                      >
                        {notSyncing?.map((notSyncedName: any, index: any) => {
                          const key = index;
                          return (
                            <Company
                              key={key}
                              companies={
                                notSyncedName.companyInfo ||
                                notSyncedName.tally_companyInfo
                              }
                              isSyncing={false}
                              syncingStatus={syncStatusCtx.syncingStatus}
                              handleSyncStart={handleSyncStart}
                              setIsSyncing={syncCompleteCallback}
                              showSyncButton={false}
                              lastSyncTime={updateLastSyncTime(
                                notSyncedName?.companyInfo?.Name
                              )}
                            />
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      sx={{
                        color: "#7E7E7E",
                        fontSize: "13px",
                        alignContent: "center",
                        justifyContent: "center",
                        width: "80%",
                        marginLeft: "15%",
                        marginTop: 4,
                        fontWeight: "600",
                      }}
                    >
                      {" "}
                      Add companies from the add company option in the side
                      menu.{" "}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box
                sx={{
                  width: "93%",
                  marginTop: "20px",
                  marginLeft: "30px"
                }}
              >
                {companiesUnderOtherLicenses?.length > 0 && (
                  <Box
                    sx={{
                      marginTop: "5%",
                    }}
                  >
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Companies under other license(s)
                      </AccordionSummary>
                      <AccordionDetails>
                        {companiesUnderOtherLicenses?.map(
                          (company: any, index: any) => {
                            return (
                              <Company
                                key={index}
                                companies={
                                  company.companyInfo ||
                                  company.tally_companyInfo
                                }
                                isSyncing={false}
                                syncingStatus={syncStatusCtx.syncingStatus}
                                handleSyncStart={handleSyncStart}
                                setIsSyncing={syncCompleteCallback}
                                showSyncButton={false}
                              />
                            );
                          }
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
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
            {/* Content Box */}
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
                  borderRadius: isTallyRunningOnGivenPort ? "none" : "5px",
                  paddingLeft: isTallyRunningOnGivenPort ? "none" : "5px",
                  backgroundColor: isTallyRunningOnGivenPort
                    ? "none"
                    : "#ffbfcb",
                  padding: "5px",
                }}
              >
                4. The port on which tally is running and the port in your
                application settings must be same, (By default it is 9000).
              </Typography>
            </Box>

            {/* Button Box */}
            {/* <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                // marginTop: "15px",
              }}
            >
              <Button
                // variant="contained"
                sx={{
                  backgroundColor: "#4470AD",
                  width: "200px",
                  fontSize: "16px",
                  color: "white",
                  borderRadius: "8px",
                  ":hover": {
                    backgroundColor: "#4470AD",
                    color: "white",
                  },
                }}
                // onClick={fetchTallyCompanyData}
              >
                Reload
              </Button>
            </Box> */}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CompanyList;
