import { createContext, useState } from "react";
export const UserContext = createContext({
  userDetails: {},
  connectors: [],
  companyDetails: [],
  syncincData: {},
  tallyOpened: {},
  isInternetConnected: {},
  helpContact: {},
  saveUserDetails: (value: any) => {},
  updateLastSyncTime: (value: any, value1: any) => {},
  saveCompanyDetails: (value: any) => {},
  handleSyncData: (value: any) => {},
  checkIsTallyOpen: (value: any) => {},
  updateInternetStatus: (value: any) => {},
  saveConnectorDetails: (value: any) => {},
  updateHelpContact: (value: any) => {},
});

function UserContextProvider({ children }: any) {
  const [userDetails, setUserDetails]: any = useState({});
  const [companyDetails, setCompanyDetails] = useState([]);
  const [connectors, setConnectors]: any = useState([]);
  const [tallyOpened, setTallyOpened] = useState({});
  const [isInternetConnected, setIsInternetConnected] = useState({});
  const [syncincData, setSyncincData] = useState<any>([
    {
      companyName: "",
      syncStatus: false,
    },
  ]);
  const [helpContact, setHelpContact]: any = useState({
    email: "",
    mobile: "",
    subscriptionEnabled: false,
  });
  function updateHelpContact(value: any) {
    setHelpContact({
      ...helpContact,
      email: value.connector.helpContactInfo.email,
      mobile: value.connector.helpContactInfo.mobileNumber,
      subscriptionEnabled: value.subscriptionEnabled,
    });
  }
  function updateInternetStatus(value: any) {
    setIsInternetConnected(value);
  }
  function checkIsTallyOpen(value: any) {
    setTallyOpened(value);
  }
  function saveUserDetails(value: any) {
    setUserDetails(value);
  }
  function saveConnectorDetails(value: any) {
    console.log(value, "from context");
    // setConnectors(value);
    setConnectors((prevValue: any) => [...prevValue, value]);
  }

  function saveCompanyDetails(value: any) {
    setCompanyDetails(value);
  }

  function handleSyncData(value: any) {
    setSyncincData(value);
  }

  const updateLastSyncTime = (syncTime: any, CompanyName: any) => {
    const value = { ...userDetails };
    value.lastSyncedTime.forEach((e: any) => {
      if (e.companyName.split("_")[1] == CompanyName) {
        e.time = syncTime;
        console.log(e);
      }
    });
    setUserDetails({ ...userDetails, lastSyncedTime: value.lastSyncedTime });
  };

  const value = {
    userDetails: userDetails,
    connectors: connectors,
    companyDetails: companyDetails,
    tallyOpened: tallyOpened,
    isInternetConnected: isInternetConnected,
    helpContact: helpContact,
    saveUserDetails: saveUserDetails,
    saveConnectorDetails: saveConnectorDetails,
    saveCompanyDetails: saveCompanyDetails,
    updateLastSyncTime: updateLastSyncTime,
    syncincData: syncincData,
    handleSyncData: handleSyncData,
    checkIsTallyOpen: checkIsTallyOpen,
    updateInternetStatus: updateInternetStatus,
    updateHelpContact: updateHelpContact,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
