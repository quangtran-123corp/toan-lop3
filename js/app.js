/* globals TOPICS, getTopic, loadState, saveState, ensureDayRollover, recordSession, resetProgress, todayStr, generateSession */

var state = null;
var session = null; // { topicId, level, questions, index, correct, stars }

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function showScreen(id) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  const el = $(`#screen-${id}`);
  if (el) el.classList.add("active");
  try {
    if (window.scrollTo) window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    /* ignore */
  }
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  t.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    t.classList.remove("show");
    t.hidden = true;
  }, 2200);
}

function sfx(name, arg) {
  try {
    if (!window.SoundFX) return;
    if (name === "correct") SoundFX.playCorrect();
    else if (name === "wrong") SoundFX.playWrong();
    else if (name === "start") SoundFX.playStart();
    else if (name === "click") SoundFX.playClick();
    else if (name === "pop") SoundFX.playPop();
    else if (name === "finish") SoundFX.playFinish(arg);
    else if (name === "preview") SoundFX.playPreview();
    else if (name === "unlock") SoundFX.unlock();
  } catch (e) {
    /* ignore */
  }
}

// Tương thích
function playTone(ok) {
  sfx(ok ? "correct" : "wrong");
}

function confettiBurst() {
  // lightweight CSS confetti via temporary nodes
  const wrap = document.createElement("div");
  wrap.className = "confetti-wrap";
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("span");
    p.className = "confetti";
    p.style.setProperty("--x", `${uiRand(-120, 120)}px`);
    p.style.setProperty("--d", `${uiRand(400, 900)}ms`);
    p.style.setProperty("--h", `${uiRand(0, 360)}deg`);
    p.style.left = `${50 + uiRand(-20, 20)}%`;
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 1000);
}

function uiRand(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

/** Popup chúc mừng + tặng nhân vật khi 100% */
function showCharacterReward(info) {
  const ch = info.character;
  if (!ch) return;

  let modal = $("#reward-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "reward-modal";
    modal.className = "reward-modal";
    modal.hidden = true;
    modal.innerHTML =
      '<div class="reward-dialog" role="dialog" aria-labelledby="reward-title">' +
      '<p class="reward-sparkle" aria-hidden="true">✨🎉✨</p>' +
      '<h2 id="reward-title">Chúc mừng Bé!</h2>' +
      '<p class="reward-sub" id="reward-sub"></p>' +
      '<div class="reward-char" id="reward-char"></div>' +
      '<p class="reward-name" id="reward-name"></p>' +
      '<p class="reward-blurb" id="reward-blurb"></p>' +
      '<p class="reward-progress" id="reward-progress"></p>' +
      '<p class="reward-yogurt" id="reward-yogurt" hidden></p>' +
      '<button type="button" class="btn btn-primary btn-lg" id="btn-reward-ok">Nhận quà 🎁</button>' +
      "</div>";
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) hideCharacterReward();
    });
    $("#btn-reward-ok").addEventListener("click", hideCharacterReward);
  }

  $("#reward-sub").textContent = info.isNew
    ? "Bé làm đúng hết — nhận 1 nhân vật Zootopia mới!"
    : "Bé làm đúng hết! (Bộ sưu tập đã có nhân vật này rồi, vẫn siêu đỉnh!)";
  const charEl = $("#reward-char");
  charEl.style.setProperty("--c", ch.color || "#4F46E5");
  if (ch.img) {
    charEl.innerHTML = '<img src="' + ch.img + '" alt="' + ch.name + '" class="reward-char-img">';
  } else {
    charEl.textContent = ch.emoji;
  }
  $("#reward-name").textContent = ch.name;
  $("#reward-blurb").textContent = ch.blurb || "";
  $("#reward-progress").textContent =
    "Bộ sưu tập: " + info.ownedCount + " / " + info.goal + " nhân vật (mốc sữa chua)";

  const yg = $("#reward-yogurt");
  if (info.yogurtJustUnlocked || info.yogurtUnlocked) {
    yg.hidden = false;
    yg.textContent = info.yogurtJustUnlocked
      ? "🍦 Woa! Bé đã đủ " +
        info.goal +
        " nhân vật — Ba sẽ chở Bé đi mua sữa chua!"
      : "🍦 Bé đã mở quà sữa chua với Ba rồi — nhớ nhắc Ba nhé!";
  } else {
    yg.hidden = false;
    const left = Math.max(0, info.goal - info.ownedCount);
    yg.textContent =
      left > 0
        ? "Còn " + left + " nhân vật nữa là Ba chở đi mua sữa chua 🍦"
        : "🍦 Đủ mốc sữa chua rồi!";
  }

  modal.hidden = false;
  confettiBurst();
  sfx("finish", 100);
}

function hideCharacterReward() {
  const modal = $("#reward-modal");
  if (modal) modal.hidden = true;
}

// ——— Home ———
function renderHome() {
  state = ensureDayRollover(loadState());
  const name = state.childName?.trim();
  $("#greeting").textContent = name ? `Xin chào ${name}!` : "Xin chào bé!";
  const hour = new Date().getHours();
  const msgs = [
    "Hôm nay mình luyện Toán nhé?",
    "Mỗi ngày một chút, bé sẽ giỏi hơn!",
    "Thử thách hôm nay đang chờ bé đó!",
    hour < 12 ? "Buổi sáng vui vẻ — làm vài câu nhé!" : "Cùng ôn Toán nào!",
  ];
  $("#hero-msg").textContent = msgs[uiRand(0, msgs.length - 1)];

  $("#stat-streak").textContent = state.streak;
  $("#stat-stars").textContent = state.stars;
  $("#stat-done").textContent = state.todaySessions;

  const homeName = $("#home-child-name");
  if (homeName && document.activeElement !== homeName) {
    homeName.value = state.childName || "";
  }

  const dailyDone = state.dailyCompletedDate === todayStr();
  const prog = Math.min(100, Math.round(((state.dailyCorrectToday || 0) / state.dailyGoal) * 100));
  $("#daily-fill").style.width = `${prog}%`;
  $("#daily-progress-text").textContent = dailyDone
    ? `Hoàn thành! +5⭐ thưởng`
    : `${state.dailyCorrectToday || 0} / ${state.dailyGoal} câu đúng`;
  $("#btn-daily").textContent = dailyDone ? "Luyện thêm 🌟" : "Bắt đầu thử thách 🚀";
  $("#daily-title").textContent = "10 câu · Hỗn hợp (Cơ bản + Nâng cao)";

  // Bộ sưu tập nhân vật
  let charBox = $("#char-collection-box");
  if (!charBox) {
    charBox = document.createElement("div");
    charBox.id = "char-collection-box";
    const daily = $("#daily-card");
    if (daily && daily.parentNode) {
      daily.parentNode.insertBefore(charBox, daily.nextSibling);
    } else {
      const gridHost = $("#topic-grid");
      if (gridHost && gridHost.parentNode) {
        gridHost.parentNode.insertBefore(charBox, gridHost);
      }
    }
  }
  if (charBox && window.Characters && typeof Characters.collectionHtml === "function") {
    charBox.innerHTML = Characters.collectionHtml(state);
  }

  const grid = $("#topic-grid");
  grid.innerHTML = TOPICS.map(function (t) {
    if (t.section) {
      return (
        '<div class="topic-section" style="grid-column:1/-1">' +
        '<h3 class="topic-section-title">' +
        t.section +
        "</h3></div>"
      );
    }
    var contentHtml = "";
    if (t.content && t.content.length) {
      contentHtml =
        '<ul class="topic-content">' +
        t.content
          .map(function (line) {
            return "<li>" + line + "</li>";
          })
          .join("") +
        "</ul>";
    }
    var dateHtml = t.dates
      ? '<span class="topic-dates">' + t.dates + "</span>"
      : "";
    return (
      '<button type="button" class="topic-card' +
      (t.mathxWeek || t.mathxExam ? " topic-card-mathx" : "") +
      '" data-topic="' +
      t.id +
      '" style="--accent:' +
      t.color +
      '">' +
      '<span class="topic-emoji">' +
      t.emoji +
      "</span>" +
      '<span class="topic-name">' +
      t.name +
      "</span>" +
      dateHtml +
      contentHtml +
      (contentHtml
        ? ""
        : '<span class="topic-desc">' + (t.desc || "") + "</span>") +
      "</button>"
    );
  }).join("");

  grid.querySelectorAll(".topic-card").forEach((btn) => {
    btn.addEventListener("click", () => openDiff(btn.dataset.topic));
  });
}

/** Số câu mặc định theo đề (ôn kiểm tra giữa kỳ I = 20 câu) */
function defaultQuestionCount(topicId) {
  if (topicId === "mathx-gk1") return 20;
  return 0; // 0 = dùng lựa chọn trên màn hình
}

function openDiff(topicId) {
  session = { topicId, level: null, questions: [], index: 0, correct: 0, stars: 0 };
  const topic = getTopic(topicId);
  $("#diff-topic-name").textContent = `${topic.emoji} ${topic.name}`;
  const countSel = $("#q-count");
  const forced = defaultQuestionCount(topicId);
  if (countSel && forced) {
    countSel.value = String(forced);
  }
  // Gợi ý số câu đề kiểm tra
  const countLabel = document.querySelector(".count-picker label");
  if (countLabel) {
    countLabel.textContent = forced
      ? "Số câu đề này (cố định " + forced + "):"
      : "Số câu mỗi lần:";
  }
  if (countSel) {
    countSel.disabled = !!forced;
  }
  showScreen("diff");
}

function startPractice(topicId, level, count) {
  const forced = defaultQuestionCount(topicId);
  if (forced) count = forced;
  count = Math.max(1, Math.min(30, Number(count) || 10));
  const questions = generateSession(topicId, level, count);
  session = {
    topicId,
    level,
    questions,
    index: 0,
    correct: 0,
    stars: 0,
    answered: false,
    answerLog: [],
    isDaily: false,
  };
  const topic = getTopic(topicId);
  $("#practice-label").textContent =
    `${topic.emoji} ${level === "basic" ? "Cơ bản" : "Nâng cao"}`;
  $("#score-pill").textContent = "⭐ 0";
  sfx("start");
  showScreen("practice");
  renderQuestion();
}

function renderQuestion() {
  const { questions, index } = session;
  const total = questions.length;
  const item = questions[index];
  session.answered = false;

  $("#q-fill").style.width = `${(index / total) * 100}%`;
  $("#q-counter").textContent = `${index + 1} / ${total}`;

  const topic = getTopic(item.topicId);
  $("#q-topic-tag").textContent = `${topic.emoji} ${topic.name}`;
  $("#q-text").textContent = item.text;

  const visual = $("#q-visual");
  if (item.visual && typeof item.visual === "string") {
    visual.hidden = false;
    visual.innerHTML = item.visual;
    // Đưa hình vào tầm nhìn (iPad/điện thoại)
    try {
      visual.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch (e) {
      /* ignore */
    }
  } else {
    visual.hidden = true;
    visual.innerHTML = "";
  }

  const area = $("#answer-area");
  area.innerHTML = "";
  $("#feedback").hidden = true;
  $("#feedback").className = "feedback";
  $("#btn-check").hidden = true;
  $("#btn-next").hidden = true;
  $("#encourage").textContent = "";

  const card = $("#question-card");
  card.classList.remove("shake", "pop");
  void card.offsetWidth;
  card.classList.add("pop");

  if (item.type === "mc" && item.options) {
    const opts = item.options;
    area.className = "answer-area mc-grid";
    opts.forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt-btn";
      b.textContent = opt;
      b.dataset.value = opt;
      b.addEventListener("click", () => {
        if (session.answered) return;
        area.querySelectorAll(".opt-btn").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        checkAnswer(opt);
      });
      area.appendChild(b);
    });
  } else {
    area.className = "answer-area input-area";
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "numeric";
    input.autocomplete = "off";
    input.id = "answer-input";
    input.placeholder = "Nhập đáp án...";
    input.setAttribute("aria-label", "Đáp án");
    area.appendChild(input);
    $("#btn-check").hidden = false;
    setTimeout(() => input.focus(), 100);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submitInput();
      }
    });
  }
}

function normalizeAnswer(s) {
  return String(s)
    .trim()
    .replace(/\s+/g, "")
    .replace(/,/g, "")
    .replace(/\./g, "")
    .toLowerCase();
}

function submitInput() {
  if (session.answered) return;
  const input = $("#answer-input");
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    toast("Bé hãy nhập đáp án nhé!");
    input.focus();
    return;
  }
  checkAnswer(val);
}

function checkAnswer(userRaw) {
  if (session.answered) return;
  session.answered = true;

  const item = session.questions[session.index];
  const ok = normalizeAnswer(userRaw) === normalizeAnswer(item.answer);

  if (!session.answerLog) session.answerLog = [];
  session.answerLog.push({
    topicId: item.topicId || session.topicId,
    ok: ok,
    text: item.text || "",
    level: item.level || session.level,
  });

  if (ok) {
    session.correct += 1;
    const gain = session.level === "advanced" ? 2 : 1;
    session.stars += gain;
    $("#score-pill").textContent = `⭐ ${session.stars}`;
    sfx("correct");
    showFeedback(true, item);
    $("#encourage").textContent = uiPick([
      "Giỏi quá! 🌟",
      "Đúng rồi! Bé tuyệt lắm!",
      "Xuất sắc! 💪",
      "Hay lắm! Tiếp tục nào!",
      "Chính xác 100%! 🎉",
    ]);
  } else {
    sfx("wrong");
    showFeedback(false, item);
    $("#encourage").textContent = uiPick([
      "Chưa đúng — xem gợi ý rồi làm câu sau nhé!",
      "Không sao, sai là để học thêm! 💙",
      "Cố lên, câu sau sẽ tốt hơn!",
    ]);
    $("#question-card").classList.add("shake");
  }

  // disable options
  $$(".opt-btn").forEach((b) => {
    b.disabled = true;
    if (normalizeAnswer(b.dataset.value) === normalizeAnswer(item.answer)) {
      b.classList.add("correct");
    } else if (b.classList.contains("selected")) {
      b.classList.add("wrong");
    }
  });
  const input = $("#answer-input");
  if (input) input.disabled = true;

  $("#btn-check").hidden = true;
  $("#btn-next").hidden = false;
  $("#btn-next").textContent =
    session.index + 1 >= session.questions.length ? "Xem kết quả 🏆" : "Câu tiếp →";

  $("#q-fill").style.width = `${((session.index + 1) / session.questions.length) * 100}%`;

  // Hiện highlight đáp án trên hình (nếu có) — chỉ sau khi bé đã chọn
  if (item.visualAfter) {
    const vis = $("#q-visual");
    if (vis) {
      vis.hidden = false;
      vis.innerHTML = item.visualAfter;
    }
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Hiển thị lời giải dễ hiểu cho học sinh lớp 3 */
function showFeedback(ok, item) {
  const fb = $("#feedback");
  fb.hidden = false;
  fb.className = `feedback ${ok ? "ok" : "bad"}`;

  const head = ok
    ? `<div class="fb-head"><strong>Đúng rồi! 🌟</strong></div>`
    : `<div class="fb-head"><strong>Chưa đúng.</strong> Đáp án đúng: <em>${escapeHtml(
        item.answer
      )}</em></div>`;

  let solve = "";
  const steps = item.explainSteps;
  if (steps && steps.length) {
    solve =
      `<div class="solve-box">` +
      `<p class="solve-title">📝 Cách giải (dễ nhớ cho lớp 3)</p>` +
      `<ol class="solve-steps">` +
      steps
        .map(function (s) {
          return `<li>${escapeHtml(s)}</li>`;
        })
        .join("") +
      `</ol>` +
      (item.explainTip
        ? `<p class="solve-tip">💡 <strong>Ghi nhớ:</strong> ${escapeHtml(
            item.explainTip
          )}</p>`
        : "") +
      `</div>`;
  } else if (item.explain) {
    // Hỗ trợ giải thích nhiều dòng (xuống dòng = bước)
    const lines = String(item.explain)
      .split(/\n+/)
      .map(function (l) {
        return l.trim();
      })
      .filter(Boolean);
    if (lines.length > 1) {
      solve =
        `<div class="solve-box">` +
        `<p class="solve-title">📝 Cách giải</p>` +
        `<ol class="solve-steps">` +
        lines
          .map(function (l) {
            return `<li>${escapeHtml(l.replace(/^Bước\s*\d+\s*[:.\-]?\s*/i, ""))}</li>`;
          })
          .join("") +
        `</ol></div>`;
    } else {
      solve = `<div class="solve-box"><p class="solve-plain">${escapeHtml(
        item.explain
      )}</p></div>`;
    }
  }

  fb.innerHTML = head + solve;
}

function nextQuestion() {
  if (session.index + 1 >= session.questions.length) {
    finishSession();
    return;
  }
  sfx("click");
  session.index += 1;
  renderQuestion();
}

function finishSession() {
  const total = session.questions.length;
  const correct = session.correct;
  const starsEarned = session.stars;
  const pct = Math.round((correct / total) * 100);

  const recorded = recordSession(state, {
    topicId: session.topicId,
    level: session.level,
    correct,
    total,
    starsEarned,
  });
  // Tương thích: recordSession trả { state, events }
  const events = recorded && recorded.events ? recorded.events : {};
  state = recorded && recorded.state ? recorded.state : recorded;

  let title, emoji, msg;
  let rewardInfo = null;
  if (pct === 100) {
    emoji = "🏆";
    title = "Hoàn hảo!";
    msg = "Bé trả lời đúng hết — siêu đỉnh!";
    confettiBurst();
    // Tặng nhân vật hoạt hình
    if (window.Characters && typeof Characters.awardPerfect === "function") {
      rewardInfo = Characters.awardPerfect(state);
      state = loadState();
    }
  } else if (pct >= 80) {
    emoji = "🎉";
    title = "Tuyệt vời!";
    msg = "Bé làm rất tốt. Cố gắng thêm chút nữa là 100%!";
    confettiBurst();
  } else if (pct >= 50) {
    emoji = "💪";
    title = "Cố gắng tốt!";
    msg = "Đã nắm được nhiều phần. Luyện thêm để chắc hơn nhé!";
  } else {
    emoji = "🌱";
    title = "Cùng luyện tiếp!";
    msg = "Mỗi lần luyện là một bước tiến. Chọn Cơ bản để vững nền nhé!";
  }

  sfx("finish", pct);

  $("#result-emoji").textContent = emoji;
  $("#result-title").textContent = title;
  $("#result-msg").textContent = msg;
  $("#result-correct").textContent = correct;
  $("#result-total").textContent = total;
  $("#result-stars").textContent = `+${starsEarned}`;
  $("#result-pct").textContent = `${pct}%`;

  if (rewardInfo && rewardInfo.character) {
    showCharacterReward(rewardInfo);
  }

  const starsRow = $("#result-stars-row");
  const starCount = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  starsRow.innerHTML = Array.from({ length: 3 }, (_, i) =>
    i < starCount ? "⭐" : "☆"
  ).join("");

  // Dòng trạng thái gửi email bố + mẹ
  let emailLine = $("#result-email-status");
  if (!emailLine) {
    emailLine = document.createElement("p");
    emailLine.id = "result-email-status";
    emailLine.className = "result-email-status";
    const card = document.querySelector(".result-card");
    const actions = document.querySelector(".result-actions");
    if (card && actions) card.insertBefore(emailLine, actions);
    else if (card) card.appendChild(emailLine);
  }
  emailLine.textContent = "";
  emailLine.hidden = true;

  // Gửi email sau mỗi buổi (mặc định bật) — bố + mẹ
  if (window.EmailReport && typeof EmailReport.sendStreakReport === "function") {
    const emailsLabel =
      typeof EmailReport.getParentEmailDisplay === "function"
        ? EmailReport.getParentEmailDisplay(state)
        : state.parentEmail || "bố/mẹ";
    const willSend =
      state.emailNotify !== false &&
      (state.emailEverySession !== false ||
        events.dailyCompleted ||
        events.streakIncreased);
    if (willSend) {
      emailLine.hidden = false;
      emailLine.textContent = "📧 Đang gửi kết quả tới: " + emailsLabel + "…";
      EmailReport.sendStreakReport(
        state,
        {
          topicId: session.topicId,
          level: session.level,
          correct,
          total,
          starsEarned,
          answerLog: session.answerLog || [],
          isDaily: !!session.isDaily,
        },
        events
      ).then(function (res) {
        if (!emailLine) return;
        if (res && res.skipped) {
          emailLine.hidden = true;
          return;
        }
        if (res && res.ok) {
          emailLine.textContent = "✅ Đã gửi kết quả (Web3Forms) → " + emailsLabel;
          toast("Đã gửi email cho bố & mẹ 📧");
        } else if (res && res.needsSetup) {
          emailLine.textContent =
            "⚠️ Chưa có Access Key Web3Forms. Vào ⚙️ Cài đặt để dán key free từ web3forms.com";
          toast("Cần cấu hình Web3Forms");
        } else {
          emailLine.textContent =
            "⚠️ Chưa gửi được email. " +
            (res && res.error ? res.error : "Kiểm tra Access Key trong Cài đặt.");
        }
      });
    }
  }

  session._last = { topicId: session.topicId, level: session.level, count: total };
  showScreen("result");
}

function uiPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ——— Progress ———
function renderProgress() {
  state = ensureDayRollover(loadState());
  const s = state;
  $("#progress-summary").innerHTML = `
    <div class="psum-card"><span>🔥</span><strong>${s.streak}</strong><em>ngày streak</em></div>
    <div class="psum-card"><span>⭐</span><strong>${s.stars}</strong><em>tổng sao</em></div>
    <div class="psum-card"><span>📚</span><strong>${s.history.length}</strong><em>lần gần đây</em></div>
    <div class="psum-card"><span>✅</span><strong>${s.todaySessions}</strong><em>hôm nay</em></div>
  `;

  const list = $("#topic-progress-list");
  const practiceTopics =
    typeof getPracticeTopics === "function"
      ? getPracticeTopics()
      : TOPICS.filter(function (t) {
          return t.id && !t.section;
        });
  list.innerHTML = practiceTopics
    .map((t) => {
      const p = s.byTopic[t.id];
      if (!p || !p.total) {
        return `<div class="tp-row">
        <span class="tp-emoji">${t.emoji}</span>
        <div class="tp-info"><strong>${t.name}</strong><span>Chưa luyện</span></div>
        <div class="tp-bar"><div class="fill" style="width:0%"></div></div>
      </div>`;
      }
      const pct = Math.round((p.correct / p.total) * 100);
      return `<div class="tp-row">
      <span class="tp-emoji">${t.emoji}</span>
      <div class="tp-info">
        <strong>${t.name}</strong>
        <span>${p.correct}/${p.total} đúng · ${pct}% · CB ${p.basic} · NC ${p.advanced}</span>
      </div>
      <div class="tp-bar"><div class="fill" style="width:${pct}%;background:${t.color}"></div></div>
    </div>`;
    })
    .join("");
}

// ——— Settings ———
function renderSettings() {
  $("#child-name").value = state.childName || "";
  $("#opt-sound").checked = state.sound !== false;
  state.parentEmail = "quangtran@123corp.vn, ngocdang@123corp.vn";
  state.parentEmails = state.parentEmail;

  const keyDad = $("#web3-key-dad");
  const keyMom = $("#web3-key-mom");
  if (keyDad) keyDad.value = state.web3formsKeyDad || "";
  if (keyMom) keyMom.value = state.web3formsKeyMom || "";

  const optMail = $("#opt-email-notify");
  if (optMail) optMail.checked = state.emailNotify !== false;
  const optEvery = $("#opt-email-every");
  if (optEvery) optEvery.checked = state.emailEverySession !== false;
  const lastEl = $("#email-last-status");
  if (lastEl) {
    try {
      const last = JSON.parse(localStorage.getItem("toan-lop3-last-email") || "null");
      if (last && last.at) {
        lastEl.textContent =
          "Lần gửi gần nhất (" +
          (last.provider || "web3forms") +
          "): " +
          new Date(last.at).toLocaleString("vi-VN") +
          " — " +
          (last.results || [])
            .map(function (r) {
              return (r.label || r.to) + (r.ok ? " ✓" : " ✗");
            })
            .join(", ");
      } else if (
        window.EmailReport &&
        EmailReport.hasAnyAccessKey &&
        !EmailReport.hasAnyAccessKey(state)
      ) {
        lastEl.textContent =
          "Chưa có Access Key — vào web3forms.com lấy key free rồi dán phía trên.";
      } else {
        lastEl.textContent = "Chưa gửi email lần nào từ máy này.";
      }
    } catch (e) {
      lastEl.textContent = "";
    }
  }
}

// ——— Events ———
function bindEvents() {
  $$("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const to = btn.dataset.back;
      if (to === "home") {
        renderHome();
        showScreen("home");
      }
    });
  });

  $("#btn-settings").addEventListener("click", () => {
    renderSettings();
    showScreen("settings");
  });

  $("#btn-progress").addEventListener("click", () => {
    renderProgress();
    showScreen("progress");
  });

  $("#btn-daily").addEventListener("click", () => {
    // daily: 5 cơ bản + 5 nâng cao, gộp rồi lọc trùng
    const basicQs = generateSession("hon-hop", "basic", 5);
    const advQs = generateSession("hon-hop", "advanced", 5);
    const seen = {};
    const questions = [];
    basicQs.concat(advQs).forEach(function (item) {
      var k =
        typeof questionKey === "function"
          ? questionKey(item)
          : String(item.text) + "||" + String(item.answer);
      if (seen[k]) return;
      seen[k] = true;
      questions.push(item);
    });
    // nếu thiếu do lọc trùng, bù thêm
    var guard = 0;
    while (questions.length < 10 && guard < 80) {
      guard++;
      var extra = generateSession("hon-hop", Math.random() < 0.5 ? "basic" : "advanced", 1)[0];
      var ek =
        typeof questionKey === "function"
          ? questionKey(extra)
          : String(extra.text) + "||" + String(extra.answer);
      if (seen[ek]) continue;
      seen[ek] = true;
      questions.push(extra);
    }
    // xáo trộn
    for (var i = questions.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = questions[i];
      questions[i] = questions[j];
      questions[j] = tmp;
    }
    session = {
      topicId: "hon-hop",
      level: "basic",
      questions: questions,
      index: 0,
      correct: 0,
      stars: 0,
      answered: false,
      isDaily: true,
      answerLog: [],
    };
    $("#practice-label").textContent = "🎯 Thử thách hôm nay";
    $("#score-pill").textContent = "⭐ 0";
    sfx("start");
    showScreen("practice");
    renderQuestion();
  });

  $$(".diff-card").forEach((card) => {
    card.addEventListener("click", () => {
      const level = card.dataset.level;
      const forced = defaultQuestionCount(session.topicId);
      const count = forced || Number($("#q-count").value) || 10;
      startPractice(session.topicId, level, count);
    });
  });

  $("#btn-check").addEventListener("click", submitInput);
  $("#btn-next").addEventListener("click", nextQuestion);

  // —— Báo cáo câu khó / lỗi đề → email Ba ——
  function openReportModal() {
    if (!session || !session.questions || !session.questions[session.index]) {
      toast("Không có câu hỏi để báo cáo");
      return;
    }
    const item = session.questions[session.index];
    const modal = $("#report-modal");
    const preview = $("#report-q-preview");
    const note = $("#report-note");
    const status = $("#report-status");
    if (preview) {
      preview.textContent =
        (item.text || "").slice(0, 160) +
        ((item.text || "").length > 160 ? "…" : "");
    }
    if (note) note.value = "";
    if (status) {
      status.hidden = true;
      status.textContent = "";
      status.className = "report-status";
    }
    const firstReason = document.querySelector(
      'input[name="report-reason"][value="kho"]'
    );
    if (firstReason) firstReason.checked = true;
    if (modal) modal.hidden = false;
  }

  function closeReportModal() {
    const modal = $("#report-modal");
    if (modal) modal.hidden = true;
  }

  function sendCurrentQuestionReport() {
    if (!session || !session.questions) return;
    const item = session.questions[session.index];
    const reasonEl = document.querySelector(
      'input[name="report-reason"]:checked'
    );
    const reason = reasonEl ? reasonEl.value : "kho";
    const note = ($("#report-note") && $("#report-note").value) || "";
    const status = $("#report-status");
    const btnSend = $("#btn-report-send");

    if (!window.EmailReport || !EmailReport.sendBugReport) {
      toast("Chưa tải được module gửi email");
      return;
    }

    if (btnSend) {
      btnSend.disabled = true;
      btnSend.textContent = "Đang gửi…";
    }
    if (status) {
      status.hidden = false;
      status.className = "report-status";
      status.textContent = "Đang gửi báo cáo về email Ba…";
    }

    EmailReport.sendBugReport(state, {
      reason: reason,
      note: note,
      question: {
        text: item.text,
        type: item.type,
        answer: item.answer,
        options: item.options,
        explain: item.explain,
        explainSteps: item.explainSteps,
        topicId: item.topicId,
        week: item.week,
        level: item.level || session.level,
      },
      sessionMeta: {
        topicId: session.topicId,
        level: session.level,
        questionIndex: session.index,
        totalQuestions: session.questions.length,
        isDaily: !!session.isDaily,
      },
    }).then(function (res) {
      if (btnSend) {
        btnSend.disabled = false;
        btnSend.textContent = "Gửi cho Ba 📧";
      }
      if (res && res.ok) {
        if (status) {
          status.className = "report-status";
          status.textContent = "✅ Đã gửi cho Ba (quangtran@123corp.vn)";
        }
        toast("Đã báo cáo cho Ba 📧");
        sfx("pop");
        setTimeout(closeReportModal, 900);
      } else {
        if (status) {
          status.className = "report-status err";
          status.textContent =
            "⚠️ Gửi chưa được: " + (res && res.error ? res.error : "thử lại");
        }
        toast("Gửi báo cáo thất bại");
      }
    });
  }

  $("#btn-report-q")?.addEventListener("click", () => {
    openReportModal();
  });
  $("#btn-report-cancel")?.addEventListener("click", closeReportModal);
  $("#btn-report-send")?.addEventListener("click", sendCurrentQuestionReport);
  $("#report-modal")?.addEventListener("click", (e) => {
    if (e.target && e.target.id === "report-modal") closeReportModal();
  });

  $("#btn-quit").addEventListener("click", () => {
    if (confirm("Thoát buổi luyện? Tiến độ buổi này sẽ không được lưu.")) {
      closeReportModal();
      renderHome();
      showScreen("home");
    }
  });

  $("#btn-again").addEventListener("click", () => {
    const last = session?._last;
    if (last) {
      startPractice(last.topicId, last.level, last.count);
    } else {
      renderHome();
      showScreen("home");
    }
  });

  $("#btn-home").addEventListener("click", () => {
    renderHome();
    showScreen("home");
  });

  function saveChildName(fromEl) {
    const val = (fromEl?.value || "").trim().slice(0, 20);
    state.childName = val;
    saveState(state);
    const other = fromEl?.id === "home-child-name" ? $("#child-name") : $("#home-child-name");
    if (other) other.value = val;
    $("#greeting").textContent = val ? `Xin chào ${val}!` : "Xin chào bé!";
    toast(val ? `Đã lưu tên: ${val}` : "Đã xóa tên");
  }

  $("#child-name").addEventListener("change", () => {
    saveChildName($("#child-name"));
    sfx("pop");
  });
  $("#home-child-name")?.addEventListener("change", () => {
    saveChildName($("#home-child-name"));
    sfx("pop");
  });
  $("#btn-save-name")?.addEventListener("click", () => {
    saveChildName($("#home-child-name"));
    sfx("pop");
  });

  $("#opt-sound").addEventListener("change", () => {
    state.sound = $("#opt-sound").checked;
    saveState(state);
    if (state.sound) {
      sfx("unlock");
      sfx("preview");
      toast("Đã bật âm thanh 🔊");
    } else {
      toast("Đã tắt âm thanh");
    }
  });

  function saveParentEmailSettings() {
    state.parentEmail = "quangtran@123corp.vn, ngocdang@123corp.vn";
    state.parentEmails = state.parentEmail;
    const keyDad = $("#web3-key-dad");
    const keyMom = $("#web3-key-mom");
    if (keyDad) state.web3formsKeyDad = keyDad.value.trim();
    if (keyMom) state.web3formsKeyMom = keyMom.value.trim();
    const optMail = $("#opt-email-notify");
    if (optMail) state.emailNotify = optMail.checked;
    const optEvery = $("#opt-email-every");
    if (optEvery) state.emailEverySession = optEvery.checked;
    saveState(state);
  }

  $("#opt-email-notify")?.addEventListener("change", () => {
    saveParentEmailSettings();
    toast(state.emailNotify ? "Đã bật gửi email" : "Đã tắt gửi email");
  });
  $("#opt-email-every")?.addEventListener("change", () => {
    saveParentEmailSettings();
    toast(
      state.emailEverySession
        ? "Gửi email mọi buổi luyện"
        : "Chỉ gửi khi hoàn thành streak / ngày mới"
    );
  });
  $("#btn-save-email")?.addEventListener("click", () => {
    saveParentEmailSettings();
    // Đánh dấu user đã chỉnh key thủ công
    state.web3formsKeysLocked = true;
    saveState(state);
    const n =
      (state.web3formsKeyDad ? 1 : 0) + (state.web3formsKeyMom ? 1 : 0);
    toast(
      n
        ? "Đã lưu " + n + " Access Key Web3Forms"
        : "Chưa dán key — vào web3forms.com lấy key free"
    );
    sfx("pop");
    renderSettings();
  });
  $("#btn-test-email")?.addEventListener("click", () => {
    saveParentEmailSettings();
    sfx("unlock");
    const btn = $("#btn-test-email");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Đang gửi…";
    }
    toast("Đang gửi email thử (Web3Forms)…");
    if (!window.EmailReport || !EmailReport.sendTestEmail) {
      toast("Lỗi: chưa tải module email");
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Gửi email thử ngay";
      }
      return;
    }
    if (EmailReport.hasAnyAccessKey && !EmailReport.hasAnyAccessKey(state)) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Gửi email thử ngay";
      }
      alert(
        "⚠️ CHƯA CÓ ACCESS KEY\n\n" +
          "1. Mở https://web3forms.com (miễn phí)\n" +
          "2. Tạo Access Key với email quangtran@123corp.vn (bố)\n" +
          "3. Tạo Access Key với email ngocdang@123corp.vn (mẹ)\n" +
          "4. Dán 2 key vào ⚙️ Cài đặt → Lưu\n" +
          "5. Bấm Gửi email thử ngay\n\n" +
          "Web3Forms ít bị Kaspersky chặn hơn FormSubmit."
      );
      return;
    }
    EmailReport.sendTestEmail(state).then(function (res) {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Gửi email thử ngay";
      }
      renderSettings();
      if (res && res.ok) {
        toast("Đã gửi email thử — kiểm tra hộp thư bố & mẹ");
        alert(
          "✅ Đã gửi thử qua Web3Forms!\n\n" +
            (res.details || "") +
            "\n\nKiểm tra hộp thư:\n- quangtran@123corp.vn\n- ngocdang@123corp.vn\n(cả Spam nếu cần)."
        );
      } else if (res && res.needsSetup) {
        alert("⚠️ " + (res.error || "Cần cấu hình Access Key Web3Forms."));
      } else {
        alert(
          "⚠️ Gửi email thất bại\n\n" +
            (res && res.error ? res.error : "Thử lại sau.") +
            "\n\nGợi ý: kiểm tra Access Key đúng email, mạng ổn, Kaspersky không chặn api.web3forms.com"
        );
      }
    });
  });

  // Mở khóa audio trên iPad/Safari sau lần chạm đầu
  function unlockAudioOnce() {
    sfx("unlock");
    document.removeEventListener("pointerdown", unlockAudioOnce);
    document.removeEventListener("touchstart", unlockAudioOnce);
    document.removeEventListener("keydown", unlockAudioOnce);
  }
  document.addEventListener("pointerdown", unlockAudioOnce, { passive: true });
  document.addEventListener("touchstart", unlockAudioOnce, { passive: true });
  document.addEventListener("keydown", unlockAudioOnce);

  $("#btn-reset-progress").addEventListener("click", () => {
    if (confirm("Xóa toàn bộ sao, streak và lịch sử luyện tập?")) {
      state = resetProgress();
      renderProgress();
      toast("Đã xóa dữ liệu luyện tập");
    }
  });
}

// boot — chạy khi DOM sẵn sàng
function boot() {
  try {
    if (typeof TOPICS === "undefined" || !TOPICS || !TOPICS.length) {
      throw new Error("Không tải được danh sách chủ đề (TOPICS).");
    }
    if (typeof generateSession !== "function") {
      throw new Error("Không tải được bộ câu hỏi.");
    }
    if (typeof loadState !== "function") {
      throw new Error("Không tải được bộ nhớ.");
    }
    state = ensureDayRollover(loadState());
    // Cập nhật email bố + mẹ & gửi mọi buổi (cho bản đã cài trước đó)
    var needSave = false;
    if (
      !state.parentEmail ||
      String(state.parentEmail).indexOf("ngocdang@123corp.vn") < 0 ||
      String(state.parentEmail).indexOf("quangtran@123corp.vn") < 0
    ) {
      state.parentEmail = "quangtran@123corp.vn, ngocdang@123corp.vn";
      state.parentEmails = state.parentEmail;
      needSave = true;
    }
    if (state.emailNotify === undefined) {
      state.emailNotify = true;
      needSave = true;
    }
    if (state.emailEverySession !== true) {
      state.emailEverySession = true;
      needSave = true;
    }
    // Gắn Access Key Web3Forms mặc định (bố + mẹ)
    var KEY_DAD = "0bd0a7dc-bfc6-4b65-b80e-00d7cbbde648";
    var KEY_MOM = "b48e2593-fd09-4709-9234-bfb951ea3f43";
    if (!state.web3formsKeyDad || !String(state.web3formsKeyDad).trim()) {
      state.web3formsKeyDad = KEY_DAD;
      needSave = true;
    }
    if (!state.web3formsKeyMom || !String(state.web3formsKeyMom).trim()) {
      state.web3formsKeyMom = KEY_MOM;
      needSave = true;
    }
    // Cập nhật key mới nếu user chưa tự đổi (đồng bộ key chính thức)
    if (
      !state.web3formsKeyCustom &&
      (state.web3formsKeyDad !== KEY_DAD || state.web3formsKeyMom !== KEY_MOM)
    ) {
      // Chỉ ép key mặc định khi chưa từng lưu custom (cờ web3formsKeyCustom)
      // Nếu key cũ trống hoặc khác key chính thức và không có cờ custom → set key mới
      if (!state.web3formsKeysLocked) {
        state.web3formsKeyDad = KEY_DAD;
        state.web3formsKeyMom = KEY_MOM;
        needSave = true;
      }
    }
    if (needSave) saveState(state);

    bindEvents();
    renderHome();
    showScreen("home");
    var ok = document.getElementById("boot-ok");
    if (ok) ok.hidden = false;
  } catch (err) {
    console.error(err);
    var el = document.getElementById("boot-error");
    if (el) {
      el.hidden = false;
      el.textContent =
        "Lỗi tải app: " +
        (err && err.message ? err.message : String(err)) +
        " — Hãy mở file ToanLop3.html bằng Chrome (double-click).";
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
