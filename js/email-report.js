/**
 * Gửi báo cáo kết quả qua Web3Forms (miễn phí, ít bị antivirus chặn hơn FormSubmit).
 *
 * Đăng ký free: https://web3forms.com
 * - Tạo Access Key cho quangtran@123corp.vn
 * - Tạo Access Key cho ngocdang@123corp.vn
 * - Dán key vào ⚙️ Cài đặt trong app
 *
 * API: POST https://api.web3forms.com/submit
 */
(function (global) {
  var DEFAULT_EMAILS = ["quangtran@123corp.vn", "ngocdang@123corp.vn"];
  var WEB3FORMS_URL = "https://api.web3forms.com/submit";
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
    DEFAULT_EMAILS.forEach(function (e) {
      if (list.indexOf(e) < 0) list.push(e);
    });
    return list;
  }

  function getParentEmailDisplay(state) {
    return getParentEmails(state).join(", ");
  }

  /**
   * Danh sách { email, access_key } để gửi Web3Forms.
   * Free plan: mỗi access_key gắn 1 email nhận.
   */
  function getWeb3Targets(state) {
    var targets = [];
    var dadKey = (state && state.web3formsKeyDad) || "";
    var momKey = (state && state.web3formsKeyMom) || "";
    var sharedKey = (state && state.web3formsAccessKey) || "";

    dadKey = String(dadKey).trim();
    momKey = String(momKey).trim();
    sharedKey = String(sharedKey).trim();

    if (dadKey) {
      targets.push({ email: "quangtran@123corp.vn", access_key: dadKey, label: "Bố" });
    }
    if (momKey) {
      targets.push({ email: "ngocdang@123corp.vn", access_key: momKey, label: "Mẹ" });
    }
    // Key dùng chung (1 email đã cấu hình trên Web3Forms dashboard)
    if (sharedKey && !dadKey && !momKey) {
      targets.push({
        email: getParentEmails(state)[0] || DEFAULT_EMAILS[0],
        access_key: sharedKey,
        label: "Chung",
      });
    }
    // Nếu chỉ có 1 trong 2 key riêng + shared, thêm shared nếu khác
    if (sharedKey && (dadKey || momKey)) {
      var used = targets.map(function (t) {
        return t.access_key;
      });
      if (used.indexOf(sharedKey) < 0) {
        targets.push({
          email: "forward",
          access_key: sharedKey,
          label: "Key thêm",
        });
      }
    }
    return targets;
  }

  function hasAnyAccessKey(state) {
    return getWeb3Targets(state).length > 0;
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

    var strengths = sessionStats.filter(function (s) {
      return s.total > 0 && s.pct >= 70;
    });
    var weaknesses = sessionStats.filter(function (s) {
      return s.total > 0 && s.pct < 60;
    });
    if (!weaknesses.length && sessionStats.length) {
      var worst = sessionStats[sessionStats.length - 1];
      if (worst.pct < 100) weaknesses = [worst];
    }
    if (!strengths.length && sessionStats.length) {
      var best = sessionStats[0];
      if (best.pct >= 50) strengths = [best];
    }

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
        "Streak " + state.streak + " ngày — duy trì thói quen mỗi ngày 10–15 phút rất tốt!"
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
    return { title: name, level: level, summary: parts.join(" · ") };
  }

  /** Một bản nội dung gọn — không lặp field */
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
    var grade =
      payload.pct >= 90
        ? "Xuất sắc"
        : payload.pct >= 70
          ? "Khá/Tốt"
          : payload.pct >= 50
            ? "Trung bình"
            : "Cần ôn thêm";

    var manh = [];
    (a.strengths || []).forEach(function (s) {
      manh.push(s.name + " " + s.pct + "%");
    });
    (a.longStrong || []).slice(0, 2).forEach(function (s) {
      var dup = (a.strengths || []).some(function (x) {
        return x.id === s.id;
      });
      if (!dup) manh.push(s.name + " " + s.pct + "% (lịch sử)");
    });
    if (!manh.length) manh.push("Chưa nổi bật rõ");

    var yeu = [];
    (a.weaknesses || []).forEach(function (s) {
      var line = s.name + " " + s.pct + "%";
      if (s.wrongSamples && s.wrongSamples[0]) {
        line += " — VD: " + s.wrongSamples[0];
      }
      yeu.push(line);
    });
    (a.longWeak || []).slice(0, 2).forEach(function (s) {
      var dup = (a.weaknesses || []).some(function (x) {
        return x.id === s.id;
      });
      if (!dup) yeu.push(s.name + " " + s.pct + "% (lịch sử)");
    });
    if (!yeu.length) yeu.push("Không có dạng yếu rõ");

    var chiTiet = (a.sessionStats || [])
      .map(function (s) {
        return s.name + " " + s.correct + "/" + s.total + " (" + s.pct + "%)";
      })
      .join("; ");

    var lines = [
      "BÁO CÁO TOÁN LỚP 3 (KNTT)",
      "",
      "• Tên bé: " + (payload.childName || "Bé"),
      "• Bài/thử thách: " + (ch.summary || payload.topicName || "—"),
      "• Thời gian: " + (payload.when || ""),
      "• Điểm: " +
        payload.correct +
        "/" +
        payload.total +
        " (" +
        payload.pct +
        "%) — " +
        grade,
      "• Sao buổi này: +" +
        payload.starsEarned +
        " | Streak: " +
        payload.streak +
        " ngày | Tổng sao: " +
        payload.totalStars,
    ];

    if (chiTiet) {
      lines.push("• Chi tiết dạng bài: " + chiTiet);
    }

    lines.push("• Điểm mạnh: " + manh.join("; "));
    lines.push("• Điểm yếu: " + yeu.join("; "));
    lines.push("");
    lines.push("Lời khuyên:");
    (a.adviceList || []).slice(0, 4).forEach(function (tip, i) {
      lines.push(i + 1 + ") " + tip);
    });

    if (payload.dailyCompletedNow) {
      lines.push("");
      lines.push("(Đã hoàn thành thử thách/mục tiêu ngày)");
    }
    if (payload.isTest) {
      lines.push("");
      lines.push("(Email thử)");
    }

    lines.push("");
    lines.push("App: https://quangtran-123corp.github.io/toan-lop3/");
    return lines.join("\n");
  }

  function postWeb3Forms(accessKey, fields) {
    // Chỉ các key cho phép — tuyệt đối không gửi field lẻ trùng message
    var body = {
      access_key: accessKey,
      subject: fields.subject || "Báo cáo Toán Lớp 3",
      // Web3Forms hiển thị nội dung chính qua "message" / "content"
      // Không gửi name, email, Tên bé, Điểm số... để tránh double
      message: fields.message || "",
    };

    return fetch(WEB3FORMS_URL, {
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

  function interpretResult(r, target) {
    var data = r.data || {};
    var msg = String(data.message || data.raw || r.text || "");
    var ok =
      data.success === true ||
      data.success === "true" ||
      (r.httpOk && /success|sent|thank/i.test(msg));
    if (data.success === false || data.success === "false") ok = false;

    return {
      to: target.email,
      label: target.label,
      ok: ok,
      message: msg || (ok ? "OK" : "Lỗi gửi"),
      status: r.status,
      needsKey: /access.?key|invalid|unauthorized/i.test(msg),
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

    var targets = getWeb3Targets(state);
    if (!targets.length) {
      return Promise.resolve({
        ok: false,
        needsSetup: true,
        error:
          "Chưa cấu hình Web3Forms Access Key. Vào ⚙️ Cài đặt → lấy key miễn phí tại web3forms.com (1 key cho bố, 1 key cho mẹ) rồi dán vào app.",
      });
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

    // CHỈ 1 bản: subject + message (nội dung gọn). Không field lẻ.
    var message = buildMessage(payload);

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

    pending = true;

    var fieldsBase = {
      subject: subject,
      message: message,
    };

    var tasks = targets.map(function (target) {
      return postWeb3Forms(target.access_key, fieldsBase)
        .then(function (r) {
          return interpretResult(r, target);
        })
        .catch(function (err) {
          return {
            to: target.email,
            label: target.label,
            ok: false,
            message: err && err.message ? err.message : String(err),
          };
        });
    });

    return Promise.all(tasks).then(function (results) {
      pending = false;
      var anyOk = results.some(function (r) {
        return r.ok;
      });
      var details = results
        .map(function (r) {
          return (r.label || r.to) + ": " + (r.ok ? "OK" : r.message || "lỗi");
        })
        .join(" | ");

      try {
        localStorage.setItem(
          "toan-lop3-last-email",
          JSON.stringify({
            at: Date.now(),
            provider: "web3forms",
            results: results,
            subject: subject,
          })
        );
      } catch (e) {
        /* ignore */
      }

      if (anyOk) {
        return { ok: true, results: results, details: details, provider: "web3forms" };
      }
      return {
        ok: false,
        results: results,
        details: details,
        error: details || "Không gửi được qua Web3Forms",
        provider: "web3forms",
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
    PROVIDER: "web3forms",
    SETUP_URL: "https://web3forms.com",
    DEFAULT_EMAIL: DEFAULT_EMAILS[0],
    DEFAULT_EMAILS: DEFAULT_EMAILS,
    getParentEmail: function (state) {
      return getParentEmails(state)[0];
    },
    getParentEmails: getParentEmails,
    getParentEmailDisplay: getParentEmailDisplay,
    getWeb3Targets: getWeb3Targets,
    hasAnyAccessKey: hasAnyAccessKey,
    shouldNotify: shouldNotify,
    sendStreakReport: sendStreakReport,
    sendTestEmail: sendTestEmail,
    buildMessage: buildMessage,
    analyzePerformance: analyzePerformance,
  };
})(typeof window !== "undefined" ? window : globalThis);
