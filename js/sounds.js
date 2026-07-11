/**
 * Hiệu ứng âm thanh — Web Audio API (không cần file MP3)
 * Hoạt động offline + iPad Safari sau lần chạm đầu tiên.
 */
(function (global) {
  var audioCtx = null;

  function enabled() {
    try {
      if (global.state && global.state.sound === false) return false;
      // state có thể chưa gắn — fallback localStorage
      if (!global.state) {
        var raw = localStorage.getItem("toan-lop3-kntt-v1");
        if (raw) {
          var s = JSON.parse(raw);
          if (s.sound === false) return false;
        }
      }
    } catch (e) {
      /* ignore */
    }
    return true;
  }

  function getCtx() {
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(function () {});
    }
    return audioCtx;
  }

  /** Gọi khi bé chạm/mở app — mở khóa audio trên iOS */
  function unlock() {
    try {
      var ctx = getCtx();
      if (!ctx) return;
      // beep cực ngắn volume 0
      var g = ctx.createGain();
      g.gain.value = 0.0001;
      g.connect(ctx.destination);
      var o = ctx.createOscillator();
      o.connect(g);
      o.start();
      o.stop(ctx.currentTime + 0.01);
    } catch (e) {
      /* ignore */
    }
  }

  function tone(freq, t0, dur, type, vol, freqEnd) {
    var ctx = getCtx();
    if (!ctx) return;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (freqEnd != null) {
      o.frequency.linearRampToValueAtTime(freqEnd, t0 + dur);
    }
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.02);
  }

  function chord(freqs, t0, dur, vol) {
    for (var i = 0; i < freqs.length; i++) {
      tone(freqs[i], t0 + i * 0.02, dur, "sine", (vol || 0.1) * (1 - i * 0.15));
    }
  }

  /** Trả lời đúng — 3 nốt vui (đô-mi-sol) */
  function playCorrect() {
    if (!enabled()) return;
    try {
      var ctx = getCtx();
      if (!ctx) return;
      var t = ctx.currentTime;
      tone(523.25, t, 0.12, "sine", 0.11); // C5
      tone(659.25, t + 0.1, 0.12, "sine", 0.11); // E5
      tone(783.99, t + 0.2, 0.22, "sine", 0.13); // G5
      // sparkle
      tone(1046.5, t + 0.28, 0.15, "triangle", 0.05);
    } catch (e) {
      /* ignore */
    }
  }

  /** Trả lời sai — 2 nốt thấp, nhẹ nhàng (không đáng sợ) */
  function playWrong() {
    if (!enabled()) return;
    try {
      var ctx = getCtx();
      if (!ctx) return;
      var t = ctx.currentTime;
      tone(311.13, t, 0.18, "triangle", 0.09); // Eb
      tone(233.08, t + 0.16, 0.28, "triangle", 0.08, 196); // xuống
    } catch (e) {
      /* ignore */
    }
  }

  /** Bắt đầu bài / thử thách */
  function playStart() {
    if (!enabled()) return;
    try {
      var ctx = getCtx();
      if (!ctx) return;
      var t = ctx.currentTime;
      tone(392, t, 0.1, "sine", 0.08);
      tone(523.25, t + 0.1, 0.12, "sine", 0.1);
      tone(659.25, t + 0.22, 0.18, "sine", 0.11);
    } catch (e) {
      /* ignore */
    }
  }

  /** Click / chuyển câu */
  function playClick() {
    if (!enabled()) return;
    try {
      var ctx = getCtx();
      if (!ctx) return;
      tone(800, ctx.currentTime, 0.04, "sine", 0.04);
    } catch (e) {
      /* ignore */
    }
  }

  /** Lưu tên / toast nhẹ */
  function playPop() {
    if (!enabled()) return;
    try {
      var ctx = getCtx();
      if (!ctx) return;
      var t = ctx.currentTime;
      tone(660, t, 0.08, "sine", 0.07);
      tone(880, t + 0.07, 0.1, "sine", 0.06);
    } catch (e) {
      /* ignore */
    }
  }

  /**
   * Kết thúc bài test
   * pct: 0–100
   */
  function playFinish(pct) {
    if (!enabled()) return;
    try {
      var ctx = getCtx();
      if (!ctx) return;
      var t = ctx.currentTime;
      pct = Number(pct) || 0;

      if (pct >= 100) {
        // Fanfare hoàn hảo
        var notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        for (var i = 0; i < notes.length; i++) {
          tone(notes[i], t + i * 0.12, 0.2, "sine", 0.12);
        }
        chord([523.25, 659.25, 783.99], t + 0.75, 0.55, 0.1);
        tone(1568, t + 0.85, 0.35, "triangle", 0.06);
      } else if (pct >= 80) {
        // Vui mừng
        tone(523.25, t, 0.14, "sine", 0.11);
        tone(659.25, t + 0.12, 0.14, "sine", 0.11);
        tone(783.99, t + 0.24, 0.14, "sine", 0.11);
        tone(1046.5, t + 0.4, 0.35, "sine", 0.12);
      } else if (pct >= 50) {
        // Khích lệ vừa
        tone(440, t, 0.15, "sine", 0.1);
        tone(554.37, t + 0.15, 0.15, "sine", 0.1);
        tone(659.25, t + 0.3, 0.28, "sine", 0.11);
      } else {
        // Nhẹ nhàng, động viên
        tone(349.23, t, 0.2, "sine", 0.09);
        tone(392, t + 0.2, 0.2, "sine", 0.09);
        tone(440, t + 0.4, 0.35, "sine", 0.1);
      }
    } catch (e) {
      /* ignore */
    }
  }

  /** Preview khi bật âm thanh trong cài đặt */
  function playPreview() {
    if (!enabled()) return;
    playCorrect();
  }

  // Tương thích code cũ
  function playTone(ok) {
    if (ok) playCorrect();
    else playWrong();
  }

  global.SoundFX = {
    unlock: unlock,
    playCorrect: playCorrect,
    playWrong: playWrong,
    playStart: playStart,
    playClick: playClick,
    playPop: playPop,
    playFinish: playFinish,
    playPreview: playPreview,
    playTone: playTone,
  };
  global.playTone = playTone;
})(typeof window !== "undefined" ? window : globalThis);
