import "./style.css";

const app = document.querySelector("#app");

if (!app) {
  throw new Error("App container not found");
}

app.innerHTML = `
  <div class="app">
    <header class="header">
      <div>
        <p class="kicker">ZENO</p>
        <h1 class="title">_console</h1>
      </div>
      <div class="meta">
        <span id="app-meta">Loading...</span>
      </div>
    </header>

    <main class="layout">
      <section class="panel">
        <h2 class="section-title">Source</h2>
        <div class="field">
          <label class="label" for="url-input">Video or playlist URL</label>
          <input id="url-input" class="input" type="text" placeholder="https://www.youtube.com/watch?v=..." />
        </div>

        <div class="field">
          <label class="label" for="yt-dlp-input">yt-dlp location</label>
          <div class="field-row">
            <input id="yt-dlp-input" class="input" type="text" placeholder="C:\\path\\to\\yt-dlp.exe" />
            <button id="yt-dlp-browse" class="button" type="button">Browse</button>
          </div>
        </div>

        <div class="field">
          <label class="label" for="ffmpeg-input">FFmpeg location</label>
          <div class="field-row">
            <input id="ffmpeg-input" class="input" type="text" placeholder="C:\\ffmpeg\\bin" />
            <button id="ffmpeg-browse" class="button" type="button">Browse</button>
          </div>
        </div>

        <div class="field">
          <label class="label" for="download-dir-input">Download folder</label>
          <div class="field-row">
            <input id="download-dir-input" class="input" type="text" placeholder="C:\\Downloads" />
            <button id="download-dir-browse" class="button" type="button">Browse</button>
          </div>
        </div>

        <div class="field-grid">
          <div class="field">
            <div class="label-row">
              <label class="label" for="cookies-browser">Cookies from browser</label>
              <button class="icon-button" type="button" aria-label="Cookies help">
                <span aria-hidden="true">i</span>
                <span class="tooltip">
                  <span class="tooltip-line">Use a non-chromium browser (Firefox).</span>
                  <span class="tooltip-line">Or launch Chrome with:</span>
                  <span class="tooltip-code">--disable-features=LockProfileCookieDatabase</span>
                  <span class="tooltip-line">Fully close Chrome and end background chrome.exe.</span>
                </span>
              </button>
            </div>
            <select id="cookies-browser" class="select">
              <option value="none">None</option>
              <option value="chrome">Chrome</option>
              <option value="edge">Edge</option>
              <option value="firefox">Firefox</option>
              <option value="brave">Brave</option>
              <option value="opera">Opera</option>
            </select>
          </div>
          <div class="field">
            <label class="label" for="cookies-profile">Browser profile (optional)</label>
            <input id="cookies-profile" class="input" type="text" placeholder="Profile 1" />
          </div>
        </div>
        <div class="field">
          <label class="label" for="cookies-file-input">Cookies file (Netscape format)</label>
          <div class="field-row">
            <input id="cookies-file-input" class="input" type="text" placeholder="cookies.txt" />
            <button id="cookies-file-browse" class="button" type="button">Browse</button>
          </div>
        </div>

        <div class="field">
          <span class="label">Mode</span>
          <div class="radio-group">
            <label class="radio">
              <input type="radio" name="mode" value="audio" checked />
              <span>Audio</span>
            </label>
            <label class="radio">
              <input type="radio" name="mode" value="video" />
              <span>Video</span>
            </label>
          </div>
        </div>

        <div id="audio-options" class="field-grid">
          <div class="field">
            <label class="label" for="audio-format">Audio format</label>
            <select id="audio-format" class="select">
              <option value="mp3">MP3</option>
              <option value="m4a">M4A</option>
              <option value="flac">FLAC</option>
              <option value="opus">OPUS</option>
              <option value="wav">WAV</option>
            </select>
          </div>
          <div class="field">
            <label class="label" for="audio-quality">Audio bitrate</label>
            <select id="audio-quality" class="select">
              <option value="128K">128 kbps</option>
              <option value="192K" selected>192 kbps</option>
              <option value="256K">256 kbps</option>
              <option value="320K">320 kbps</option>
            </select>
          </div>
        </div>

        <div id="video-options" class="field-grid is-hidden">
          <div class="field">
            <label class="label" for="video-format">Video format</label>
            <select id="video-format" class="select">
              <option value="mp4">MP4</option>
              <option value="webm">WEBM</option>
              <option value="best">Best available</option>
            </select>
          </div>
          <div class="field">
            <label class="label" for="video-quality">Video quality</label>
            <select id="video-quality" class="select">
              <option value="best">Best</option>
              <option value="1080p">Up to 1080p</option>
              <option value="720p">Up to 720p</option>
              <option value="480p">Up to 480p</option>
            </select>
          </div>
        </div>

        <div class="field-grid">
          <label class="toggle">
            <input id="playlist-toggle" type="checkbox" checked />
            <span>Playlist mode</span>
          </label>
          <label class="toggle">
            <input id="metadata-toggle" type="checkbox" checked />
            <span>Embed metadata</span>
          </label>
          <label class="toggle">
            <input id="no-update-toggle" type="checkbox" />
            <span>Disable update check</span>
          </label>
        </div>

        <div class="actions">
          <button id="download-start" class="button button--primary" type="button">Start download</button>
          <button id="download-cancel" class="button" type="button" disabled>Stop</button>
          <div class="field actions-fragments">
            <label class="label" for="fragment-count">Fragment threads (-N)</label>
            <input id="fragment-count" class="input" type="number" min="1" max="16" value="4" />
          </div>
        </div>
        <div class="overall">
          <div class="overall-header">
            <span class="section-subtitle">Overall</span>
            <span id="overall-text" class="overall-text">0/0</span>
          </div>
          <div class="progress-track progress-track--overall">
            <div id="overall-bar" class="progress-bar"></div>
          </div>
          <span id="overall-remaining" class="hint">Remaining: 0</span>
        </div>
        <div class="status" data-variant="neutral">
          <span id="status-text">Idle</span>
        </div>
      </section>

      <section class="panel">
        <h2 class="section-title">Queue</h2>
        <div id="queue-list" class="queue"></div>
      </section>

      <section class="panel">
        <h2 class="section-title">Logs</h2>
        <pre id="log-output" class="log-output"></pre>
      </section>

      <section class="panel">
        <h2 class="section-title">Failed</h2>
        <div id="failed-list" class="failed-list"></div>
      </section>
    </main>
  </div>
`;

const urlInput = document.querySelector("#url-input");
const ytDlpInput = document.querySelector("#yt-dlp-input");
const ytDlpBrowse = document.querySelector("#yt-dlp-browse");
const downloadDirInput = document.querySelector("#download-dir-input");
const downloadDirBrowse = document.querySelector("#download-dir-browse");
const ffmpegInput = document.querySelector("#ffmpeg-input");
const ffmpegBrowse = document.querySelector("#ffmpeg-browse");
const cookiesBrowser = document.querySelector("#cookies-browser");
const cookiesProfile = document.querySelector("#cookies-profile");
const cookiesFileInput = document.querySelector("#cookies-file-input");
const cookiesFileBrowse = document.querySelector("#cookies-file-browse");
const modeRadios = document.querySelectorAll("input[name='mode']");
const audioOptions = document.querySelector("#audio-options");
const videoOptions = document.querySelector("#video-options");
const audioFormat = document.querySelector("#audio-format");
const audioQuality = document.querySelector("#audio-quality");
const videoFormat = document.querySelector("#video-format");
const videoQuality = document.querySelector("#video-quality");
const playlistToggle = document.querySelector("#playlist-toggle");
const metadataToggle = document.querySelector("#metadata-toggle");
const noUpdateToggle = document.querySelector("#no-update-toggle");
const fragmentCount = document.querySelector("#fragment-count");
const startButton = document.querySelector("#download-start");
const cancelButton = document.querySelector("#download-cancel");
const statusText = document.querySelector("#status-text");
const statusWrap = document.querySelector(".status");
const overallText = document.querySelector("#overall-text");
const overallBar = document.querySelector("#overall-bar");
const overallRemaining = document.querySelector("#overall-remaining");
const queueList = document.querySelector("#queue-list");
const failedList = document.querySelector("#failed-list");
const logOutput = document.querySelector("#log-output");
const appMeta = document.querySelector("#app-meta");

const MAX_LOG_LINES = 240;
const logLines = [];

const state = {
  active: false,
  items: [],
  currentIndex: 0,
  failed: [],
  currentUrl: "",
  currentLabel: "",
  playlistIndex: 0,
  playlistTotal: 0,
  currentPercent: 0,
  outputDir: ""
};

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeTitle = (value) => {
  if (!value) return "";
  const normalized = value.replace(/\\/g, "/");
  const last = normalized.split("/").pop() || value;
  return last.replace(/\.[^.]+$/, "");
};

const renderQueue = () => {
  if (!queueList) return;
  if (state.items.length === 0) {
    queueList.innerHTML = '<p class="hint">No items yet.</p>';
    return;
  }

  queueList.innerHTML = state.items
    .map((item) => {
      const label = escapeHtml(item.label);
      const status = escapeHtml(item.status);
      const progress = Math.round(item.progress);
      return `
        <div class="queue-item">
          <div class="queue-top">
            <span class="queue-label">${label}</span>
            <span class="queue-percent">${progress}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" style="width:${progress}%"></div>
          </div>
          <span class="queue-status">${status}</span>
        </div>
      `;
    })
    .join("");
};

const renderFailed = () => {
  if (!failedList) return;
  if (state.failed.length === 0) {
    failedList.innerHTML = '<p class="hint">No failed items.</p>';
    return;
  }

  failedList.innerHTML = state.failed
    .map((item, index) => {
      const url = escapeHtml(item.url || "");
      const reason = escapeHtml(item.reason || "Unavailable");
      const copied = item.copied ? "is-copied" : "";
      const label = item.copied ? "✓" : "Copy";
      return `
        <div class="failed-item">
          <span class="failed-reason">${reason}</span>
          <div class="failed-row">
            <span class="failed-url">${url || "No URL"}</span>
            ${url ? `<button class="copy-button ${copied}" type="button" data-index="${index}">${label}</button>` : ""}
          </div>
        </div>
      `;
    })
    .join("");
};

const updateOverall = () => {
  if (!overallText || !overallBar || !overallRemaining) {
    return;
  }

  if (!state.playlistTotal) {
    overallText.textContent = "0/0";
    overallBar.style.width = "0%";
    overallRemaining.textContent = "Remaining: 0";
    return;
  }

  const total = Math.max(1, state.playlistTotal);
  const index = Math.min(Math.max(state.playlistIndex, 1), total);
  const portion = Math.min(Math.max(state.currentPercent, 0), 100) / 100;
  const overall = Math.min(1, ((index - 1) + portion) / total);
  const overallPercent = Math.round(overall * 1000) / 10;

  overallText.textContent = `${index}/${total}`;
  overallBar.style.width = `${overallPercent}%`;
  overallRemaining.textContent = `Remaining: ${Math.max(total - index, 0)}`;
};

const updateStatusSummary = (isFinal = false) => {
  const estimatedTotal = Math.max(state.playlistTotal, state.items.length, state.failed.length, 1);
  const failedCount = state.failed.length;
  const failureRate = failedCount / estimatedTotal;

  if (!isFinal) {
    setStatus("Downloading...", "neutral");
    return;
  }

  if (failedCount === 0) {
    setStatus("Complete", "neutral");
    return;
  }
  if (failedCount >= estimatedTotal) {
    setStatus("Error during download", "error");
    return;
  }
  if (failureRate < 0.1) {
    setStatus(`Minor failures (${failedCount})`, "error");
    return;
  }
  setStatus("Download failed", "error");
};

const persistFailedReport = async () => {
  if (!window.zeno || typeof window.zeno.writeFailedReport !== "function") {
    return;
  }
  if (!state.outputDir) {
    return;
  }

  try {
    await window.zeno.writeFailedReport({
      outputDir: state.outputDir,
      failed: state.failed
    });
  } catch (error) {
    pushLog(`Failed to write failed.txt: ${error.message || error}`);
  }
};

const pushLog = (line) => {
  if (!logOutput) return;
  logLines.push(line);
  if (logLines.length > MAX_LOG_LINES) {
    logLines.shift();
  }
  logOutput.textContent = logLines.join("\n");
  logOutput.scrollTop = logOutput.scrollHeight;
};

const setStatus = (text, variant = "neutral") => {
  if (statusText) {
    statusText.textContent = text;
  }
  if (statusWrap) {
    statusWrap.dataset.variant = variant;
  }
};

const ensureQueueLength = (count) => {
  while (state.items.length < count) {
    state.items.push({
      label: `Item ${state.items.length + 1}`,
      progress: 0,
      status: "Pending"
    });
  }
};

const setCurrentItem = (index, total) => {
  if (total) {
    ensureQueueLength(total);
  }
  if (state.items.length === 0) {
    ensureQueueLength(1);
  }
  state.currentIndex = Math.max(0, Math.min(index, state.items.length - 1));
  state.items[state.currentIndex].status = "Downloading...";
  renderQueue();
};

const updateProgress = (percent) => {
  if (state.items.length === 0) {
    ensureQueueLength(1);
  }
  const item = state.items[state.currentIndex];
  item.progress = percent;
  if (percent >= 100) {
    item.status = "Complete";
  }
  renderQueue();
};

const updateLabel = (label) => {
  if (state.items.length === 0) {
    ensureQueueLength(1);
  }
  state.items[state.currentIndex].label = label;
  renderQueue();
};

const resetSession = () => {
  state.items = [];
  state.currentIndex = 0;
  state.failed = [];
  state.currentUrl = "";
  state.currentLabel = "";
  state.playlistIndex = 0;
  state.playlistTotal = 0;
  state.currentPercent = 0;
  state.outputDir = "";
  logLines.length = 0;
  if (logOutput) {
    logOutput.textContent = "";
  }
  renderQueue();
  renderFailed();
  updateOverall();
};

const updateModeVisibility = () => {
  const selected = document.querySelector("input[name='mode']:checked");
  const mode = selected ? selected.value : "audio";
  if (audioOptions && videoOptions) {
    audioOptions.classList.toggle("is-hidden", mode !== "audio");
    videoOptions.classList.toggle("is-hidden", mode !== "video");
  }
};

const persistValue = (key, value) => {
  if (value !== undefined && value !== null) {
    localStorage.setItem(key, value);
  }
};

const restoreValue = (key, fallback = "") => localStorage.getItem(key) || fallback;

if (urlInput) {
  urlInput.value = restoreValue("zeno:url");
  urlInput.addEventListener("input", (event) => persistValue("zeno:url", event.target.value));
}

if (ytDlpInput) {
  ytDlpInput.value = restoreValue("zeno:ytDlpPath");
  ytDlpInput.addEventListener("input", (event) => persistValue("zeno:ytDlpPath", event.target.value));
}

if (downloadDirInput) {
  downloadDirInput.value = restoreValue("zeno:downloadDir");
  downloadDirInput.addEventListener("input", (event) =>
    persistValue("zeno:downloadDir", event.target.value)
  );
}

if (ffmpegInput) {
  ffmpegInput.value = restoreValue("zeno:ffmpegLocation");
  ffmpegInput.addEventListener("input", (event) =>
    persistValue("zeno:ffmpegLocation", event.target.value)
  );
}

if (cookiesBrowser) {
  cookiesBrowser.value = restoreValue("zeno:cookiesBrowser", "none");
  cookiesBrowser.addEventListener("change", (event) =>
    persistValue("zeno:cookiesBrowser", event.target.value)
  );
}

if (cookiesProfile) {
  cookiesProfile.value = restoreValue("zeno:cookiesProfile");
  cookiesProfile.addEventListener("input", (event) =>
    persistValue("zeno:cookiesProfile", event.target.value)
  );
}

if (cookiesFileInput) {
  cookiesFileInput.value = restoreValue("zeno:cookiesFile");
  cookiesFileInput.addEventListener("input", (event) =>
    persistValue("zeno:cookiesFile", event.target.value)
  );
}

if (audioFormat) {
  audioFormat.value = restoreValue("zeno:audioFormat", "mp3");
  audioFormat.addEventListener("change", (event) =>
    persistValue("zeno:audioFormat", event.target.value)
  );
}

if (audioQuality) {
  audioQuality.value = restoreValue("zeno:audioQuality", "192K");
  audioQuality.addEventListener("change", (event) =>
    persistValue("zeno:audioQuality", event.target.value)
  );
}

if (videoFormat) {
  videoFormat.value = restoreValue("zeno:videoFormat", "mp4");
  videoFormat.addEventListener("change", (event) =>
    persistValue("zeno:videoFormat", event.target.value)
  );
}

if (videoQuality) {
  videoQuality.value = restoreValue("zeno:videoQuality", "best");
  videoQuality.addEventListener("change", (event) =>
    persistValue("zeno:videoQuality", event.target.value)
  );
}

if (playlistToggle) {
  playlistToggle.checked = restoreValue("zeno:playlist", "true") === "true";
  playlistToggle.addEventListener("change", (event) =>
    persistValue("zeno:playlist", event.target.checked)
  );
}

if (metadataToggle) {
  metadataToggle.checked = restoreValue("zeno:metadata", "true") === "true";
  metadataToggle.addEventListener("change", (event) =>
    persistValue("zeno:metadata", event.target.checked)
  );
}

if (noUpdateToggle) {
  noUpdateToggle.checked = restoreValue("zeno:noUpdate", "false") === "true";
  noUpdateToggle.addEventListener("change", (event) =>
    persistValue("zeno:noUpdate", event.target.checked)
  );
}

if (fragmentCount) {
  fragmentCount.value = restoreValue("zeno:fragments", "4");
  fragmentCount.addEventListener("input", (event) => persistValue("zeno:fragments", event.target.value));
}

modeRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    updateModeVisibility();
    persistValue("zeno:mode", radio.value);
  });
});

const savedMode = restoreValue("zeno:mode", "audio");
modeRadios.forEach((radio) => {
  radio.checked = radio.value === savedMode;
});

updateModeVisibility();
renderQueue();
renderFailed();
updateOverall();

const parseOutputLine = (line) => {
  if (!line) return;
  pushLog(line);

  const playlistMatch = line.match(/Downloading item (\d+) of (\d+)/i);
  if (playlistMatch) {
    const index = Number(playlistMatch[1]) - 1;
    const total = Number(playlistMatch[2]);
    state.playlistIndex = Number(playlistMatch[1]);
    state.playlistTotal = total;
    state.currentPercent = 0;
    updateOverall();
    setCurrentItem(index, total);
    return;
  }

  const urlMatch = line.match(/Extracting URL:\s+(\S+)/i);
  if (urlMatch) {
    state.currentUrl = urlMatch[1];
  }

  const destinationMatch = line.match(/Destination:\s+(.+)/i);
  const mergeMatch = line.match(/Merging formats into\s+"?(.+?)"?$/i);
  const labelSource = (destinationMatch && destinationMatch[1]) || (mergeMatch && mergeMatch[1]);
  if (labelSource) {
    const label = normalizeTitle(labelSource.trim());
    if (label) {
      state.currentLabel = label;
      updateLabel(label);
    }
  }

  const percentMatch = line.match(/\[download\]\s+(\d+(?:\.\d+)?)%/i);
  if (percentMatch) {
    const percent = Number(percentMatch[1]);
    if (!Number.isNaN(percent)) {
      if (!state.playlistTotal) {
        state.playlistTotal = 1;
        state.playlistIndex = 1;
      }
      state.currentPercent = percent;
      updateProgress(percent);
      updateOverall();
    }
  }

  if (/has already been downloaded/i.test(line)) {
    if (!state.playlistTotal) {
      state.playlistTotal = 1;
      state.playlistIndex = 1;
    }
    state.currentPercent = 100;
    updateProgress(100);
    updateOverall();
  }

  if (/ERROR: \[youtube\].*(video unavailable|not available|private video)/i.test(line)) {
    const reason = line.replace(/^ERROR:\s*/i, "").trim();
    const label = state.currentLabel || state.currentUrl || "Unknown item";
    state.failed.push({ label, url: state.currentUrl, reason, copied: false });
    if (state.items[state.currentIndex]) {
      state.items[state.currentIndex].status = "Failed";
    }
    renderQueue();
    renderFailed();
    persistFailedReport();
    updateStatusSummary();
  }

  if (/ERROR:/i.test(line) && state.active) {
    setStatus("Downloading...", "neutral");
  }
};

const startDownload = async () => {
  if (!window.zeno || typeof window.zeno.startDownload !== "function") {
    setStatus("Run inside the desktop app to download.", "error");
    return;
  }

  const url = urlInput ? urlInput.value.trim() : "";
  const ytDlpPath = ytDlpInput ? ytDlpInput.value.trim() : "";
  const outputDir = downloadDirInput ? downloadDirInput.value.trim() : "";

  if (!url) {
    setStatus("Paste a video or playlist URL.", "error");
    return;
  }

  if (!ytDlpPath) {
    setStatus("Select your yt-dlp location.", "error");
    return;
  }

  if (!outputDir) {
    setStatus("Choose a download folder.", "error");
    return;
  }

  resetSession();
  state.outputDir = outputDir;
  setStatus("Starting...", "neutral");
  state.active = true;

  if (startButton) startButton.disabled = true;
  if (cancelButton) cancelButton.disabled = false;

  const selectedMode = document.querySelector("input[name='mode']:checked");
  const mode = selectedMode ? selectedMode.value : "audio";

  const payload = {
    url,
    ytDlpPath,
    outputDir,
    ffmpegLocation: ffmpegInput ? ffmpegInput.value.trim() : "",
    mode,
    audioFormat: audioFormat ? audioFormat.value : "mp3",
    audioQuality: audioQuality ? audioQuality.value : "192K",
    videoFormat: videoFormat ? videoFormat.value : "mp4",
    videoQuality: videoQuality ? videoQuality.value : "best",
    cookiesBrowser: cookiesBrowser ? cookiesBrowser.value : "none",
    cookiesProfile: cookiesProfile ? cookiesProfile.value.trim() : "",
    cookiesFile: cookiesFileInput ? cookiesFileInput.value.trim() : "",
    fragments: fragmentCount ? Number(fragmentCount.value) || 4 : 4,
    playlist: playlistToggle ? playlistToggle.checked : true,
    metadata: metadataToggle ? metadataToggle.checked : true,
    noUpdate: noUpdateToggle ? noUpdateToggle.checked : false
  };

  try {
    await window.zeno.startDownload(payload);
    setStatus("Downloading...", "neutral");
  } catch (error) {
    setStatus(error.message || "Failed to start download.", "error");
    if (startButton) startButton.disabled = false;
    if (cancelButton) cancelButton.disabled = true;
    state.active = false;
  }
};

const cancelDownload = async () => {
  if (!window.zeno || typeof window.zeno.cancelDownload !== "function") {
    return;
  }
  await window.zeno.cancelDownload();
  setStatus("Stopped", "error");
  if (startButton) startButton.disabled = false;
  if (cancelButton) cancelButton.disabled = true;
  state.active = false;
};

if (startButton) {
  startButton.addEventListener("click", startDownload);
}

if (cancelButton) {
  cancelButton.addEventListener("click", cancelDownload);
}

if (ytDlpBrowse) {
  ytDlpBrowse.addEventListener("click", async () => {
    if (!window.zeno || typeof window.zeno.selectYtDlpPath !== "function") {
      return;
    }
    const result = await window.zeno.selectYtDlpPath();
    if (result && ytDlpInput) {
      ytDlpInput.value = result;
      persistValue("zeno:ytDlpPath", result);
    }
  });
}

if (downloadDirBrowse) {
  downloadDirBrowse.addEventListener("click", async () => {
    if (!window.zeno || typeof window.zeno.selectDownloadDir !== "function") {
      return;
    }
    const result = await window.zeno.selectDownloadDir();
    if (result && downloadDirInput) {
      downloadDirInput.value = result;
      persistValue("zeno:downloadDir", result);
    }
  });
}

if (ffmpegBrowse) {
  ffmpegBrowse.addEventListener("click", async () => {
    if (!window.zeno || typeof window.zeno.selectFfmpegLocation !== "function") {
      return;
    }
    const result = await window.zeno.selectFfmpegLocation();
    if (result && ffmpegInput) {
      ffmpegInput.value = result;
      persistValue("zeno:ffmpegLocation", result);
    }
  });
}

if (cookiesFileBrowse) {
  cookiesFileBrowse.addEventListener("click", async () => {
    if (!window.zeno || typeof window.zeno.selectCookiesFile !== "function") {
      return;
    }
    const result = await window.zeno.selectCookiesFile();
    if (result && cookiesFileInput) {
      cookiesFileInput.value = result;
      persistValue("zeno:cookiesFile", result);
    }
  });
}

if (failedList) {
  failedList.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-button");
    if (!button) return;
    const index = Number(button.dataset.index);
    const item = state.failed[index];
    if (!item || !item.url) return;
    try {
      await navigator.clipboard.writeText(item.url);
      item.copied = true;
      renderFailed();
    } catch {
      setStatus("Failed to copy link", "error");
    }
  });
}

if (window.zeno && typeof window.zeno.onDownloadOutput === "function") {
  window.zeno.onDownloadOutput((payload) => {
    parseOutputLine(payload.line || "");
  });
}

if (window.zeno && typeof window.zeno.onDownloadExit === "function") {
  window.zeno.onDownloadExit(({ code }) => {
    state.active = false;
    if (startButton) startButton.disabled = false;
    if (cancelButton) cancelButton.disabled = true;

    if (code === 0) {
      updateStatusSummary(true);
      if (state.playlistTotal) {
        state.playlistIndex = state.playlistTotal;
        state.currentPercent = 100;
        updateOverall();
      }
      state.items.forEach((item) => {
        item.progress = 100;
        item.status = "Complete";
      });
      renderQueue();
      renderFailed();
      persistFailedReport();
    } else {
      updateStatusSummary(true);
      state.items.forEach((item) => {
        if (item.progress < 100) {
          item.status = "Error";
        }
      });
      renderQueue();
      renderFailed();
      persistFailedReport();
    }
  });
}

if (window.zeno && typeof window.zeno.onDownloadError === "function") {
  window.zeno.onDownloadError((payload) => {
    setStatus(payload.message || "Download error", "error");
  });
}

const updateMeta = async () => {
  if (!appMeta) return;
  if (window.zeno && typeof window.zeno.getVersion === "function") {
    try {
      const version = await window.zeno.getVersion();
      appMeta.textContent = `v${version} on ${window.zeno.platform}`;
      return;
    } catch {
      appMeta.textContent = "Local session";
      return;
    }
  }
  appMeta.textContent = "Local session";
};

updateMeta();
