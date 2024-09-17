import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    ipcRenderer.invoke(channel, ...omit);
  },
  appRestart: () => {
    return ipcRenderer.invoke("app-restart");
  },
  appMinimize: () => {
    return ipcRenderer.invoke("minimize-App");
  },
  appReload: () => {
    return ipcRenderer.invoke("reload");
  },
  appClose: () => {
    return ipcRenderer.invoke("close-App");
  },
  isOnline: () => {
    return ipcRenderer.invoke("online-status");
  },
  getMachineId: () => {
    return ipcRenderer.invoke("get-machineid");
  },
  getUniqueMachineId: () => {
    return ipcRenderer.invoke("get-unique-machine-id");
  },
  serverAvailability: () => {
    return ipcRenderer.invoke("check-server-availability");
  },
  // decrypt: (data: any) => {
  //   return ipcRenderer.invoke("decrypt", data);
  // },
  tallyOpen: () => {
    return ipcRenderer.invoke("is-tally-open");
  },
  connectedToGivenPort: (data: any) => {
    return ipcRenderer.invoke("check-tally-connected-on-given-port", data);
  },
  syncComplete: (data: any) => {
    return ipcRenderer.invoke("sync-complete", data);
  },
  fetchCompanyInfo: (data: any) => {
    return ipcRenderer.invoke("fetch-company-info", data);
  },
  fetchTallyInfo: (data: any) => {
    return ipcRenderer.invoke("fetch-tally-info", data);
  },
  mobilePushNotification: (data: any) => {
    return ipcRenderer.invoke("mobile-push-notification", data);
  },
  syncCompany: (data: any) => {
    return ipcRenderer.invoke("sync-company", data);
  },
  currentVersion: () => {
    return ipcRenderer.invoke("current-version");
  },
  showPurchaseSection: () => {
    return ipcRenderer.invoke('show-purchase-section');
  },
  latestVersion: () => {
    return ipcRenderer.invoke("check-latest-version");
  },
  latestVersionUrl: () => {
    return ipcRenderer.invoke("latest-version-url");
  },
  isSkippable: () => {
    return ipcRenderer.invoke("check-isSkippable-status");
  },
  listenForProgress: (callback: any) => {
    ipcRenderer.on("sync-progress-check", (event, data) => {
      callback(data); // Call the provided callback with the received data
    });
  },
  removeAllListeners: (channel: any) => {
    ipcRenderer.removeAllListeners(channel);
  },
  // listenForProgress: () => {
  //   return new Promise((resolve) => {
  //     ipcRenderer.on("sync-progress-check", (event, data) => {
  //       // console.log('Received progress update in preload:', data);
  //       resolve(data); // Resolve the Promise with the received data
  //     });
  //   });
  // },
});

function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};

setTimeout(removeLoading, 4999);
