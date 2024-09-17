import { UserContext } from "./Store/Context/UserContext";
import axios from "axios";
import { ipProxy } from "../core/ipConfig";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ipcRenderer } from "electron";
const { ipcRenderer }: any = window;
import { decryptJSON } from "../electron/main/decryptJson";
import { AuthContext } from "./Store/Context/AuthContext";
import { checkTallyOpen, isServerActive } from "../core/authUtil";


const AuthLoader = ({onCheckComplete}:any) => {
  const userCTX = useContext(UserContext);
  const authCtx = useContext(AuthContext)
  const token = localStorage.getItem("token");

  // const [isInternetConnected, setIsInternetConnected]: any = useState();
  const navigate = useNavigate();
  // console.log(token, 'tok')

  // useEffect(() => {
  //   check();
  //   const ans = setInterval(check, 2000);
  //   return () => {
  //     clearInterval(ans);
  //   };
  // }, []);

  useEffect(()=>{
    const check = async () => {
      try {
        const ans = await ipcRenderer.isOnline();
        // console.log(ans, "----- result");
        if (ans) {
          // console.log("internet con");
          
          authCtx.updateInternetStatus(true);
          getAppConfig();
          try{
            // console.log("serverUp");
            const isServerUp = await isServerActive()
          if (isServerUp){
            authCtx.updateServerStatus(true)
            try{
              const isTallyOpen = await checkTallyOpen();
              if(isTallyOpen){
                // console.log("tally open");
                authCtx.updateTallyOpenStatus(true)
                // onCheckComplete(true)
              }else{
                authCtx.updateTallyOpenStatus(false)
              }
            }catch(err){
              authCtx.updateTallyOpenStatus(false)
            }
            // console.log('token', token)
            if (token) {
              // console.log('if token')
              // console.log("token available");
              authCtx.updateTokenValidity(true)
              await fetchData()
              // await updateContext();
              onCheckComplete(true)
            }else{
              // console.log("else of token");
              localStorage.clear()
              authCtx.updateTokenValidity(false)
              navigate('/')
              onCheckComplete(true,"token not available")
            }
          }else{
            authCtx.updateServerStatus(false)
            onCheckComplete(true,"server not available")
          }
          }catch(err){
            console.log(err)
            authCtx.updateServerStatus(false)
          }
        } else {
          // setIsInternetConnected(false);
          authCtx?.updateInternetStatus(false);
        }
      } catch (error) {
        // console.log(error, '---- error ');
        // setIsInternetConnected(false);
        authCtx.updateInternetStatus(false)
      }
    };
    check()
    const interval = token ? setInterval(check, 7000) : null; // Check every 7 seconds

    return () => {
      if (interval) clearInterval(interval); // Cleanup on unmount
    }; // Cleanup on unmount
  },[onCheckComplete])

  // const handleTokenSend = () => {
  //   ipcRenderer.send("token", token);
  // };


  const reloadapp = async () => {
    try {
      await ipcRenderer.appReload();
    } catch (error) {
      console.log(error, "error");
    }
  };

  // const checkTallyOpen = async () => {
  //   const ans = await ipcRenderer.tallyOpen();
  //   userCTX?.checkIsTallyOpen(ans);
  // };
  const getAppConfig = async () => {
    try{
      const response = await axios.get(`${ipProxy}/appconfig/get`);
      userCTX.updateHelpContact(response?.data?.data);
    }catch(error){
      console.log(error, 'Error');
    }
  }
  const fetchData = async () => {
    if (authCtx.isInternetConnected === true) {
      try {
        const isTallyOpen = await checkTallyOpen();
        if (token) {
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.get(
            `${ipProxy}/user/fetchuserconnector?isTallyConnected=${isTallyOpen}`,
            {
              headers,
            }
          );
          const secretKey = "superSecretKey";
          const decryptedJSON = decryptJSON(response.data, secretKey);
          if (decryptedJSON?.status === true) {
            // setIsValidToken(true);
            // setIsloading(false);
            authCtx.updateTokenValidity(true)
            authCtx.updateLoading(false)
            userCTX.saveUserDetails(decryptedJSON?.data?.userData);
            userCTX.saveCompanyDetails(decryptedJSON?.data?.companiesInfo);
          } else {
            // setIsValidToken(false);
            authCtx.updateTokenValidity(false)
          }
        }
      } catch (error: any) {
        // console.log(error, "error from the app.tsx");
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("host");
          localStorage.removeItem("caseId");
          localStorage.removeItem("port");
          reloadapp();
        }
      }
    }
  };




  // const updateContext = async () => {
  //   const userDataForCTX = await axios.get(
  //     `${ipProxy}/user/fetchuserconnector`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     }
  //   );
  //   const secretKey = "superSecretKey";
  //   const decryptedJSON = decryptJSON(userDataForCTX.data, secretKey);
  //   if (decryptedJSON.status) {
  //     if (decryptedJSON?.data?.userData !== undefined) {
  //       userCTX.saveUserDetails(decryptedJSON?.data?.userData);
  //     }else{
  //       updateContext();
  //     }
  //   }
  // };

  // console.log(userCTX, "userCTX in authloder =======>");

  // useEffect(() => {
  //   if (token && (isInternetConnected === true)) {
  //     updateContext();
  //   }
  //   const intervalId = setInterval(() => {
  //     if(isInternetConnected === true){
  //       updateContext();
  //     }
  //   },1000);
  //   return () => clearInterval(intervalId);
  // }, []);
  // useEffect(() => {
  //   if (token && (isInternetConnected === true)) {
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //     };
  //     axios
  //       .get(`${ipProxy}/user/fetchuserconnector`, { headers })
  //       .then((response) => {
  //         userCTX.saveUserDetails(response.data.data?.userData);
  //         navigate("/companylist");
  //       })
  //       .catch((error) => {
  //         console.error(error, "Error from the authloader");
  //       });
  //   } else {
  //     navigate("/");
  //   }
  // }, []);
  // useEffect(() => {
  //   handleTokenSend();
  // }, []);
  return null;
};

export default AuthLoader;
