import { createContext, useState } from "react";
export const CompanySyncContext = createContext({
  syncincData: {},
  currentSyncProgress: {},
  handleSyncData: (value: any) => {},
  handleCurrentSyncProgress:(value:any)=>{},
  markCompanyAsSyncedInPlace: (value1:  any, value2: any) => {},
  getIsSyncedByCompanyName: (value: any) => {}
});

function CompanySyncContextProvider({ children }: any) {
  const [syncincData, setSyncincData] = useState<any>([]);
  const [currentSyncProgress, setCurrentSyncProgress] = useState(0);

  function markCompanyAsSyncedInPlace(companyNameToSync: any, bol: any) {
    setSyncincData((prevCompanyArray: any) =>
      prevCompanyArray.map((company: any) => {
        if (company.companyName === companyNameToSync) {
          return { ...company, isSynced: bol };
        }
        return company;
      })
    );
  }

  function getIsSyncedByCompanyName(companyNameToFind: any) {
    const foundCompany = syncincData.find(
      (company: any) => company.companyName === companyNameToFind
    );
    return foundCompany ? foundCompany.isSynced : null;
  }
  
  function handleSyncData(value: any) {
    console.log(value, "from context------->")
    setSyncincData((prevValue: any) => [...prevValue, value]);
  }

  function handleCurrentSyncProgress( params : any) {
    setCurrentSyncProgress(params);
  }

  const value = {
    syncincData: syncincData,
    currentSyncProgress: currentSyncProgress,
    handleSyncData: handleSyncData,
    handleCurrentSyncProgress: handleCurrentSyncProgress,
    markCompanyAsSyncedInPlace: markCompanyAsSyncedInPlace,
    getIsSyncedByCompanyName: getIsSyncedByCompanyName
  };
  return (
    <CompanySyncContext.Provider value={value}>
      {children}
    </CompanySyncContext.Provider>
  );
}

export default CompanySyncContextProvider;

