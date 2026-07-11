/**
 * Gửi báo cáo kết quả luyện Toán về email phụ huynh.
 * Dùng FormSubmit (miễn phí, không cần server riêng).
 * Lần đầu: bố mở email và bấm xác nhận FormSubmit một lần.
 */
(function (global) {
  var DEFAULT_EMAIL = "quangtran@123corp.vn";
  var pending = false;

  function getParentEmail(state) {
    var e = (state && state.parentEmail) || DEFAULT_EMAIL;
    e = String(e).trim();
    if (!e || e.indexOf("@") < 0) return DEFAULT_EMAIL;
    return e;
  }

  function shouldNotify(state, events) {
    if (!state || state.emailNotify === false) return false;
    // Gửi khi: hoàn thành thử thách/streak ngày, hoặc streak tăng (ngày luyện mới)
    if (events && (events.dailyCompleted || events.streakIncreased)) return true;
    // Tuỳ chọn: gửi mọi buổi
    if (state.emailEverySession) return true;
    return false;
  }

  function buildMessage(payload) {
    var lines = [
      "Báo cáo luyện Toán Lớp 3 — Kết nối tri thức",
      "========================================",
      "",
      "Bé: " + (payload.childName || "Bé"),
      "Thời gian: " + (payload.when || new Date().toLocaleString("vi-VN")),
      "",
      "--- Kết quả buổi luyện ---",
      "Chủ đề: " + (payload.topicName || payload.topicId || "—"),
      "Mức: " + (payload.level === "advanced" ? "Nâng cao" : "Cơ bản"),
      "Đúng: " + payload.correct + " / " + payload.total + " câu",
      "Chính xác: " + payload.pct + "%",
      "Sao buổi này: +" + payload.starsEarned,
      "",
      "--- Streak & tổng ---",
      "🔥 Streak: " + payload.streak + " ngày liên tiếp",
      "⭐ Tổng sao: " + payload.totalStars,
      "📚 Số buổi hôm nay: " + payload.todaySessions,
      "🎯 Thử thách ngày: " +
        (payload.dailyDone
          ? "ĐÃ HOÀN THÀNH (+ thưởng)"
          : (payload.dailyProgress || "0") + " / " + (payload.dailyGoal || 10) + " câu đúng"),
      "",
    ];
    if (payload.dailyCompletedNow) {
      lines.push(">>> Bé vừa HOÀN THÀNH thử thách / streak ngày hôm nay!");
      lines.push("");
    }
    if (payload.streakIncreased) {
      lines.push(">>> Streak vừa được cập nhật (ngày luyện mới).");
      lines.push("");
    }
    lines.push("App: https://quangtran-123corp.github.io/toan-lop3/");
    lines.push("");
    lines.push("(Email tự động từ app Toán Lớp 3)");
    return lines.join("\n");
  }

  /**
   * @returns {Promise<{ok:boolean, skipped?:boolean, error?:string}>}
   */
  function sendStreakReport(state, sessionInfo, events) {
    events = events || {};
    if (!shouldNotify(state, events)) {
      return Promise.resolve({ ok: true, skipped: true });
    }
    if (pending) {
      return Promise.resolve({ ok: true, skipped: true });
    }

    var to = getParentEmail(state);
    var topic =
      typeof getTopic === "function"
        ? getTopic(sessionInfo.topicId)
        : { name: sessionInfo.topicId, emoji: "" };
    var pct = sessionInfo.total
      ? Math.round((sessionInfo.correct / sessionInfo.total) * 100)
      : 0;

    var payload = {
      childName: state.childName || "Bé",
      when: new Date().toLocaleString("vi-VN"),
      topicId: sessionInfo.topicId,
      topicName: (topic.emoji ? topic.emoji + " " : "") + (topic.name || sessionInfo.topicId),
      level: sessionInfo.level,
      correct: sessionInfo.correct,
      total: sessionInfo.total,
      pct: pct,
      starsEarned: sessionInfo.starsEarned,
      streak: state.streak,
      totalStars: state.stars,
      todaySessions: state.todaySessions,
      dailyDone: state.dailyCompletedDate === (typeof todayStr === "function" ? todayStr() : ""),
      dailyProgress: state.dailyCorrectToday,
      dailyGoal: state.dailyGoal,
      dailyCompletedNow: !!events.dailyCompleted,
      streakIncreased: !!events.streakIncreased,
    };

    var subject =
      "[Toán Lớp 3] " +
      (payload.childName || "Bé") +
      " — " +
      (events.dailyCompleted
        ? "Hoàn thành Streak ngày"
        : events.streakIncreased
          ? "Streak " + payload.streak + " ngày"
          : "Kết quả luyện") +
      " (" +
      payload.pct +
      "%)";

    var body = {
      name: payload.childName || "Bé",
      email: to,
      _replyto: to,
      _subject: subject,
      message: buildMessage(payload),
      // FormSubmit options
      _template: "box",
      _captcha: "false",
      // Trường phụ để bảng đẹp hơn (một số template hỗ trợ)
      "Tên bé": payload.childName,
      Streak: payload.streak + " ngày",
      "Kết quả": payload.correct + "/" + payload.total + " (" + payload.pct + "%)",
      "Chủ đề": payload.topicName,
    };

    pending = true;
    var url = "https://formsubmit.co/ajax/" + encodeURIComponent(to);

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(function (res) {
        pending = false;
        if (!res.ok) {
          return res.text().then(function (t) {
            throw new Error(t || "HTTP " + res.status);
          });
        }
        return res.json().catch(function () {
          return { success: true };
        });
      })
      .then(function () {
        return { ok: true };
      })
      .catch(function (err) {
        pending = false;
        console.warn("Gửi email thất bại:", err);
        return {
          ok: false,
          error: err && err.message ? err.message : String(err),
        };
      });
  }

  global.EmailReport = {
    DEFAULT_EMAIL: DEFAULT_EMAIL,
    getParentEmail: getParentEmail,
    shouldNotify: shouldNotify,
    sendStreakReport: sendStreakReport,
    buildMessage: buildMessage,
  };
})(typeof window !== "undefined" ? window : globalThis);
