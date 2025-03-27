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
