import { useContext, useEffect, useState } from "react";
import { alpha } from "@mui/system";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  InputBase,
  Modal,
  Typography,
} from "@mui/material";
const { ipcRenderer }: any = window;
import { useLocation } from "react-router-dom";
import { ipProxy } from "../../../core/ipConfig";
import { UserContext } from "@/Store/Context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { SyncStatusContext } from "@/Store/Context/SyncStatusContext";

const Deletecompany = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userCTX: any = useContext(UserContext);
  const location = useLocation();
  const companyData = location.state.companies || {};
  const isOwned = location.state.ownedcompany;
  const [syncData, setSyncData] = useState<boolean>(true);
  const [autoImportVoucher, setAutoImportVoucher] = useState<boolean>(true);
  const [initialState, setInitialState] = useState({
    syncData: syncData,
    autoImportVoucher: autoImportVoucher,
  });
  const [companyName, setCompanyName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [userBackupCheckbox, setUserBackupCheckbox] = useState(true);
  const [resyncOpenModal, setResyncOpenModal] = useState(false);
  const [resyncUserBackup, setResyncUserBackup] = useState(false);
  const [tallyCompanies, setTallyCompanies] = useState([]);
  const [resyncOwnedModal, setResyncOwnedModal] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [tallyLicenseNumber, setTallyLicenseNumber] = useState();
  const [notUnderLicense, setNotUnderLicense] = useState(false);

  const syncStatusCtx: any = useContext(SyncStatusContext);
  const getData = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const requiredMatchingCompanies = userCTX?.userDetails?.tallyLicenses?.find(
      (license: any) =>
        license.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
    );
    const matchedCompany = requiredMatchingCompanies?.companies.find(
      (comp: any) => comp.companyInfo.Name === companyData.Name
    );
    setTallyLicenseNumber(requiredMatchingCompanies?.tallyLicenseNumber);
    if (matchedCompany === undefined) {
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
      const matchedCompany2 = otherLicensesCompanies?.find(
        (comp: any) => comp.companyInfo.Name === companyData.Name
      );
      setTallyLicenseNumber(otherLicenses[0].tallyLicenseNumber);
      setNotUnderLicense(true);
      setCompanyId(matchedCompany2?._id);
      setSyncData(matchedCompany2?.syncData);
      setAutoImportVoucher(matchedCompany2?.autoImportVoucher);
    } else {
      setCompanyId(matchedCompany?._id);
      setSyncData(matchedCompany?.syncData);
      setAutoImportVoucher(matchedCompany?.autoImportVoucher);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (isOwned === false) {
      getTallyCompanies();
    }
  }, []);
  // function to get users config
  const fetchCurrentMachineConfig = async () => {
    const machineId = await ipcRenderer.getMachineId();
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const currentMachineConfig = userCTX.userDetails?.tallyLicenses?.find(
      (item: any) => item.tallyLicenseNumber === tallyInfo?.info?.licenseNumber
    );
    const connectors = currentMachineConfig.connectors;
    const currentMachineConfig2 = connectors?.find(
      (item: any) => item.machineId === machineId
    );
    return currentMachineConfig2.config;
  };
  // function to get companies which are opened in tally
  const getTallyCompanies = async () => {
    try {
      const currentMachineConfig = await fetchCurrentMachineConfig();
      const response = await ipcRenderer.fetchCompanyInfo(
        currentMachineConfig !== undefined
          ? currentMachineConfig?.tallyPort
          : localStorage.getItem("port")
      );
      if (response.code === 400) {
        return;
      }
      setTallyCompanies(response.info);
    } catch (error) {
      console.log(error);
    }
  };
  // re-sync funtion to be called which companies are not-syncing state
  const handleResyncNotOwned = async () => {
    setResyncOpenModal(false);
    const companyOpenedinTally = tallyCompanies.some(
      (obj: any) => obj.Name === companyData.Name
    );
    if (companyOpenedinTally === true) {
      const tallyInfo = await ipcRenderer.fetchTallyInfo(
        localStorage.getItem("port")
      );
      navigate("/readytosync", { state: companyData.Name });
      const url = `${ipProxy}/resync/onresync`;
      const params = {
        companyId: companyId,
        userBackup: `${resyncUserBackup === true ? "true" : "false"}`,
        tallyLicenseNumber: notUnderLicense
          ? tallyLicenseNumber
          : tallyInfo?.info?.licenseNumber,
      };
      try {
        const response = await axios.delete(url, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          syncStatusCtx.updateSyncingStatus(true);
          const currentMachineConfig = await fetchCurrentMachineConfig();
          const tallyInfo = await ipcRenderer.fetchTallyInfo(
            currentMachineConfig !== undefined
              ? currentMachineConfig?.tallyPort
              : localStorage.getItem("port")
          );
          const syncCompany = await ipcRenderer.syncCompany({
            port: localStorage.getItem("port"),
            companyData: companyData,
            tallyInfo: tallyInfo,
            email: localStorage.getItem("email"),
            userData: userCTX?.userDetails,
          });
          if (syncCompany.code === 200) {
            // console.log("sync company complete from the delete page ");
          }
        }
      } catch (error) {
        console.log("error ", error);
      }
    } else {
      companyOpenedtally();
    }
  };
  // re-sync function to be called companies are in the syncing state
  const handleResyncOwned = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    navigate("/readytosync", { state: companyData.Name });
    const machineId = await ipcRenderer.getMachineId();
    const url = `${ipProxy}/company/delete`;
    const params = {
      companyId: companyId,
      machineId: `${machineId}`,
      userBackup: `true`,
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
        syncStatusCtx.updateSyncingStatus(true);
        const currentMachineConfig = await fetchCurrentMachineConfig();
        const tallyInfo = await ipcRenderer.fetchTallyInfo(
          localStorage.getItem("port")
        );
        const syncCompany = await ipcRenderer.syncCompany({
          port: localStorage.getItem("port"),
          companyData: companyData,
          tallyInfo: tallyInfo,
          email: localStorage.getItem("email"),
          userData: userCTX?.userDetails,
        });
        if (syncCompany?.code === 200) {
          // console.log("sync company complete from the delete page ");
        }
      }
    } catch (error: any) {
      console.log("error of resync ", error);
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
  // console.log(userCTX)
  // function to delete a company
  const handleDelete = async () => {
    const tallyInfo = await ipcRenderer.fetchTallyInfo(
      localStorage.getItem("port")
    );
    const url = `${ipProxy}/company/delete`;
    const params = {
      companyId: companyId,
      userBackup: `${userBackupCheckbox === true ? "true" : "false"}`,
      tallyLicenseNumber: notUnderLicense
        ? tallyLicenseNumber
        : tallyInfo?.info?.licenseNumber,
    };
    try {
      const response = await axios.delete(url, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        navigate("/companylist");
        // reload();
      }
    } catch (error: any) {
      console.log("Error deleting data: ", error);
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
  // function to update a company
  const handleUpdate = () => {
    const url = `${ipProxy}/company/updatecompanyinfo`;
    const dataToUpdate = {
      allowSync: syncData === true ? true : false,
      allowAddVoucher: syncData === true ? true : false,
      // allowAddVoucher: autoImportVoucher === true ? true : false,
    };
    axios
      .patch(`${url}?companyId=${companyId}`, dataToUpdate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        updateSuccess();
      })
      .catch((error: any) => {
        console.error("There was a problem with the patch request", error);
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
      });
  };
  const maskLicenseNumber = (licenseNumber: any) => {
    const lastFourDigits = licenseNumber?.slice(-4);
    const maskedPart = licenseNumber?.slice(0, -4).replace(/./g, "*");
    return maskedPart + lastFourDigits;
  };
  const handleModalOpen = () => {
    setOpenModal(true);
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };
  const reload = async () => {
    try {
      await ipcRenderer.appReload();
    } catch (err) {
      console.log(err);
    }
  };
  // helper functions
  const updateSuccess = () => {
    toast.success("updated company data  successfully", {
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
  const companyOpenedtally = () => {
    toast.error(`${companyData.Name} is not opened in tally`, {
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
  console.log(syncData == initialState.syncData &&
    autoImportVoucher == initialState.autoImportVoucher, 'sssss');
  return (
    <Box
      sx={{
        width: "100%",
        height: "95%",
        marginTop: "-23px",
        backgroundColor: alpha("#FFFFFF", 0.8),
        paddingLeft: "20px",
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* heading and buttons section  */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Typography sx={{ color: "#000", fontSize: "18px", fontWeight: 500 }}>
          Company info
        </Typography>
        <Box
          sx={{
            display: "flex",
            marginRight: "15px",
            gap: 1.5,
          }}
        >
          <Button
            sx={{
              backgroundColor: "#4470AD",
              borderRadius: "5px",
              // width: "80px",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              ":hover": {
                backgroundColor: "#4470AD",
              },
              ":disabled": {
                color: "white",
                backgroundColor: "#e0e0e0",
              },
            }}
            onClick={() => {
              handleUpdate();
            }}
          >
            UPDATE CHANGES
          </Button>
          <Button
            sx={{
              backgroundColor: "#FF6E6E",
              borderRadius: "5px",
              // width: "80px",
              height: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "13px",
              fontWeight: 500,
              ":hover": {
                backgroundColor: "red",
              },
            }}
            onClick={handleModalOpen}
          >
            DELETE COMPANY
          </Button>
        </Box>
      </Box>

      <Modal
        open={openModal}
        onClose={handleModalClose}
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
            sx={{ textAlign: "center", marginBottom: "22px", fontSize: "18px" }}
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
              checked={userBackupCheckbox}
              onChange={(event) => setUserBackupCheckbox(event.target.checked)}
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

      {/* company input section  */}
      <Box
        sx={{
          width: "80%",
          height: "auto",
          // paddingLeft: "15px",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          marginTop: "25px",
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
            sx={{ color: "#B0B0B0", fontSize: "15px", fontWeight: 500 }}
          >
            Company Name
          </Typography>
          <InputBase
            defaultValue={companyData?.Name || companyName}
            onChange={(e: any) => setCompanyName(e.target.value)}
            disabled={true}
            sx={{
              backgroundColor: "white",
              border: "1px solid #D7D7D7",
              borderRadius: "8px",
              width: "95%",
              paddingLeft: 2,
              paddingY: 0.3,
              fontSize: "14px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "white",
              },
              ":disabled": {},
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Typography
              sx={{ color: "#B0B0B0", fontSize: "15px", fontWeight: 500 }}
            >
              Tallylicense No: {maskLicenseNumber(tallyLicenseNumber)}
            </Typography>
          </Box>
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
            sx={{ color: "#B0B0B0", fontSize: "15px", fontWeight: 500 }}
          >
            Tally Company Name
          </Typography>
          <InputBase
            defaultValue={companyData?.Name || ""}
            readOnly
            sx={{
              backgroundColor: "#EDEDED",
              // border: "1px solid #D7D7D7",
              border: "none",
              borderRadius: "8px",
              width: "95%",
              paddingLeft: 2,
              paddingY: 0.3,
              fontSize: "14px",
              fontWeight: 600,
              color: "#808080",
              "&:hover": {
                backgroundColor: "#EDEDED",
              },
            }}
          />
        </Box>

        {/* checkbox 1 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "16px",
            marginTop: "15px",
            gap: 1,
          }}
        >
          <Checkbox
            sx={{ padding: 0 }}
            checked={syncData}
            onChange={(event) => setSyncData(event.target.checked)}
            size="small"
          />
          <Typography
            sx={{ marginRight: 1, fontSize: "16px", fontWeight: 500 }}
          >
            Sync Data
          </Typography>
        </Box>
        <Typography sx={{ textAlign: "left", fontSize: "14px", color: "gray" }}>
          if 'Sync Data' is checked off, this company will no longer be synced
          by Accosync.
        </Typography>
        <Typography sx={{ textAlign: "left", fontSize: "14px", color: "gray" }}>
          if 'auto sync' is off, then vouchers added via phone will be in a
          pending state
        </Typography>
        {/* checkbox 2  */}
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "15px",
            marginTop: "10px",
            gap: 1,
          }}
        >
          <Checkbox
            sx={{ padding: 0 }}
            checked={autoImportVoucher}
            onChange={(event) => setAutoImportVoucher(event.target.checked)}
            size="small"
            disableRipple
          />
          <Typography
            sx={{ marginRight: 1, fontSize: "16px", fontWeight: 500 }}
          >
            Auto Import Voucher
          </Typography>
        </Box> */}
        {/* <Typography sx={{ textAlign: "left", fontSize: "14px", color: "gray" }}>
          if 'Auto import voucher' is checked off, voucher created from Accosync
          App won't be entered in tally automatically.
        </Typography> */}
      </Box>

      {/* divider  */}
      <Divider
        sx={{
          marginTop: 2,
          borderColor: "#D2D2D2;",
          width: "95%",
          height: "2px",
        }}
      />
      {/* re-sync data section  */}
      <Box
        sx={{
          width: "96%",
          height: "auto",
          paddingLeft: "10px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "25px",
        }}
      >
        <Box
          sx={{
            marginLeft: "-10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              textAlign: "left",
              // color: "#6C6C6C",
              color: "#313131",
              marginBottom: "10px",
              fontSize: "17px",
              fontWeight: 500,
            }}
          >
            Re-Sync Data
          </Typography>

          <Typography
            sx={{
              textAlign: "left",
              color: "#6C6C6C",
              maxWidth: "70%",
              fontSize: "14px",
            }}
          >
            Resync <strong>{companyData.Name}</strong>'s data with Accosync.
            This will clear your data in Accosync App and sync from the start.
          </Typography>
        </Box>
        {/* <Tooltip
          title="Feature currently in progress ..."
          arrow
          placement="top"
        >
          
        </Tooltip> */}
        <Button
          sx={{
            width: "180px",
            height: "35px",
            borderRadius: "5px",
            backgroundColor: "#4470AD",
            color: "white",
            fontSize: "13px",
            ":hover": {
              backgroundColor: "#4470AD",
              cursor: "pointer",
              color: "white",
            },
          }}
          onClick={
            isOwned
              ? () => setResyncOwnedModal(true)
              : () => setResyncOpenModal(true)
          }
        >
          RE-SYNC DATA
        </Button>
        <Modal
          open={resyncOpenModal}
          onClose={() => setResyncOpenModal(false)}
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
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={resyncUserBackup}
                onChange={(e) => setResyncUserBackup(e.target.checked)}
                inputProps={{ "aria-label": "userBackup checkbox" }}
              />
              <Typography>User Backup</Typography>
            </Box>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleResyncNotOwned}
                sx={{ marginRight: 2 }}
                disabled={ syncStatusCtx?.syncStart}
              >
                re-sync data
              </Button>
            </Box>
          </Box>
        </Modal>
        <Modal
          open={resyncOwnedModal}
          onClose={() => setResyncOwnedModal(false)}
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
            }}
          >
            <Typography>Are you sure you want to resync. </Typography>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleResyncOwned}
                sx={{ marginRight: 2 }}
              >
                yes
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setResyncOwnedModal(false)}
                sx={{ marginRight: 2 }}
              >
                no
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <ToastContainer style={{ width: "auto" }} />
    </Box>
  );
};

export default Deletecompany;
