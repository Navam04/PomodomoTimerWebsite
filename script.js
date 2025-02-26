// Get DOM elements
const timerText = document.getElementById("timerText");
const statusText = document.getElementById("statusText");
const playBtn   = document.getElementById("play");
const resetBtn  = document.getElementById("reset");
const skipBtn   = document.getElementById("skip");
const progressBar = document.getElementById("progress");
const totPomosText = document.querySelector("#totPomos h4");

// Constants for durations (in seconds)
const WORK_DURATION = 25 * 60;  // 25 minutes
const BREAK_DURATION = 5 * 60;  // 5 minutes

// Initial state
let currentMode = 'work';       // "work" or "break"
let remainingTime = WORK_DURATION;
let totalPomodoros = 0;
let timerInterval = null;
let isRunning = false;

// Format seconds as mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
}

// Update timer text, status, progress bar, and total pomodoros count
function updateDisplay() {
  timerText.textContent = formatTime(remainingTime);
  statusText.textContent = currentMode === 'work' ? "Work" : "Break";
  
  // Calculate progress as percentage of elapsed time
  const duration = currentMode === 'work' ? WORK_DURATION : BREAK_DURATION;
  const elapsed = duration - remainingTime;
  const progressPercent = (elapsed / duration) * 100;
  progressBar.style.width = 100 - progressPercent + "%";
  
  totPomosText.textContent = `Total Pomos: ${totalPomodoros}`;
}

// Start the timer
function startTimer() {
  if (!isRunning) {
    timerInterval = setInterval(() => {
      remainingTime--;
      if (remainingTime < 0) {
        completeSession();
      } else {
        updateDisplay();
      }
    }, 1000);
    isRunning = true;
    // Change the play button to a pause icon
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  // Change the play button back to a play icon
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Reset the timer for the current session
function resetTimer() {
  pauseTimer();
  remainingTime = currentMode === 'work' ? WORK_DURATION : BREAK_DURATION;
  updateDisplay();
}

// Skip the current session and move to the next one
function skipSession() {
  pauseTimer();
  completeSession(true);  // Force complete current session
}

// Handle session completion (natural or skipped)
function completeSession(isSkip = false) {
  clearInterval(timerInterval);
  isRunning = false;
  
  // Only count a completed work session if not skipped
  if (currentMode === 'work' && !isSkip) {
    totalPomodoros++;
  }
  
  // Toggle between work and break sessions
  if (currentMode === 'work') {
    currentMode = 'break';
    remainingTime = BREAK_DURATION;
  } else {
    currentMode = 'work';
    remainingTime = WORK_DURATION;
  }
  
  // Reset the play button to the play icon
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  updateDisplay();
}

// Button event listeners
playBtn.addEventListener("click", () => {
  isRunning ? pauseTimer() : startTimer();
});
resetBtn.addEventListener("click", resetTimer);
skipBtn.addEventListener("click", skipSession);

// Initialize the display on page load
updateDisplay();
