// Get DOM elements
const timerText = document.getElementById("timerText");
const statusText = document.getElementById("statusText");
const playBtn   = document.getElementById("play");
const resetBtn  = document.getElementById("reset");
const skipBtn   = document.getElementById("skip");
const progressBar = document.getElementById("progress");
const totPomosText = document.getElementById("totPomos h4");
const LoginBtn = document.getElementById("loginBtn");
const StatsBtn = document.getElementById("statsBtn");
const body = document.getElementById("body");
const openModalBtn = document.getElementById('loginBtn');
const closeModalBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const mainSection = document.getElementById('main-section');

// Constants for durations (in seconds)
const WORK_DURATION = 25 * 60;  // 25 minutes
const BREAK_DURATION = 5 * 60;  // 5 minutes

// Initial state
let currentMode = 'work';       // "work" or "break"
let remainingTime = WORK_DURATION;
let totalPomodoros = 0;
let timerInterval = null;
let isRunning = false;
let isLoggedIn = false;

// Function to play silent audio in the background
function keepPageActive() {
  const audio = new Audio();
  audio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA="; 
  audio.loop = true;
  
  // Try to play the audio
  audio.play().then(() => {
      console.log("Silent audio is playing to keep the timer active.");
  }).catch(err => {
      console.warn("User interaction required to start audio:", err);
  });
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  keepPageActive();
});

// In case browsers block autoplay, prompt user to allow it
document.addEventListener("click", () => {
  keepPageActive();
});


function login() {
  if (!isLoggedIn) {
    isLoggedIn = true;
    LoginBtn.textContent = "Logout";
    StatsBtn.style.display = "block";
  } else {
    isLoggedIn = false;
    LoginBtn.textContent = "Login";
    StatsBtn.style.display = "block";
  }
}

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
  
  totPomosText.textContent = `Total Pomos Today: ${totalPomodoros}`;
}

// Update the background color of the body based on current mode
function updateBackground() {
  if (currentMode === 'work') {
    document.body.style.backgroundColor = "rgba(23, 180, 230, 0.219)"; // blue
  } else {
    document.body.style.backgroundColor = "rgba(23, 230, 150, 0.219)"; // similar tone green
  }
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
    // Change play button to pause icon
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  }
}

// Pause the timer
function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  // Change pause button back to play icon
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
  
  // Update body background based on new mode
  updateBackground();
  
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
LoginBtn.addEventListener("click", login);

openModalBtn.addEventListener('click', () => {
  modal.classList.add('active');
  // Option 1: Add inert attribute if supported (with polyfill if needed)
  mainSection.setAttribute('inert', '');
  // Option 2: Or add a class that disables pointer events (as in our CSS above)
  mainSection.classList.add('inert');
});

// Close modal: hide overlay and re-enable main content
closeModalBtn.addEventListener('click', () => {
  modal.classList.remove('active');
  mainSection.removeAttribute('inert');
  mainSection.classList.remove('inert');
});


// Initialize display and background on page load
updateBackground();
updateDisplay();
