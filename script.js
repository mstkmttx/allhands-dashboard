let timeLeft = 30;
let countdown;
let running = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function updateDisplay() {
  const seconds = timeLeft.toString().padStart(2, '0');
  timerDisplay.textContent = `00:${seconds}`;
}

startBtn.addEventListener("click", () => {
  if (running) return;
  running = true;
  countdown = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerDisplay.textContent = "Time's up!";
      running = false;
    } else {
      timeLeft--;
      updateDisplay();
    }
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(countdown);
  running = false;
});

resetBtn.addEventListener("click", () => {
  clearInterval(countdown);
  timeLeft = 30;
  updateDisplay();
  running = false;
});

updateDisplay();
let currentSlide = 0;
let totalSlides = 0;

const totalSlidesInput = document.getElementById("totalSlides");
const slideDisplay = document.querySelector(".slide-display");
const progressFill = document.getElementById("progressFill");

document.getElementById("nextSlide").addEventListener("click", () => {
  if (currentSlide < totalSlides) {
    currentSlide++;
    updateProgressBar();
  }
});

document.getElementById("prevSlide").addEventListener("click", () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateProgressBar();
  }
});

totalSlidesInput.addEventListener("change", () => {
  totalSlides = parseInt(totalSlidesInput.value) || 0;
  if (currentSlide > totalSlides) currentSlide = totalSlides;
  updateProgressBar();
});

function updateProgressBar() {
  if (totalSlides === 0) return;

  const percent = Math.round((currentSlide / totalSlides) * 100);
  progressFill.style.width = `${percent}%`;
  slideDisplay.textContent = `Slide ${currentSlide} of ${totalSlides} (${percent}%)`;
}
