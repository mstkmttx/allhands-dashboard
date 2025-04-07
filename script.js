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
const precountdownEl = document.getElementById("precountdown");

// Initialize timer state
let time = 30;
let interval = null;

// Update the countdown display
function updateDisplay() {
  countdownEl.textContent = `00:${String(time).padStart(2, "0")}`;
}
updateDisplay();

// Revised pre-countdown function using recursive setTimeout with "GO" animation
function startPreCountdown(callback) {
  let count = 3;
  function displayNext() {
    if (count < 0) {
      // All done; hide the pre-countdown element and call callback
      precountdownEl.classList.add("hidden");
      if (callback) callback();
    } else if (count === 0) {
      // When count reaches 0, show "GO" and trigger the slide-to-timer animation
      precountdownEl.textContent = "GO";
      precountdownEl.classList.remove("hidden");
      precountdownEl.style.opacity = 1;
      precountdownEl.classList.add("slide-go");
      // Allow the slide animation to run for 1 second before finishing
      setTimeout(() => {
        precountdownEl.classList.remove("slide-go");
        count--; // set to -1 to finish
        displayNext();
      }, 1000);
    } else {
      // Display the number (3, then 2, then 1) with a fade-out effect
      precountdownEl.textContent = count;
      precountdownEl.classList.remove("hidden");
      precountdownEl.style.opacity = 1;
      setTimeout(() => {
        precountdownEl.style.opacity = 0;
        setTimeout(() => {
          count--;
          displayNext();
        }, 500); // Wait for fade-out to finish
      }, 500); // Hold the number for 500ms
    }
  }
  displayNext();
}

// Start timer with pre-countdown
startTimerBtn.addEventListener("click", () => {
  if (interval !== null) return; // Avoid multiple intervals
  startPreCountdown(() => {
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
