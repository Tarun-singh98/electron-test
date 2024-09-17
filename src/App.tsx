import { useState, useEffect, useContext } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import UserContextProvider, { UserContext } from "./Store/Context/UserContext";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/profile";
import Settings from "./components/Settings/Settings";
import CompanyList from "./components/CompanyList/CompanyList";
import Footer from "./components/Footer/Footer";
import AuthLoader from "./AuthLoader";
import Sidebar from "./components/Sidebar/Sidebar";
// import Addcompany from "./components/Addcompany/Addcompany";
import Contactus from "./components/Contactus/Contactus";
import CompanySyncContextProvider from "./Store/Context/CompanySyncStatus";
import Deletecompany from "./components/Deletecompany/Deletecompany";
import AdditionalSettings from "./components/Additionalsettings/AdditionalSettings";
import axios from "axios";
import { ipProxy } from "../core/ipConfig";
// import BackgroungImageSignUp from "./assets/background.png";
import { SyncStatusProvider } from "./Store/Context/SyncStatusContext";
// import { ipcRenderer } from "electron";
const { ipcRenderer }: any = window;
import CustomModal from "./components/shared/CustomModal/CustomModal";
import Pricing from "./components/Pricing/Pricing";
import Transfer from "./components/Transfer/Transfer";
import ReadyToSync from "./components/ReadytoSync/ReadyToSync";
import { Box, CircularProgress } from "@mui/material";
import { decryptJSON } from "../electron/main/decryptJson";
import AuthContextProvider, { AuthContext } from "./Store/Context/AuthContext";
import Tutorial from "./components/Tutorial/Tutorial";
function App() {
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  // const [isLoading, setIsloading] = useState(false);
  // const [token, setToken] = useState(localStorage.getItem("token"));
  // const [isValidToken, setIsValidToken] = useState(false);
  // const [isInternetConnected, setIsInternetConnected]: any = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverDownModal, setServerDownModal] = useState(false);

  const [isCheckingComplete, setIsCheckingComplete] = useState(false);

  const handleCheckComplete = (status: any, message?: any) => {
    // console.log("handleCheckComplete trig", status, message)
    // setIsInternetConnected(isOnline);
    setIsCheckingComplete(true);
  };

  const internetRetryHandler = async () => {
    const ans = await ipcRenderer.isOnline();
    // console.log(ans, "isOnline")
    if (ans) {
      authCtx.updateInternetStatus(true);
    }
  };

  // function to check server is up or not
  // const checkServerStatus = async () => {
  //   try {
  //     const response = await axios.get(ipProxy);
  //     if (response.status === 200) {
  //       setServerDownModal(false);
  //     } else {
  //       setServerDownModal(true);
  //     }
  //   } catch (error: any) {
  //     console.log(error, "------> error");
  //     setServerDownModal(true);
  //   }
  // };

  // function to check is interent is connected or not
  // const check = async () => {
  //   try {
  //     const ans = await ipcRenderer.isOnline();
  //     if (ans) {
  //       checkServerStatus();
  //     }
  //     if (ans) {
  //       fetchData();
  //     }
  //     setIsInternetConnected(ans);
  //     setIsModalOpen(!ans);
  //   } catch (error) {
  //     setIsInternetConnected(false);
  //     setIsModalOpen(true);
  //   }
  // };

  // function to reload the app
  // const reloadapp = async () => {
  //   try {
  //     await ipcRenderer.appReload();
  //   } catch (error) {
  //     console.log(error, "error");
  //   }
  // };
  // function to get data from backend
  // const fetchData = async () => {
  //   if (isInternetConnected === true) {
  //     try {
  //       if (token) {
  //         const headers = {
  //           Authorization: `Bearer ${token}`,
  //         };
  //         const response = await axios.get(
  //           `${ipProxy}/user/fetchuserconnector`,
  //           {
  //             headers,
  //           }
  //         );
  //         const secretKey = "superSecretKey";
  //         const decryptedJSON = decryptJSON(response.data, secretKey);
  //         if (decryptedJSON?.status === true) {
  //           setIsValidToken(true);
  //           setIsloading(false);
  //         } else {
  //           setIsValidToken(false);
  //         }
  //       }
  //     } catch (error: any) {
  //       // console.log(error, "error from the app.tsx");
  //       if (
  //         error?.response?.status === 403 ||
  //         error?.response?.status === 401
  //       ) {
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("token");
  //         reloadapp();
  //       }
  //     }
  //   }
  // };
  function AuthStack() {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/companylist" element={<CompanyList />} /> */}
      </Routes>
    );
  }
  function AuthenticatedStack() {
    return (
      <Routes>
        <Route path="/companylist" element={<CompanyList />} />
        <Route path="/readytosync" element={<ReadyToSync />} />
        <Route path="/deletecompany" element={<Deletecompany />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/additionalsettings" element={<AdditionalSettings />} />
        <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
    );
  }
  return (
    <div className="app">
      <SyncStatusProvider>
        <Router>
          <UserContextProvider>
            <CompanySyncContextProvider>
              <AuthLoader onCheckComplete={handleCheckComplete} />
              <Navbar />
              {!isCheckingComplete ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <div
                  className="app-container"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // backgroundImage: `url(${BackgroungImageSignUp})`,
                    backgroundSize: "cover",
                    width: "100%",
                    height: "86%",
                    marginTop: "30px",
                    gap: 8,
                  }}
                >
                  {authCtx?.isTokenValid ? <Sidebar /> : ""}
                  <div
                    className="main-content"
                    style={{
                      width: "100%",
                      height: "100%",
                      // paddingLeft: "20px",
                      backgroundColor: "transparent",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {authCtx?.isTokenValid === true ? (
                      <AuthenticatedStack />
                    ) : (
                      <AuthStack />
                    )}
                  </div>
                </div>
              )}

              {authCtx?.isTokenValid ? <Footer screen="" /> : ""}
              <CustomModal
                isOpen={!authCtx.isInternetConnected}
                onClose={
                  authCtx?.isInternetConnected === true
                    ? () => setIsModalOpen(false)
                    : () => setIsModalOpen(true)
                }
                title={"Internet disconnected"}
                content={
                  "Internet disconnected. Please check and try again later."
                }
                type={"error"}
                hasOkButton={true}
                okButtonText={"retry"}
                okButtonHandler={internetRetryHandler}
                hasCancelButton={true}
                cancelButtonText={"close"}
                showbutton={true}
              />
              {!authCtx?.isServerUp ? (
                <CustomModal
                  isOpen={!authCtx.isServerUp}
                  onClose={() => setServerDownModal(false)}
                  title={"Service unavailable"}
                  content={
                    "Oops! It looks like our service is taking a short break. Don't worry our team is already on it."
                  }
                  type={"error"}
                  showbutton={false}
                />
              ) : (
                ""
              )}
            </CompanySyncContextProvider>
          </UserContextProvider>
        </Router>
      </SyncStatusProvider>
    </div>
  );
}

export default App;
