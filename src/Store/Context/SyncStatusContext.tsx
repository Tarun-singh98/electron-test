// SyncStatusContext.js
import { createContext, useState } from "react";

export const SyncStatusContext = createContext({
  isSyncing: {},
  syncingStatus: "",
  syncStart: false,
  handleSetIsSyncing: (value: any) => {},
  updateSyncingStatus: (value: any) => {},
  updateSync: (value: any) => {},
});

export const SyncStatusProvider = ({ children }: any) => {
  const [isSyncing, setIsSyncing] = useState<any>({
    companyName: "",
    syncStarted: false,
    currentProgress: 0,
    isSyncCompleted: false,

  });

  const [syncingStatus, setSyncingStatus] = useState(false);
  const [syncStart, setSyncStart] = useState(false);
  function updateSync(value: any) {
    // console.log(value, "value from context");
    setSyncStart(value);
  }

  function updateSyncingStatus(value: any) {
    setSyncingStatus(value);
  }
  function handleSetIsSyncing(
    companyName: any,
    currectProgress: any,
    isSyncCompleted: any,
    syncStarted: any
  ) {
    // console.log(isSyncing, "check syncing status");
    setIsSyncing({
      companyName: companyName,
      currectProgress: currectProgress,
      isSyncCompleted: isSyncCompleted,
      syncStarted: syncStarted,
    });
  }
  const value: any = {
    isSyncing: isSyncing,
    syncingStatus: syncingStatus,
    syncStart: syncStart,
    handleSetIsSyncing: handleSetIsSyncing,
    updateSyncingStatus: updateSyncingStatus,
    updateSync: updateSync,
  };

  return (
    <SyncStatusContext.Provider value={value}>
      {children}
    </SyncStatusContext.Provider>
  );
};



