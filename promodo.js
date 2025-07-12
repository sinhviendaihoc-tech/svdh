window.onload = function () {
  const toggleBtn = document.getElementById("togglePomodoroBtn");
  const pomodoro = document.getElementById("pomodoroModule");

  toggleBtn.addEventListener("click", () => {
    pomodoro.style.display =
      pomodoro.style.display === "none" || pomodoro.style.display === ""
        ? "block"
        : "none";
  });

  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("startBtn");
  const resetBtn = document.getElementById("resetBtn");
  const modeButtons = document.querySelectorAll(".mode");

  const alarmSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
  alarmSound.preload = "auto";
  alarmSound.loop = true;

  let timer;
  let timeLeft = 20 * 60;
  let isRunning = false;

  let times = {
    pomodoro: 25,
    shortbreak: 5,
    longbreak: 15,
  };

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  function startTimer() {
    if (isRunning) {
      // Nếu đang chạy → bấm để dừng
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = "Start";
      return;
    }

    // Bắt đầu chạy
    isRunning = true;
    startBtn.textContent = "Stop";
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        startBtn.textContent = "Start";
        alarmSound.play();
        showAlarmPopup();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startBtn.textContent = "Start";
    const active = document.querySelector(".mode.active");
    const mode = active.textContent.toLowerCase().replace(" ", "");
    timeLeft = times[mode] * 60;
    updateDisplay();
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      clearInterval(timer);
      isRunning = false;
      startBtn.textContent = "Start";
      const mode = btn.textContent.toLowerCase().replace(" ", "");
      timeLeft = times[mode] * 60;
      updateDisplay();
    });
  });

  startBtn.addEventListener("click", startTimer);
  resetBtn.addEventListener("click", resetTimer);

  updateDisplay();

  // Kéo thả
  function makeDraggable(dragTarget, dragHandle) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    dragHandle.addEventListener("mousedown", function (e) {
      isDragging = true;
      const rect = dragTarget.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        dragTarget.style.position = "fixed";
        dragTarget.style.left = `${e.clientX - offsetX}px`;
        dragTarget.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
      document.body.style.userSelect = "auto";
    });
  }

  const dragTarget = document.getElementById("pomodoroModule");
  const dragHandle = document.getElementById("dragHandle");
  makeDraggable(dragTarget, dragHandle);

  // Thu nhỏ
  const minimizeBtn = document.getElementById("minimizeBtn");
  const pomodoroWrapper = document.getElementById("pomodoroModule");

  minimizeBtn.addEventListener("click", () => {
    pomodoroWrapper.classList.toggle("minimized");
  });

  // Cài đặt
  const settingsBtn = document.querySelector(".settings");
  const settingsPanel = document.getElementById("settingsPanel");
  const saveBtn = document.getElementById("saveSettings");

  const inputPomodoro = document.getElementById("setPomodoro");
  const inputShort = document.getElementById("setShortBreak");
  const inputLong = document.getElementById("setLongBreak");

  settingsBtn.addEventListener("click", () => {
    settingsPanel.style.display =
      settingsPanel.style.display === "none" ? "block" : "none";
  });

  saveBtn.addEventListener("click", () => {
    times.pomodoro = parseInt(inputPomodoro.value) || 25;
    times.shortbreak = parseInt(inputShort.value) || 5;
    times.longbreak = parseInt(inputLong.value) || 15;

    const active = document.querySelector(".mode.active");
    const mode = active.textContent.toLowerCase().replace(" ", "");
    timeLeft = times[mode] * 60;
    updateDisplay();

    alert("✅ Đã cập nhật thời gian!");
    settingsPanel.style.display = "none";
  });

  // Hàm hiện popup và dừng chuông
  function showAlarmPopup() {
    const popup = document.createElement("div");
    popup.innerHTML = `
    <div id="alarmOverlay" style="
      position: fixed; 
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.5); 
      display: flex; justify-content: center; align-items: center;
      z-index: 9999;">
      <div style="
        background: white; 
        padding: 20px 30px; 
        border-radius: 10px; 
        text-align: center;
        max-width: 300px;
        font-family: Arial, sans-serif;
        color: black;">
        <h3 style="margin-bottom: 10px;">⏰ Hết giờ!</h3>
        <p style="margin-bottom: 15px;">Bạn đã hoàn thành thời gian, hãy nghỉ ngơi hoặc chọn chế độ khác.</p>
        <button id="stopAlarmBtn" style="
          padding: 8px 16px; background: #4CAF50; color: white;
          border: none; border-radius: 6px; cursor: pointer;">OK</button>
      </div>
    </div>`;
    document.body.appendChild(popup);

    document.getElementById("stopAlarmBtn").addEventListener("click", () => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      document.getElementById("alarmOverlay").remove();
    });
  }
};
