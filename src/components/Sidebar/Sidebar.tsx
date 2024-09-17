import { useContext, useEffect, useState } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import companyimage from "../../assets/Companies.png";
import addCompany from "../../assets/add-company.png";
import profile from "../../assets/Profile.png";
import setting from "../../assets/Setting.png";
import priceTag from "../../assets/price-tag.png";
import addcompany from "../../assets/Addcompany.png";
import logout from "../../assets/Logout.png";
import phone from "../../assets/Phone.png";
import email from "../../assets/Email.png";
import BrowserUpdatedIcon from "@mui/icons-material/BrowserUpdated";
import HelpIcon from "@mui/icons-material/Help";
import question from "../../assets/question.png";
import help from "../../assets/Help.png";
import "./SideBar.css";
// import { ipcRenderer, shell } from "electron";
const { ipcRenderer }: any = window;
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import LogoutIcon from "@mui/icons-material/Logout";
import { Eamil, Mobile } from "../../../core/appConfig";
import { UserContext } from "@/Store/Context/UserContext";
//Function for comapring the current Version and lastest version availaible
const compareVersions = (versionA: any, versionB: any) => {
  const versionArrA = versionA?.split(".").map(Number);
  const versionArrB = versionB?.split(".").map(Number);

  for (let i = 0; i < Math.max(versionArrA?.length, versionArrB?.length); i++) {
    const numA = versionArrA[i] || 0;
    const numB = versionArrB[i] || 0;

    if (numA > numB) {
      return 1;
    } else if (numA < numB) {
      return -1;
    }
  }

  return 0;
};

const sidebarMenuItems: any = [
  { icon: companyimage, label: "Companies", route: "companylist" },
  { icon: addCompany, label: "Add company", route: "readytosync" },
  { icon: profile, label: "Profile", route: "profile" },
  { icon: setting, label: "Settings", route: "settings" },
  { icon: help, label: "Tutorial", route: "tutorial" },
];

const Sidebar = () => {
  const userCtx: any = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(sidebarMenuItems[0].route);
  {
    /*----------------Update Mechanism---------------------------*/
  }
  const [latestVersionfromDB, setLatestVersionFromDB] = useState("1.0.0");
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
  const [subscriptionDisable, setSubscriptionDisable] = useState(false);
  const [currentNameFromDB, setCurrentNameFromDB] = useState("");
  const [latestVersionURLFromDB, setLatestVersionURLFromDB] = useState();
  const [currentVersionFromApp, setCurrentVersionFromApp] = useState();
  const [isSkippableStatus, setIsSkippsbleStatus] = useState<any>();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [subscriptionEnabled, setSubscriptionEnabled] = useState(
    false
  );
  useEffect(() => {
    const fetchVersionFromDB = async () => {
      try {
        // Fetch latest version
        const isSubscriptionEnabled = await ipcRenderer.showPurchaseSection();
        console.log(isSubscriptionEnabled, "fin");
        const latestVersion = await ipcRenderer.latestVersion();
        const checkCurrentVersion = await ipcRenderer.currentVersion();
        const latestVersionURL = await ipcRenderer.latestVersionUrl();
        const isSkippable = await ipcRenderer.isSkippable();

        setSubscriptionDisable(isSubscriptionEnabled);
        setLatestVersionFromDB(latestVersion);
        setLatestVersionURLFromDB(latestVersionURL);
        setCurrentVersionFromApp(checkCurrentVersion);
        setIsSkippsbleStatus(isSkippable);
        if (isSkippable) {
          // console.log("skip ---------------", isSkippable);
        } else {
          handleOpen();
        }

        // Compare versions and enable/disable the update button accordingly
        const isUpdateAvailable =
          compareVersions(latestVersion, checkCurrentVersion) > 0;
        // console.log(isUpdateAvailable, "isUpdateAvailable status");
        setUpdateButtonDisabled(!isUpdateAvailable);
      } catch (error) {
        console.error("Error fetching version from the database:", error);
      }
    };

    fetchVersionFromDB();

    const intervalId = setInterval(fetchVersionFromDB, 50000);

    return () => clearInterval(intervalId);
  }, [subscriptionDisable]);

  {
    /*---------------------------------------------------------*/
  }
  useEffect(() => {
    const currentRoute = location.pathname.replace("/", "");
    if (!currentRoute) {
      // Handle the case when no route is selected, set default to 'companylist'
      navigate("/companylist");
      setActiveItem("companylist");
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const currentRoute = location.pathname.replace("/", "");
    setActiveItem(currentRoute);
  }, [location.pathname]);

  const handleItemClick = (item: any) => {
    navigate(`/${item.toLowerCase()}`);
    setActiveItem(item);
  };
  const reload = async () => {
    try {
      await ipcRenderer.appReload();
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    reload();
  };

  const isItemActive = (item: any) => activeItem === item;

  // const handleUpdateClick = () => {
  //   console.log("Checking for updates and downloading...");
  //   // Redirect to the Bitbucket repository download link
  //   shell.openExternal(
  //     `https://bitbucket.org/decobee-tech/tally-connector-artifact-main/downloads/${currentNameFromDB}_${latestVersionfromDB}.exe`
  //   );
  // };

  const handleUpdateDownloadClick = () => {
    // console.log("Checking for updates and downloading...");
    try {
      // shell.openExternal(`${latestVersionURLFromDB}`);
      window.open(`${latestVersionURLFromDB}`, "_blank");
      // handleClose();
    } catch (error) {
      console.error(error, "Error while downloading update...");
    }
  };
  const getsucscription = () => {
    if(location.pathname === "/pricing"){
      setSubscriptionEnabled(false);
    }else{
      setSubscriptionEnabled(userCtx?.helpContact?.subscriptionEnabled);
    }
    
  }
  useEffect(() => {
    getsucscription();
  },[userCtx?.helpContact, location]);
  return (
    <Box
      sx={{
        backgroundColor: "white",
        minWidth: "22%",
        maxWidth: "22%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 0.5,
        marginTop: "2px",
        borderRadius: 1.2,
        paddingTop: "5px",
      }}
    >
      {sidebarMenuItems?.map((item: any, index: any) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: isItemActive(item?.route) ? "#D1F1FF" : "#FFFFFF",
            width: "90%",
            gap: 3,
            paddingLeft: "10px",
            paddingY: "10px",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            marginLeft: 0,
            ":hover": {
              cursor: "pointer",
            },
            // boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
          }}
          onClick={() => handleItemClick(item.route)}
        >
          <img
            src={item.icon}
            style={{
              width: "13px",
              height: "13px",
              backgroundSize: "cover",
              backgroundColor: isItemActive(item.route) ? "#D1F1FF" : "#FFFFFF",
            }}
          />
          <Typography
            sx={{ color: "#000000", fontSize: "14px", fontWeight: "500" }}
          >
            {item.label}
          </Typography>
        </Box>
      ))}
      {subscriptionDisable && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "white",
            width: "90%",
            gap: 3,
            paddingLeft: "10px",
            paddingY: "10px",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px",
            marginLeft: 0,
            ":hover": {
              cursor: "pointer",
            },
          }}
          onClick={() => navigate(`pricing`)}
        >
          <img
            src={priceTag}
            style={{
              width: "13px",
              height: "13px",
              backgroundSize: "cover",
              backgroundColor: "white",
            }}
          />
          <Typography
            sx={{ color: "#000000", fontSize: "14px", fontWeight: "500" }}
          >
            Subscription
          </Typography>
        </Box>
      )}
      {!updateButtonDisabled && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "190px",
              height: "40px",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
              position: "relative",
              overflow: "hidden",
              boxSizing: "border-box",
              paddingLeft: "2px",
              ":hover": {
                cursor: "pointer",
              },
              "&::before": {
                content: '""', // Replaces attr(content)
                position: "absolute",
                width: "calc(100% - 5px)",
                height: "calc(100% - 5px)",
                zIndex: 1,
                backgroundColor: "#ffffff",
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                color: "#000000",
                fontSize: "14px",
                fontWeight: "500",
              },
              "&::after": {
                content: '""',
                width: "190px",
                height: "400px",
                position: "absolute",
                borderTopRightRadius: "5px",
                borderBottomRightRadius: "5px",
                background: `conic-gradient(
            #3a7cec 0%12.5%,
            #3BB2FF 12.5%25%,
            #A0E8FF 25%37.5%,
            #D1F1FF 37.5%50%,
            #3a7cec 50%62.5%,
            #3BB2FF 62.5%75%,
            #A0E8FF 75%87.5%,
            #D1F1FF 87.5%100%
          )`,
                animation: "border-animation 5s linear infinite",
              },
              "@keyframes border-animation": {
                to: {
                  transform: "rotate(360deg)",
                },
              },
            }}
            onClick={handleOpen}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                zIndex: 2,
                marginLeft: "10px",
                gap: 1.5,
              }}
            >
              <BrowserUpdatedIcon
                style={{
                  width: "14px",
                  height: "14px",
                  marginRight: "10px", // Gap between icon and text
                }}
              />
              <Typography
                sx={{
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Update
              </Typography>
            </Box>
          </Box>
          <Modal open={open} disableEscapeKeyDown={true} hideBackdrop={true}>
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 1,
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ fontWeight: "700" }}
              >
                Latest Version Available
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, color: "grey", fontSize: 14 }}
              >
                Current Application Version:{" "}
                <span style={{ fontWeight: "600", color: "black" }}>
                  v{currentVersionFromApp}
                </span>
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, color: "grey", fontSize: 14 }}
              >
                New Version Available:{" "}
                <span style={{ fontWeight: "600", color: "black" }}>
                  v{latestVersionfromDB}
                </span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  mt: 2,
                }}
              >
                {isSkippableStatus ? (
                  <Button
                    onClick={handleClose}
                    sx={{
                      color: "black",
                      backgroundColor: "lightgrey",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "lightgrey",
                      },
                    }}
                  >
                    Skip
                  </Button>
                ) : (
                  <Button
                    onClick={() => ipcRenderer.appClose()}
                    sx={{
                      color: "black",
                      backgroundColor: "lightgrey",
                      "&:hover": {
                        color: "black",
                        backgroundColor: "lightgrey",
                      },
                    }}
                  >
                    Exit
                  </Button>
                )}
                <Button
                  onClick={handleUpdateDownloadClick}
                  sx={{
                    color: "black",
                    backgroundColor: "lightblue",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "lightblue",
                    },
                  }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Modal>
          {/* <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: "absolute" as "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 1,
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ fontWeight: "700" }}
              >
                Latest Version Availaible
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, color: "grey" }}
              >
                Current Application Version :{" "}
                <span style={{ fontWeight: "600", color: "black" }}>
                  v{currentVersionFromApp}
                </span>
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, color: "grey" }}
              >
                New Version Availaible :{" "}
                <span style={{ fontWeight: "600", color: "black" }}>
                  v{latestVersionfromDB}
                </span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  onClick={handleUpdateDownloadClick}
                  sx={{
                    color: "black",
                    backgroundColor: "lightblue",
                    "&:hover": {
                      color: "black",
                      backgroundColor: "lightblue",
                    },
                  }}
                >
                  Download
                </Button>
              </Box>
            </Box>
          </Modal> */}
        </>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "90%",
          gap: 0.5,
          paddingLeft: "10px",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          // marginLeft: 2,
          marginTop: "auto",
          backgroundColor: "white",
          paddingY: "10px",
          // boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
        }}
      >
        {/* <img
          src={phone}
          style={{ width: "12px", height: "12px", backgroundSize: "cover" }}
        /> */}
        <LocalPhoneIcon sx={{ width: "14px", height: "14px" }} />
        <Typography
          sx={{ fontSize: "12px", color: "#000000", fontWeight: "500" }}
        >
          +91 {userCtx?.helpContact?.mobile}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          width: "90%",
          gap: 0.5,
          paddingLeft: "10px",
          borderTopRightRadius: "5px",
          borderBottomRightRadius: "5px",
          // marginLeft: 1,
          marginBottom: "50px",
          backgroundColor: "white",
          paddingY: "10px",
          // boxShadow: "0 0px 4px rgba(0, 0, 0, 0.09)",
        }}
      >
        {/* <img
          src={email}
          style={{ width: "12px", height: "12px", backgroundSize: "cover" }}
        /> */}
        <EmailIcon sx={{ width: "14px", height: "14px" }} />
        <Typography
          sx={{ fontSize: "12px", color: "#000000", fontWeight: "500" }}
        >
          {userCtx?.helpContact?.email}
        </Typography>
      </Box>
      <Modal
        open={subscriptionEnabled}
        onClose={() => setSubscriptionEnabled(false)}
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
          <Typography>Subscription expired</Typography>
          <Typography>
            {" "}
            Thank you for being a valued member! Unfortunately, your
            subscription has expired. We’d love to have you back—renew now for
            continued access to all features.
          </Typography>
          <Box>
            <Button
              onClick={() => {
                navigate("/pricing");
                setSubscriptionEnabled(false);
              }}
            >
              Renew
            </Button>
            <Button onClick={() => setSubscriptionEnabled(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Sidebar;
