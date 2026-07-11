/**
 * Gửi báo cáo kết quả luyện Toán về email bố + mẹ.
 * Dùng FormSubmit (miễn phí).
 *
 * Lần đầu mỗi địa chỉ email cần MỞ MAIL "Activate Form" và bấm xác nhận.
 * (Kiểm tra cả hộp Spam / Quảng cáo / Junk)
 */
(function (global) {
  var DEFAULT_EMAILS = ["quangtran@123corp.vn", "ngocdang@123corp.vn"];
  var pending = false;

  function uniqueEmails(list) {
    var seen = {};
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var e = String(list[i] || "")
        .trim()
        .toLowerCase();
      if (!e || e.indexOf("@") < 1) continue;
      if (seen[e]) continue;
      seen[e] = true;
      out.push(e);
    }
    return out;
  }

  /** Danh sách email bố/mẹ từ state (chuỗi phân tách bằng dấu phẩy) */
  function getParentEmails(state) {
    var raw = "";
    if (state) {
      if (state.parentEmails) raw = state.parentEmails;
      else if (state.parentEmail) raw = state.parentEmail;
    }
    var parts = String(raw || "")
      .split(/[,;\n]+/)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    if (!parts.length) return DEFAULT_EMAILS.slice();
    var list = uniqueEmails(parts);
    return list.length ? list : DEFAULT_EMAILS.slice();
  }

  function getParentEmailDisplay(state) {
    return getParentEmails(state).join(", ");
  }

  function shouldNotify(state, events, force) {
    if (force) return true;
    if (!state || state.emailNotify === false) return false;
    // Mặc định: gửi sau MỌI buổi hoàn thành (emailEverySession mặc định true)
    if (state.emailEverySession !== false) return true;
    if (events && (events.dailyCompleted || events.streakIncreased)) return true;
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
      "Streak: " + payload.streak + " ngày liên tiếp",
      "Tong sao: " + payload.totalStars,
      "So buoi hom nay: " + payload.todaySessions,
      "Thu thach ngay: " +
        (payload.dailyDone
          ? "DA HOAN THANH"
          : (payload.dailyProgress || "0") + " / " + (payload.dailyGoal || 10) + " cau dung"),
      "",
    ];
    if (payload.dailyCompletedNow) {
      lines.push(">>> Be vua HOAN THANH thu thach / streak ngay hom nay!");
      lines.push("");
    }
    if (payload.streakIncreased) {
      lines.push(">>> Streak vua duoc cap nhat (ngay luyen moi).");
      lines.push("");
    }
    if (payload.isTest) {
      lines.push(">>> DAY LA EMAIL THU (Test) tu app.");
      lines.push("");
    }
    lines.push("App: https://quangtran-123corp.github.io/toan-lop3/");
    lines.push("");
    lines.push("(Email tu dong tu app Toan Lop 3)");
    return lines.join("\n");
  }

  function postToFormSubmit(toEmail, body) {
    var url = "https://formsubmit.co/ajax/" + encodeURIComponent(toEmail);
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then(function (res) {
      return res.text().then(function (text) {
        var data = null;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { raw: text };
        }
        return { httpOk: res.ok, status: res.status, data: data, text: text };
      });
    });
  }

  function interpretResult(r, toEmail) {
    var data = r.data || {};
    var msg = String(data.message || data.raw || r.text || "");
    var successFlag = data.success;
    // FormSubmit: success can be boolean true or string "true"/"false"
    var ok =
      successFlag === true ||
      successFlag === "true" ||
      /thank you|submitted|success/i.test(msg);

    if (successFlag === false || successFlag === "false") {
      ok = false;
    }

    var needsActivation =
      /activat/i.test(msg) || /activate form/i.test(msg) || /we've sent you an email/i.test(msg);

    var needsServer =
      /web server/i.test(msg) || /html files/i.test(msg);

    return {
      to: toEmail,
      ok: ok && r.httpOk,
      needsActivation: needsActivation,
      needsServer: needsServer,
      message: msg,
      status: r.status,
    };
  }

  /**
   * Gửi tới tất cả email bố/mẹ.
   * @param force {boolean} bỏ qua điều kiện streak (dùng cho nút Test)
   */
  function sendStreakReport(state, sessionInfo, events, force) {
    events = events || {};
    sessionInfo = sessionInfo || {};

    if (!shouldNotify(state, events, force)) {
      return Promise.resolve({ ok: true, skipped: true });
    }
    if (pending && !force) {
      return Promise.resolve({ ok: true, skipped: true });
    }

    var emails = getParentEmails(state);
    var topic =
      typeof getTopic === "function"
        ? getTopic(sessionInfo.topicId || "hon-hop")
        : { name: sessionInfo.topicId || "Hỗn hợp", emoji: "🎲" };
    var pct = sessionInfo.total
      ? Math.round((sessionInfo.correct / sessionInfo.total) * 100)
      : sessionInfo.pct != null
        ? sessionInfo.pct
        : 0;

    var payload = {
      childName: (state && state.childName) || "Bé",
      when: new Date().toLocaleString("vi-VN"),
      topicId: sessionInfo.topicId || "hon-hop",
      topicName: (topic.emoji ? topic.emoji + " " : "") + (topic.name || sessionInfo.topicId),
      level: sessionInfo.level || "basic",
      correct: sessionInfo.correct != null ? sessionInfo.correct : 0,
      total: sessionInfo.total != null ? sessionInfo.total : 0,
      pct: pct,
      starsEarned: sessionInfo.starsEarned != null ? sessionInfo.starsEarned : 0,
      streak: (state && state.streak) || 0,
      totalStars: (state && state.stars) || 0,
      todaySessions: (state && state.todaySessions) || 0,
      dailyDone:
        state &&
        state.dailyCompletedDate === (typeof todayStr === "function" ? todayStr() : ""),
      dailyProgress: (state && state.dailyCorrectToday) || 0,
      dailyGoal: (state && state.dailyGoal) || 10,
      dailyCompletedNow: !!events.dailyCompleted,
      streakIncreased: !!events.streakIncreased,
      isTest: !!force || !!sessionInfo.isTest,
    };

    var subject =
      (payload.isTest ? "[TEST] " : "") +
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

    var message = buildMessage(payload);
    pending = true;

    // Gửi song song tới từng email (mỗi địa chỉ FormSubmit cần activate riêng)
    var tasks = emails.map(function (to) {
      var others = emails.filter(function (e) {
        return e !== to;
      });
      var body = {
        name: payload.childName || "Bé",
        email: to,
        _replyto: emails[0],
        _subject: subject,
        message: message,
        _template: "table",
        _captcha: "false",
        _honey: "",
        "Ten be": payload.childName,
        Streak: payload.streak + " ngay",
        "Ket qua": payload.correct + "/" + payload.total + " (" + payload.pct + "%)",
        "Chu de": payload.topicName,
      };
      // CC các email còn lại (nếu FormSubmit hỗ trợ)
      if (others.length) {
        body._cc = others.join(",");
      }

      return postToFormSubmit(to, body)
        .then(function (r) {
          return interpretResult(r, to);
        })
        .catch(function (err) {
          return {
            to: to,
            ok: false,
            needsActivation: false,
            message: err && err.message ? err.message : String(err),
          };
        });
    });

    return Promise.all(tasks).then(function (results) {
      pending = false;
      var anyOk = results.some(function (r) {
        return r.ok;
      });
      var anyActivation = results.some(function (r) {
        return r.needsActivation;
      });
      var details = results
        .map(function (r) {
          return r.to + ": " + (r.ok ? "OK" : r.message || "loi");
        })
        .join(" | ");

      // Lưu lần gửi cuối để debug
      try {
        localStorage.setItem(
          "toan-lop3-last-email",
          JSON.stringify({
            at: Date.now(),
            results: results,
            subject: subject,
          })
        );
      } catch (e) {
        /* ignore */
      }

      if (anyOk) {
        return { ok: true, results: results, details: details };
      }
      if (anyActivation) {
        return {
          ok: false,
          needsActivation: true,
          results: results,
          details: details,
          error:
            "FormSubmit chưa kích hoạt. Mở email Activate Form (cả Spam) của bố và mẹ, bấm link xác nhận, rồi thử lại.",
        };
      }
      return {
        ok: false,
        results: results,
        details: details,
        error: details || "Không gửi được email",
      };
    });
  }

  /** Email thử — không cần vừa xong bài */
  function sendTestEmail(state) {
    return sendStreakReport(
      state || {},
      {
        topicId: "hon-hop",
        level: "basic",
        correct: 8,
        total: 10,
        starsEarned: 8,
        pct: 80,
        isTest: true,
      },
      { streakIncreased: true },
      true
    );
  }

  global.EmailReport = {
    DEFAULT_EMAIL: DEFAULT_EMAILS[0],
    DEFAULT_EMAILS: DEFAULT_EMAILS,
    getParentEmail: function (state) {
      return getParentEmails(state)[0];
    },
    getParentEmails: getParentEmails,
    getParentEmailDisplay: getParentEmailDisplay,
    shouldNotify: shouldNotify,
    sendStreakReport: sendStreakReport,
    sendTestEmail: sendTestEmail,
    buildMessage: buildMessage,
  };
})(typeof window !== "undefined" ? window : globalThis);
