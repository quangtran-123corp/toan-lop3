/**
 * Bộ sưu tập nhân vật Zootopia — thưởng khi bé làm đúng 100% một phiên.
 * Đủ 10 nhân vật → Ba chở đi mua sữa chua 🍦
 */
(function (global) {
  var YOGURT_GOAL = 10;

  /** Danh sách nhân vật Zootopia (bé yêu thích!) */
  var CHARACTERS = [
    {
      id: "judy-hopps",
      name: "Judy Hopps",
      emoji: "🐰",
      img: "award/judy.png",
      color: "#7C3AED",
      blurb: "Cô thỏ cảnh sát dũng cảm, không bao giờ bỏ cuộc!",
    },
    {
      id: "nick-wilde",
      name: "Nick Wilde",
      emoji: "🦊",
      img: "award/hi-its-the-real-nick-wilde-ask-me-anything-v0-n5qplbkl5xac1.webp",
      color: "#EA580C",
      blurb: "Chú cáo thông minh, bạn thân của Judy.",
    },
    {
      id: "judy-nick-selfie",
      name: "Judy & Nick",
      emoji: "📸",
      img: "award/avatar-tho-va-cao-doi-4.webp",
      color: "#2563EB",
      blurb: "Cặp đôi hoàn hảo — cùng nhau chiến thắng!",
    },
    {
      id: "judy-zootopia",
      name: "Judy Zootopia",
      emoji: "🌆",
      img: "award/avatar-zootopia-20.jpg",
      color: "#0891B2",
      blurb: "Judy vui vẻ chào đón Bé tới Zootopia!",
    },
    {
      id: "judy-police",
      name: "Judy Cảnh sát",
      emoji: "👮",
      img: "award/image.jpg",
      color: "#4F46E5",
      blurb: "Sĩ quan Hopps sẵn sàng bảo vệ thành phố!",
    },
    {
      id: "judy-determined",
      name: "Judy Quyết tâm",
      emoji: "💪",
      img: "award/images.jfif",
      color: "#1D4ED8",
      blurb: "Dù khó khăn, Judy luôn kiên cường!",
    },
    {
      id: "judy-salute",
      name: "Judy Chào",
      emoji: "🎖️",
      img: "award/images (1).jfif",
      color: "#1E40AF",
      blurb: "Sĩ quan Judy chào Bé — Bé làm tốt lắm!",
    },
    {
      id: "judy-cute",
      name: "Judy Dễ thương",
      emoji: "🥰",
      img: "award/images (2).jfif",
      color: "#3B82F6",
      blurb: "Judy nhìn trộm — Bé thật đáng yêu!",
    },
    {
      id: "judy-sweet",
      name: "Judy Ngọt ngào",
      emoji: "💜",
      img: "award/images (3).jfif",
      color: "#6D28D9",
      blurb: "Judy tự hào vì Bé đã cố gắng!",
    },
    {
      id: "judy-carrot",
      name: "Judy & Cà Rốt",
      emoji: "🥕",
      img: "award/tumblr_3c565f4f3628962ec93c8e8ea7ce6119_5f366adb_1280.jpg",
      color: "#F97316",
      blurb: "Judy cầm cà rốt — phần thưởng cho Bé giỏi!",
    },
    {
      id: "judy-nick-duo-1",
      name: "Đội Judy & Nick",
      emoji: "🤝",
      img: "award/1784349949633_1745451039232600407_g2553855885846108703_740d399bd15c271c2b7a836e90a41d00.jpg",
      color: "#059669",
      blurb: "Hai bạn cùng nhau — không gì ngăn cản!",
    },
    {
      id: "judy-nick-duo-2",
      name: "Phiêu lưu cùng nhau",
      emoji: "🎬",
      img: "award/1784350028603_1745451039232600407_g2553855885846108703_8750ee223b38304890c83b97325eec5d.jpg",
      color: "#10B981",
      blurb: "Hành trình phiêu lưu đang chờ Bé phía trước!",
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

  function charImgHtml(c, size) {
    size = size || 48;
    if (c.img) {
      return (
        '<img src="' + c.img + '" alt="' + c.name + '" ' +
        'class="char-img" style="width:' + size + 'px;height:' + size + 'px;" ' +
        'loading="lazy">'
      );
    }
    return '<span class="char-emoji">' + c.emoji + '</span>';
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
        '<div class="char-avatar">' +
        (got
          ? charImgHtml(c, 48)
          : '<span class="char-emoji">❓</span>') +
        "</div>" +
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
      "<h3>🎁 Bộ sưu tập Zootopia</h3>" +
      '<span class="char-count">' +
      count +
      "/" +
      CHARACTERS.length +
      "</span></div>" +
      '<p class="char-hint">Làm đúng <strong>100%</strong> một bài để nhận 1 nhân vật Zootopia mới!</p>' +
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
    charImgHtml: charImgHtml,
  };
})(typeof window !== "undefined" ? window : this);
