const KEY = "toan-lop3-kntt-v1";

function defaultState() {
  return {
    childName: "",
    sound: true,
    // Email báo cáo cho bố + mẹ (phân tách bằng dấu phẩy)
    parentEmail: "quangtran@123corp.vn, ngocdang@123corp.vn",
    parentEmails: "quangtran@123corp.vn, ngocdang@123corp.vn",
    emailNotify: true,
    emailEverySession: true, // gửi sau MỌI buổi hoàn thành
    stars: 0,
    streak: 0,
    lastPracticeDate: null,
    todayDate: null,
    todayCorrect: 0,
    todaySessions: 0,
    dailyGoal: 10,
    dailyCorrectToday: 0,
    dailyCompletedDate: null,
    byTopic: {},
    history: [],
  };
}

function loadState() {
  try {
    var raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    var parsed = JSON.parse(raw);
    var base = defaultState();
    for (var k in parsed) {
      if (Object.prototype.hasOwnProperty.call(parsed, k)) base[k] = parsed[k];
    }
    return base;
  } catch (e) {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function todayStr() {
  var d = new Date();
  var m = String(d.getMonth() + 1);
  var day = String(d.getDate());
  if (m.length < 2) m = "0" + m;
  if (day.length < 2) day = "0" + day;
  return d.getFullYear() + "-" + m + "-" + day;
}

function ensureDayRollover(state) {
  var t = todayStr();
  if (state.todayDate !== t) {
    if (state.lastPracticeDate) {
      var last = new Date(state.lastPracticeDate + "T12:00:00");
      var now = new Date(t + "T12:00:00");
      var diff = Math.round((now - last) / 86400000);
      if (diff > 1) state.streak = 0;
    }
    state.todayDate = t;
    state.todayCorrect = 0;
    state.todaySessions = 0;
    if (state.dailyCompletedDate !== t) {
      state.dailyCorrectToday = 0;
    }
  }
  return state;
}

/**
 * Ghi nhận buổi luyện.
 * Trả về { state, events } — events dùng để gửi email streak.
 */
function recordSession(state, info) {
  var topicId = info.topicId;
  var level = info.level;
  var correct = info.correct;
  var total = info.total;
  var starsEarned = info.starsEarned;
  var t = todayStr();
  ensureDayRollover(state);

  var events = {
    streakIncreased: false,
    dailyCompleted: false,
    firstSessionToday: false,
  };

  state.stars += starsEarned;
  state.todayCorrect += correct;
  state.todaySessions += 1;

  if (state.lastPracticeDate !== t) {
    if (state.lastPracticeDate) {
      var last = new Date(state.lastPracticeDate + "T12:00:00");
      var now = new Date(t + "T12:00:00");
      var diff = Math.round((now - last) / 86400000);
      if (diff === 1) state.streak += 1;
      else state.streak = 1;
    } else {
      state.streak = 1;
    }
    state.lastPracticeDate = t;
    events.streakIncreased = true;
    events.firstSessionToday = true;
  }

  if (state.dailyCompletedDate !== t) {
    state.dailyCorrectToday = Math.min(
      state.dailyGoal,
      (state.dailyCorrectToday || 0) + correct
    );
    if (state.dailyCorrectToday >= state.dailyGoal) {
      state.dailyCompletedDate = t;
      state.stars += 5;
      events.dailyCompleted = true;
    }
  }

  if (!state.byTopic[topicId]) {
    state.byTopic[topicId] = {
      attempts: 0,
      correct: 0,
      total: 0,
      basic: 0,
      advanced: 0,
    };
  }
  var tp = state.byTopic[topicId];
  tp.attempts += 1;
  tp.correct += correct;
  tp.total += total;
  if (level === "basic") tp.basic += 1;
  else tp.advanced += 1;

  state.history.unshift({
    date: t,
    topicId: topicId,
    level: level,
    correct: correct,
    total: total,
    starsEarned: starsEarned,
    at: Date.now(),
  });
  state.history = state.history.slice(0, 50);

  saveState(state);
  return { state: state, events: events };
}

function resetProgress() {
  var prev = loadState();
  var s = defaultState();
  s.childName = prev.childName;
  s.sound = prev.sound;
  saveState(s);
  return s;
}

window.loadState = loadState;
window.saveState = saveState;
window.todayStr = todayStr;
window.ensureDayRollover = ensureDayRollover;
window.recordSession = recordSession;
window.resetProgress = resetProgress;
