/**
 * Gửi báo cáo kết quả luyện Toán về email bố + mẹ.
 * Nội dung: Tên bé, thử thách hôm nay, điểm số, điểm mạnh/yếu, lời khuyên.
 * FormSubmit — mỗi email cần Activate Form 1 lần (kể cả Spam).
 */
(function (global) {
  var DEFAULT_EMAILS = ["quangtran@123corp.vn", "ngocdang@123corp.vn"];
  var pending = false;

  var ADVICE = {
    "on-tap-so":
      "Luyện đọc-viết số, so sánh và làm tròn 5–10 phút/ngày với số có 3–4 chữ số.",
    "cong-tru":
      "Ôn cộng trừ có nhớ / mượn trong phạm vi 1000; làm 10 phép tính nháp mỗi ngày.",
    "bang-nhan-chia":
      "Học thuộc bảng nhân-chia 2–9 theo từng bảng; kiểm tra chéo (vd 6×7 và 42:6).",
    "nhan-chia-lon":
      "Rèn nhân/chia số có 2–3 chữ số với số 1 chữ số; chú ý đặt tính thẳng cột.",
    "hinh-hoc":
      "Cùng bé nhận biết góc vuông, trung điểm, bán kính trên hình vẽ thực tế.",
    "chu-vi-dien-tich":
      "Nhớ công thức: C=(dài+rộng)×2; S=dài×rộng. Vẽ hình và ghi số đo lên hình.",
    "do-luong":
      "Ôn đổi đơn vị: 1m=100cm, 1kg=1000g, 1 giờ=60 phút; làm vài bài tiền Việt.",
    "phan-so":
      "Dùng hình tròn/thanh chia phần để hiểu 1/2, 1/3, 1/4; so sánh phân số đơn giản.",
    "toan-loi":
      "Đọc kỹ đề, gạch chân dữ kiện, xác định phép tính trước khi ra đáp án.",
    "hon-hop":
      "Làm thử thách hỗn hợp 10 câu mỗi ngày để ôn đều các dạng.",
  };

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

  /** Luôn gồm bố + mẹ; gộp thêm email tùy chỉnh trong state */
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
    var list = uniqueEmails(parts.concat(DEFAULT_EMAILS));
    // đảm bảo đủ 2 email mặc định
    DEFAULT_EMAILS.forEach(function (e) {
      if (list.indexOf(e) < 0) list.push(e);
    });
    return list;
  }

  function getParentEmailDisplay(state) {
    return getParentEmails(state).join(", ");
  }

  function shouldNotify(state, events, force) {
    if (force) return true;
    if (!state || state.emailNotify === false) return false;
    if (state.emailEverySession !== false) return true;
    if (events && (events.dailyCompleted || events.streakIncreased)) return true;
    return false;
  }

  function topicLabel(id) {
    if (typeof getTopic === "function") {
      var t = getTopic(id);
      return (t.emoji ? t.emoji + " " : "") + (t.name || id);
    }
    return id;
  }

  /**
   * Phân tích answerLog buổi này + byTopic tổng hợp
   * answerLog: [{ topicId, ok, text }]
   */
  function analyzePerformance(state, sessionInfo) {
    var log = (sessionInfo && sessionInfo.answerLog) || [];
    var by = {};

    for (var i = 0; i < log.length; i++) {
      var row = log[i];
      var id = row.topicId || sessionInfo.topicId || "hon-hop";
      if (!by[id]) by[id] = { correct: 0, total: 0, wrongSamples: [] };
      by[id].total += 1;
      if (row.ok) by[id].correct += 1;
      else if (row.text && by[id].wrongSamples.length < 2) {
        by[id].wrongSamples.push(String(row.text).slice(0, 70));
      }
    }

    // Nếu không có log (bản cũ): gán theo topic buổi
    if (!Object.keys(by).length && sessionInfo) {
      var tid = sessionInfo.topicId || "hon-hop";
      by[tid] = {
        correct: sessionInfo.correct || 0,
        total: sessionInfo.total || 0,
        wrongSamples: [],
      };
    }

    var sessionStats = [];
    Object.keys(by).forEach(function (id) {
      var s = by[id];
      var pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
      sessionStats.push({
        id: id,
        name: topicLabel(id),
        correct: s.correct,
        total: s.total,
        pct: pct,
        wrongSamples: s.wrongSamples || [],
      });
    });
    sessionStats.sort(function (a, b) {
      return b.pct - a.pct;
    });

    // Điểm mạnh: >= 70% và có ít nhất 1 câu; yếu: < 60%
    var strengths = sessionStats.filter(function (s) {
      return s.total > 0 && s.pct >= 70;
    });
    var weaknesses = sessionStats.filter(function (s) {
      return s.total > 0 && s.pct < 60;
    });
    // Nếu không có yếu rõ, lấy dạng thấp nhất
    if (!weaknesses.length && sessionStats.length) {
      var worst = sessionStats[sessionStats.length - 1];
      if (worst.pct < 100) weaknesses = [worst];
    }
    if (!strengths.length && sessionStats.length) {
      var best = sessionStats[0];
      if (best.pct >= 50) strengths = [best];
    }

    // Bổ sung điểm yếu dài hạn từ state.byTopic
    var longWeak = [];
    var longStrong = [];
    if (state && state.byTopic) {
      Object.keys(state.byTopic).forEach(function (id) {
        var p = state.byTopic[id];
        if (!p || !p.total || p.total < 3) return;
        var pct = Math.round((p.correct / p.total) * 100);
        var item = {
          id: id,
          name: topicLabel(id),
          correct: p.correct,
          total: p.total,
          pct: pct,
        };
        if (pct >= 75) longStrong.push(item);
        else if (pct < 55) longWeak.push(item);
      });
      longStrong.sort(function (a, b) {
        return b.pct - a.pct;
      });
      longWeak.sort(function (a, b) {
        return a.pct - b.pct;
      });
    }

    var adviceList = [];
    var overallPct = sessionInfo.total
      ? Math.round((sessionInfo.correct / sessionInfo.total) * 100)
      : 0;

    if (overallPct >= 90) {
      adviceList.push(
        "Bé làm rất tốt buổi này. Có thể tăng mức Nâng cao hoặc thêm 5 câu thử thách."
      );
    } else if (overallPct >= 70) {
      adviceList.push(
        "Kết quả khá. Nên ôn lại các câu sai ngay trong ngày (xem phần điểm yếu)."
      );
    } else if (overallPct >= 50) {
      adviceList.push(
        "Bé đang nắm được một phần. Nên luyện mức Cơ bản 10 phút/ngày ở dạng yếu nhất."
      );
    } else {
      adviceList.push(
        "Đừng lo — sai để học. Chọn 1 dạng yếu, làm 5 câu Cơ bản mỗi ngày trong 1 tuần."
      );
    }

    weaknesses.slice(0, 3).forEach(function (w) {
      var tip = ADVICE[w.id] || "Luyện thêm dạng này 5–10 phút/ngày.";
      adviceList.push("[" + w.name + "] " + tip);
    });
    longWeak.slice(0, 2).forEach(function (w) {
      var already = weaknesses.some(function (x) {
        return x.id === w.id;
      });
      if (already) return;
      adviceList.push(
        "[Lịch sử] " +
          w.name +
          " còn " +
          w.pct +
          "% đúng — " +
          (ADVICE[w.id] || "nên ôn lại.")
      );
    });

    if (state && state.streak >= 3) {
      adviceList.push(
        "Streak " +
          state.streak +
          " ngày — duy trì thói quen mỗi ngày 10–15 phút rất tốt!"
      );
    } else {
      adviceList.push("Khuyến khích bé luyện đều mỗi ngày để giữ chuỗi streak.");
    }

    return {
      sessionStats: sessionStats,
      strengths: strengths,
      weaknesses: weaknesses,
      longStrong: longStrong.slice(0, 3),
      longWeak: longWeak.slice(0, 3),
      adviceList: adviceList,
    };
  }

  function describeChallenge(sessionInfo, events, state) {
    var topic =
      typeof getTopic === "function"
        ? getTopic(sessionInfo.topicId || "hon-hop")
        : { name: sessionInfo.topicId || "Hỗn hợp", emoji: "🎲" };
    var level =
      sessionInfo.level === "advanced"
        ? "Nâng cao"
        : sessionInfo.isDaily
          ? "Thử thách hôm nay (Cơ bản + Nâng cao)"
          : "Cơ bản";
    var name =
      sessionInfo.isDaily || sessionInfo.topicId === "hon-hop"
        ? "Thử thách hôm nay — Hỗn hợp nhiều dạng"
        : (topic.emoji ? topic.emoji + " " : "") + topic.name;
    var parts = [
      name,
      "Mức: " + level,
      "Số câu: " + (sessionInfo.total || 0),
    ];
    if (events && events.dailyCompleted) {
      parts.push("Vừa hoàn thành mục tiêu thử thách ngày");
    }
    if (state && state.dailyCorrectToday != null) {
      parts.push(
        "Tiến độ thử thách ngày: " +
          (state.dailyCorrectToday || 0) +
          "/" +
          (state.dailyGoal || 10) +
          " câu đúng"
      );
    }
    return {
      title: name,
      level: level,
      summary: parts.join(" · "),
    };
  }

  function buildMessage(payload) {
    var a = payload.analysis || {
      strengths: [],
      weaknesses: [],
      sessionStats: [],
      adviceList: [],
      longStrong: [],
      longWeak: [],
    };
    var ch = payload.challenge || {};
    var lines = [];

    lines.push("══════════════════════════════════════");
    lines.push("  BÁO CÁO KẾT QUẢ LUYỆN TOÁN LỚP 3");
    lines.push("  Kết nối tri thức với cuộc sống");
    lines.push("══════════════════════════════════════");
    lines.push("");
    lines.push("1) TÊN BÉ");
    lines.push("   " + (payload.childName || "Bé"));
    lines.push("");
    lines.push("2) THỬ THÁCH / BÀI HÔM NAY");
    lines.push("   " + (ch.summary || payload.topicName || "—"));
    lines.push("   Thời gian: " + (payload.when || ""));
    lines.push("");
    lines.push("3) ĐIỂM SỐ");
    lines.push(
      "   " +
        payload.correct +
        "/" +
        payload.total +
        " câu đúng  |  Chính xác: " +
        payload.pct +
        "%"
    );
    lines.push(
      "   Xếp loại: " +
        (payload.pct >= 90
          ? "Xuất sắc"
          : payload.pct >= 70
            ? "Khá / Tốt"
            : payload.pct >= 50
              ? "Trung bình"
              : "Cần ôn thêm")
    );
    lines.push("   Sao buổi này: +" + payload.starsEarned);
    lines.push(
      "   Streak: " +
        payload.streak +
        " ngày  |  Tổng sao: " +
        payload.totalStars
    );
    lines.push("");
    lines.push("4) CHI TIẾT THEO DẠNG BÀI (buổi này)");
    if (a.sessionStats && a.sessionStats.length) {
      a.sessionStats.forEach(function (s) {
        lines.push(
          "   • " +
            s.name +
            ": " +
            s.correct +
            "/" +
            s.total +
            " (" +
            s.pct +
            "%)"
        );
      });
    } else {
      lines.push("   (Không có chi tiết từng dạng)");
    }
    lines.push("");
    lines.push("5) ĐIỂM MẠNH");
    if (a.strengths && a.strengths.length) {
      a.strengths.forEach(function (s) {
        lines.push("   ✓ " + s.name + " — " + s.pct + "% đúng buổi này");
      });
    } else {
      lines.push("   • Chưa nổi bật rõ; cần luyện đều thêm.");
    }
    if (a.longStrong && a.longStrong.length) {
      lines.push("   (Lịch sử tích lũy tốt:)");
      a.longStrong.forEach(function (s) {
        lines.push(
          "   ✓ " + s.name + " — " + s.pct + "% (" + s.correct + "/" + s.total + ")"
        );
      });
    }
    lines.push("");
    lines.push("6) ĐIỂM YẾU");
    if (a.weaknesses && a.weaknesses.length) {
      a.weaknesses.forEach(function (s) {
        lines.push("   ! " + s.name + " — " + s.pct + "% đúng buổi này");
        if (s.wrongSamples && s.wrongSamples.length) {
          s.wrongSamples.forEach(function (w) {
            lines.push("      VD câu sai: " + w);
          });
        }
      });
    } else {
      lines.push("   • Không có dạng yếu rõ trong buổi này.");
    }
    if (a.longWeak && a.longWeak.length) {
      lines.push("   (Cần theo dõi lâu dài:)");
      a.longWeak.forEach(function (s) {
        lines.push(
          "   ! " + s.name + " — " + s.pct + "% (" + s.correct + "/" + s.total + ")"
        );
      });
    }
    lines.push("");
    lines.push("7) LỜI KHUYÊN CHO BỐ MẸ");
    (a.adviceList || []).forEach(function (tip, idx) {
      lines.push("   " + (idx + 1) + ". " + tip);
    });
    lines.push("");
    if (payload.dailyCompletedNow) {
      lines.push(">>> Bé vừa HOÀN THÀNH thử thách / mục tiêu ngày!");
      lines.push("");
    }
    if (payload.isTest) {
      lines.push(">>> Đây là EMAIL THỬ từ app.");
      lines.push("");
    }
    lines.push("App: https://quangtran-123corp.github.io/toan-lop3/");
    lines.push("(Email tự động — Toán Lớp 3 KNTT)");
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
    var ok =
      successFlag === true ||
      successFlag === "true" ||
      /thank you|submitted|success/i.test(msg);
    if (successFlag === false || successFlag === "false") ok = false;
    var needsActivation =
      /activat/i.test(msg) || /activate form/i.test(msg) || /we've sent you an email/i.test(msg);
    return {
      to: toEmail,
      ok: ok && r.httpOk,
      needsActivation: needsActivation,
      message: msg,
      status: r.status,
    };
  }

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
    // luôn có ngocdang
    if (emails.indexOf("ngocdang@123corp.vn") < 0) {
      emails.push("ngocdang@123corp.vn");
    }
    if (emails.indexOf("quangtran@123corp.vn") < 0) {
      emails.push("quangtran@123corp.vn");
    }

    var topic =
      typeof getTopic === "function"
        ? getTopic(sessionInfo.topicId || "hon-hop")
        : { name: sessionInfo.topicId || "Hỗn hợp", emoji: "🎲" };
    var pct = sessionInfo.total
      ? Math.round((sessionInfo.correct / sessionInfo.total) * 100)
      : sessionInfo.pct != null
        ? sessionInfo.pct
        : 0;

    var analysis = analyzePerformance(state, sessionInfo);
    var challenge = describeChallenge(sessionInfo, events, state);

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
      analysis: analysis,
      challenge: challenge,
    };

    var grade =
      payload.pct >= 90
        ? "Xuất sắc"
        : payload.pct >= 70
          ? "Khá/Tốt"
          : payload.pct >= 50
            ? "Trung bình"
            : "Cần ôn thêm";

    var strengthText = (analysis.strengths || [])
      .map(function (s) {
        return s.name + " (" + s.pct + "%)";
      })
      .join("; ");
    if (!strengthText) strengthText = "Chưa nổi bật rõ";

    var weakText = (analysis.weaknesses || [])
      .map(function (s) {
        return s.name + " (" + s.pct + "%)";
      })
      .join("; ");
    if (!weakText) weakText = "Không có dạng yếu rõ";

    var adviceText = (analysis.adviceList || []).slice(0, 5).join(" | ");

    var subject =
      (payload.isTest ? "[TEST] " : "") +
      "[Toán Lớp 3] " +
      payload.childName +
      " — " +
      challenge.title +
      " — " +
      payload.pct +
      "% (" +
      grade +
      ")";

    var message = buildMessage(payload);
    pending = true;

    var tasks = emails.map(function (to) {
      var body = {
        // FormSubmit table fields (tiếng Việt rõ ràng)
        _subject: subject,
        _template: "table",
        _captcha: "false",
        _honey: "",
        name: payload.childName,
        email: to,
        _replyto: "quangtran@123corp.vn",
        "1_Ten_Be": payload.childName,
        "2_Thu_thach_hom_nay": challenge.summary,
        "3_Diem_so":
          payload.correct +
          "/" +
          payload.total +
          " câu đúng (" +
          payload.pct +
          "%) — " +
          grade,
        "4_Diem_manh": strengthText,
        "5_Diem_yeu": weakText,
        "6_Loi_khuyen": adviceText,
        "7_Streak": payload.streak + " ngày liên tiếp",
        "8_Tong_sao": String(payload.totalStars),
        message: message,
      };

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

      try {
        localStorage.setItem(
          "toan-lop3-last-email",
          JSON.stringify({ at: Date.now(), results: results, subject: subject })
        );
      } catch (e) {
        /* ignore */
      }

      if (anyOk) return { ok: true, results: results, details: details };
      if (anyActivation) {
        return {
          ok: false,
          needsActivation: true,
          results: results,
          details: details,
          error:
            "FormSubmit chưa kích hoạt. Mở email Activate Form (Spam) của bố và mẹ → bấm link → thử lại.",
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

  function sendTestEmail(state) {
    return sendStreakReport(
      state || {},
      {
        topicId: "hon-hop",
        level: "basic",
        correct: 7,
        total: 10,
        starsEarned: 7,
        pct: 70,
        isTest: true,
        isDaily: true,
        answerLog: [
          { topicId: "bang-nhan-chia", ok: true, text: "6 × 7 = ?" },
          { topicId: "bang-nhan-chia", ok: true, text: "48 : 6 = ?" },
          { topicId: "cong-tru", ok: true, text: "345 + 278 = ?" },
          { topicId: "cong-tru", ok: false, text: "1000 − 456 = ?" },
          { topicId: "hinh-hoc", ok: false, text: "Góc vuông bằng ? độ" },
          { topicId: "hinh-hoc", ok: true, text: "Hình tam giác có mấy cạnh?" },
          { topicId: "phan-so", ok: false, text: "1/2 của 12" },
          { topicId: "toan-loi", ok: true, text: "Mua 3 quyển vở..." },
          { topicId: "do-luong", ok: true, text: "2 giờ = ? phút" },
          { topicId: "chu-vi-dien-tich", ok: true, text: "Chu vi HV cạnh 5" },
        ],
      },
      { streakIncreased: true, dailyCompleted: true },
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
    analyzePerformance: analyzePerformance,
  };
})(typeof window !== "undefined" ? window : globalThis);
