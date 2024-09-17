// import axios from "axios";
// import { ipProxy } from "../../core/ipConfig";
import { app, ipcMain } from "electron";
import {
  // type ProgressInfo,
  // type UpdateDownloadedEvent,
  autoUpdater,
} from "electron-updater";
const log = require("electron-log");

// Configure to check updates from Bitbucket release URL
const res: any = autoUpdater.setFeedURL({
  provider: "bitbucket",
  username:"decobee_tech",
  owner: "decobee_tech",
  
  // url: "https://bitbucket.org/decobee-tech/tally-connector-sql-artifacts/downloads/",
  // "channel": "latest"
});
log.info("response " + res);
log.transports.file.resolvePathFn = () =>
  "D:/new/tally-connector-sql-vite/logs/main.log";
// path.join("D:/Connector new/tally-connector-sql-vite", "logs/main.log");
log.info("Connecting to server...");

export function update(win: Electron.BrowserWindow) {
  // When set to false, the update download will be triggered through the API
  autoUpdater.autoDownload = false;
  log.info("inside update");
  // autoUpdater.disableWebInstaller = false;
  // autoUpdater.allowDowngrade = false;

  // start check
  // autoUpdater.on("checking-for-update", function () {});
  // update available
  autoUpdater.on("update-available", (arg) => {
    log.info("Checking for update");
    win.webContents.send("update-can-available", {
      update: true,
      version: app.getVersion(),
      newVersion: arg?.version,
    });
  });
  // update not available
  autoUpdater.on("update-not-available", () => {
    log.info("Update not available");
    win.webContents.send("update-can-available", {
      update: false,
      version: app.getVersion(),
      // newVersion: arg?.version,
    });
  });

  // {
  //   /*--------------------------Update Mechanism Functions----------------------------------*/
  // }
  ipcMain.handle("current-version", () => {
    try {
      const currentVersion: any = app.getVersion();
      return currentVersion;
    } catch (error) {
      console.log(error, "Error while getting the current app version");
    }
  });

  // ipcMain.handle("current-name", async () => {
  //   try {
  //     const currentName: any = await axios.get(
  //       `${ipProxy}/currentConnectorVersion/getconnectorversion`
  //     );
  //     const currentConnectorName = currentName?.data?.data?.appname;
  //     return currentConnectorName;
  //   } catch (error) {
  //     console.log(error, "Error while getting the current name");
  //   }
  // });
  // ipcMain.handle("show-purchase-section", async () => {
  //   try {
  //     const connectorVersion = await axios.get(
  //       `${ipProxy}/currentConnectorVersion/getconnectorversion`
  //     );
  //     const isSubscriptionEnabled =
  //       connectorVersion?.data?.data?.isSubscriptionEnabled;
  //     return isSubscriptionEnabled;
  //   } catch (error) {
  //     console.error("Error fetching connector version:", error);
  //     return { message: "Error fetching connector version", error };
  //   }
  // });
  // ipcMain.handle("check-latest-version", async () => {
  //   try {
  //     const connectorVersion = await axios.get(
  //       `${ipProxy}/currentConnectorVersion/getconnectorversion`
  //     );
  //     // console.log(connectorVersion?.data?.data[0]?.version, "connectorVersion");
  //     const currentConnectorVersion = connectorVersion?.data?.data?.version;
  //     return currentConnectorVersion;
  //   } catch (error) {
  //     console.error("Error fetching connector version:", error);
  //     return { message: "Error fetching connector version", error };
  //   }
  // });

  // ipcMain.handle("check-isSkippable-status", async () => {
  //   try {
  //     const connectorVersion = await axios.get(
  //       `${ipProxy}/currentConnectorVersion/getconnectorversion`
  //     );
  //     // console.log(connectorVersion?.data?.data[0]?.version, "connectorVersion");
  //     const currentConnectorVersionIsSkippable =
  //       connectorVersion?.data?.data?.isSkippable;
  //     return currentConnectorVersionIsSkippable;
  //   } catch (error) {
  //     console.error("Error fetching connector version isSkippable:", error);
  //     return { message: "Error fetching connector version isSkippable", error };
  //   }
  // });

  // ipcMain.handle("latest-version-url", async () => {
  //   try {
  //     const connectorVersion = await axios.get(
  //       `${ipProxy}/currentConnectorVersion/getconnectorversion`
  //     );
  //     // console.log(connectorVersion?.data?.data[0]?.versionURL, "connectorVersion URL");
  //     const currentConnectorVersionURL =
  //       connectorVersion?.data?.data?.versionURL;
  //     return currentConnectorVersionURL;
  //   } catch (error) {
  //     console.error("Error fetching connector version:", error);
  //     return { message: "Error fetching connector version", error };
  //   }
  // });

  // {
  //   /*-----------------------------------------------------------------------------------*/
  // }

  // Checking for updates
  // ipcMain.handle("check-update", async () => {
  //   if (!app.isPackaged) {
  //     const error = new Error(
  //       "The update feature is only available after the package."
  //     );
  //     return { message: error.message, error };
  //   }

  //   try {
  //     return await autoUpdater.checkForUpdatesAndNotify();
  //   } catch (error) {
  //     return { message: "Network error", error };
  //   }
  // });
  // Check for updates manually
  ipcMain.handle("check-update", async () => {
    log.info("Checking for updates");
    try {
      await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      console.error("Error checking for updates", error);
    }
  });

  // Start downloading and feedback on progress
  ipcMain.handle("start-download", () => {
    log.info("Starting download...");
    autoUpdater.downloadUpdate();
    autoUpdater.on("download-progress", (progress) => {
      log.info("Downloading : " + progress + "%");
      win.webContents.send("download-progress", progress);
    });
    autoUpdater.on("update-downloaded", () => {
      log.info("Update downloaded");
      win.webContents.send("update-downloaded");
    });
  });

  // Install the update after download
  ipcMain.handle("quit-and-install", () => {
    log.info("quit and Install");
    autoUpdater.quitAndInstall();
  });
  // ipcMain.handle("start-download", (event) => {
  //   startDownload(
  //     (error, progressInfo) => {
  //       if (error) {
  //         // feedback download error message
  //         event.sender.send("update-error", { message: error.message, error });
  //       } else {
  //         // feedback update progress message
  //         event.sender.send("download-progress", progressInfo);
  //       }
  //     },
  //     () => {
  //       // feedback update downloaded message
  //       event.sender.send("update-downloaded");
  //     }
  //   );
  // });

  // Install now
  // ipcMain.handle("quit-and-install", () => {
  //   autoUpdater.quitAndInstall(false, true);
  // });

  //   ipcMain.handle('is-tally-open', (event) => {
  //     console.log("checking if tally is open")
  // })
}

// function startDownload(
//   callback: (error: Error | null, info: ProgressInfo | null) => void,
//   complete: (event: UpdateDownloadedEvent) => void
// ) {
//   autoUpdater.on("download-progress", (info) => callback(null, info));
//   autoUpdater.on("error", (error) => callback(error, null));
//   autoUpdater.on("update-downloaded", complete);
//   autoUpdater.downloadUpdate();
// }
