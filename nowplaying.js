// Overlay OBS "now playing" pour Apple Music (macOS)
// Lancer : node nowplaying.js   →   OBS : http://localhost:3939
const http = require("http");
const fs = require("fs");
const { execFile } = require("child_process");

const PORT = 3939;
const ART = "/tmp/np_art";
let state = { playing: false, title: "", artist: "", album: "", key: "" };

const INFO = `
tell application "Music"
  if player state is stopped then return "STOPPED"
  set t to current track
  return (name of t) & "||" & (artist of t) & "||" & (album of t) & "||" & (duration of t) & "||" & (player position) & "||" & (player state is playing)
end tell`;

const ARTWORK = `
tell application "Music"
  set t to current track
  if (count of artworks of t) = 0 then return "none"
  set d to raw data of artwork 1 of t
end tell
set f to open for access POSIX file "${ART}" with write permission
set eof f to 0
write d to f
close access f
return "ok"`;

const osa = (s) =>
  new Promise((res) =>
    execFile("osascript", ["-e", s], (e, out) => res(e ? "" : out.trim())),
  );

async function poll() {
  const out = await osa(INFO);
  if (!out || out === "STOPPED") {
    state = { ...state, active: false, playing: false };
    return;
  }
  const [title, artist, album, dur, pos, ps] = out.split("||");
  const key = `${title}|${artist}`;
  if (key !== state.key) {
    try {
      fs.unlinkSync(ART);
    } catch {}
    await osa(ARTWORK);
  }
  const n = (x) => parseFloat(x.replace(",", "."));
  state = {
    active: true,
    playing: ps === "true",
    title,
    artist,
    album,
    key,
    duration: n(dur),
    position: n(pos),
    ts: Date.now(),
  };
}
setInterval(poll, 2000);
poll();

const HTML = `<!doctype html><meta charset="utf-8">
<style>
  body{margin:0;background:transparent;font-family:system-ui,sans-serif;color:#fff}
  #w{display:flex;align-items:center;gap:14px;padding:12px;width:fit-content;
     background:rgba(0,0,0,.55);border-radius:14px;transition:opacity .4s}
  #w.off{opacity:0}
  img{width:72px;height:72px;border-radius:8px;object-fit:cover;background:#222}
  #c{min-width:260px}
  #t{font-size:22px;font-weight:700}
  #a{font-size:16px;opacity:.8}
  #bar{height:5px;background:rgba(255,255,255,.25);border-radius:3px;margin-top:8px;overflow:hidden}
  #f{height:100%;width:0;background:#fff}
</style>
<div id="w" class="off"><img id="i"><div id="c">
  <div id="t"></div><div id="a"></div><div id="bar"><div id="f"></div></div>
</div></div>
<script>
let last='', s=null;
async function tick(){ try{ s=await (await fetch('/np')).json(); }catch{} }
function draw(){
  if(!s) return;
  w.classList.toggle('off',!s.active);
  if(s.key!==last){ last=s.key; i.src='/art?'+encodeURIComponent(s.key); }
  t.textContent=s.title;
  a.textContent=(s.playing?'⏸  ':'▶  ')+s.artist;
  const p=s.position+(s.playing?(Date.now()-s.ts)/1000:0);
  f.style.width=Math.min(100,p/s.duration*100)+'%';
}
setInterval(tick,2000); setInterval(draw,250); tick();
</script>`;

http
  .createServer((req, res) => {
    if (req.url.startsWith("/np")) {
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(state));
    }
    if (req.url.startsWith("/art")) {
      return fs.readFile(ART, (e, d) => {
        if (e) {
          res.statusCode = 404;
          return res.end();
        }
        res.setHeader("Content-Type", "image/jpeg");
        res.end(d);
      });
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(HTML);
  })
  .listen(PORT, () => console.log(`OK → http://localhost:${PORT}`));
