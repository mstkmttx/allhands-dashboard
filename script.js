// script.js

// Grab elements
const slidesLinkInput      = document.getElementById("slides-link");
const startBtn             = document.getElementById("start-btn");
const welcomeScreen        = document.getElementById("welcome-screen");
const presenterView        = document.getElementById("presenter-view");
const slidesFrame          = document.getElementById("slides-frame");

const slidoLinkInput       = document.getElementById("slido-link");
const startSlidoBtn        = document.getElementById("start-slido");
const slidoView            = document.getElementById("slido-view");
const slidoPresenterFrame  = document.getElementById("slido-presenter-frame");
const toSlidesBtn          = document.getElementById("to-slides");

const countdownEl          = document.getElementById("countdown");
const startTimerBtn        = document.getElementById("start-timer");
const pauseTimerBtn        = document.getElementById("pause-timer");
const resetTimerBtn        = document.getElementById("reset-timer");
const qaBtn                = document.getElementById("qa-btn");
const qaSection            = document.getElementById("qa-section");
const precountdownEl       = document.getElementById("precountdown");

// Load persisted URLs (if any)
let savedSlidesUrl = localStorage.getItem("slidesUrl") || null;
let savedSlidoUrl  = localStorage.getItem("slidoUrl")  || null;

// Prefill inputs
if (savedSlidesUrl) slidesLinkInput.value = savedSlidesUrl;
if (savedSlidoUrl)  slidoLinkInput.value  = savedSlidoUrl;

// Initialize timer state
let time     = 30;
let interval = null;

// Update the countdown display
function updateDisplay() {
  countdownEl.textContent = `00:${String(time).padStart(2, "0")}`;
}
updateDisplay();

// Pre-countdown: 3→2→1→GO, then callback
function startPreCountdown(cb) {
  const steps = ["3", "2", "1"];
  let idx = 0;
  function showStep() {
    if (idx < steps.length) {
      precountdownEl.textContent = steps[idx++];
      precountdownEl.classList.remove("hidden");
      precountdownEl.style.opacity = "1";
      setTimeout(() => {
        precountdownEl.style.opacity = "0";
        setTimeout(showStep, 100);
      }, 900);
    } else {
      precountdownEl.textContent = "GO";
      precountdownEl.classList.remove("hidden");
      precountdownEl.style.opacity = "1";
      precountdownEl.classList.add("slide-go");
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
  showStep();
}

// Convert Slides link to embed URL
function convertToEmbedLink(inputUrl) {
  try {
    const url = new URL(inputUrl);
    if (
      url.hostname.includes("docs.google.com") &&
      url.pathname.includes("/presentation")
    ) {
      const m = url.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (m) {
        return `https://docs.google.com/presentation/d/${m[1]}/embed?start=false&loop=false&delayms=3000`;
      }
    }
  } catch {}
  return null;
}

// Show Slides presenter view
function activateSlides(url) {
  const embed = convertToEmbedLink(url);
  if (!embed) {
    return alert("❌ Invalid Google Slides link. Please check and try again.");
  }
  slidesFrame.src = embed;
  welcomeScreen.classList.add("hidden");
  presenterView.classList.remove("hidden");
}

// -- Slides start button: store & launch --
startBtn.addEventListener("click", () => {
  const url = slidesLinkInput.value.trim();
  if (!url) return alert("⚠️ Paste your Google Slides link first.");
  savedSlidesUrl = url;
  localStorage.setItem("slidesUrl", url);
  activateSlides(url);
});

// -- Slido start button: store & launch Slido (and maybe Slides) --
startSlidoBtn.addEventListener("click", () => {
  // ensure Slides link is saved too
  if (!savedSlidesUrl) {
    const sUrl = slidesLinkInput.value.trim();
    if (!sUrl) return alert("⚠️ Paste your Google Slides link first.");
    savedSlidesUrl = sUrl;
    localStorage.setItem("slidesUrl", sUrl);
  }
  // store Slido link
  const slUrl = slidoLinkInput.value.trim();
  if (!slUrl) return alert("⚠️ Paste your Slido Presenter link first.");
  savedSlidoUrl = slUrl;
  localStorage.setItem("slidoUrl", slUrl);

  slidoPresenterFrame.src = slUrl;
  welcomeScreen.classList.add("hidden");
  slidoView.classList.remove("hidden");
});

// -- Proceed to Slides from Slido: reuse or fallback --
toSlidesBtn.addEventListener("click", () => {
  if (!savedSlidesUrl) {
    const f = slidesLinkInput.value.trim();
    if (!f) {
      return alert("⚠️ No Slides link available. Go back and paste it on the Welcome screen first.");
    }
    savedSlidesUrl = f;
    localStorage.setItem("slidesUrl", f);
  }
  slidoView.classList.add("hidden");
  activateSlides(savedSlidesUrl);
});

// -- Timer & Q&A logic --
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

pauseTimerBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
});

resetTimerBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
  time = 30;
  updateDisplay();
});

qaBtn.addEventListener("click", () => {
  qaSection.classList.remove("hidden");
  qaSection.scrollIntoView({ behavior: "smooth" });
});
