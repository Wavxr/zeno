const { contextBridge, ipcRenderer } = require("electron");

const onChannel = (channel, handler) => {
  const listener = (_event, payload) => handler(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
};

contextBridge.exposeInMainWorld("zeno", {
  getVersion: () => ipcRenderer.invoke("app:getVersion"),
  platform: process.platform,
  selectYtDlpPath: () => ipcRenderer.invoke("zeno:selectYtDlp"),
  selectDownloadDir: () => ipcRenderer.invoke("zeno:selectDownloadDir"),
  selectFfmpegLocation: () => ipcRenderer.invoke("zeno:selectFfmpegLocation"),
  selectCookiesFile: () => ipcRenderer.invoke("zeno:selectCookiesFile"),
  writeFailedReport: (payload) => ipcRenderer.invoke("zeno:writeFailedReport", payload),
  startDownload: (options) => ipcRenderer.invoke("zeno:startDownload", options),
  cancelDownload: () => ipcRenderer.invoke("zeno:cancelDownload"),
  onDownloadOutput: (handler) => onChannel("zeno:download-output", handler),
  onDownloadExit: (handler) => onChannel("zeno:download-exit", handler),
  onDownloadError: (handler) => onChannel("zeno:download-error", handler)
});
