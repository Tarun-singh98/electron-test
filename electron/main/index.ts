import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
  Tray,
  nativeImage,
  Menu,
  Notification,
  powerSaveBlocker,
  net,
} from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";
import { startCronJobForReport, startCronJobForSyncCompany, tally } from "./tally";
const Winreg = require("winreg");
const os = require("os");
const isReachable = require("is-reachable");
// var AutoLaunch = require('auto-launch');

require("dotenv").config();

import { getMachineId } from "./tally-sync/util/deviceInfo/uniqueIdFromDevice";
// import { checkGlobalCronAllow, fetchConnectorVersionInfo, } from "./tally-sync/fromCloud/util/phoneFromToken";
import { prod } from "../../core/appConfig";

// const iconPath = path.join(__dirname, "../assets/logo.jpg");

// const {cronJo} = require('cron');
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) {
  console.log("release 6.1 entered")
  app.disableHardwareAcceleration();
}

// Set application name for Windows 10+ notifications
if (process.platform === "win32") {
  app.setAppUserModelId(app.getName());
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export let win: BrowserWindow;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
// const preload = join(app.getAppPath(), "electron/main/preload.js");
const url = process.env.VITE_DEV_SERVER_URL;
// console.log(url, "url ")


const indexHtml = join(process.env.DIST, "index.html");

let tray: any = null;

async function createWindow() {
  win = new BrowserWindow({
    title: "Tally Connector",
    icon: join(process.env.VITE_PUBLIC, "ACCOSYNC_LOGO3.png"),
    width: 900,
    height: 650,
    webPreferences: {
      preload,
      // preload: path.join(__dirname, "../../electron/main/preload.js"),
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: false,
      contextIsolation: true,
    },
    frame: false,
    movable: true,
    darkTheme: true,
    resizable: false,
  });
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  const contextMenu = Menu.buildFromTemplate([
    { label: "Open", click: () => win?.show() },
    {
      label: "Close",
      click: () => {
        tray.destroy();
        app.quit();
        // win.close();
      },
    },
  ]);
  const trayIcon = nativeImage.createFromPath(
    join(process.env.VITE_PUBLIC, "ACCOSYNC_LOGO3.png")
  );
  tray = new Tray(trayIcon);
  tray.setToolTip("Accosync Connector");
  tray.on("click", () => {
    win?.isVisible() ? win.hide() : win?.show();
  });
  tray.setContextMenu(contextMenu);
  win.on("close", (event: any) => {
    event.preventDefault();
    win?.hide();
    // app.hide();
    // win.close();
  });

  console.log("The Cronjob functions will start after 15 sec.");
  if (!prod) {
    const framesLeft = ['(o   )', '( o  )', '(  o )', '(   o)', '(    )'];
    const framesRight = ['(    )', '(   o)', '(  o )', '( o  )', '(o   )'];
    let i = 0;

    const loading = setInterval(() => {
      const left = framesLeft[i % framesLeft.length];
      const right = framesRight[i % framesRight.length];
      process.stdout.write(`\r${left} Waiting... ${right}`);
      i++;
    }, 130);

    setTimeout(async () => {
      clearInterval(loading);
      console.log('\nThe Cronjob function is started, Happy syncing.');
      await startCronJobForSyncCompany(false)
      await startCronJobForReport()
    }, 5000);
  } else {
    setTimeout(async () => {
      console.log('The Cronjob function is started after 15 sec., Happy syncing.');
      await startCronJobForSyncCompany(false)
      await startCronJobForReport()
    }, 15000);
  }

  // const isGlobalCronAllowed = await checkGlobalCronAllow()
  // if (isGlobalCronAllowed?.code === 400) {
  //   console.log("err in isGlobalCronAllowed.------------->", isGlobalCronAllowed);
  // }
  // console.log("IS CRON JOB ALLOWED : ------------------>", isGlobalCronAllowed);
  // if (isGlobalCronAllowed) {
  //   const isVersionMatch = await fetchConnectorVersionInfo();
  //   if (isVersionMatch?.code === 400) {
  //     console.log("err in isVersionMatch.------------->", isVersionMatch);
  //   }
  //   console.log("IS VERSION MATCH : ------------------>", isVersionMatch);

  //   if (isVersionMatch) {
  // setTimeout(async () => {
  //   console.log('Sync in delayed for 15 sec.');
  //   await startCronJobForSyncCompany(false)
  //   await startCronJobForReport()
  // }, 15000);
  //   }else{
  //     console.log("Version mismatched or cronjob not allowed for your current version.");
  //   }
  // } else {
  //   console.log("cron job not allowed or error faced");
  // }

  if (!prod) {
    if (url) {
      // console.log("if entered")
      // electron-vite-vue#298
      win.loadURL(url);
      // Open devTool if the app is not packaged
      // win.webContents.openDevTools();
    } else {
      // console.log("else entered")
    }
  } else {
    win.loadFile(indexHtml);
  }

  win.webContents.setWindowOpenHandler(({ url }: any) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // Apply electron-updater
  update(win);

  //Check tally utilities
  tally(win);

}


// const secretKey = process.env.secretKey || "superSecretKey";
// ipcMain.handle("decrypt", async (event, data) => {
//   // const decipher = await crypto.createDecipher("aes-256-cbc", secretKey);
//   // let decrypted = await decipher.update(data, "hex", "utf8");
//   // decrypted += decipher.final("utf8");
//   // return JSON.parse(decrypted);

//   const bytes = CryptoJS.AES.decrypt(data, secretKey);
//   const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
//   return decryptedData;
// });


const getWindowsGuid = () => {
  return new Promise((resolve, reject) => {
    // Define the registry key where the MachineGUID is stored
    const regKey = new Winreg({
      hive: Winreg.HKLM, // Use HKLM for HKEY_LOCAL_MACHINE
      key: "\\SOFTWARE\\Microsoft\\Cryptography",
    });

    // Specify the name of the value that holds the MachineGUID
    const valueName = "MachineGuid";

    // Read the MachineGUID from the registry
    regKey.get(valueName, (err: any, item: any) => {
      if (err) {
        console.error(
          "Error reading MachineGUID from the registry:",
          err.message
        );
        reject(err);
      } else {
        resolve(item.value);
      }
    });
  });
};


ipcMain.handle("close-App", () => {
  console.log("Close request received.");
  if (win) {
    win.close();
  }
});
ipcMain.handle("online-status", async (event, params) => {
  try {
    const result = net.isOnline();
    return result;
  } catch (ex) {
    console.error(ex);
    const ans = net.isOnline();
    return ans;
  }
});
ipcMain.handle("get-machineid", async (event, params) => {
  const machineId = await getMachineId();
  return machineId;
});
ipcMain.handle("get-unique-machine-id", async (event) => {
  try {
    const uniqueGuid = await getWindowsGuid();
    const deviceName = os.hostname();
    return { deviceName: deviceName, deviceModel: uniqueGuid };
  } catch (error) {
    console.error("Error in IPC handler:", error);
    return null; // Handle the error appropriately
  }
});
ipcMain.on("check-server-availability", async (event, serverUrl) => {
  try {
    const reachable = await isReachable(serverUrl);
    event.sender.send("server-availability-result", reachable);
  } catch (error) {
    event.sender.send("server-availability-result", false);
  }
});


ipcMain.handle("app-restart", () => {
  console.log("app restart triggered");
  app.relaunch({ args: process.argv.slice(1).concat(["--relaunch"]) });
  app.exit(0);
});
ipcMain.handle("minimize-App", () => {
  if (win) {
    win.minimize();
  }
});
ipcMain.handle("reload", async (event, params) => {
  win.webContents.executeJavaScript("location.reload(true);");
});
let blockerId: any = null;

// Create a function to start preventing display sleep
function startPreventSleep() {
  if (!blockerId) {
    blockerId = powerSaveBlocker.start("prevent-display-sleep");
    // console.log("Preventing display sleep");
  }
}

// Create a function to stop preventing display sleep
function stopPreventSleep() {
  if (blockerId) {
    powerSaveBlocker.stop(blockerId);
    blockerId = null;
    console.log("Allowing display sleep");
  }
}
// var minecraftAutoLauncher = new AutoLaunch({
// 	name: 'accosync_desktop_dev',
// 	path: process.execPath,
// });

// minecraftAutoLauncher.enable();

//minecraftAutoLauncher.disable();


// minecraftAutoLauncher.isEnabled()
// .then(function(isEnabled: any){
// 	if(isEnabled){
// 	    return;
// 	}
// 	minecraftAutoLauncher.enable();
// })
// .catch(function(err: any){
//     // handle error
// });
// app.whenReady().then(createWindow);
app.whenReady().then(() => {
  createWindow();
  startPreventSleep();

});

app.on("before-quit", () => {
  // Ensure that all windows are properly closed before quitting the app
  if (win) {
    win.removeAllListeners("close");
    win.close();
  }
});

app.on("window-all-closed", () => {
  // Don't quit the app when all windows are closed
  if (process.platform !== "darwin") {
    // app.hide();
    app.quit();
  }
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});



