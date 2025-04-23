// Grab elements
const slidesLinkInput  = document.getElementById("slides-link");
const startBtn         = document.getElementById("start-btn");
const welcomeScreen    = document.getElementById("welcome-screen");
const presenterView    = document.getElementById("presenter-view");
const slidesFrame      = document.getElementById("slides-frame");
const countdownEl      = document.getElementById("countdown");
const startTimerBtn    = document.getElementById("start-timer");
const pauseTimerBtn    = document.getElementById("pause-timer");
const resetTimerBtn    = document.getElementById("reset-timer");
const qaBtn            = document.getElementById("qa-btn");
const qaSection        = document.getElementById("qa-section");
const precountdownEl   = document.getElementById("precountdown");

// Initialize timer state
let time     = 30;
let interval = null;

// Update the countdown display
function updateDisplay() {
  countdownEl.textContent = `00:${String(time).padStart(2, "0")}`;
}
updateDisplay();

// Pre-countdown: 3→2→1→GO, then callback to start main timer
function startPreCountdown(cb) {
  const steps = ["3", "2", "1"];
  let idx = 0;

  function showNumber() {
    if (idx < steps.length) {
      precountdownEl.textContent = steps[idx++];
      precountdownEl.classList.remove("hidden");
      precountdownEl.style.opacity = "1";

      // hold ~900ms, fade ~100ms
      setTimeout(() => {
        precountdownEl.style.opacity = "0";
        setTimeout(showNumber, 100);
      }, 900);

    } else {
      // show GO
      precountdownEl.textContent = "GO";
      precountdownEl.classList.remove("hidden");
      precountdownEl.style.opacity = "1";
      precountdownEl.classList.add("slide-go");

      // let slide-go run for 1s, then hide and start main timer
      setTimeout(() => {
        precountdownEl.classList.remove("slide-go");
        precountdownEl.style.opacity = "0";
        setTimeout(() => {
          precountdownEl.classList.add("hidden");
          cb();
        }, 100);
      }, 1000);
    }
  }

  showNumber();
}

// Start timer with pre-countdown
startTimerBtn.addEventListener("click", () => {
  if (interval !== null) return;

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
    if (
      url.hostname.includes("docs.google.com") &&
      url.pathname.includes("/presentation")
    ) {
      const match = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        return `https://docs.google.com/presentation/d/${match[1]}/embed?start=false&loop=false&delayms=3000`;
      }
    }
  } catch (e) {}
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

// Show presenter on submit or paste
startBtn.addEventListener("click", () => {
  activatePresenterMode(slidesLinkInput.value.trim());
});
slidesLinkInput.addEventListener("input", () => {
  const url = slidesLinkInput.value.trim();
  if (url.includes("docs.google.com/presentation")) {
    activatePresenterMode(url);
  }
});
