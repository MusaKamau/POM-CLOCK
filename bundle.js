document.addEventListener('DOMContentLoaded', function () {
  // Constants
  const breakElement = document.getElementById('break-length');
  const sessionElement = document.getElementById('session-length');
  const timeLeftElement = document.getElementById('time-left');
  const timerLabelElement = document.getElementById('timer-label');
  const startStopBtn = document.getElementById('start_stop');
  const resetBtn = document.getElementById('reset');
  const beep = document.getElementById('beep');

  // Initial values and state
  let breakLength = parseInt(breakElement.innerText);
  let sessionLength = parseInt(sessionElement.innerText);
  let isSessionMode = true;
  let timeRemaining = sessionLength * 60 * 1000;
  let isActive = false;
  let timerInterval;

  // Format time in MM:SS format and update the display
  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((timeRemaining % 60000) / 1000).toString().padStart(2, '0');
    timeLeftElement.innerText = `${minutes}:${seconds}`;
  }

  // Set the timer label based on the current mode (Session or Break)
  function setCurrentTimer() {
    if (isSessionMode) {
      timerLabelElement.innerText = 'Session';
    } else {
      timerLabelElement.innerText = 'Break';
    }
  }

  // Toggle between start and stop
  function toggleTimer() {
    isActive = !isActive;
    if (isActive) {
      timerInterval = setInterval(updateTime, 1000);
      updateTimerDisplay();
      setCurrentTimer(); // Call the function to set the correct label when timer starts
    } else {
      clearInterval(timerInterval);
    }
  }

  // Update the timer based on the time remaining and current mode
  function updateTime() {
    if (timeRemaining === 0) {
      beep.play();
      if (isSessionMode) {
        isSessionMode = false;
        timeRemaining = breakLength * 60 * 1000;
      } else {
        isSessionMode = true;
        timeRemaining = sessionLength * 60 * 1000;
      }
      setCurrentTimer(); // Call the function to set the correct label when timer reaches zero
    } else {
      timeRemaining -= 1000;
      if (timeRemaining < 0) {
        timeRemaining = 0; // Ensure the timer reaches 00:00 before switching to a new session
      }
    }
    updateTimerDisplay();
  }

  // Reset the timer to initial state
  function resetTimer() {
    beep.pause();
    beep.currentTime = 0;
    clearInterval(timerInterval);
    isActive = false;
    isSessionMode = true;
    breakLength = 5;
    sessionLength = 25;
    timeRemaining = sessionLength * 60 * 1000;
    breakElement.innerText = breakLength;
    sessionElement.innerText = sessionLength;
    setCurrentTimer(); // Call the function to set the correct label when timer is reset
    updateTimerDisplay();
  }

  // Handle length change for session and break
  function handleLengthChange(type, increment) {
    const element = type === 'break' ? breakElement : sessionElement;
    const length = parseInt(element.innerText);
    if (!isActive) {
      const newLength = increment ? Math.min(length + 1, 60) : Math.max(length - 1, 1);
      element.innerText = newLength;
      if (type === 'session') {
        sessionLength = newLength;
        if (isSessionMode) {
          timeRemaining = newLength * 60 * 1000;
          updateTimerDisplay();
        }
      } else {
        breakLength = newLength;
        if (!isSessionMode) {
          timeRemaining = newLength * 60 * 1000;
          updateTimerDisplay();
          setCurrentTimer(); // Call the function to set the correct label when the break timer starts
        }
      }
    }
  }

  // Event listeners
  startStopBtn.addEventListener('click', toggleTimer);
  resetBtn.addEventListener('click', resetTimer);
  document.getElementById('break-increment').addEventListener('click', function () {
    handleLengthChange('break', true);
  });
  document.getElementById('break-decrement').addEventListener('click', function () {
    handleLengthChange('break', false);
  });
  document.getElementById('session-increment').addEventListener('click', function () {
    handleLengthChange('session', true);
  });
  document.getElementById('session-decrement').addEventListener('click', function () {
    handleLengthChange('session', false);
  });
});

