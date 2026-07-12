/**
 * Câu hỏi theo phong cách MathX — bám KNTT Lớp 3
 * Dạng đề tương đương (không chép nguyên văn SGK/MathX)
 * Tuần 1–5 · Cơ bản / Nâng cao
 */
(function (global) {
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function pick(arr) {
    return arr[rand(0, arr.length - 1)];
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  function numMc(answer, spread) {
    spread = spread || 12;
    var a = Number(answer);
    var opts = [String(a)];
    var guard = 0;
    while (opts.length < 4 && guard < 40) {
      guard++;
      var v = a + rand(1, spread) * (Math.random() < 0.5 ? 1 : -1);
      if (v < 0) continue;
      var s = String(v);
      if (opts.indexOf(s) < 0) opts.push(s);
    }
    return shuffle(opts);
  }
  function q(p) {
    return {
      type: p.type || "mc",
      topicId: p.topicId || "mathx",
      level: p.level,
      text: p.text,
      options: p.options || null,
      answer: String(p.answer),
      explain: p.explain || "",
      /** Các bước giải dễ hiểu cho HS lớp 3 (hiển thị sau khi trả lời) */
      explainSteps: p.explainSteps || null,
      /** Mẹo ghi nhớ ngắn */
      explainTip: p.explainTip || null,
      visual: p.visual || null,
      week: p.week || 0,
    };
  }

  // ——— Tuần 1: Số có 3 chữ số, cộng trừ, đọc viết ———
  function week1Basic(level) {
    var mode = pick(["write", "read", "place", "add", "sub", "next", "prev", "word", "find"]);
    if (mode === "write") {
      var h = rand(1, 9);
      var t = rand(0, 9);
      var o = rand(0, 9);
      var n = h * 100 + t * 10 + o;
      var words = [
        "",
        "một",
        "hai",
        "ba",
        "bốn",
        "năm",
        "sáu",
        "bảy",
        "tám",
        "chín",
      ];
      var tens = [
        "",
        "mười",
        "hai mươi",
        "ba mươi",
        "bốn mươi",
        "năm mươi",
        "sáu mươi",
        "bảy mươi",
        "tám mươi",
        "chín mươi",
      ];
      var mid =
        t === 0 && o > 0
          ? " linh " + words[o]
          : t === 0
            ? ""
            : " " +
              tens[t] +
              (o === 0 ? "" : o === 1 && t > 1 ? " mốt" : o === 5 && t > 0 ? " lăm" : " " + words[o]);
      // Simplify word form for question
      var text =
        "Số " +
        (h === 1 ? "một" : words[h]) +
        " trăm" +
        (t === 0 && o === 0
          ? ""
          : t === 0
            ? " linh " + words[o]
            : " " +
              tens[t].replace("mười", t === 1 ? "mười" : tens[t]) +
              (o === 0
                ? ""
                : t === 1 && o === 5
                  ? " lăm"
                  : t > 1 && o === 1
                    ? " mốt"
                    : t > 1 && o === 5
                      ? " lăm"
                      : " " + words[o])) +
        " viết là:";
      // Cleaner generation:
      text =
        "Số gồm " +
        h +
        " trăm" +
        (t || o
          ? t
            ? ", " + t + " chục" + (o ? " " + o + " đơn vị" : "")
            : ", " + o + " đơn vị"
          : "") +
        " viết là:";
      if (t === 0 && o > 0) {
        text = "Số gồm " + h + " trăm linh " + o + " (viết số):";
      }
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: text,
        type: "mc",
        options: numMc(n, 40),
        answer: n,
        explain: "Số đó là " + n + ".",
      });
    }
    if (mode === "read") {
      var n2 = rand(100, 999);
      // multiple choice reading - just ask digits place
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: "Số " + n2 + ": chữ số hàng trăm là?",
        type: "mc",
        options: numMc(Math.floor(n2 / 100), 3),
        answer: Math.floor(n2 / 100),
        explain: n2 + " có hàng trăm là " + Math.floor(n2 / 100) + ".",
      });
    }
    if (mode === "place") {
      var hu = rand(1, 9);
      var un = rand(10, 99);
      var n3 = hu * 100 + un;
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: "Số gồm " + hu + " trăm " + un + " đơn vị là:",
        type: "mc",
        options: numMc(n3, 30),
        answer: n3,
        explain: hu + "×100 + " + un + " = " + n3,
      });
    }
    if (mode === "add") {
      var a = rand(200, 450);
      var b = rand(100, 400);
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: "Tổng của " + a + " và " + b + " là:",
        type: pick(["mc", "input"]),
        options: numMc(a + b, 25),
        answer: a + b,
        explain: a + " + " + b + " = " + (a + b),
      });
    }
    if (mode === "sub") {
      var a2 = rand(400, 900);
      var b2 = rand(100, Math.min(350, a2 - 50));
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: a2 + " − " + b2 + " = ?",
        type: pick(["mc", "input"]),
        options: numMc(a2 - b2, 25),
        answer: a2 - b2,
        explain: a2 + " − " + b2 + " = " + (a2 - b2),
      });
    }
    if (mode === "next") {
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: "Số liền sau số nhỏ nhất có ba chữ số là:",
        type: "mc",
        options: numMc(101, 5),
        answer: 101,
        explain: "Số nhỏ nhất 3 chữ số là 100; liền sau là 101.",
      });
    }
    if (mode === "prev") {
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: "Số liền trước số lớn nhất có ba chữ số là:",
        type: "mc",
        options: numMc(998, 5),
        answer: 998,
        explain: "Số lớn nhất 3 chữ số là 999; liền trước là 998.",
      });
    }
    if (mode === "find") {
      var x = rand(50, 150);
      var sum = 100 + x;
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text:
          "Tìm một số biết tổng của số đó với số nhỏ nhất có ba chữ số là " +
          sum +
          ".",
        type: "input",
        answer: x,
        explain: sum + " − 100 = " + x,
      });
    }
    // word
    var cow = rand(500, 800);
    var calf = rand(80, 150);
    return q({
      topicId: "mathx-t1",
      level: level,
      week: 1,
      text:
        "Con bò nặng " +
        cow +
        " kg, con bê nặng " +
        calf +
        " kg. Cả hai nặng bao nhiêu kg?",
      type: "mc",
      options: numMc(cow + calf, 40),
      answer: cow + calf,
      explain: cow + " + " + calf + " = " + (cow + calf),
    });
  }

  function week1Advanced(level) {
    var mode = pick(["cards", "more", "round", "rel", "sumdiff", "hens", "seq"]);
    if (mode === "cards") {
      // digits 1-9 pick 3 unique - largest + smallest 3-digit from them
      var d = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort();
      var small = d[0] * 100 + d[1] * 10 + d[2];
      var large = d[2] * 100 + d[1] * 10 + d[0];
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text:
          "Cho ba thẻ số: " +
          d[0] +
          ", " +
          d[1] +
          ", " +
          d[2] +
          ". Tổng số lớn nhất và số nhỏ nhất lập từ cả ba thẻ là:",
        type: "input",
        answer: large + small,
        explain:
          "Lớn nhất " + large + ", nhỏ nhất " + small + ", tổng = " + (large + small),
      });
    }
    if (mode === "more") {
      var morning = rand(150, 300);
      var more = rand(15, 40);
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text:
          "Buổi sáng bán " +
          morning +
          " kg đường, buổi chiều bán hơn buổi sáng " +
          more +
          " kg. Buổi chiều bán được bao nhiêu kg?",
        type: "input",
        answer: morning + more,
        explain: morning + " + " + more + " = " + (morning + more),
      });
    }
    if (mode === "round") {
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text: "Số liền trước của số tròn trăm lớn nhất có ba chữ số là:",
        type: "mc",
        options: numMc(899, 20),
        answer: 899,
        explain: "Số tròn trăm lớn nhất 3 chữ số là 900; liền trước là 899.",
      });
    }
    if (mode === "rel") {
      // Tổng − hạng1 = hạng2. Hạng2 − hạng1 = d → hạng1 = hạng2 − d
      var hang2 = rand(200, 450);
      var d = rand(40, Math.min(180, hang2 - 80));
      var hang1 = hang2 - d;
      var tong = hang1 + hang2;
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text:
          "Trong phép cộng hai số: tổng lớn hơn số hạng thứ nhất " +
          hang2 +
          " đơn vị; số hạng thứ nhất nhỏ hơn số hạng thứ hai " +
          d +
          " đơn vị. Số hạng thứ nhất là:",
        type: "input",
        answer: hang1,
        explainSteps: [
          "“Tổng lớn hơn số hạng thứ nhất " +
            hang2 +
            "” nghĩa là: số hạng thứ hai = " +
            hang2 +
            " (vì tổng − số hạng 1 = số hạng 2).",
          "“Số hạng thứ nhất nhỏ hơn số hạng thứ hai " +
            d +
            "” nghĩa là: số hạng 1 = số hạng 2 − " +
            d +
            ".",
          "Tính: số hạng thứ nhất = " + hang2 + " − " + d + " = " + hang1 + ".",
          "Kiểm tra: tổng = " +
            hang1 +
            " + " +
            hang2 +
            " = " +
            tong +
            " (lớn hơn số hạng 1 đúng " +
            hang2 +
            ").",
        ],
        explainTip:
          "Trong phép cộng: Tổng − một số hạng = số hạng còn lại.",
        explain:
          "Số hạng 2 = " +
          hang2 +
          "; số hạng 1 = " +
          hang2 +
          " − " +
          d +
          " = " +
          hang1 +
          ".",
      });
    }
    if (mode === "sumdiff") {
      var x = rand(8, 20);
      var y = rand(3, x - 2);
      var sum = x + y;
      var diff = x - y;
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text:
          "Tổng hai số là " +
          sum +
          ", hiệu là " +
          diff +
          " (số lớn trừ số bé). Số lớn là:",
        type: "input",
        answer: x,
        explainSteps: [
          "Gọi số lớn là A, số bé là B.",
          "A + B = " + sum + " (tổng), A − B = " + diff + " (hiệu).",
          "Cộng hai vế: (A+B) + (A−B) = " +
            sum +
            " + " +
            diff +
            " → 2A = " +
            (sum + diff) +
            ".",
          "Vậy A = " +
            (sum + diff) +
            " : 2 = " +
            x +
            " (số lớn). Số bé B = " +
            y +
            ".",
        ],
        explainTip: "Số lớn = (tổng + hiệu) : 2. Số bé = (tổng − hiệu) : 2.",
        explain: "Số lớn = (tổng + hiệu) : 2 = " + x,
      });
    }
    if (mode === "hens") {
      var roosters = rand(20, 45);
      var less = rand(10, 30);
      return q({
        topicId: "mathx-t1",
        level: level,
        week: 1,
        text:
          "Nhà An nuôi " +
          roosters +
          " con gà trống. Gà trống ít hơn gà mái " +
          less +
          " con. Số gà mái là:",
        type: "input",
        answer: roosters + less,
        explain: roosters + " + " + less + " = " + (roosters + less),
      });
    }
    // seq fibonacci-like
    var s1 = rand(2, 5);
    var s2 = rand(3, 6);
    var seq = [s1, s2];
    for (var i = 0; i < 4; i++) seq.push(seq[i] + seq[i + 1]);
    return q({
      topicId: "mathx-t1",
      level: level,
      week: 1,
      text:
        "Dãy số: " +
        seq.slice(0, 5).join(", ") +
        ", ... Số hạng tiếp theo là:",
      type: "mc",
      options: numMc(seq[5], 8),
      answer: seq[5],
      explain: "Mỗi số = tổng 2 số đứng trước → " + seq[5],
    });
  }

  // ——— Tuần 2: Trừ, nhân chia bảng, toán lời ———
  function week2Basic(level) {
    var mode = pick(["sub", "findSub", "mult", "div", "equalize", "findNum", "cmp", "word"]);
    if (mode === "sub") {
      var a = rand(300, 600);
      var b = rand(100, 250);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text: "Số bị trừ là " + a + ", số trừ là " + b + ". Hiệu là:",
        type: "mc",
        options: numMc(a - b, 20),
        answer: a - b,
        explain: a + " − " + b + " = " + (a - b),
      });
    }
    if (mode === "findSub") {
      var minuend = rand(300, 600);
      var diff = rand(80, 200);
      var sub = minuend - diff;
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Phép trừ có số bị trừ " +
          minuend +
          ", hiệu " +
          diff +
          ". Số trừ là:",
        type: "input",
        answer: sub,
        explain: minuend + " − " + diff + " = " + sub,
      });
    }
    if (mode === "mult") {
      var n = pick([2, 3, 4, 5]);
      var m = rand(3, 9);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Một lớp có " +
          n +
          " bộ bàn ghế, mỗi bộ " +
          m +
          " học sinh ngồi. Lớp có tất cả bao nhiêu học sinh?",
        type: "mc",
        options: numMc(n * m, 8),
        answer: n * m,
        explain: n + " × " + m + " = " + n * m,
      });
    }
    if (mode === "div") {
      var each = pick([3, 4, 5, 6]);
      var people = rand(4, 9);
      var total = each * people;
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Có " +
          total +
          " quyển sách chia đều, mỗi bạn " +
          each +
          " quyển. Có bao nhiêu bạn?",
        type: "mc",
        options: numMc(people, 4),
        answer: people,
        explain: total + " : " + each + " = " + people,
      });
    }
    if (mode === "equalize") {
      var give = rand(3, 8);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Nếu An cho Bình " +
          give +
          " nhãn vở thì số nhãn của hai bạn bằng nhau. Lúc đầu An hơn Bình bao nhiêu nhãn?",
        type: "mc",
        options: numMc(give * 2, 4),
        answer: give * 2,
        explainSteps: [
          "An cho Bình " +
            give +
            " nhãn → An giảm " +
            give +
            ", Bình tăng " +
            give +
            ".",
          "Sau khi cho, hai bạn bằng nhau → phần An “đưa qua” đã san bằng khoảng cách.",
          "Khoảng cách lúc đầu = phần An mất + phần Bình thêm = " +
            give +
            " + " +
            give +
            " = " +
            give * 2 +
            ".",
          "Vậy lúc đầu An hơn Bình " + give * 2 + " nhãn.",
        ],
        explainTip: "An cho Bình k cái để bằng nhau → lúc đầu An hơn 2×k cái.",
        explain: "An hơn Bình 2 × " + give + " = " + give * 2 + " nhãn.",
      });
    }
    if (mode === "findNum") {
      var half = rand(4, 15);
      var add = rand(20, 50);
      var result = half + add;
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Tìm một số, biết số đó chia cho 2 rồi lấy thương cộng với " +
          add +
          " thì được " +
          result +
          ".",
        type: "input",
        answer: half * 2,
        explainSteps: [
          "Làm ngược từ kết quả " + result + ".",
          "Trước khi cộng " +
            add +
            ", thương là: " +
            result +
            " − " +
            add +
            " = " +
            half +
            ".",
          "Thương đó là số cần tìm chia cho 2 → số cần tìm = " +
            half +
            " × 2 = " +
            half * 2 +
            ".",
          "Thử lại: " + half * 2 + " : 2 = " + half + "; " + half + " + " + add + " = " + result + ".",
        ],
        explainTip: "Bài “tìm số” thường làm ngược: trừ trước, rồi nhân/chia ngược.",
        explain:
          "Thương = " + result + " − " + add + " = " + half + "; số = " + half * 2,
      });
    }
    if (mode === "cmp") {
      var n = rand(3, 8);
      var m = rand(3, 8);
      var left = n * m;
      var right = n + m;
      var ans = left > right ? ">" : left < right ? "<" : "=";
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text: "Điền dấu: " + n + " × " + m + "  ___  " + n + " + " + m,
        type: "mc",
        options: [">", "<", "="],
        answer: ans,
        explain: left + " " + ans + " " + right,
      });
    }
    var took = rand(5, 12);
    var left = rand(3, 10);
    return q({
      topicId: "mathx-t2",
      level: level,
      week: 2,
      text:
        "An có một số viên bi. An cho bạn " +
        took +
        " viên, còn lại " +
        left +
        " viên. Lúc đầu An có bao nhiêu viên?",
      type: "input",
      answer: took + left,
      explain: took + " + " + left + " = " + (took + left),
    });
  }

  function week2Advanced(level) {
    var mode = pick(["div", "mult", "equalize", "add0", "sub0", "word", "seq"]);
    if (mode === "div") {
      var e = pick([4, 5, 6, 7]);
      var p = rand(4, 9);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Có " +
          e * p +
          " nhãn vở chia đều, mỗi em " +
          e +
          " nhãn. Số học sinh là:",
        type: "input",
        answer: p,
        explain: e * p + " : " + e + " = " + p,
      });
    }
    if (mode === "mult") {
      var floors = rand(4, 8);
      var rooms = rand(6, 12);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Tòa nhà " +
          floors +
          " tầng, mỗi tầng " +
          rooms +
          " phòng. Tất cả có bao nhiêu phòng?",
        type: "input",
        answer: floors * rooms,
        explain: floors + " × " + rooms + " = " + floors * rooms,
      });
    }
    if (mode === "equalize") {
      var g = rand(4, 9);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Nếu An cho Bình " +
          g +
          " nhãn thì hai bạn bằng nhau. Lúc đầu An hơn Bình:",
        type: "mc",
        options: numMc(g * 2, 5),
        answer: g * 2,
        explainSteps: [
          "An đưa sang Bình " + g + " nhãn.",
          "An giảm " + g + " và Bình tăng " + g + " → khoảng cách giảm 2 × " + g + ".",
          "Để hai bên bằng nhau, lúc đầu An phải hơn đúng 2 × " + g + " = " + g * 2 + ".",
        ],
        explainTip: "Cho k cái để bằng nhau → lúc đầu hơn 2k cái.",
        explain: "Hơn 2 × " + g + " = " + g * 2,
      });
    }
    if (mode === "add0") {
      var t = rand(30, 90);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Phép cộng: số hạng thứ nhất và tổng đều bằng " +
          t +
          ". Số hạng thứ hai là:",
        type: "mc",
        options: numMc(0, 3),
        answer: 0,
        explain: t + " + ☐ = " + t + " → ☐ = 0",
      });
    }
    if (mode === "sub0") {
      var h = rand(40, 99);
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Phép trừ: hiệu và số bị trừ đều bằng " +
          h +
          ". Số trừ là:",
        type: "mc",
        options: numMc(0, 3),
        answer: 0,
        explain: h + " − ☐ = " + h + " → ☐ = 0",
      });
    }
    if (mode === "seq") {
      // numbers that divide by 2 give given list - pick correct sequence
      var targets = [40, 20, 30, 10];
      var correct = targets.map(function (x) {
        return x * 2;
      });
      return q({
        topicId: "mathx-t2",
        level: level,
        week: 2,
        text:
          "Chia số nào cho 2 để được lần lượt: " +
          targets.join("; ") +
          "? Dãy số đúng là:",
        type: "mc",
        options: shuffle([
          correct.join("; "),
          shuffle(correct.slice()).join("; "),
          correct
            .map(function (x) {
              return x + 2;
            })
            .join("; "),
          correct
            .slice()
            .reverse()
            .join("; "),
        ]),
        answer: correct.join("; "),
        explain: "Mỗi số × 2: " + correct.join("; "),
      });
    }
    var sold = rand(30, 50);
    var left = rand(40, 70);
    return q({
      topicId: "mathx-t2",
      level: level,
      week: 2,
      text:
        "Nhà An nuôi gà. Sau khi bán " +
        sold +
        " con còn lại " +
        left +
        " con. Ban đầu có bao nhiêu con?",
      type: "input",
      answer: sold + left,
      explain: sold + " + " + left + " = " + (sold + left),
    });
  }

  // ——— Tuần 3: Bảng nhân chia 3, 4 ———
  function week3Basic(level) {
    var mode = pick(["multW", "product", "sumToMult", "divW", "cmp", "len"]);
    if (mode === "multW") {
      var each = rand(2, 5);
      var groups = rand(3, 9);
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text:
          "Thầy tặng mỗi bạn " +
          each +
          " quyển truyện, tặng " +
          groups +
          " bạn. Tất cả bao nhiêu quyển?",
        type: "mc",
        options: numMc(each * groups, 8),
        answer: each * groups,
        explain: each + " × " + groups + " = " + each * groups,
      });
    }
    if (mode === "product") {
      var f1 = pick([3, 4, 5]);
      var f2 = rand(4, 9);
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text: "Thừa số thứ nhất " + f1 + ", thừa số thứ hai " + f2 + ". Tích là:",
        type: "mc",
        options: numMc(f1 * f2, 8),
        answer: f1 * f2,
        explain: f1 + " × " + f2 + " = " + f1 * f2,
      });
    }
    if (mode === "sumToMult") {
      var n = pick([3, 4, 5, 6]);
      var k = rand(3, 8);
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text:
          n +
          " + " +
          Array(k - 1)
            .fill(String(n))
            .join(" + ") +
          " = " +
          n +
          " × ?",
        type: "mc",
        options: numMc(k, 3),
        answer: k,
        explain: "Cộng " + k + " lần số " + n + " = " + n + " × " + k,
      });
    }
    if (mode === "divW") {
      var e = pick([3, 4]);
      var bags = rand(3, 8);
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text:
          "Cô có " +
          e * bags +
          " gói kẹo chia đều, mỗi tổ " +
          e +
          " gói. Có bao nhiêu tổ?",
        type: "mc",
        options: numMc(bags, 3),
        answer: bags,
        explain: e * bags + " : " + e + " = " + bags,
      });
    }
    if (mode === "cmp") {
      var a = pick([3, 4, 5]);
      var left = (a * 3) / 1; // a*something
      var L = pick([a * 2, a * 3, a * 4]);
      var R = pick([a * 2, a * 3, a * 5]);
      // use division compare
      var lq = L;
      var rq = R;
      // simpler: 12:4 vs 16:4
      var x = a * rand(2, 5);
      var y = a * rand(2, 5);
      var ans = x / a > y / a ? ">" : x / a < y / a ? "<" : "=";
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text: "Điền dấu: " + x + " : " + a + "  ___  " + y + " : " + a,
        type: "mc",
        options: [">", "<", "="],
        answer: ans,
        explain: x / a + " " + ans + " " + y / a,
      });
    }
    var dm = pick([3, 4, 5]);
    var parts = dm;
    var cmEach = (dm * 10) / parts;
    return q({
      topicId: "mathx-t3",
      level: level,
      week: 3,
      text:
        "Đường gấp khúc dài " +
        dm +
        " dm chia thành " +
        parts +
        " đoạn bằng nhau. Mỗi đoạn dài bao nhiêu cm?",
      type: "input",
      answer: cmEach,
      explain:
        dm + " dm = " + dm * 10 + " cm; chia " + parts + " = " + cmEach + " cm",
    });
  }

  function week3Advanced(level) {
    var mode = pick(["cut", "wood", "cycle", "share", "equal"]);
    if (mode === "cut") {
      var n = pick([3, 4, 5]);
      var maxP = (n * (n + 1)) / 2 + 1;
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text:
          "Cắt một tờ giấy bằng " +
          n +
          " nhát cắt thẳng. Nhiều nhất được bao nhiêu phần?",
        type: "mc",
        options: numMc(maxP, 4),
        answer: maxP,
        explainSteps: [
          "Muốn nhiều phần nhất: mỗi nhát cắt mới cắt hết tất cả các đường cũ.",
          "Nhát 1 chia thành 2 phần.",
          "Nhát thứ k thêm được nhiều nhất k phần mới.",
          "Với " +
            n +
            " nhát: tổng phần = 1 + (1+2+…+" +
            n +
            ") = " +
            maxP +
            ".",
        ],
        explainTip: "n nhát cắt thẳng, nhiều nhất n(n+1)/2 + 1 phần.",
        explain: "Công thức: n(n+1)/2 + 1 = " + maxP,
      });
    }
    if (mode === "wood") {
      var parts = rand(4, 7);
      var minPer = pick([5, 6, 7, 8]);
      var cuts = parts - 1;
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text:
          "Cắt khúc gỗ thành " +
          parts +
          " phần bằng nhau, mỗi nhát cắt " +
          minPer +
          " phút. Thời gian là:",
        type: "input",
        answer: cuts * minPer,
        explainSteps: [
          "Cắt thành " + parts + " phần thì cần " + cuts + " nhát cắt (ít hơn số phần 1 nhát).",
          "Mỗi nhát hết " + minPer + " phút.",
          "Tổng thời gian = " + cuts + " × " + minPer + " = " + cuts * minPer + " phút.",
        ],
        explainTip: "n phần thẳng hàng → chỉ cần (n − 1) nhát cắt.",
        explain: "Cần " + cuts + " nhát × " + minPer + " = " + cuts * minPer + " phút",
      });
    }
    if (mode === "cycle") {
      var total = pick([24, 27, 30, 33]);
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text:
          "Xếp bi theo chu kỳ: đỏ, xanh, vàng (lặp lại). Có " +
          total +
          " viên. Mỗi màu có bao nhiêu viên?",
        type: "mc",
        options: numMc(total / 3, 4),
        answer: total / 3,
        explain: total + " : 3 = " + total / 3,
      });
    }
    if (mode === "share") {
      var rabbits = pick([12, 18, 24]);
      var cages = 2;
      var bins = 3;
      return q({
        topicId: "mathx-t3",
        level: level,
        week: 3,
        text:
          "Có " +
          rabbits +
          " chú thỏ chia đều vào " +
          cages +
          " chuồng, mỗi chuồng chia đều vào " +
          bins +
          " ngăn. Mỗi ngăn có bao nhiêu thỏ?",
        type: "input",
        answer: rabbits / cages / bins,
        explain:
          rabbits +
          " : " +
          cages +
          " : " +
          bins +
          " = " +
          rabbits / cages / bins,
      });
    }
    var g = rand(6, 12);
    var d = rand(8, 16);
    var pens = pick([2, 4]);
    return q({
      topicId: "mathx-t3",
      level: level,
      week: 3,
      text:
        "Có " +
        g +
        " gà và " +
        d +
        " vịt nhốt vào " +
        pens +
        " chuồng đều nhau (mỗi chuồng cùng số gà, cùng số vịt). Mỗi chuồng có tất cả bao nhiêu con?",
      type: "input",
      answer: (g + d) / pens,
      explain: "(" + g + " + " + d + ") : " + pens + " = " + (g + d) / pens,
    });
  }

  // ——— Tuần 4: Bảng 6, thời gian, hình ———
  function week4Basic(level) {
    var mode = pick(["mult6", "div6", "time", "seq", "sumTo6", "cmp6", "rows"]);
    if (mode === "mult6") {
      var m = rand(2, 9);
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text: "6 × " + m + " = ?",
        type: "mc",
        options: numMc(6 * m, 8),
        answer: 6 * m,
        explain: "6 × " + m + " = " + 6 * m,
      });
    }
    if (mode === "div6") {
      var m2 = rand(2, 9);
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text: 6 * m2 + " : 6 = ?",
        type: "mc",
        options: numMc(m2, 4),
        answer: m2,
        explain: 6 * m2 + " : 6 = " + m2,
      });
    }
    if (mode === "time") {
      // from 3:25 to 4:50 = 85? "4 giờ kém 10" = 3:50 → 25 min
      // or general: start H:M, end next hour - K min
      var startM = pick([15, 20, 25, 30]);
      var endLess = pick([5, 10, 15]);
      // from H:startM to (H+1):(60-endLess)
      var mins = 60 - startM + (60 - endLess);
      // simpler fixed style: from 3:25 to 3:50 = 25, or to 4:50
      // "3 giờ 25 đến 4 giờ kém 10" = 3:25 → 3:50 = 25 phút
      var ans = 60 - startM - endLess;
      if (ans <= 0) ans = 60 - startM + (60 - endLess);
      // 3:25 to 4:50 means 4 hours minus 10 = 3:50, duration = 25
      ans = 60 - startM - endLess;
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text:
          "Khoảng thời gian từ 3 giờ " +
          startM +
          " phút đến 4 giờ kém " +
          endLess +
          " phút là bao nhiêu phút?",
        type: "mc",
        options: numMc(ans, 15),
        answer: ans,
        explain:
          "4 giờ kém " +
          endLess +
          " = 3 giờ " +
          (60 - endLess) +
          " phút. Từ " +
          startM +
          " đến " +
          (60 - endLess) +
          " = " +
          ans +
          " phút.",
      });
    }
    if (mode === "seq") {
      var start = 6 * rand(2, 4);
      var seq = [start, start + 6, start + 12, start + 18];
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text:
          "Điền số: " +
          seq[0] +
          "; " +
          seq[1] +
          "; " +
          seq[2] +
          "; ... ; " +
          (seq[2] + 12),
        type: "mc",
        options: numMc(seq[2] + 6, 6),
        answer: seq[2] + 6,
        explain: "Dãy cách đều 6 đơn vị → " + (seq[2] + 6),
      });
    }
    if (mode === "sumTo6") {
      var k = rand(3, 8);
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text: "6 + 6 + ... (" + k + " lần) = 6 × ?",
        type: "mc",
        options: numMc(k, 3),
        answer: k,
        explain: "Cộng " + k + " số hạng 6 = 6 × " + k,
      });
    }
    if (mode === "cmp6") {
      var a = 6 * rand(4, 8);
      var b = 6 * rand(4, 8);
      var left = a / 6;
      var right = b / 6 - 2;
      var ans = left > right ? ">" : left < right ? "<" : "=";
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text: "Điền dấu: " + a + " : 6  ___  " + b + " : 6 − 2",
        type: "mc",
        options: [">", "<", "="],
        answer: ans,
        explain: left + " " + ans + " " + right,
      });
    }
    var total = 6 * rand(3, 9);
    return q({
      topicId: "mathx-t4",
      level: level,
      week: 4,
      text: "Có " + total + " bạn xếp " + 6 + " hàng đều. Mỗi hàng có bao nhiêu bạn?",
      type: "mc",
      options: numMc(total / 6, 3),
      answer: total / 6,
      explain: total + " : 6 = " + total / 6,
    });
  }

  function week4Advanced(level) {
    var mode = pick(["diff", "rows", "poles", "minProd", "polyline"]);
    if (mode === "diff") {
      var big = rand(200, 400);
      var small = rand(100, big - 50);
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text:
          "Thùng lớn " +
          big +
          " lít, thùng nhỏ " +
          small +
          " lít. Thùng nhỏ ít hơn bao nhiêu lít?",
        type: "input",
        answer: big - small,
        explain: big + " − " + small + " = " + (big - small),
      });
    }
    if (mode === "rows") {
      var rows = 6;
      var total = 6 * rand(6, 12);
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text:
          "Có " +
          total +
          " cây trồng " +
          rows +
          " hàng đều. Mỗi hàng có:",
        type: "input",
        answer: total / rows,
        explain: total + " : " + rows + " = " + total / rows,
      });
    }
    if (mode === "poles") {
      var poles = rand(8, 15);
      var trees = rand(4, 8);
      var gaps = poles - 1;
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text:
          "Có " +
          poles +
          " cột điện. Giữa 2 cột liền nhau trồng " +
          trees +
          " cây xanh. Tất cả bao nhiêu cây xanh?",
        type: "input",
        answer: gaps * trees,
        explainSteps: [
          "Vẽ nhanh: cột — cây — cột — cây — … — cột.",
          "Số khoảng giữa " + poles + " cột = " + poles + " − 1 = " + gaps + ".",
          "Mỗi khoảng " + trees + " cây → tổng cây = " + gaps + " × " + trees + " = " + gaps * trees + ".",
        ],
        explainTip: "n cột thẳng hàng → (n − 1) khoảng.",
        explain: gaps + " khoảng × " + trees + " = " + gaps * trees,
      });
    }
    if (mode === "minProd") {
      return q({
        topicId: "mathx-t4",
        level: level,
        week: 4,
        text: "Phép nhân số có hai chữ số với 6, tích nhỏ nhất là:",
        type: "mc",
        options: shuffle(["60", "66", "600", "120"]),
        answer: "60",
        explain: "Số 2 chữ số nhỏ nhất là 10; 10 × 6 = 60.",
      });
    }
    var segs = [rand(4, 9), rand(4, 9), rand(4, 9)];
    var sum = segs[0] + segs[1] + segs[2];
    return q({
      topicId: "mathx-t4",
      level: level,
      week: 4,
      text:
        "Đường gấp khúc ABCD gồm 3 đoạn: " +
        segs.join(" cm, ") +
        " cm. Độ dài đường gấp khúc là:",
      type: "mc",
      options: numMc(sum, 8),
      answer: sum,
      explain: segs.join(" + ") + " = " + sum + " cm",
    });
  }

  // ——— Tuần 5: Bảng 7, 8, gấp lần, nhiều bước ———
  function week5Basic(level) {
    var mode = pick(["mult7", "div7", "cmp", "findA", "days", "multi", "times"]);
    if (mode === "mult7") {
      var m = rand(2, 9);
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text: "7 × " + m + " = ?",
        type: "mc",
        options: numMc(7 * m, 10),
        answer: 7 * m,
        explain: "7 × " + m + " = " + 7 * m,
      });
    }
    if (mode === "div7") {
      var m2 = rand(2, 9);
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text: "Tìm a biết: a : 7 = " + m2,
        type: "input",
        answer: 7 * m2,
        explain: "a = 7 × " + m2 + " = " + 7 * m2,
      });
    }
    if (mode === "cmp") {
      // 7×7+7 vs 7×8
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text: "Điền dấu: 7 × 7 + 7  ___  7 × 8",
        type: "mc",
        options: [">", "<", "="],
        answer: "=",
        explain: "7×7+7 = 56; 7×8 = 56 → bằng nhau.",
      });
    }
    if (mode === "findA") {
      var m3 = rand(3, 9);
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text: "Tìm a: a : 7 = " + m3,
        type: "mc",
        options: numMc(7 * m3, 10),
        answer: 7 * m3,
        explain: "a = " + 7 * m3,
      });
    }
    if (mode === "days") {
      var w = rand(3, 8);
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text: "Mỗi tuần 7 ngày. " + w + " tuần có bao nhiêu ngày?",
        type: "mc",
        options: numMc(7 * w, 8),
        answer: 7 * w,
        explain: "7 × " + w + " = " + 7 * w,
      });
    }
    if (mode === "multi") {
      var total = rand(40, 80);
      var sold = rand(10, 25);
      var cans = pick([5, 6, 7, 8]);
      var left = total - sold;
      if (left % cans !== 0) {
        left = cans * rand(3, 8);
        total = left + sold;
      }
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text:
          "Có " +
          total +
          " lít sữa, bán " +
          sold +
          " lít, chia đều phần còn lại vào " +
          cans +
          " can. Mỗi can có bao nhiêu lít?",
        type: "input",
        answer: left / cans,
        explain:
          "(" + total + " − " + sold + ") : " + cans + " = " + left / cans,
      });
    }
    var fruit = rand(20, 40);
    var decor = pick([4, 5, 6, 8]);
    if ((fruit + decor) % decor !== 0) fruit = decor * rand(3, 6) - decor;
    return q({
      topicId: "mathx-t5",
      level: level,
      week: 5,
      text:
        "Vườn có " +
        fruit +
        " cây ăn quả và " +
        decor +
        " cây cảnh. Tổng số cây gấp mấy lần số cây cảnh?",
      type: "mc",
      options: numMc((fruit + decor) / decor, 3),
      answer: (fruit + decor) / decor,
      explain:
        "(" + fruit + " + " + decor + ") : " + decor + " = " + (fruit + decor) / decor,
    });
  }

  function week5Advanced(level) {
    var mode = pick(["age", "boxes", "factor", "age2", "multiBuy", "times"]);
    if (mode === "age") {
      var child = rand(6, 9);
      var mult = pick([4, 5, 6]);
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text:
          "Năm nay con " +
          child +
          " tuổi. Tuổi mẹ gấp " +
          mult +
          " lần tuổi con. Tuổi mẹ là:",
        type: "input",
        answer: child * mult,
        explain: child + " × " + mult + " = " + child * mult,
      });
    }
    if (mode === "boxes") {
      var per = pick([7, 8, 9]);
      var full = rand(5, 9);
      var extra = rand(2, per - 1);
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text:
          "Mỗi hộp " +
          per +
          " bút. Cửa hàng có " +
          full +
          " hộp nguyên và 1 hộp " +
          extra +
          " bút. Tất cả bao nhiêu bút?",
        type: "input",
        answer: full * per + extra,
        explain: full + "×" + per + " + " + extra + " = " + (full * per + extra),
      });
    }
    if (mode === "factor") {
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text: "A × B = 63; B × C = 35; A, B, C > 1. Vậy A × B × C = ?",
        type: "mc",
        options: numMc(315, 50),
        answer: 315,
        explainSteps: [
          "Tìm B chung: B vừa là ước của 63 vừa là ước của 35, và B > 1.",
          "Ước chung lớn hơn 1 của 63 và 35 là 7 → B = 7.",
          "A × 7 = 63 → A = 9.  7 × C = 35 → C = 5.",
          "A × B × C = 9 × 7 × 5 = 315.",
        ],
        explainTip: "Gặp hai tích chung một chữ: tìm số ở giữa (B) trước.",
        explain: "B=7, A=9, C=5 → 9×7×5=315",
      });
    }
    if (mode === "age2") {
      var c = rand(7, 10);
      var k = pick([3, 4, 5]);
      var mom = c * k;
      var diff = mom - c;
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text:
          "Năm nay con " +
          c +
          " tuổi, mẹ gấp " +
          k +
          " lần tuổi con. Sau 10 năm, mẹ hơn con bao nhiêu tuổi?",
        type: "input",
        answer: diff,
        explainSteps: [
          "Năm nay: tuổi mẹ = " + c + " × " + k + " = " + mom + ".",
          "Mẹ hơn con năm nay: " + mom + " − " + c + " = " + diff + " tuổi.",
          "Sau 10 năm, cả hai cùng thêm 10 tuổi → khoảng cách tuổi không đổi.",
          "Vậy sau 10 năm mẹ vẫn hơn con " + diff + " tuổi.",
        ],
        explainTip: "Hai người cùng lớn thêm số năm bằng nhau → hiệu tuổi giữ nguyên.",
        explain: "Hiệu tuổi không đổi: " + mom + " − " + c + " = " + diff,
      });
    }
    if (mode === "multiBuy") {
      var boxes = rand(5, 9);
      var per = rand(6, 9);
      var give1 = rand(8, 15);
      var give2 = rand(10, 18);
      return q({
        topicId: "mathx-t5",
        level: level,
        week: 5,
        text:
          "Lan mua " +
          boxes +
          " hộp, mỗi hộp " +
          per +
          " bút. Cho Hùng " +
          give1 +
          " bút, cho Ngọc " +
          give2 +
          " bút. Còn lại:",
        type: "input",
        answer: boxes * per - give1 - give2,
        explain:
          boxes +
          "×" +
          per +
          " − " +
          give1 +
          " − " +
          give2 +
          " = " +
          (boxes * per - give1 - give2),
      });
    }
    var g = rand(6, 12);
    var k = pick([3, 4, 5]);
    var vit = g * k;
    // chọn ngan sao cho vit chia hết cho ngan
    var ngan = pick([4, 5, 8, 10].filter(function (n) {
      return vit % n === 0 && n !== g;
    }));
    if (!ngan) ngan = 5;
    if (vit % ngan !== 0) {
      ngan = 5;
      vit = ngan * rand(3, 8);
      g = vit / k;
    }
    return q({
      topicId: "mathx-t5",
      level: level,
      week: 5,
      text:
        "Nhà nuôi " +
        ngan +
        " ngan và " +
        g +
        " gà. Số vịt gấp " +
        k +
        " lần số gà. Số vịt gấp số ngan mấy lần?",
      type: "input",
      answer: vit / ngan,
      explain: "Vịt = " + vit + "; " + vit + " : " + ngan + " = " + vit / ngan,
    });
  }

  var WEEK_BASIC = {
    1: week1Basic,
    2: week2Basic,
    3: week3Basic,
    4: week4Basic,
    5: week5Basic,
  };
  var WEEK_ADV = {
    1: week1Advanced,
    2: week2Advanced,
    3: week3Advanced,
    4: week4Advanced,
    5: week5Advanced,
  };

  function generateMathXQuestion(week, level) {
    week = Number(week) || 0;
    if (week < 1 || week > 5) week = rand(1, 5);
    var fn =
      level === "advanced" ? WEEK_ADV[week] || week1Advanced : WEEK_BASIC[week] || week1Basic;
    var item = fn(level);
    item.topicId = item.topicId || "mathx-t" + week;
    item.week = week;
    return item;
  }

  function generateMathXByTopicId(topicId, level) {
    var map = {
      "mathx-t1": 1,
      "mathx-t2": 2,
      "mathx-t3": 3,
      "mathx-t4": 4,
      "mathx-t5": 5,
      "mathx-hon-hop": 0,
    };
    var w = map[topicId];
    if (w === 0 || w == null) return generateMathXQuestion(0, level);
    return generateMathXQuestion(w, level);
  }

  global.MathXQuestions = {
    generateMathXQuestion: generateMathXQuestion,
    generateMathXByTopicId: generateMathXByTopicId,
  };
})(typeof window !== "undefined" ? window : globalThis);
