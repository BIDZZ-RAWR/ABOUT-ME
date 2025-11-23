// Dialog to request music playback with a playful "No" button that dodges clicks.
const audio = document.getElementById("bgMusic");
const dialog = document.getElementById("musicDialog");
const dialogCard = dialog.querySelector("[data-animate='card']");
const yesButton = document.getElementById("btnYes");
const noButton = document.getElementById("btnNo");

let playResolved = false;

function showDialog() {
  dialog.classList.remove("hidden");
  requestAnimationFrame(() => {
    dialogCard.classList.remove("opacity-0", "translate-y-4", "scale-95");
    dialogCard.classList.add("opacity-100", "translate-y-0", "scale-100");
  });
}

function hideDialog() {
  dialogCard.classList.add("opacity-0", "translate-y-4", "scale-95");
  dialogCard.classList.remove("opacity-100", "translate-y-0", "scale-100");
  setTimeout(() => dialog.classList.add("hidden"), 200);
}

function dodgeButton() {
  const offsetX = Math.random() * 220 - 110;
  const offsetY = Math.random() * 140 - 70;
  const rotate = Math.random() * 10 - 5;
  noButton.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;
}

window.addEventListener("load", showDialog);

function attemptPlay() {
  audio.muted = false;
  audio.currentTime = 0;
  return audio.play().then(() => {
    playResolved = true;
    hideDialog();
  });
}

function scheduleRetry() {
  const reattempt = () => {
    attemptPlay().finally(() => {
      if (playResolved) {
        window.removeEventListener("pointerdown", reattempt);
        window.removeEventListener("touchstart", reattempt);
      }
    });
  };
  window.addEventListener("pointerdown", reattempt, { once: true });
  window.addEventListener("touchstart", reattempt, { once: true });
}

yesButton.addEventListener("click", () => {
  attemptPlay().catch(() => {
    scheduleRetry();
    hideDialog();
  });
});

["pointerenter", "pointerdown", "pointermove"].forEach(evt => {
  noButton.addEventListener(evt, dodgeButton);
});
