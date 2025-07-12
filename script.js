// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Hiệu ứng tiêu đề động
  const text = "Sinh viên đại học";
  const chars = text.split('');
  let visible = [...chars];
  let index = chars.length - 1;
  let deleting = true;

  function animateTitle() {
    if (deleting) {
      if (index >= 1) {
        if (chars[index] !== ' ') visible[index] = '';
        index--;
      } else {
        deleting = false;
        index = 1;
      }
    } else {
      if (index < chars.length) {
        if (chars[index] !== ' ') visible[index] = chars[index];
        index++;
      } else {
        deleting = true;
        index = chars.length - 1;
      }
    }
    document.title = visible.join('');
    setTimeout(animateTitle, 150);
  }
  animateTitle();

  // Chat toggle
  const chatBox = document.getElementById("chat-box");
  const chatBtn = document.getElementById("chatBtn");

  chatBtn.addEventListener("click", () => {
    chatBox.style.display = chatBox.style.display === "block" ? "none" : "block";
  });

  // Gửi tin nhắn đến Discord
  window.sendToDiscord = function () {
    const sender = document.getElementById("sender").value.trim();
    const message = document.getElementById("message").value.trim();
    const signature = document.getElementById("signature").value.trim();

    if (!sender || !message) return alert("❗ Vui lòng nhập tên và nội dung.");

    const webhookURL = "https://discord.com/api/webhooks/1391749380884664361/7_8_pR_pxoQaqCe-blfAoSkvqYE3JmLuRn6zNuya-iXdRJAf0vacc_Vt0w1XyTeAxF7k";

    const payload = {
      content: `📨 **Tin nhắn mới từ người dùng**\n👤 **Người gửi:** ${sender}\n💬 **Nội dung:** ${message}\n✍️ **Ký tên:** ${signature || "(Không có)"}`
    };

    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) {
        alert("✅ Đã gửi thành công!");
        document.getElementById("sender").value = "";
        document.getElementById("message").value = "";
        document.getElementById("signature").value = "";
        chatBox.style.display = "none";
      } else {
        alert("❌ Gửi thất bại. Vui lòng thử lại.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("⚠️ Lỗi khi gửi tin nhắn.");
    });
  }

  // Audio Player Controls
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const trackTitle = document.getElementById('trackTitle');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const progressBar = document.getElementById('progressBar');

  let isPlaying = false;
  const playIcon = "https://cdn-icons-png.flaticon.com/512/27/27223.png";
  const pauseIcon = "https://cdn-icons-png.flaticon.com/512/3669/3669483.png";

  window.addEventListener('click', () => {
    if (!isPlaying) {
      audioPlayer.play().then(() => {
        console.log('Đã phát nhạc sau tương tác đầu tiên');
      }).catch(err => console.log('Không thể phát nhạc:', err));
      isPlaying = true;
    }
  }, { once: true });

  function formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener('timeupdate', () => {
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${percent}%`;
  });

  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audioPlayer.pause();
      playPauseIcon.src = playIcon;
    } else {
      audioPlayer.play();
      playPauseIcon.src = pauseIcon;
    }
    isPlaying = !isPlaying;
  });

  trackTitle.addEventListener('click', () => {
    audioPlayer.play();
    playPauseIcon.src = pauseIcon;
    isPlaying = true;
  });

  // Overlay
  const overlay = document.getElementById('overlay');
  overlay.addEventListener('click', () => {
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.style.display = 'none';
      audioPlayer.play().catch(err => console.log("Autoplay bị chặn:", err));
    }, 500);
  });

  // Volume Control
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeToggle = document.getElementById("volumeToggle");
  const volumeIcon = document.getElementById("volumeIcon");
  audioPlayer.volume = 0.1;
  volumeSlider.value = 0.1;

  let lastVolume = 1;

  volumeToggle.addEventListener("click", () => {
    if (audioPlayer.volume > 0) {
      lastVolume = audioPlayer.volume;
      audioPlayer.volume = 0;
      volumeSlider.value = 0;
      volumeIcon.src = "https://img.icons8.com/ios-filled/24/mute.png";
    } else {
      audioPlayer.volume = lastVolume || 1;
      volumeSlider.value = audioPlayer.volume;
      volumeIcon.src = "https://img.icons8.com/ios-filled/24/speaker.png";
    }
  });

  volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;
    volumeIcon.src = audioPlayer.volume == 0
      ? "https://img.icons8.com/ios-filled/24/mute.png"
      : "https://img.icons8.com/ios-filled/24/speaker.png";
  });
});
