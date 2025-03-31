// Grab elements
const slidesLinkInput = document.getElementById("slides-link");
const startBtn = document.getElementById("start-btn");
const welcomeScreen = document.getElementById("welcome-screen");
const presenterView = document.getElementById("presenter-view");
const slidesFrame = document.getElementById("slides-frame");
const countdownEl = document.getElementById("countdown");
const startTimerBtn = document.getElementById("start-timer");
const pauseTimerBtn = document.getElementById("pause-timer");
const resetTimerBtn = document.getElementById("reset-timer");
const qaBtn = document.getElementById("qa-btn");
const qaSection = document.getElementById("qa-section");

// Initialize timer state
let time = 30;
let interval = null;

// Update the countdown display
function updateDisplay() {
  countdownEl.textContent = `00:${String(time).padStart(2, "0")}`;
}
updateDisplay();

// Start timer
startTimerBtn.addEventListener("click", () => {
  if (interval !== null) return; // Avoid multiple intervals

  interval = setInterval(() => {
    if (time > 0) {
      time--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
    }
  }, 1000);
});

// Pause timer
pauseTimerBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
});

// Reset timer
resetTimerBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  time = 30;
  updateDisplay();
});

// Show Q&A section
qaBtn.addEventListener("click", () => {
  qaSection.classList.remove("hidden");
  qaSection.scrollIntoView({ behavior: "smooth" });
});

// Convert any valid Google Slides link to embeddable format
function convertToEmbedLink(inputUrl) {
  try {
    const url = new URL(inputUrl);
    if (url.hostname.includes("docs.google.com") && url.pathname.includes("/presentation")) {
      const idMatch = url.pathname.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (idMatch && idMatch[1]) {
        const id = idMatch[1];
        return `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000`;
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

// Activate presenter mode
function activatePresenterMode(inputUrl) {
  const embedUrl = convertToEmbedLink(inputUrl);
  if (embedUrl) {
    slidesFrame.src = embedUrl;
    welcomeScreen.classList.add("hidden");
    presenterView.classList.remove("hidden");
  } else {
    alert("❌ Invalid Google Slides link. Please check and try again.");
  }
}

// Button click or input paste triggers
startBtn.addEventListener("click", () => {
  const inputUrl = slidesLinkInput.value.trim();
  activatePresenterMode(inputUrl);
});

slidesLinkInput.addEventListener("input", () => {
  const inputUrl = slidesLinkInput.value.trim();
  if (inputUrl.includes("docs.google.com/presentation")) {
    activatePresenterMode(inputUrl);
  }
});
