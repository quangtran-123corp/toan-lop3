/**
 * Bộ sưu tập nhân vật — thưởng khi bé làm đúng 100% một phiên.
 * Đủ 10 nhân vật → Ba chở đi mua sữa chua 🍦
 */
(function (global) {
  var YOGURT_GOAL = 10;

  /** Danh sách nhân vật dễ thương (tên thân thuộc với bé Việt) */
  var CHARACTERS = [
    {
      id: "doraemon",
      name: "Doraemon",
      emoji: "🤖",
      color: "#3B82F6",
      blurb: "Mèo máy túi thần kỳ từ tương lai!",
    },
    {
      id: "nobita",
      name: "Nobita",
      emoji: "👓",
      color: "#F59E0B",
      blurb: "Bạn thân của Doraemon, hay ngủ nướng.",
    },
    {
      id: "shizuka",
      name: "Xuka",
      emoji: "🎀",
      color: "#EC4899",
      blurb: "Dịu dàng, chăm chỉ và tốt bụng.",
    },
    {
      id: "gian",
      name: "Chaien",
      emoji: "🎤",
      color: "#EF4444",
      blurb: "To lớn, thích hát (hơi... to)!",
    },
    {
      id: "suneo",
      name: "Suneo",
      emoji: "💎",
      color: "#8B5CF6",
      blurb: "Hay khoe đồ mới, nhưng vẫn là bạn.",
    },
    {
      id: "dorami",
      name: "Dorami",
      emoji: "💛",
      color: "#EAB308",
      blurb: "Em gái đáng yêu của Doraemon.",
    },
    {
      id: "dekisugi",
      name: "Dekisugi",
      emoji: "📚",
      color: "#10B981",
      blurb: "Học giỏi, luôn sẵn sàng giúp bạn.",
    },
    {
      id: "jaiko",
      name: "Jaiko",
      emoji: "✏️",
      color: "#F472B6",
      blurb: "Em gái Chaien, thích vẽ truyện tranh.",
    },
    {
      id: "miichan",
      name: "Mi-chan",
      emoji: "🐱",
      color: "#FB923C",
      blurb: "Chú mèo cưng của Xuka.",
    },
    {
      id: "mini-dora",
      name: "Mini-Dora",
      emoji: "🔵",
      color: "#60A5FA",
      blurb: "Bảo bối nhỏ xinh xắn!",
    },
    {
      id: "take-copter",
      name: "Chong chóng tre",
      emoji: "🚁",
      color: "#14B8A6",
      blurb: "Bay lượn khắp nơi cùng bạn bè.",
    },
    {
      id: "time-machine",
      name: "Cỗ máy thời gian",
      emoji: "🕰️",
      color: "#6366F1",
      blurb: "Du hành quá khứ – tương lai!",
    },
  ];

  function byId(id) {
    for (var i = 0; i < CHARACTERS.length; i++) {
      if (CHARACTERS[i].id === id) return CHARACTERS[i];
    }
    return null;
  }

  function ownedList(state) {
    var list = (state && state.charactersOwned) || [];
    return Array.isArray(list) ? list.slice() : [];
  }

  function ownedCount(state) {
    return ownedList(state).length;
  }

  function unowned(state) {
    var have = {};
    ownedList(state).forEach(function (id) {
      have[id] = true;
    });
    return CHARACTERS.filter(function (c) {
      return !have[c.id];
    });
  }

  /**
   * Thưởng 1 nhân vật khi làm đúng 100%.
   * Ưu tiên nhân vật chưa có; nếu đã đủ bộ thì chọn ngẫu nhiên (không thêm trùng).
   * Trả về { character, isNew, yogurtJustUnlocked, ownedCount, goal }
   */
  function awardPerfect(state) {
    if (!state.charactersOwned) state.charactersOwned = [];
    var pool = unowned(state);
    var isNew = pool.length > 0;
    var pick;
    if (isNew) {
      pick = pool[Math.floor(Math.random() * pool.length)];
      state.charactersOwned.push(pick.id);
    } else {
      // Đã sưu tầm đủ — vẫn chúc mừng, không thêm trùng
      pick = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    }

    var count = state.charactersOwned.length;
    var yogurtJustUnlocked = false;
    if (count >= YOGURT_GOAL && !state.yogurtUnlocked) {
      state.yogurtUnlocked = true;
      yogurtJustUnlocked = true;
    }

    if (typeof saveState === "function") saveState(state);
    else if (global.saveState) global.saveState(state);

    return {
      character: pick,
      isNew: isNew,
      yogurtJustUnlocked: yogurtJustUnlocked,
      yogurtUnlocked: !!state.yogurtUnlocked,
      ownedCount: count,
      goal: YOGURT_GOAL,
    };
  }

  function collectionHtml(state) {
    var owned = {};
    ownedList(state).forEach(function (id) {
      owned[id] = true;
    });
    var count = ownedList(state).length;
    var cells = CHARACTERS.map(function (c) {
      var got = !!owned[c.id];
      return (
        '<div class="char-cell' +
        (got ? " got" : " locked") +
        '" style="--c:' +
        c.color +
        '" title="' +
        (got ? c.name + " — " + c.blurb : "Chưa mở") +
        '">' +
        '<span class="char-emoji">' +
        (got ? c.emoji : "❓") +
        "</span>" +
        '<span class="char-name">' +
        (got ? c.name : "???") +
        "</span></div>"
      );
    }).join("");

    var yogurt =
      state && state.yogurtUnlocked
        ? '<p class="char-yogurt ok">🍦 Đủ ' +
          YOGURT_GOAL +
          " nhân vật — Ba chở bé đi mua sữa chua nhé!</p>"
        : '<p class="char-yogurt">Sưu tầm <strong>' +
          count +
          "/" +
          YOGURT_GOAL +
          "</strong> nhân vật → Ba chở đi mua sữa chua 🍦</p>";

    return (
      '<div class="char-collection">' +
      '<div class="char-head">' +
      "<h3>🎁 Bộ sưu tập nhân vật</h3>" +
      '<span class="char-count">' +
      count +
      "/" +
      CHARACTERS.length +
      "</span></div>" +
      '<p class="char-hint">Làm đúng <strong>100%</strong> một bài để nhận 1 nhân vật mới!</p>' +
      '<div class="char-grid">' +
      cells +
      "</div>" +
      yogurt +
      "</div>"
    );
  }

  global.Characters = {
    list: CHARACTERS,
    YOGURT_GOAL: YOGURT_GOAL,
    byId: byId,
    ownedCount: ownedCount,
    awardPerfect: awardPerfect,
    collectionHtml: collectionHtml,
  };
})(typeof window !== "undefined" ? window : this);
