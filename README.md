# 🎵 Apple Music Now Playing for OBS

A "now playing" widget that shows the music playing in **Apple Music** (macOS) on your stream: title, artist, album art, a progress bar, and play / pause state.

One file, **no dependencies**: a small Node server reads Apple Music through AppleScript and serves an HTML page that you add to OBS as a *Browser Source*.

*Lire en français : [README_fr.md](https://github.com/Kacaouhete/obs-nowplaying/blob/main/README_fr.md)*

## Requirements

- macOS
- Apple Music (the "Music" app)
- [Node.js](https://nodejs.org) (LTS version)
- OBS Studio

## Installation

1. Install Node.js:
   ```bash
   brew install node
   ```
   On Apple Silicon Macs, if Homebrew shows a Rosetta error, use:
   ```bash
   arch -arm64 brew install node
   ```
   You can also download the installer from [nodejs.org](https://nodejs.org).

2. Get the project:
   ```bash
   git clone https://github.com/Kacaouhete/obs-nowplaying.git
   cd obs-nowplaying
   ```
   Or just download `nowplaying.js` and put it in a folder.

3. Start the server:
   ```bash
   node nowplaying.js
   ```
   You should see `OK → http://localhost:3939`. Keep the Terminal window open while you stream.

4. On first launch, macOS asks for permission: "Terminal wants to control Music". Click **OK**.

## Add the widget to OBS

1. In OBS: **Sources → + → Browser**
2. URL: `http://localhost:3939`
3. Width: `500`, height: `120` (adjust as needed)
4. Confirm.

To test without OBS, open `http://localhost:3939` in your browser while a track is playing.

## How it works

- The widget appears as soon as a track is loaded in Apple Music.
- When paused, it stays visible with the ⏸ icon and the bar frozen.
- It fades out when playback is stopped.
- Data is refreshed every 2 seconds, and the progress bar moves smoothly between updates.

## Customization

Everything lives in `nowplaying.js`:

| What | Where |
|---|---|
| Colors, fonts, sizes, rounded corners | `<style>` block inside the `HTML` constant |
| Server port | `PORT` constant at the top of the file |
| Play / pause icons | `draw()` function inside the `HTML` constant |

After any change: restart the script (`Ctrl+C`, then `node nowplaying.js`), then in OBS right-click the source → **Properties → Refresh cache of current page**.

## Troubleshooting

**Nothing shows up**
Check the permission: System Settings → Privacy & Security → Automation → enable **Music** under **Terminal**.

**Album art stays grey**
Some streamed tracks don't expose their artwork through AppleScript. The text still displays normally.

**`EADDRINUSE` on startup**
The port is already in use. Change `PORT` in the file (for example `3940`) and use the same value in the OBS URL.

**The widget is out of date in OBS**
Refresh the browser source cache (see above).

**The progress bar doesn't move**
Make sure the track is actually playing and the script is still running in the Terminal.

## Run automatically (optional)

To avoid opening Terminal before every stream, you can create a shortcut or launcher that runs `node /path/to/nowplaying.js`.

## License

## License

This project is released under the [MIT License](https://github.com/Kacaouhete/obs-nowplaying/blob/main/LICENSE).
