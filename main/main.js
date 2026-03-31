const { app, BrowserWindow, ipcMain, shell, Menu, dialog } = require("electron");
const { spawn, execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

const isDev = !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
const iconPath = path.join(__dirname, "..", "build", "zeno_icon.ico");

let activeDownload = null;

const splitLines = (buffer, chunk) => {
  const next = `${buffer}${chunk}`;
  const parts = next.split(/\r?\n/);
  return { lines: parts.slice(0, -1), rest: parts.at(-1) || "" };
};

const sendToRenderer = (sender, channel, payload) => {
  if (sender && !sender.isDestroyed()) {
    sender.send(channel, payload);
  }
};

const buildVideoFormatArgs = (format, quality) => {
  const args = [];
  let selector = "bestvideo+bestaudio/best";

  if (quality && quality !== "best") {
    const height = quality.replace(/p/i, "");
    selector = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`;
  }

  args.push("-f", selector);

  if (format === "mp4" || format === "webm") {
    args.push("--merge-output-format", format);
  }

  return args;
};

const buildYtDlpArgs = (options) => {
  const args = ["--newline", "--progress"];

  const fragments = Number(options.fragments);
  if (Number.isFinite(fragments) && fragments > 0) {
    args.push("-N", String(Math.min(fragments, 16)));
  }

  if (options.playlist === false) {
    args.push("--no-playlist");
  }

  if (options.cookiesFile) {
    args.push("--cookies", options.cookiesFile);
  } else if (options.cookiesBrowser && options.cookiesBrowser !== "none") {
    const profile = options.cookiesProfile ? `:${options.cookiesProfile}` : "";
    args.push("--cookies-from-browser", `${options.cookiesBrowser}${profile}`);
  }

  if (options.noUpdate) {
    args.push("--no-update");
  }

  if (options.ffmpegLocation) {
    args.push("--ffmpeg-location", options.ffmpegLocation);
  }

  args.push("-P", options.outputDir);
  args.push("-o", "%(title)s.%(ext)s");

  if (options.metadata) {
    args.push("--add-metadata");
    args.push("--parse-metadata", "%(title)s:%(meta_title)s");
    args.push("--parse-metadata", "%(uploader|)s:%(meta_contributing_artist)s");
  }

  if (options.mode === "audio") {
    args.push("-f", "ba");
    args.push("-x");
    if (options.audioFormat) {
      args.push("--audio-format", options.audioFormat);
    }
    if (options.audioQuality) {
      args.push("--audio-quality", options.audioQuality);
    }
  } else {
    args.push(...buildVideoFormatArgs(options.videoFormat, options.videoQuality));
  }

  args.push(options.url);

  return args;
};

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 780,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: "#ffffff",
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false,
    title: "Zeno",
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.setAutoHideMenuBar(true);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  if (isDev) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "dist", "renderer", "index.html"));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
};

app.whenReady().then(() => {
  app.setAppUserModelId("com.zeno.app");
  Menu.setApplicationMenu(null);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("app:getVersion", () => app.getVersion());

ipcMain.handle("zeno:selectYtDlp", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select yt-dlp binary",
    properties: ["openFile"],
    filters: [{ name: "yt-dlp", extensions: ["exe", ""] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("zeno:selectDownloadDir", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select download folder",
    properties: ["openDirectory", "createDirectory"]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("zeno:selectFfmpegLocation", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select FFmpeg location",
    properties: ["openFile", "openDirectory"],
    filters: [{ name: "FFmpeg", extensions: ["exe", ""] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("zeno:selectCookiesFile", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select cookies.txt (Netscape format)",
    properties: ["openFile"],
    filters: [{ name: "Cookies", extensions: ["txt"] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("zeno:writeFailedReport", async (_event, payload) => {
  if (!payload || !payload.outputDir) {
    return { ok: false };
  }

  const outputDir = payload.outputDir;
  if (!fs.existsSync(outputDir)) {
    throw new Error("The download folder does not exist.");
  }

  const failed = Array.isArray(payload.failed) ? payload.failed : [];
  const lines = [];
  failed.forEach((item) => {
    const url = item && item.url ? String(item.url) : "";
    const reason = item && item.reason ? String(item.reason) : "Unavailable";
    const line = url ? `${url} ${reason}` : reason;
    lines.push(line);
  });

  const targetPath = path.join(outputDir, "failed.txt");
  const content = lines.length ? `${lines.join("\n")}\n` : "";
  fs.writeFileSync(targetPath, content, "utf8");
  return { ok: true, path: targetPath };
});

ipcMain.handle("zeno:startDownload", async (event, options) => {
  if (activeDownload) {
    throw new Error("A download is already running.");
  }

  if (!options || !options.url) {
    throw new Error("A valid URL is required.");
  }

  if (!options.ytDlpPath) {
    throw new Error("Please select your yt-dlp location.");
  }

  if (!fs.existsSync(options.ytDlpPath)) {
    throw new Error("The yt-dlp path does not exist.");
  }

  if (!options.outputDir) {
    throw new Error("Please choose a download folder.");
  }

  if (!fs.existsSync(options.outputDir)) {
    throw new Error("The download folder does not exist.");
  }

  if (options.ffmpegLocation && !fs.existsSync(options.ffmpegLocation)) {
    throw new Error("The FFmpeg location does not exist.");
  }

  if (options.cookiesFile && !fs.existsSync(options.cookiesFile)) {
    throw new Error("The cookies file does not exist.");
  }

  const args = buildYtDlpArgs(options);
  const sender = event.sender;
  const child = spawn(options.ytDlpPath, args, {
    windowsHide: true
  });

  activeDownload = {
    child,
    sender,
    stdoutBuffer: "",
    stderrBuffer: ""
  };

  child.stdout.on("data", (data) => {
    const { lines, rest } = splitLines(activeDownload.stdoutBuffer, data.toString());
    activeDownload.stdoutBuffer = rest;
    lines.forEach((line) => {
      sendToRenderer(sender, "zeno:download-output", { stream: "stdout", line });
    });
  });

  child.stderr.on("data", (data) => {
    const { lines, rest } = splitLines(activeDownload.stderrBuffer, data.toString());
    activeDownload.stderrBuffer = rest;
    lines.forEach((line) => {
      sendToRenderer(sender, "zeno:download-output", { stream: "stderr", line });
    });
  });

  child.on("error", (error) => {
    sendToRenderer(sender, "zeno:download-error", { message: error.message });
  });

  child.on("close", (code) => {
    sendToRenderer(sender, "zeno:download-exit", { code });
    activeDownload = null;
  });

  return { ok: true };
});

ipcMain.handle("zeno:cancelDownload", async () => {
  if (!activeDownload) {
    return { ok: false };
  }

  const child = activeDownload.child;
  if (child && child.pid) {
    if (process.platform === "win32") {
      execFile("taskkill", ["/pid", String(child.pid), "/T", "/F"], (error) => {
        if (error) {
          child.kill("SIGTERM");
        }
      });
    } else {
      child.kill("SIGTERM");
    }
  }
  return { ok: true };
});
