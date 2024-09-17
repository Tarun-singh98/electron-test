import { useContext, useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Popover,
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import { UserContext } from "../../Store/Context/UserContext";
const { ipcRenderer }: any = window;
import Loader from "../Loader/Loader";
import { CompanySyncContext } from "@/Store/Context/CompanySyncStatus";
import { SyncStatusContext } from "@/Store/Context/SyncStatusContext";
import Modal from "@mui/material/Modal";
import { ipProxy } from "../../../core/ipConfig";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import CustomModal from "../shared/CustomModal/CustomModal";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { toast, ToastContainer } from "react-toastify";

const Company = ({
  companies,
  isSyncing,
  handleSyncStart,
  setIsSyncing,
  lastSyncTime,
  showSyncButton,
  showDeleteStatus,
  syncingStatus,
  showLastSyncedTime,
}: any) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const userCTX: any = useContext(UserContext);
  const email = userCTX.userDetails?.email;
  const companySyncCTX: any = useContext(CompanySyncContext);
  const syncStatusCtx: any = useContext(SyncStatusContext);
  const [currentSyncProgress, setCurrentSyncProgress] = useState(0);
  const [time, setTime] = useState(lastSyncTime);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [userBackup, setUserBackup] = useState(false);
  const [tallyInfo, setTallyInfo]: any = useState([]);
  const [userData, setUserData] = useState([]);
  const startingFrom = moment(companies?.StartingFrom, "YYYYMMDD").format(
    "DD MMM YYYY"
  );
  const [associateEmail, setAssociateEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const openPopover = Boolean(popoverAnchorEl);
  useEffect(() => {
    showResyncLoader();
    // syncStatusCtx.handleSetIsSyncing("", 0, true, false);
  }, [location.state !== null]);
  // console.log(companies.Name, 'name')
  useEffect(() => {
    ipcRenderer.on("sync-progress-check", (event: any, params: any) => {
      console.log("sync progress ------------>", params);
      if (params.isCronJob === true) {
        syncStatusCtx.updateSyncingStatus(true);
        syncStatusCtx.handleSetIsSyncing(
          params.companyName,
          params.progress,
          false,
          true
        );
        if (params.code === 400) {
          // const ans = ipcRenderer.mobilePushNotification({
          //   expoToken: userCTX?.userDetails?.expoToken,
          //   title: "Error occured",
          //   body: `Error occured at the time of syncing ${params.companyName}`,
          // });
          // console.log(ans, "ans");
          syncStatusCtx.handleSetIsSyncing("", 0, true, false);
          setIsSyncing(false);
        }
        if (params.progress === 100) {
          syncStatusCtx.handleSetIsSyncing("", 0, true, false);
          setIsSyncing(false);
          setCurrentSyncProgress(0);
        }
        setCurrentSyncProgress(params.progress);
      }else{
        if(params.progress === 100){
          syncStatusCtx.handleSetIsSyncing("", 0, true, false);
          setIsSyncing(false);
        }
      }
    });
  }, []);
  useEffect(() => {
    getTimeFromContext();
    const intervalId = setInterval(getTimeFromContext, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [userCTX]);
  useEffect(() => {
    getTallyInfo();
    setUserData(userCTX?.userDetails?.email);
  }, []);
  const getTallyInfo = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    setTallyInfo(tallyInfo.info);
  };
  let syncedStatus = companySyncCTX.getIsSyncedByCompanyName(
    companies.Name.replace(/[\s.]/g, "").toLowerCase()
  );
  const userBackupRef = useRef(userBackup);
  useEffect(() => {
    userBackupRef.current = userBackup;
  }, [userBackup]);
  const isSyncingRef = useRef(syncStatusCtx.isSyncing);
  useEffect(() => {
    isSyncingRef.current = syncStatusCtx.isSyncing;
  }, [syncStatusCtx.isSyncing]);
  const getCompanyId = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const requiredMatchingCompanies = userCTX?.userDetails?.tallyLicenses?.find(
      (license: any) =>
        license.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
    );
    const matchedCompany = requiredMatchingCompanies?.companies.find(
      (comp: any) => comp.companyInfo.Name === companies.Name
    );
    setCompanyId(matchedCompany?._id);
    setCompanyName(matchedCompany?.companyInfo?.Name);
  };
  useEffect(() => {
    getCompanyId();
  }, []);
  // function to delete company
  const handleDelete = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const url = `${ipProxy}/company/delete`;
    const params = {
      companyId: companyId,
      userBackup: `${userBackup === true ? "True" : "false"}`,
      tallyLicenseNumber: tallyInfo?.info?.licenseNumber,
    };
    try {
      const response = await axios.delete(url, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        handleModalClose();
        reload();
      }
    } catch (error: any) {
      console.error("Error deleting data:", error);
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
  };

  const fetchData = async () => {
    try {
      const tallyInfo = await ipcRenderer.fetchTallyInfo(
        localStorage.getItem("port")
      );
      const res = await axios.get(
        `${ipProxy}/user/prepurchasecheck?tallyLicenceNumber=${tallyInfo?.info?.licenseNumber}&email=${email}`
      );
      // console.log(res, "response");
      if (
        res.data.canPurchase &&
        res.data.haveLicense === false &&
        res.data.modalType === "subscribe"
      ) {
        // res.data.canPurchase;
        // console.log("navigate to the pricing section of the accosync");
        const tallyInfo = await ipcRenderer.fetchTallyInfo(
          localStorage.getItem("port")
        );
        const machineId = await ipcRenderer.getMachineId();
        try {
          const res: any = await axios.post(
            `${ipProxy}/user/afterpurchasesuccessupdate`,
            {
              email:
                userCTX?.userDetails?.email || localStorage.getItem("email"),
              tallyLicenseDetail: tallyInfo.info,
              machineId: machineId,
            }
          );
          if (res.data.status === true) {
            syncStatusCtx.handleSetIsSyncing(companies.Name, 0, false, true);
            syncStatusCtx.updateSyncingStatus(true);
            companySyncCTX.markCompanyAsSyncedInPlace(
              companies.Name.replace(/[\s.]/g, "").toLowerCase(),
              true
            );
            syncedStatus = companySyncCTX.getIsSyncedByCompanyName(
              companies.Name.replace(/[\s.]/g, "").toLowerCase()
            );
            const tallyInfo = await ipcRenderer.fetchTallyInfo(
              localStorage.getItem("port")
            );
            if (tallyInfo.code === 400) {
              setIsSyncing(false);
              return;
            }
            ipcRenderer.on("sync-progress-check", (event: any, params: any) => {
              console.log("sync progress ------------>", params);
              companySyncCTX.handleCurrentSyncProgress(params);
              if (params.isCronJob === false) {
                syncStatusCtx.handleSetIsSyncing(
                  companies.Name,
                  params.progress,
                  false,
                  true
                );
                if (params.code === 400) {
                  // const ans = ipcRenderer.mobilePushNotification({
                  //   expoToken: userCTX?.userDetails?.expoToken,
                  //   title: "Error occured",
                  //   body: `Error occured at the time of syncing ${params.companyName}`,
                  // });
                  // console.log(ans, 'ans');
                  syncStatusCtx.handleSetIsSyncing("", 0, true, false);
                  setIsSyncing(false);
                }
              }
              setCurrentSyncProgress(params.progress);
            });
            ipcRenderer.on(
              "connector-error-check",
              (event: any, params: any) => {
                console.log("\x1b[31merror ------------>", params, "\x1b[0m");
                // syncStatusCtx.handleSetIsSyncing("", 0, true, false);
              }
            );
            ipcRenderer.on("connector-noissue", (event: any, params: any) => {
              console.log(
                "\x1b[32m%s\x1b[0m",
                "no error ------------>",
                params
              );
            });
            const syncCompany = await ipcRenderer.syncCompany({
              port: localStorage.getItem("port"),
              companyData: companies,
              tallyInfo: tallyInfo,
              email: email,
              userData: userCTX?.userDetails,
            });
            // console.log("console from frntend ==============>", syncCompany);
            if (syncCompany?.code === 200) {
              setTime(syncCompany.lastSynced);
              syncStatusCtx.handleSetIsSyncing("", 0, true, false);
              setIsSyncing(false);
              // setSyncincData(false);
              companySyncCTX.markCompanyAsSyncedInPlace(
                companies.Name.replace(/[\s.]/g, "").toLowerCase(),
                false
              );
              syncedStatus = companySyncCTX.getIsSyncedByCompanyName(
                companies.Name.replace(/[\s.]/g, "").toLowerCase()
              );
            } else if (syncCompany?.code === 400) {
              setIsSyncing(false);
            }
          } else {
          }
        } catch (error) {
          console.log(error, "error");
        }
        // navigate("/pricing");
      } else if (
        res.data.canPurchase === false &&
        res.data.haveLicense === false &&
        res.data.modalType === "transfer"
      ) {
        setAssociateEmail(res.data.associateEmail);
        navigate("/transfer", { state: res.data.associateEmail });
      } else {
        syncStatusCtx.handleSetIsSyncing(companies.Name, 0, false, true);
        syncStatusCtx.updateSyncingStatus(true);
        companySyncCTX.markCompanyAsSyncedInPlace(
          companies.Name.replace(/[\s.]/g, "").toLowerCase(),
          true
        );
        syncedStatus = companySyncCTX.getIsSyncedByCompanyName(
          companies.Name.replace(/[\s.]/g, "").toLowerCase()
        );
        const tallyInfo = await ipcRenderer.fetchTallyInfo(
          localStorage.getItem("port")
        );
        if (tallyInfo.code === 400) {
          setIsSyncing(false);
          return;
        }
        ipcRenderer.on("sync-progress-check", (event: any, params: any) => {
          console.log("sync progress ------------>", params);
          companySyncCTX.handleCurrentSyncProgress(params);
          if (params.isCronJob === false) {
            syncStatusCtx.handleSetIsSyncing(
              companies.Name,
              params.progress,
              false,
              true
            );
            if (params.code === 400) {
              // const ans = ipcRenderer.mobilePushNotification({
              //   expoToken: userCTX?.userDetails?.expoToken,
              //   title: "Error occured",
              //   body: `Error occured at the time of syncing ${params.companyName}`,
              // });
              // console.log(ans, 'ans');
              syncStatusCtx.handleSetIsSyncing("", 0, true, false);
              setIsSyncing(false);
            }
          }
          setCurrentSyncProgress(params.progress);
        });
        ipcRenderer.on("connector-error-check", (event: any, params: any) => {
          console.log("\x1b[31merror ------------>", params, "\x1b[0m");
          // syncStatusCtx.handleSetIsSyncing("", 0, true, false);
        });
        ipcRenderer.on("connector-noissue", (event: any, params: any) => {
          console.log("\x1b[32m%s\x1b[0m", "no error ------------>", params);
        });
        // console.log(currentMachineConfig);
        const syncCompany = await ipcRenderer.syncCompany({
          port: localStorage.getItem("port"),
          companyData: companies,
          tallyInfo: tallyInfo,
          email: email,
          userData: userCTX?.userDetails,
        });
        // console.log("console from frntend ==============>", syncCompany);
        if (syncCompany?.code === 200) {
          syncStatusCtx.handleSetIsSyncing("", 0, true, false);
          setTime(syncCompany.lastSynced);
          setIsSyncing(false);
          // setSyncincData(false);
          companySyncCTX.markCompanyAsSyncedInPlace(
            companies.Name.replace(/[\s.]/g, "").toLowerCase(),
            false
          );
          syncedStatus = companySyncCTX.getIsSyncedByCompanyName(
            companies.Name.replace(/[\s.]/g, "").toLowerCase()
          );
        } else if (syncCompany?.code === 400) {
          setIsSyncing(false);
        }
      }
    } catch (error) {
      console.error(error);
      userCTX.handleSyncData(false);
      // setIsSyncing(false);
      // {setIsSyncing !== undefined ? setIsSyncing(false) : ""}
    }
  };
  // function to show loader when you do resync
  const showResyncLoader = async () => {
    if (location?.state !== null) {
      syncStatusCtx.handleSetIsSyncing(location?.state, 0, false, true);
      ipcRenderer.on("sync-progress-check", (event: any, params: any) => {
        console.log("sync progress ------------>", params.progress);
        if (params.isCronJob === false) {
          syncStatusCtx.handleSetIsSyncing(
            location?.state,
            params.progress,
            false,
            true
          );
          if (params.code === 400) {
            // const ans = ipcRenderer.mobilePushNotification({
            //   expoToken: userCTX?.userDetails?.expoToken,
            //   title: "Error occured",
            //   body: `Error occured at the time of syncing ${params.companyName}`,
            // });
            syncStatusCtx.handleSetIsSyncing("", 0, true, false);
          }
        }
        if (params?.progress === 100) {
          syncStatusCtx?.handleSetIsSyncing("", 0, true, false);
          syncStatusCtx.updateSyncingStatus(false);
        }
      });
    }
  };
  // function to show the time difference
  const formatTimeDifference = (time: any) => {
    let startTime = moment(time);
    const endTime = moment();
    const duration = moment.duration(endTime.diff(startTime));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const days = duration.days();
    const months = duration.months();
    if (months) {
      return `Synced ${months} months ago`;
    } else if (days) {
      return `Synced ${days} days ago`;
    } else if (hours) {
      return `Synced ${hours} hours ago`;
    } else if (minutes) {
      return `Synced ${minutes} minutes ago`;
    } else if (seconds) {
      return `Synced few seconds ago`;
    }
  };
  // function to get the time from context
  const getTimeFromContext = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const findActiveLicense = await userCTX?.userDetails?.tallyLicenses?.find(
      (license: any) =>
        license.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
    );
    const companiesArr = findActiveLicense?.companies;
    const timeobj = await companiesArr?.find((item: any) => {
      if (item.companyInfo.Name === companies.Name) {
        return item;
      }
    });
    if (timeobj !== undefined) {
      setTime((prevTime: any) => timeobj?.lastSyncedTime || prevTime);
      setRenderTrigger((prev) => prev + 1);
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
        if (item.companyInfo.Name === companies.Name) {
          return item;
        }
      });
      setTime((prevTime: any) => time?.lastSyncedTime || prevTime);
      setRenderTrigger((prev) => prev + 1);
    }
  };
  const reload = async () => {
    try {
      await ipcRenderer.appReload();
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleModalOpen = () => {
    setUserBackup(userBackupRef.current);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    handlePopoverClose();
  };
  const handlePopoverOpen = (event: any) => {
    setPopoverAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "#FFFFFF",
        // border: `2px solid ${lastSyncTime !== "" ? "#F3F3F3" : "red"}`,
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        position: "relative",
        // boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
        marginTop: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 0.5,
          paddingX: "12px",
        }}
      >
        {isSyncing || isSyncing === undefined ? (
          ""
        ) : (
          <Typography
            sx={{
              color: "#02AD28",
              display: "flex",
              alignItems: "center",
              fontSize: "11px",
              fontWeight: 500,
              marginBottom: 0.8,
            }}
            component="div"
          >
            {formatTimeDifference(time)}
          </Typography>
        )}
        {companies?.Name ? (
          <Typography
            sx={{ color: "#000000", fontSize: "14px", fontWeight: 500 }}
          >
            {companies?.Name}
          </Typography>
        ) : (
          <Typography sx={{ color: "#000000", fontSize: "14px" }}>
            {companies}
          </Typography>
        )}

        {companies?.StartingFrom ? (
          <Typography
            sx={{
              margin: 0,
              color: "#A4A4A4",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {`From - ${startingFrom}`}
          </Typography>
        ) : (
          <Typography
            sx={{
              margin: 0,
              color: "#7D7D7D",
              fontSize: "14px",
            }}
          ></Typography>
        )}

        {showSyncButton === false ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
              marginTop: 1,
            }}
          >
            <SyncDisabledIcon
              sx={{ color: "#FF3131", width: "18px", height: "18px" }}
            />
            <Typography
              sx={{
                fontSize: "12px",
                color: "#FF2424",
                fontStyle: "italic",
                fontWeight: 500,
              }}
            >
              Either this company is not opened in Tally or the data path is
              different.
            </Typography>
          </Box>
        ) : (
          ""
        )}
      </Box>

      {syncStatusCtx?.isSyncing?.companyName === companies?.Name ? (
        <Loader percentage={syncStatusCtx?.isSyncing?.currectProgress} />
      ) : showSyncButton ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            onClick={() => {
              if (!isSyncing) {
                fetchData();
                // handleSyncStart();
              }
            }}
            sx={{
              // backgroundColor: "#4470AD",
              marginRight: "5px",
              padding: "10px",
              fontSize: "13px",
              border: "1px solid #4470AD",
              height: "30px",
              display: {},
              fontWeight: 500,
              ":hover": {
                backgroundColor: "#4470AD",
                color: "white",
              },
              ":disabled": {
                borderColor: "rgba(0, 0, 0, 0.26)",
              },
            }}
            disabled={syncingStatus || syncStatusCtx?.syncStart}
          >
            Sync Now
          </Button>
          {showDeleteStatus && syncingStatus == false ? (
            <MoreVertIcon
              sx={{
                color: "GrayText",
                ":hover": { cursor: "pointer", backgroundColor: "#D3D3D3" },
                width: "20px",
                height: "20px",
                borderRadius: "50%",
              }}
              onClick={handlePopoverOpen}
            />
          ) : (
            <Box></Box>
          )}
          <Popover
            open={openPopover}
            anchorEl={popoverAnchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPaper-root": {
                boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
              },
            }}
          >
            <MenuItem
              onClick={() =>
                navigate("/deletecompany", {
                  state: { companies, ownedcompany: true },
                })
              }
              sx={{
                fontSize: "14px",
              }}
            >
              Info
            </MenuItem>
            <MenuItem onClick={handleModalOpen} sx={{ fontSize: "14px" }}>
              Delete
            </MenuItem>
          </Popover>

          <Modal
            open={isModalOpen}
            onClose={setModalOpen}
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
                p: 4,
                width: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "8px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#FFF1F1",
                  borderRadius: "30px",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <WarningAmberIcon sx={{ color: "#F04545" }} />{" "}
              </Box>

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  textAlign: "center",
                  marginBottom: "22px",
                  fontSize: "18px",
                }}
              >
                Delete Company
              </Typography>
              {/* <Button
            onClick={() => {
              handleModalClose();
            }}
            sx={{ position: "absolute", right: 0, top: 0 }}
          >
            <CloseRoundedIcon sx={{ color: "red" }} />
          </Button> */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "22px",
                }}
              >
                <Checkbox
                  checked={userBackup}
                  onChange={(e) => setUserBackup(e.target.checked)}
                  inputProps={{ "aria-label": "userBackup checkbox" }}
                  sx={{
                    color: "#a6a6a6",
                    ":hover": {
                      backgroundColor: "white",
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: "#b5b5b5",
                    fontSize: "13px",
                    fontWeight: 400,
                    marginLeft: "10px",
                  }}
                >
                  Ensure that your user backup has not been lost.
                </Typography>
              </Box>

              <Button
                onClick={handleDelete}
                sx={{
                  backgroundColor: "#FF2121",
                  borderRadius: "10px",
                  width: "100%",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  ":hover": {
                    backgroundColor: "#FF2121",
                  },
                  marginBottom: "12px",
                  fontSize: "13px",
                }}
              >
                Delete Company
              </Button>
              <Button
                onClick={() => {
                  handleModalClose();
                }}
                variant="outlined"
                sx={{
                  borderRadius: "10px",
                  width: "100%",
                  height: "40px",
                  color: "#b5b5b5",
                  borderColor: "#b5b5b5",
                  ":hover": {
                    backgroundColor: "#e6e6e682",
                    borderColor: "#e6e6e682",
                  },
                  fontSize: "13px",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </Box>
      ) : (
        <Box>
          {syncStatusCtx.isSyncing.companyName === companies.Name &&
          syncStatusCtx.isSyncing.isSyncCompleted === false ? (
            <Loader percentage={syncStatusCtx.isSyncing.currectProgress} />
          ) : (
            <Button
              variant="text"
              sx={{
                border: "1px solid #4470AD",
                height: "30px",
                marginRight: "15px",
                fontSize: "13px",
                fontWeight: 500,
                ":hover": {
                  backgroundColor: "#4470AD",
                  color: "white",
                },
              }}
              onClick={() =>
                navigate("/deletecompany", {
                  state: { companies, ownedcompany: false },
                })
              }
            >
              Edit
            </Button>
          )}
          <ToastContainer style={{ width: "auto" }} />
        </Box>
      )}
    </Box>
  );
};

export default Company;
