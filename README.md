# Zeno

Zeno is a minimal electron application for YT to audio/video format that works.

## Development

- npm install
- npm run dev

## Install yt-dlp

1. Download the yt-dlp Windows binary from the official releases page.
2. Place it somewhere stable, for example `C:\tools\yt-dlp\yt-dlp.exe`.
3. In Zeno, click `Browse` next to `yt-dlp location` and select the exe.

## Install FFmpeg

1. Download FFmpeg (Windows builds) and extract it.
2. Either add the `bin` folder to your PATH or use the `FFmpeg location` field in Zeno.

## Cookies.txt (Netscape format)

If cookies-from-browser fails on Windows, export a Netscape cookies file:

1. Install a cookies.txt exporter extension in your browser.
2. Log in to the site in your browser.
3. Export cookies in Netscape format (the file starts with `# Netscape HTTP Cookie File`).
4. In Zeno, use the `Cookies file` field and select the saved `cookies.txt`.

## Build Windows exe

- npm run dist

The installer is created in the release folder.

## Build packaged app

- npm run build

## Troubleshooting

If `npm run dist` fails with a symbolic link privilege error on Windows, enable Developer Mode or run the terminal as Administrator, then try again.
