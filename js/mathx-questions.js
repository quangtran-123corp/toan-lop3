/**
 * MathX Lớp 3 — KNTT · Toàn bộ tuần 1–34
 * Dạng đề tương đương PDF MathX (Cơ bản / Nâng cao)
 * Mọi câu khó có explainSteps cho HS lớp 3
 */
(function (global) {
  function rand(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
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
  function numMc(ans, spread) {
    spread = spread || 12;
    var a = Number(ans);
    var opts = [String(a)];
    var g = 0;
    while (opts.length < 4 && g++ < 50) {
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
      level: p.level || "basic",
      text: p.text,
      options: p.options || null,
      answer: String(p.answer),
      explain: p.explain || "",
      explainSteps: p.explainSteps || null,
      explainTip: p.explainTip || null,
      visual: p.visual || null,
      week: p.week || 0,
    };
  }
  function tid(week) {
    return "mathx-t" + week;
  }

  // ========== GIAI ĐOẠN A: T1–5 Số 1000, bảng 2–8 ==========
  function genA_basic(week, level) {
    var modes = [
      function () {
        var a = rand(200, 600);
        var b = rand(100, 350);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " + " + b + " = ?",
          type: "mc",
          options: numMc(a + b, 30),
          answer: a + b,
          explain: a + " + " + b + " = " + (a + b),
        });
      },
      function () {
        var a = rand(400, 900);
        var b = rand(100, 350);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " − " + b + " = ?",
          type: "mc",
          options: numMc(a - b, 30),
          answer: a - b,
          explain: a + " − " + b + " = " + (a - b),
        });
      },
      function () {
        var n = rand(2, 9);
        var m = rand(2, 9);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: n + " × " + m + " = ?",
          type: "mc",
          options: numMc(n * m, 10),
          answer: n * m,
          explain: n + " × " + m + " = " + n * m,
        });
      },
      function () {
        var n = rand(2, 9);
        var m = rand(2, 9);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: n * m + " : " + n + " = ?",
          type: "mc",
          options: numMc(m, 5),
          answer: m,
          explain: n * m + " : " + n + " = " + m,
        });
      },
      function () {
        var h = rand(1, 9);
        var u = rand(0, 99);
        var n = h * 100 + u;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Số gồm " + h + " trăm " + u + " đơn vị là:",
          type: "mc",
          options: numMc(n, 40),
          answer: n,
          explain: h + "×100 + " + u + " = " + n,
        });
      },
      function () {
        var each = rand(3, 9);
        var g = rand(3, 9);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Mỗi hộp " +
            each +
            " cái. " +
            g +
            " hộp có tất cả bao nhiêu cái?",
          type: "mc",
          options: numMc(each * g, 10),
          answer: each * g,
          explainSteps: [
            "Mỗi hộp có " + each + " cái, có " + g + " hộp.",
            "Tính: " + each + " × " + g + " = " + each * g + " cái.",
          ],
          explainTip: "“Mỗi … có …, có mấy …” → lấy phép nhân.",
          explain: each + " × " + g + " = " + each * g,
        });
      },
    ];
    return pick(modes)();
  }

  function genA_adv(week, level) {
    var modes = [
      function () {
        var hang2 = rand(200, 450);
        var d = rand(40, Math.min(180, hang2 - 80));
        var hang1 = hang2 - d;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Trong phép cộng hai số: tổng lớn hơn số hạng thứ nhất " +
            hang2 +
            " đơn vị; số hạng thứ nhất nhỏ hơn số hạng thứ hai " +
            d +
            " đơn vị. Số hạng thứ nhất là:",
          type: "input",
          answer: hang1,
          explainSteps: [
            "“Tổng lớn hơn số hạng 1 là " +
              hang2 +
              "” → số hạng thứ hai = " +
              hang2 +
              ".",
            "“Số hạng 1 nhỏ hơn số hạng 2 là " +
              d +
              "” → số hạng 1 = " +
              hang2 +
              " − " +
              d +
              ".",
            "Tính: " + hang2 + " − " + d + " = " + hang1 + ".",
            "Kiểm tra: tổng = " + hang1 + " + " + hang2 + " = " + (hang1 + hang2) + ".",
          ],
          explainTip: "Phép cộng: Tổng − một số hạng = số hạng kia.",
        });
      },
      function () {
        var x = rand(10, 25);
        var y = rand(3, x - 2);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Tổng hai số " +
            (x + y) +
            ", hiệu " +
            (x - y) +
            " (lớn trừ bé). Số lớn là:",
          type: "input",
          answer: x,
          explainSteps: [
            "Số lớn A, số bé B: A+B = " + (x + y) + ", A−B = " + (x - y) + ".",
            "Cộng hai vế: 2A = " + (x + y + x - y) + " = " + 2 * x + ".",
            "A = " + 2 * x + " : 2 = " + x + ".",
          ],
          explainTip: "Số lớn = (tổng + hiệu) : 2.",
        });
      },
      function () {
        var g = rand(3, 9);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Nếu An cho Bình " +
            g +
            " nhãn thì hai bạn bằng nhau. Lúc đầu An hơn Bình bao nhiêu nhãn?",
          type: "mc",
          options: numMc(g * 2, 5),
          answer: g * 2,
          explainSteps: [
            "An giảm " + g + ", Bình tăng " + g + ".",
            "Khoảng cách lúc đầu = " + g + " + " + g + " = " + g * 2 + ".",
          ],
          explainTip: "Cho k cái để bằng nhau → lúc đầu hơn 2k cái.",
        });
      },
      function () {
        var half = rand(5, 20);
        var add = rand(15, 40);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Một số chia 2, thương cộng " +
            add +
            " được " +
            (half + add) +
            ". Số đó là:",
          type: "input",
          answer: half * 2,
          explainSteps: [
            "Làm ngược: " + (half + add) + " − " + add + " = " + half + " (thương).",
            "Số cần tìm = " + half + " × 2 = " + half * 2 + ".",
          ],
          explainTip: "Bài tìm số: làm ngược phép tính.",
        });
      },
      function () {
        var sold = rand(25, 50);
        var left = rand(30, 60);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Bán " +
            sold +
            " con gà, còn " +
            left +
            " con. Ban đầu có bao nhiêu con?",
          type: "input",
          answer: sold + left,
          explainSteps: [
            "Ban đầu = đã bán + còn lại.",
            sold + " + " + left + " = " + (sold + left) + ".",
          ],
        });
      },
    ];
    return pick(modes)();
  }

  // ========== GIAI ĐOẠN B: T6–8 Bảng 9, thuyền có dư ==========
  function genB_basic(week, level) {
    var modes = [
      function () {
        var m = rand(2, 9);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "9 × " + m + " = ?",
          type: "mc",
          options: numMc(9 * m, 12),
          answer: 9 * m,
          explain: "9 × " + m + " = " + 9 * m,
        });
      },
      function () {
        var m = rand(2, 9);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: 9 * m + " : 9 = ?",
          type: "mc",
          options: numMc(m, 4),
          answer: m,
          explain: 9 * m + " : 9 = " + m,
        });
      },
      function () {
        var people = rand(40, 90);
        var cap = pick([6, 7, 8, 9]);
        var boats = Math.ceil(people / cap);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Có " +
            people +
            " người, mỗi thuyền chở nhiều nhất " +
            cap +
            " người. Cần ít nhất bao nhiêu thuyền?",
          type: "input",
          answer: boats,
          explainSteps: [
            "Chia " + people + " : " + cap + " = " + Math.floor(people / cap) + " (dư " + (people % cap) + ").",
            people % cap === 0
              ? "Chia hết → cần " + boats + " thuyền."
              : "Còn dư nên thêm 1 thuyền → cần " + boats + " thuyền.",
          ],
          explainTip: "Chia có dư khi xếp chỗ → làm tròn lên số thuyền.",
        });
      },
      function () {
        var full = rand(5, 9);
        var each = 9;
        var rem = rand(1, 8);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Bán đều cho " +
            full +
            " người, mỗi người " +
            each +
            " quả, còn lại " +
            rem +
            " quả. Ban đầu có bao nhiêu quả?",
          type: "input",
          answer: full * each + rem,
          explainSteps: [
            "Đã bán: " + full + " × " + each + " = " + full * each + ".",
            "Còn lại " + rem + " → ban đầu = " + full * each + " + " + rem + " = " + (full * each + rem) + ".",
          ],
        });
      },
      function () {
        var a = 9 * rand(2, 7);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Tìm a: " + a + " : a = " + a / 9 + "  (a là số nào?)",
          type: "mc",
          options: numMc(9, 4),
          answer: 9,
          explain: a + " : 9 = " + a / 9 + " → a = 9.",
        });
      },
    ];
    return pick(modes)();
  }

  function genB_adv(week, level) {
    return pick([
      function () {
        // x * 9 - 6*something style: gấp 9 lần rồi giảm 6 lần được 3 → (9x)/6=3 → 9x=18 → x=2? "gấp lên 9 lần rồi giảm đi 6 lần được 3"
        // (x*9)/6 = 3 → x*9 = 18 → x = 2
        var result = pick([3, 4, 5, 6]);
        var times = 9;
        var div = 6;
        // (x * times) / div = result → x = result * div / times
        var x = (result * div) / times;
        if (x !== Math.floor(x)) {
          result = 3;
          x = 2;
        }
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Tìm số, biết gấp lên " +
            times +
            " lần rồi giảm đi " +
            div +
            " lần được " +
            result +
            ".",
          type: "input",
          answer: x,
          explainSteps: [
            "Gọi số cần tìm là x.",
            "Gấp " + times + " lần: " + times + "x. Giảm " + div + " lần: (" + times + "x) : " + div + " = " + result + ".",
            times + "x = " + result + " × " + div + " = " + result * div + ".",
            "x = " + result * div + " : " + times + " = " + x + ".",
          ],
          explainTip: "Gấp rồi giảm: nhân trước, chia sau — làm ngược từ kết quả.",
        });
      },
      function () {
        var n = 9 * rand(3, 8);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Một số chia 9 được " +
            n / 9 +
            ". Số đó chia 3 được bao nhiêu?",
          type: "input",
          answer: n / 3,
          explainSteps: [
            "Số đó = " + n / 9 + " × 9 = " + n + ".",
            n + " : 3 = " + n / 3 + ".",
          ],
        });
      },
      genB_basic.bind(null, week, level),
    ])();
  }

  // ========== GIAI ĐOẠN C: T9–11 Hình học ==========
  function genC_basic(week, level) {
    return pick([
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Hình tam giác có bao nhiêu cạnh và bao nhiêu đỉnh?",
          type: "mc",
          options: ["3 cạnh, 3 đỉnh", "4 cạnh, 4 đỉnh", "3 cạnh, 4 đỉnh", "4 cạnh, 3 đỉnh"],
          answer: "3 cạnh, 3 đỉnh",
          explainSteps: [
            "Hình tam giác có 3 cạnh.",
            "Có 3 đỉnh (góc).",
          ],
          explainTip: "Tam = 3 → 3 cạnh, 3 đỉnh.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Khối lập phương có bao nhiêu đỉnh?",
          type: "mc",
          options: numMc(8, 3),
          answer: 8,
          explain: "Khối lập phương có 8 đỉnh, 12 cạnh, 6 mặt.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Khối hộp chữ nhật có các mặt là hình gì?",
          type: "mc",
          options: ["Hình chữ nhật", "Hình tròn", "Hình tam giác", "Hình thoi"],
          answer: "Hình chữ nhật",
          explain: "Sáu mặt của hình hộp chữ nhật đều là hình chữ nhật.",
        });
      },
      function () {
        // Trước T10/T11: không chia số 2 chữ số — cho sẵn dài & rộng, chỉ cộng
        var L = rand(5, 12);
        var w = rand(2, Math.min(9, L - 1));
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Hình chữ nhật dài " +
            L +
            " cm, rộng " +
            w +
            " cm. Tổng chiều dài và chiều rộng là:",
          type: "mc",
          options: numMc(L + w, 4),
          answer: L + w,
          explainSteps: [
            "Đề đã cho cả chiều dài và chiều rộng.",
            "Tổng = " + L + " + " + w + " = " + (L + w) + " cm.",
          ],
          explainTip: "Chỉ cần cộng — chưa cần chia để tìm cạnh.",
        });
      },
      function () {
        // Cho rộng + gấp k lần → tìm dài (bảng nhân)
        var w = rand(2, 9);
        var k = pick([2, 3, 4, 5]);
        var L = w * k;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Hình chữ nhật rộng " +
            w +
            " cm, dài gấp " +
            k +
            " lần rộng. Chiều dài là:",
          type: "mc",
          options: numMc(L, 5),
          answer: L,
          explainSteps: [
            "Dài gấp " + k + " lần rộng → nhân (bảng nhân " + k + ").",
            "Dài = " + w + " × " + k + " = " + L + " cm.",
          ],
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Mỗi khối lập phương có mấy mặt? Mỗi mặt là hình gì?",
          type: "mc",
          options: [
            "6 mặt hình vuông",
            "4 mặt hình vuông",
            "6 mặt hình tròn",
            "8 mặt hình chữ nhật",
          ],
          answer: "6 mặt hình vuông",
          explain: "Lập phương: 6 mặt vuông bằng nhau.",
        });
      },
    ])();
  }

  function genC_adv(week, level) {
    return pick([
      function () {
        var edge = 12; // nan tre
        var faces = 6;
        var n = rand(2, 5);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Đèn lồng dạng khối lập phương: mỗi cạnh 1 nan tre, mỗi mặt 1 tờ giấy. " +
            n +
            " chiếc cần bao nhiêu tờ giấy màu?",
          type: "input",
          answer: n * faces,
          explainSteps: [
            "1 chiếc cần 6 tờ giấy (6 mặt).",
            n + " chiếc: " + n + " × 6 = " + n * faces + " tờ.",
          ],
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Khối lập phương có bao nhiêu cạnh (nan)?",
          type: "mc",
          options: numMc(12, 4),
          answer: 12,
          explain: "12 cạnh.",
        });
      },
      genC_basic.bind(null, week, level),
    ])();
  }

  // ========== GIAI ĐOẠN D: T12–14 Gấp / giảm lần ==========
  function genD_basic(week, level) {
    return pick([
      function () {
        var n = rand(4, 12);
        var k = pick([2, 3, 4, 5, 6, 7]);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Gấp " + n + " lên " + k + " lần được:",
          type: "mc",
          options: numMc(n * k, 15),
          answer: n * k,
          explainSteps: [
            "Gấp lên " + k + " lần nghĩa là nhân với " + k + ".",
            n + " × " + k + " = " + n * k + ".",
          ],
          explainTip: "Gấp k lần → nhân k.",
        });
      },
      function () {
        var k = pick([2, 3, 4, 5, 6, 7, 9]);
        var result = rand(3, 12);
        var n = result * k;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Giảm " + n + " đi " + k + " lần được:",
          type: "mc",
          options: numMc(result, 8),
          answer: result,
          explainSteps: [
            "Giảm đi " + k + " lần nghĩa là chia cho " + k + ".",
            n + " : " + k + " = " + result + ".",
          ],
          explainTip: "Giảm k lần → chia k.",
        });
      },
      function () {
        var mom = pick([36, 42, 48, 54]);
        var k = pick([6, 7]);
        if (mom % k !== 0) mom = k * rand(5, 8);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Mẹ " +
            mom +
            " tuổi. Giảm tuổi mẹ đi " +
            k +
            " lần được tuổi con. Con bao nhiêu tuổi?",
          type: "input",
          answer: mom / k,
          explainSteps: [
            "Tuổi con = tuổi mẹ giảm " + k + " lần = " + mom + " : " + k + ".",
            "Con = " + mom / k + " tuổi.",
          ],
        });
      },
      function () {
        var t = rand(10, 20);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Đi bộ hết " +
            t +
            " phút. Đi xe đạp thời gian giảm 2 lần. Đi xe đạp hết mấy phút?",
          type: "mc",
          options: numMc(t / 2, 5),
          answer: t / 2,
          explain: t + " : 2 = " + t / 2 + " phút.",
        });
      },
      function () {
        var start = pick([36, 48, 63, 72, 81]);
        var k = pick([3, 4, 6, 7, 9]);
        if (start % k !== 0) start = k * rand(4, 10);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Còn lại số gà giảm đi " +
            k +
            " lần so với ban đầu " +
            start +
            " con. Còn lại bao nhiêu con?",
          type: "input",
          answer: start / k,
          explain: start + " : " + k + " = " + start / k,
        });
      },
    ])();
  }

  function genD_adv(week, level) {
    return pick([
      function () {
        // gấp 7 lần 4 rồi giảm 2 lần: (4*7)/2 = 14
        var n = rand(3, 12);
        var g = pick([3, 4, 5, 6, 7]);
        var d = pick([2, 3]);
        if ((n * g) % d !== 0) n = d * rand(2, 5);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Gấp " +
            n +
            " lên " +
            g +
            " lần rồi giảm đi " +
            d +
            " lần được:",
          type: "input",
          answer: (n * g) / d,
          explainSteps: [
            "Gấp " + g + " lần: " + n + " × " + g + " = " + n * g + ".",
            "Giảm " + d + " lần: " + n * g + " : " + d + " = " + (n * g) / d + ".",
          ],
        });
      },
      function () {
        var small = rand(4, 8);
        var k = pick([3, 4, 5]);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Xe nhỏ chở " +
            small +
            " người, xe to gấp " +
            k +
            " lần xe nhỏ. Cả hai xe chở bao nhiêu người?",
          type: "input",
          answer: small + small * k,
          explainSteps: [
            "Xe to: " + small + " × " + k + " = " + small * k + " người.",
            "Cả hai: " + small + " + " + small * k + " = " + (small + small * k) + ".",
          ],
        });
      },
      genD_basic.bind(null, week, level),
    ])();
  }

  // ========== GIAI ĐOẠN E: T15–18 Đo lường, góc, trung điểm ==========
  function genE_basic(week, level) {
    return pick([
      function () {
        var segs = [rand(8, 20), rand(8, 20), rand(8, 20), rand(8, 20)];
        var sum = segs.reduce(function (a, b) {
          return a + b;
        }, 0);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Đường gấp khúc 4 đoạn: " +
            segs.join(" cm, ") +
            " cm. Độ dài là:",
          type: "mc",
          options: numMc(sum, 10),
          answer: sum,
          explain: segs.join(" + ") + " = " + sum + " cm",
        });
      },
      function () {
        var ab = pick([40, 60, 80, 100, 120]);
        // M midpoint PQ, N midpoint MQ → MN = PQ/4
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "PQ = " +
            ab +
            " cm. M trung điểm PQ, N trung điểm MQ. Độ dài MN là:",
          type: "mc",
          options: numMc(ab / 4, 10),
          answer: ab / 4,
          explainSteps: [
            "M giữa P và Q → PM = MQ = " + ab / 2 + " cm.",
            "N giữa M và Q → MN = MQ : 2 = " + ab / 4 + " cm.",
          ],
          explainTip: "Trung điểm chia đoạn thành 2 phần bằng nhau.",
        });
      },
      function () {
        var a = rand(400, 800);
        var less = rand(100, 300);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Xe 1 chở " +
            a +
            " tấn. Xe 2 chở ít hơn " +
            less +
            " tấn. Xe 2 chở:",
          type: "input",
          answer: a - less,
          explain: a + " − " + less + " = " + (a - less),
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "3 dm + 2 dm so với 60 cm. Dấu đúng là:",
          type: "mc",
          options: ["<", ">", "="],
          answer: "<",
          explainSteps: [
            "3 dm + 2 dm = 5 dm = 50 cm.",
            "50 cm < 60 cm → dấu <.",
          ],
          explainTip: "1 dm = 10 cm.",
        });
      },
      function () {
        var hours = rand(3, 6);
        var km = hours * rand(5, 12);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Đi " +
            hours +
            " giờ được " +
            km +
            " km (đều nhau). 1 giờ đi được:",
          type: "mc",
          options: numMc(km / hours, 5),
          answer: km / hours,
          explain: km + " : " + hours + " = " + km / hours + " km.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Góc vuông có số đo bằng bao nhiêu độ?",
          type: "mc",
          options: ["45", "60", "90", "180"],
          answer: "90",
          explain: "Góc vuông = 90°.",
        });
      },
    ])();
  }

  function genE_adv(week, level) {
    return pick([
      function () {
        var total = 8 * rand(12, 20);
        var bagsUsed = rand(2, 4);
        var perFamily = pick([8, 10, 12, 16]);
        var perBag = total / 8;
        var rice = bagsUsed * perBag;
        if (rice % perFamily !== 0) {
          perFamily = 8;
        }
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Có " +
            total +
            " kg gạo chia đều 8 bao. Ủng hộ " +
            bagsUsed +
            " bao, mỗi gia đình " +
            perFamily +
            " kg. Bao nhiêu gia đình nhận được?",
          type: "input",
          answer: (bagsUsed * perBag) / perFamily,
          explainSteps: [
            "Mỗi bao: " + total + " : 8 = " + perBag + " kg.",
            bagsUsed + " bao: " + bagsUsed + " × " + perBag + " = " + bagsUsed * perBag + " kg.",
            "Số gia đình: " +
              bagsUsed * perBag +
              " : " +
              perFamily +
              " = " +
              (bagsUsed * perBag) / perFamily +
              ".",
          ],
        });
      },
      genE_basic.bind(null, week, level),
    ])();
  }

  // ========== GIAI ĐOẠN F: T19–23 Số lớn, so sánh ==========
  function genF_basic(week, level) {
    return pick([
      function () {
        var a = rand(1000, 8000);
        var b = rand(500, 4000);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " + " + b + " = ?",
          type: "input",
          answer: a + b,
          explain: a + " + " + b + " = " + (a + b),
        });
      },
      function () {
        var a = rand(3000, 9000);
        var b = rand(1000, a - 500);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " − " + b + " = ?",
          type: "input",
          answer: a - b,
          explain: a + " − " + b + " = " + (a - b),
        });
      },
      function () {
        var a = rand(12, 99);
        var b = rand(2, 8);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " × " + b + " = ?",
          type: "input",
          answer: a * b,
          explain: a + " × " + b + " = " + a * b,
        });
      },
      function () {
        var b = rand(2, 9);
        var qv = rand(11, 40);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: b * qv + " : " + b + " = ?",
          type: "input",
          answer: qv,
          explain: b * qv + " : " + b + " = " + qv,
        });
      },
    ])();
  }

  function genF_adv(week, level) {
    return pick([
      function () {
        var a = rand(1000, 5000);
        var b = rand(2, 6);
        var c = rand(100, 900);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "(" + a + " + " + c + ") × " + b + " = ?",
          type: "input",
          answer: (a + c) * b,
          explainSteps: [
            "Trong ngoặc trước: " + a + " + " + c + " = " + (a + c) + ".",
            "Nhân: " + (a + c) + " × " + b + " = " + (a + c) * b + ".",
          ],
          explainTip: "Tính trong ngoặc trước, rồi nhân/chia.",
        });
      },
      genF_basic.bind(null, week, level),
    ])();
  }

  // ========== GIAI ĐOẠN G: T24–27 Nhân số lớn × 1 chữ số ==========
  function genG_basic(week, level) {
    return pick([
      function () {
        var a = rand(1000, 3000);
        var b = rand(2, 7);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " × " + b + " = ?",
          type: "input",
          answer: a * b,
          explain: a + " × " + b + " = " + a * b,
        });
      },
      function () {
        var b = rand(2, 8);
        var qv = rand(500, 2000);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Tìm y: y : " + b + " = " + qv,
          type: "input",
          answer: b * qv,
          explainSteps: [
            "y : " + b + " = " + qv + " → y = " + qv + " × " + b + ".",
            "y = " + b * qv + ".",
          ],
        });
      },
      function () {
        var per = rand(2000, 4000);
        var n = rand(3, 6);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Mỗi xe " +
            per +
            " kg. " +
            n +
            " xe chở tất cả bao nhiêu kg?",
          type: "input",
          answer: per * n,
          explain: per + " × " + n + " = " + per * n,
        });
      },
      function () {
        var nep = rand(1500, 3000);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Gạo nếp " +
            nep +
            " kg, gạo tẻ gấp đôi gạo nếp. Gạo tẻ có:",
          type: "input",
          answer: nep * 2,
          explainSteps: [
            "Gấp đôi = nhân 2.",
            nep + " × 2 = " + nep * 2 + " kg.",
          ],
        });
      },
      function () {
        var L = rand(1000, 2000);
        var more = rand(400, 800);
        var W = L - more;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Hình chữ nhật dài " +
            L +
            " m, dài hơn rộng " +
            more +
            " m. Chu vi là:",
          type: "input",
          answer: 2 * (L + W),
          explainSteps: [
            "Rộng = " + L + " − " + more + " = " + W + " m.",
            "Chu vi = (" + L + " + " + W + ") × 2 = " + 2 * (L + W) + " m.",
          ],
          explainTip: "Chu vi HCN = (dài + rộng) × 2.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Điền dấu: 2000 × 3  ___  4999 + 1",
          type: "mc",
          options: [">", "<", "="],
          answer: ">",
          explainSteps: [
            "2000 × 3 = 6000.",
            "4999 + 1 = 5000.",
            "6000 > 5000 → chọn dấu >.",
          ],
        });
      },
    ])();
  }

  // Fix the compare bug - 2000*3=6000, 4999+1=5000 so >
  function genG_basic_fixed(week, level) {
    var item = genG_basic(week, level);
    // regenerate bad compare if needed - override last mode by patching function
    return item;
  }

  // Fix compare in genG - rewrite the compare function properly
  // I'll fix by replacing the bad one in the array - actually let me fix genG_basic's compare

  // ========== GIAI ĐOẠN H: T28–31 Tiền Việt ==========
  function genH_basic(week, level) {
    return pick([
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "… tờ 5 000 đồng đổi được 1 tờ 20 000 đồng. Số tờ là:",
          type: "mc",
          options: numMc(4, 2),
          answer: 4,
          explainSteps: [
            "20 000 : 5 000 = 4.",
            "Cần 4 tờ 5 000 đồng.",
          ],
        });
      },
      function () {
        var a = rand(10, 30) * 1000;
        var b = rand(10, 25) * 1000;
        var pay = pick([50, 100]) * 1000;
        var sum = a + b;
        if (pay < sum) pay = 100000;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Mua hết " +
            a +
            " đồng và " +
            b +
            " đồng. Đưa " +
            pay +
            " đồng. Tiền thừa là:",
          type: "input",
          answer: pay - sum,
          explainSteps: [
            "Tổng tiền hàng: " + a + " + " + b + " = " + sum + " đồng.",
            "Tiền thừa: " + pay + " − " + sum + " = " + (pay - sum) + " đồng.",
          ],
          explainTip: "Tiền thừa = tiền đưa − tiền hàng.",
        });
      },
      function () {
        var packs = rand(4, 9);
        var total = packs * rand(5, 12) * 1000;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Mua " +
            packs +
            " gói hết " +
            total +
            " đồng. Mỗi gói giá:",
          type: "input",
          answer: total / packs,
          explain: total + " : " + packs + " = " + total / packs + " đồng.",
        });
      },
      function () {
        var price = rand(10, 20) * 1000;
        var money = rand(40, 60) * 1000;
        var can = Math.floor(money / price);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "1 kg giá " +
            price +
            " đồng. Có " +
            money +
            " đồng, mua được nhiều nhất bao nhiêu kg?",
          type: "mc",
          options: numMc(can, 2),
          answer: can,
          explainSteps: [
            money + " : " + price + " = " + can + " (dư " + (money % price) + ").",
            "Mua được nhiều nhất " + can + " kg.",
          ],
        });
      },
      function () {
        var price = rand(30, 50) * 1000;
        var discount = rand(3, 8) * 1000;
        var qty = 2;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Mỗi chùm " +
            price +
            " đồng, giảm " +
            discount +
            " đồng/chùm khi mua từ 2 chùm. Mua 2 chùm trả:",
          type: "input",
          answer: 2 * (price - discount),
          explainSteps: [
            "Giá sau giảm 1 chùm: " + price + " − " + discount + " = " + (price - discount) + ".",
            "2 chùm: 2 × " + (price - discount) + " = " + 2 * (price - discount) + " đồng.",
          ],
        });
      },
    ])();
  }

  function genH_adv(week, level) {
    return pick([
      function () {
        var mid = 24000;
        var kg = 3;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Đầu vụ 1 kg = " +
            mid +
            " đồng. Giữa vụ với " +
            mid +
            " đồng mua được " +
            kg +
            " kg. Giữa vụ, 1 kg giá:",
          type: "input",
          answer: mid / kg,
          explainSteps: [
            "Giữa vụ: " + mid + " đồng mua " + kg + " kg.",
            "1 kg = " + mid + " : " + kg + " = " + mid / kg + " đồng.",
          ],
        });
      },
      genH_basic.bind(null, week, level),
    ])();
  }

  // ========== GIAI ĐOẠN I: T32–34 Ôn tập phạm vi 100 000 ==========
  function genI_basic(week, level) {
    return pick([
      function () {
        var a = rand(10000, 50000);
        var b = rand(5000, 30000);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " + " + b + " = ?",
          type: "input",
          answer: a + b,
          explain: a + " + " + b + " = " + (a + b),
        });
      },
      function () {
        var a = rand(20000, 80000);
        var b = rand(5000, a - 1000);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " − " + b + " = ?",
          type: "input",
          answer: a - b,
          explain: a + " − " + b + " = " + (a - b),
        });
      },
      function () {
        var a = rand(1000, 9000);
        var b = rand(2, 9);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: a + " × " + b + " = ?",
          type: "input",
          answer: a * b,
          explain: a + " × " + b + " = " + a * b,
        });
      },
      function () {
        var b = rand(2, 9);
        var qv = rand(1000, 8000);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: b * qv + " : " + b + " = ?",
          type: "input",
          answer: qv,
          explain: b * qv + " : " + b + " = " + qv,
        });
      },
      function () {
        var a = rand(2000, 5000);
        var b = rand(2, 5);
        var c = rand(1000, 4000);
        // a - b * something careful order
        var prod = rand(1000, 2000) * b;
        var start = prod + c;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: start + " − " + prod / b + " × " + b + " = ?",
          type: "input",
          answer: start - prod,
          explainSteps: [
            "Nhân trước: " + prod / b + " × " + b + " = " + prod + ".",
            "Trừ: " + start + " − " + prod + " = " + (start - prod) + ".",
          ],
          explainTip: "Thứ tự: nhân chia trước, cộng trừ sau (trừ khi có ngoặc).",
        });
      },
    ])();
  }

  function genI_adv(week, level) {
    return pick([
      function () {
        var a = rand(10000, 40000);
        var b = rand(2, 6);
        var c = rand(1000, 9000);
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "(" + a + " − " + c + ") × " + b + " = ?",
          type: "input",
          answer: (a - c) * b,
          explainSteps: [
            "Trong ngoặc: " + a + " − " + c + " = " + (a - c) + ".",
            "Nhân: " + (a - c) + " × " + b + " = " + (a - c) * b + ".",
          ],
        });
      },
      genI_basic.bind(null, week, level),
    ])();
  }

  // ========== SKILL GENERATORS — khớp đúng chủ đề tuần KNTT ==========

  /** Bảng nhân/chia chỉ trong các bảng cho trước, vd [2,5] hoặc [6] */
  function genBangNhanChia(week, level, tables) {
    tables = tables || [2, 3, 4, 5, 6, 7, 8, 9];
    var n = pick(tables);
    var m = rand(2, 9);
    if (level === "advanced" && Math.random() < 0.45) {
      // tìm thành phần
      if (Math.random() < 0.5) {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "☐ × " + n + " = " + n * m + ". Số trong ô trống là?",
          type: "input",
          answer: m,
          explainSteps: [
            "Đây là tìm thừa số còn thiếu trong phép nhân.",
            "Số cần tìm = tích : thừa số đã biết = " + n * m + " : " + n + " = " + m + ".",
          ],
          explainTip: "Tìm thừa số: lấy tích chia cho thừa số kia.",
        });
      }
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: n * m + " : ☐ = " + m + ". Số chia (số chia) là?",
        type: "input",
        answer: n,
        explainSteps: [
          "Thương × số chia = số bị chia.",
          "Số chia = " + n * m + " : " + m + " = " + n + ".",
        ],
      });
    }
    if (Math.random() < 0.5) {
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: n + " × " + m + " = ?",
        type: "mc",
        options: numMc(n * m, 10),
        answer: n * m,
        explain: n + " × " + m + " = " + n * m,
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: n * m + " : " + n + " = ?",
      type: "mc",
      options: numMc(m, 5),
      answer: m,
      explain: n * m + " : " + n + " = " + m,
    });
  }

  function genSoDen1000(week, level) {
    var h = rand(1, 9);
    var t = rand(0, 9);
    var o = rand(0, 9);
    var n = h * 100 + t * 10 + o;
    if (Math.random() < 0.4) {
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Số gồm " + h + " trăm " + t + " chục " + o + " đơn vị là:",
        type: "mc",
        options: numMc(n, 40),
        answer: n,
        explain: h + "×100 + " + t + "×10 + " + o + " = " + n,
      });
    }
    if (Math.random() < 0.5) {
      var a = n;
      var b = n + rand(10, 80) * (Math.random() < 0.5 ? 1 : -1);
      if (b < 100) b = n + 15;
      if (b > 999) b = n - 15;
      var ans = a > b ? ">" : a < b ? "<" : "=";
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "So sánh: " + a + "  ___  " + b,
        type: "mc",
        options: [">", "<", "="],
        answer: ans,
        explain: a + " " + ans + " " + b,
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Số liền sau của " + n + " là:",
      type: "mc",
      options: numMc(n + 1, 5),
      answer: n + 1,
      explain: n + " + 1 = " + (n + 1),
    });
  }

  function genCongTru1000(week, level) {
    if (level === "advanced" && Math.random() < 0.4) {
      var a = rand(200, 600);
      var b = rand(100, 300);
      var sum = a + b;
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: a + " + ☐ = " + sum + ". Số hạng còn thiếu là?",
        type: "input",
        answer: b,
        explainSteps: [
          "Muốn tìm số hạng còn thiếu: lấy tổng trừ số hạng đã biết.",
          sum + " − " + a + " = " + b + ".",
        ],
        explainTip: "Tổng − số hạng này = số hạng kia.",
      });
    }
    if (Math.random() < 0.5) {
      var x = rand(200, 550);
      var y = rand(100, 400);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: x + " + " + y + " = ?",
        type: "mc",
        options: numMc(x + y, 30),
        answer: x + y,
        explain: x + " + " + y + " = " + (x + y),
      });
    }
    var p = rand(400, 900);
    var qv = rand(100, 350);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: p + " − " + qv + " = ?",
      type: "mc",
      options: numMc(p - qv, 30),
      answer: p - qv,
      explain: p + " − " + qv + " = " + (p - qv),
    });
  }

  function genThanhPhanCongTru(week, level) {
    if (Math.random() < 0.5) {
      var a = rand(100, 500);
      var b = rand(50, 300);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Số bị trừ " + (a + b) + ", hiệu " + a + ". Số trừ là?",
        type: "input",
        answer: b,
        explainSteps: [
          "Số trừ = số bị trừ − hiệu.",
          a + b + " − " + a + " = " + b + ".",
        ],
        explainTip: "Số bị trừ − hiệu = số trừ.",
      });
    }
    var s1 = rand(100, 400);
    var s2 = rand(100, 400);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Tổng " + (s1 + s2) + ", số hạng thứ nhất " + s1 + ". Số hạng thứ hai là?",
      type: "input",
      answer: s2,
      explainSteps: [
        "Số hạng còn lại = tổng − số hạng đã biết.",
        s1 + s2 + " − " + s1 + " = " + s2 + ".",
      ],
    });
  }

  function genMotPhanMay(week, level) {
    // Tuần 7: chỉ dùng bảng nhân đã học (2–9), thương 1 chữ số — tránh chia số lớn
    var d = pick([2, 3, 4, 5, 6]);
    var unit = rand(2, 9); // kết quả 1 chữ số
    var total = d * unit; // trong bảng nhân, vd 6×4=24
    // Giới hạn total nhỏ hơn cho cơ bản tuần ≤ 9
    if ((week || 7) <= 9 && total > 36) {
      unit = rand(2, 6);
      total = d * unit;
    }
    if (level === "advanced" && d >= 3 && Math.random() < 0.45) {
      var n = rand(2, Math.min(3, d - 1));
      var ans = unit * n;
      // Tuần 7–9: kết quả vẫn 1 chữ số (≤ 9)
      if (ans > 9) {
        unit = rand(2, 4);
        total = d * unit;
        n = 2;
        ans = unit * n;
        if (ans > 9) {
          unit = 2;
          total = d * unit;
          ans = 4;
          n = 2;
        }
      }
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: n + "/" + d + " của " + total + " bằng bao nhiêu?",
        type: "input",
        answer: ans,
        explainSteps: [
          "Một phần " + d + " của " + total + " = " + total + " : " + d + " = " + unit + " (nhớ bảng nhân " + d + ").",
          n + " phần = " + unit + " × " + n + " = " + ans + ".",
        ],
        explainTip: "Một phần mấy = chia (dùng bảng nhân). k phần = nhân tiếp.",
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Một phần " + d + " của " + total + " là bao nhiêu?",
      type: "mc",
      options: numMc(unit, 3),
      answer: unit,
      explainSteps: [
        "Chia đều " + total + " thành " + d + " phần bằng nhau.",
        "Nhớ: " + d + " × " + unit + " = " + total + " → " + total + " : " + d + " = " + unit + ".",
      ],
      explainTip: "Một phần mấy = chia cho mấy (dựa bảng nhân đã học).",
    });
  }

  function genTrungDiem(week, level) {
    // Tuần 7: chưa học chia số 2 chữ số — AM luôn 1 chữ số (2–9), AB = 2×AM (4–18)
    var am = rand(2, 9);
    var len = am * 2; // 4,6,...,18 — bé nghĩ "gấp đôi / một nửa" trong bảng 2

    // Nâng cao tuần 7: hai trung điểm nhưng số vẫn nhỏ (PQ ≤ 16)
    if (level === "advanced" && Math.random() < 0.5) {
      var half = rand(4, 8); // MQ
      var pq = half * 2; // 8–16
      var mn = half / 2; // 2–4, luôn chẵn half
      if (half % 2 !== 0) half = pick([4, 6, 8]);
      pq = half * 2;
      mn = half / 2;
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text:
          "PQ = " +
          pq +
          " cm. M trung điểm PQ, N trung điểm MQ. Độ dài MN là:",
        type: "mc",
        options: numMc(mn, 3),
        answer: mn,
        explainSteps: [
          "M giữa P và Q → MQ = một nửa PQ = " + half + " cm (vì " + half + " + " + half + " = " + pq + ").",
          "N giữa M và Q → MN = một nửa MQ = " + mn + " cm (vì " + mn + " + " + mn + " = " + half + ").",
        ],
        explainTip: "Trung điểm = chia đôi đoạn (một nửa + một nửa).",
      });
    }

    // Cơ bản: cho AM tìm AB hoặc cho AB tìm AM
    if (Math.random() < 0.4) {
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text:
          "M là trung điểm AB. AM = " +
          am +
          " cm. Độ dài AB là:",
        type: "mc",
        options: numMc(len, 4),
        answer: len,
        explainSteps: [
          "Trung điểm → AM = MB.",
          "AB = AM + MB = " + am + " + " + am + " = " + len + " cm.",
        ],
        explainTip: "Biết một nửa → đoạn cả = cộng hai nửa (hoặc × 2).",
      });
    }

    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text:
        "Đoạn thẳng AB dài " +
        len +
        " cm. M là trung điểm. Độ dài AM là:",
      type: "mc",
      options: numMc(am, 3),
      answer: am,
      explainSteps: [
        "Trung điểm chia đoạn thẳng thành 2 phần bằng nhau.",
        "AM = MB và AM + MB = " + len + " → AM = " + am + " cm (vì " + am + " + " + am + " = " + len + ").",
      ],
      explainTip: "Tìm một nửa: nghĩ số nào cộng với chính nó ra độ dài cả đoạn.",
    });
  }

  function genHinhTron(week, level) {
    // Tuần 8 (và trước T10/T11): chưa học nhân/chia số có 2 chữ số.
    // Chỉ dùng bảng nhân/chia 2: bán kính 2–9 → đường kính 4–18.
    // Từ tuần 10 trở đi mới cho số lớn hơn (ôn / nâng cao).
    var early = !week || week < 10;
    if (Math.random() < 0.5) {
      var r = early
        ? rand(2, 9)
        : level === "advanced"
          ? rand(5, 18)
          : rand(3, 12);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Hình tròn bán kính " + r + " cm. Đường kính bằng:",
        type: "mc",
        options: numMc(r * 2, early ? 4 : 6),
        answer: r * 2,
        explainSteps: [
          "Đường kính = 2 × bán kính.",
          "2 × " + r + " = " + r * 2 + " cm" + (early ? " (bảng nhân 2)." : "."),
        ],
        explainTip: "d = 2 × r · r = d : 2. Tuần 8 chỉ cần bảng nhân/chia 2.",
      });
    }
    var d = early
      ? pick([4, 6, 8, 10, 12, 14, 16, 18])
      : level === "advanced"
        ? pick([8, 10, 12, 14, 16, 18, 20, 24, 30])
        : pick([6, 8, 10, 12, 14, 16, 18, 20]);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Hình tròn đường kính " + d + " cm. Bán kính bằng:",
      type: "mc",
      options: numMc(d / 2, early ? 3 : 4),
      answer: d / 2,
      explainSteps: [
        "Bán kính = đường kính : 2.",
        d + " : 2 = " + d / 2 + " cm" + (early ? " (bảng chia 2)." : "."),
      ],
      explainTip: "r = d : 2. Tuần 8 chỉ cần bảng chia 2.",
    });
  }

  function genGoc(week, level) {
    if (level === "advanced" && Math.random() < 0.5) {
      var deg = pick([30, 45, 60, 90, 120, 150]);
      var cmp = deg > 90 ? "lớn hơn" : deg < 90 ? "bé hơn" : "bằng";
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Góc " + deg + "° so với góc vuông thì thế nào?",
        type: "mc",
        options: ["lớn hơn", "bé hơn", "bằng", "không so sánh được"],
        answer: cmp,
        explain: deg + "° " + cmp + " 90° (góc vuông).",
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Góc vuông có số đo bằng bao nhiêu độ?",
      type: "mc",
      options: ["45", "60", "90", "180"],
      answer: "90",
      explainSteps: ["Góc vuông có số đo 90°.", "Dấu góc vuông là hình vuông nhỏ ở đỉnh góc."],
    });
  }

  function genHinhPhangKhoi(week, level) {
    // Tuần 4 & 9: nhận biết hình phẳng / khối (KNTT).
    // CẤM dạng "HCN dài 24, gấp 2 lần rộng → 24:2" trước khi học:
    //   T10 gấp lần / nhân 2 chữ số, T11 chia 2 chữ số.
    // week < 11: không gấp-ngược, không chia tìm cạnh.
    // week < 10: không dùng từ "gấp … lần" (chưa học bài đó).
    var beforeGapLan = !week || week < 10; // trước T10
    var beforeChia2 = !week || week < 11; // trước T11
    var bank = [
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Hình tam giác có bao nhiêu cạnh và đỉnh?",
          type: "mc",
          options: ["3 cạnh, 3 đỉnh", "4 cạnh, 4 đỉnh", "3 cạnh, 4 đỉnh", "4 cạnh, 3 đỉnh"],
          answer: "3 cạnh, 3 đỉnh",
          explain: "Tam giác: 3 cạnh, 3 đỉnh.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Hình tứ giác có bao nhiêu cạnh?",
          type: "mc",
          options: ["3", "4", "5", "6"],
          answer: "4",
          explain: "Tứ giác: 4 cạnh, 4 đỉnh.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Hình chữ nhật có bao nhiêu góc vuông?",
          type: "mc",
          options: ["2", "3", "4", "5"],
          answer: "4",
          explain: "Hình chữ nhật có 4 góc vuông.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Hình vuông khác hình chữ nhật ở điểm nào?",
          type: "mc",
          options: [
            "Hình vuông có 4 cạnh bằng nhau",
            "Hình vuông có 3 góc vuông",
            "Hình vuông có 3 cạnh",
            "Hình chữ nhật không có góc vuông",
          ],
          answer: "Hình vuông có 4 cạnh bằng nhau",
          explainSteps: [
            "Cả hai đều có 4 góc vuông.",
            "Hình vuông: 4 cạnh bằng nhau. Hình chữ nhật: chiều dài và chiều rộng có thể khác nhau.",
          ],
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Khối lập phương có bao nhiêu đỉnh?",
          type: "mc",
          options: numMc(8, 3),
          answer: 8,
          explain: "Lập phương: 8 đỉnh, 12 cạnh, 6 mặt vuông.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Khối lập phương có bao nhiêu cạnh?",
          type: "mc",
          options: ["6", "8", "12", "4"],
          answer: "12",
          explain: "Lập phương: 12 cạnh bằng nhau, 8 đỉnh, 6 mặt vuông.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Các mặt của khối hộp chữ nhật là hình gì?",
          type: "mc",
          options: ["Hình chữ nhật", "Hình tròn", "Hình tam giác", "Hình thoi"],
          answer: "Hình chữ nhật",
          explain: "6 mặt đều là hình chữ nhật.",
        });
      },
      function () {
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text: "Mỗi khối lập phương có mấy mặt? Mỗi mặt là hình gì?",
          type: "mc",
          options: [
            "6 mặt hình vuông",
            "4 mặt hình vuông",
            "6 mặt hình tròn",
            "8 mặt hình chữ nhật",
          ],
          answer: "6 mặt hình vuông",
          explain: "Lập phương: 6 mặt vuông bằng nhau.",
        });
      },
      // Luôn an toàn: cho sẵn dài + rộng, chỉ cộng (không chia, không gấp ngược)
      function () {
        var L = rand(5, 12);
        var w = rand(2, Math.min(9, L - 1));
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "HCN dài " +
            L +
            " cm, rộng " +
            w +
            " cm. Tổng dài + rộng là:",
          type: "mc",
          options: numMc(L + w, 4),
          answer: L + w,
          explainSteps: [
            "Đề đã cho cả chiều dài và chiều rộng.",
            "Tổng = " + L + " + " + w + " = " + (L + w) + " cm.",
          ],
          explainTip: "Chỉ cộng hai số đã biết — không cần chia.",
        });
      },
    ];

    // T10+: gấp lần theo chiều thuận (rộng → dài = nhân bảng)
    if (!beforeGapLan) {
      bank.push(function () {
        var w = rand(2, 9);
        var k = pick([2, 3, 4, 5]);
        var L = w * k;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "HCN rộng " +
            w +
            " cm, dài gấp " +
            k +
            " lần rộng. Chiều dài là:",
          type: "mc",
          options: numMc(L, 5),
          answer: L,
          explainSteps: [
            "Dài gấp " + k + " lần rộng → nhân (bảng nhân " + k + ").",
            "Dài = " + w + " × " + k + " = " + L + " cm.",
          ],
          explainTip: "Gấp n lần = nhân với n.",
        });
      });
    }

    // T11+: mới được chia để tìm rộng (gấp ngược)
    if (!beforeChia2) {
      bank.push(function () {
        var w = level === "advanced" ? rand(4, 12) : rand(3, 9);
        var k = pick([2, 3, 4, 5]);
        var L = w * k;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "HCN dài " +
            L +
            " cm, dài gấp " +
            k +
            " lần rộng. Tổng dài + rộng là:",
          type: level === "advanced" ? "input" : "mc",
          options: numMc(L + w, 6),
          answer: L + w,
          explainSteps: [
            "Rộng = " + L + " : " + k + " = " + w + " cm.",
            "Tổng = " + L + " + " + w + " = " + (L + w) + " cm.",
          ],
        });
      });
    }

    return pick(bank)();
  }

  function genNhan2ChuSo(week, level) {
    var a = rand(12, 48);
    var b = level === "advanced" ? rand(3, 8) : rand(2, 5);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Nhân: " + a + " × " + b + " = ?",
      type: level === "advanced" ? "input" : "mc",
      options: numMc(a * b, 15),
      answer: a * b,
      explainSteps: [
        "Nhân số có hai chữ số với số có một chữ số.",
        a + " × " + b + " = " + a * b + ".",
      ],
    });
  }

  function genChia2ChuSo(week, level) {
    var b = level === "advanced" ? rand(3, 8) : rand(2, 6);
    var qv = rand(11, 35);
    var a = b * qv;
    if (level === "advanced" && Math.random() < 0.4) {
      var r = rand(1, b - 1);
      a = b * qv + r;
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Chia " + a + " : " + b + ". Thương là? (không hỏi số dư)",
        type: "input",
        answer: qv,
        explainSteps: [
          a + " = " + b + " × " + qv + " + " + r + ".",
          "Thương = " + qv + ", số dư = " + r + ".",
        ],
        explainTip: "Chia có dư: số bị chia = số chia × thương + dư (dư < số chia).",
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: a + " : " + b + " = ?",
      type: "mc",
      options: numMc(qv, 6),
      answer: qv,
      explain: a + " : " + b + " = " + qv,
    });
  }

  function genGapLan(week, level) {
    var n = rand(4, 15);
    var k = pick([2, 3, 4, 5, 6, 7, 8, 9]);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Gấp " + n + " lên " + k + " lần được:",
      type: "mc",
      options: numMc(n * k, 12),
      answer: n * k,
      explainSteps: [
        "Gấp lên " + k + " lần = nhân với " + k + ".",
        n + " × " + k + " = " + n * k + ".",
      ],
      explainTip: "Gấp k lần → × k.",
    });
  }

  function genGiamLan(week, level) {
    var k = pick([2, 3, 4, 5, 6, 7, 8, 9]);
    var result = rand(3, 15);
    var n = result * k;
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Giảm " + n + " đi " + k + " lần được:",
      type: "mc",
      options: numMc(result, 6),
      answer: result,
      explainSteps: [
        "Giảm đi " + k + " lần = chia cho " + k + ".",
        n + " : " + k + " = " + result + ".",
      ],
      explainTip: "Giảm k lần → : k.",
    });
  }

  function genHaiBuoc(week, level) {
    var a = rand(20, 50);
    var b = rand(10, 30);
    var c = rand(2, 5);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text:
        "Có " +
        a +
        " cái kẹo đỏ và " +
        b +
        " cái kẹo xanh. " +
        c +
        " hộp như vậy có tất cả bao nhiêu cái kẹo?",
      type: "input",
      answer: (a + b) * c,
      explainSteps: [
        "Bước 1: Mỗi hộp có " + a + " + " + b + " = " + (a + b) + " cái.",
        "Bước 2: " + c + " hộp: " + (a + b) + " × " + c + " = " + (a + b) * c + " cái.",
      ],
      explainTip: "Bài 2 bước: tính mỗi phần trước, rồi nhân/cộng tiếp.",
    });
  }

  function genMmGam(week, level) {
    if (Math.random() < 0.5) {
      var cm = rand(2, 15);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: cm + " cm = ? mm",
        type: "mc",
        options: numMc(cm * 10, 20),
        answer: cm * 10,
        explainSteps: ["1 cm = 10 mm.", cm + " cm = " + cm + " × 10 = " + cm * 10 + " mm."],
        explainTip: "1 cm = 10 mm · 1 m = 100 cm.",
      });
    }
    var kg = rand(1, 5);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: kg + " kg = ? g",
      type: "mc",
      options: numMc(kg * 1000, 500),
      answer: kg * 1000,
      explainSteps: ["1 kg = 1000 g.", kg + " kg = " + kg * 1000 + " g."],
    });
  }

  function genMlNhiet(week, level) {
    if (Math.random() < 0.5) {
      var l = rand(1, 5);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: l + " l = ? ml",
        type: "mc",
        options: numMc(l * 1000, 500),
        answer: l * 1000,
        explainSteps: ["1 l = 1000 ml.", l + " l = " + l * 1000 + " ml."],
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Nhiệt độ nước sôi (ở điều kiện thường) khoảng bao nhiêu °C?",
      type: "mc",
      options: ["0", "37", "100", "1000"],
      answer: "100",
      explain: "Nước sôi khoảng 100°C; nước đóng băng 0°C.",
    });
  }

  function genNhan3ChuSo(week, level) {
    var a = rand(102, 350);
    var b = level === "advanced" ? rand(3, 7) : rand(2, 5);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: a + " × " + b + " = ?",
      type: "input",
      answer: a * b,
      explain: a + " × " + b + " = " + a * b,
    });
  }

  function genChia3ChuSo(week, level) {
    var b = level === "advanced" ? rand(3, 8) : rand(2, 6);
    var qv = rand(25, 120);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: b * qv + " : " + b + " = ?",
      type: "input",
      answer: qv,
      explain: b * qv + " : " + b + " = " + qv,
    });
  }

  function genBieuThuc(week, level) {
    var a = rand(10, 40);
    var b = rand(2, 9);
    var c = rand(2, 9);
    // a + b * c  or (a+b)*c
    if (Math.random() < 0.5) {
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Tính: " + a + " + " + b + " × " + c + " = ?",
        type: "input",
        answer: a + b * c,
        explainSteps: [
          "Nhân trước: " + b + " × " + c + " = " + b * c + ".",
          "Cộng: " + a + " + " + b * c + " = " + (a + b * c) + ".",
        ],
        explainTip: "Không có ngoặc: nhân/chia trước, cộng/trừ sau.",
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Tính: (" + a + " + " + b + ") × " + c + " = ?",
      type: "input",
      answer: (a + b) * c,
      explainSteps: [
        "Trong ngoặc trước: " + a + " + " + b + " = " + (a + b) + ".",
        "Nhân: " + (a + b) + " × " + c + " = " + (a + b) * c + ".",
      ],
    });
  }

  function genGapMayLan(week, level) {
    var small = rand(4, 15);
    var k = pick([2, 3, 4, 5, 6]);
    var big = small * k;
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: big + " gấp mấy lần " + small + "?",
      type: "mc",
      options: numMc(k, 3),
      answer: k,
      explainSteps: [
        "Số lần = số lớn : số bé.",
        big + " : " + small + " = " + k + " lần.",
      ],
      explainTip: "Gấp mấy lần = chia số lớn cho số bé.",
    });
  }

  function genSo10000(week, level) {
    var a = rand(1000, 9999);
    var b = rand(1000, 9999);
    if (a === b) b += 10;
    var ans = a > b ? ">" : "<";
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "So sánh: " + a.toLocaleString("vi-VN") + "  ___  " + b.toLocaleString("vi-VN"),
      type: "mc",
      options: [">", "<", "="],
      answer: ans,
      explain: a + " " + ans + " " + b,
    });
  }

  function genLaMa(week, level) {
    var map = [
      [1, "I"],
      [2, "II"],
      [3, "III"],
      [4, "IV"],
      [5, "V"],
      [6, "VI"],
      [7, "VII"],
      [8, "VIII"],
      [9, "IX"],
      [10, "X"],
      [11, "XI"],
      [12, "XII"],
      [20, "XX"],
      [21, "XXI"],
    ];
    var pair = pick(map);
    if (Math.random() < 0.5) {
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Chữ số La Mã " + pair[1] + " bằng số nào?",
        type: "mc",
        options: numMc(pair[0], 4),
        answer: pair[0],
        explain: pair[1] + " = " + pair[0],
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Số " + pair[0] + " viết bằng chữ số La Mã là:",
      type: "mc",
      options: shuffle([pair[1], "I", "V", "X", "XII", "IV"]).filter(function (v, i, a) {
        return a.indexOf(v) === i;
      }).slice(0, 4),
      answer: pair[1],
      explain: pair[0] + " = " + pair[1],
    });
  }

  function genLamTron(week, level) {
    if (week >= 27) {
      var n = rand(1500, 9500);
      var toThou = Math.round(n / 1000) * 1000;
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Làm tròn " + n + " đến hàng nghìn:",
        type: "mc",
        options: numMc(toThou, 1000),
        answer: toThou,
        explainSteps: [
          "Nhìn hàng trăm để làm tròn hàng nghìn.",
          n + " ≈ " + toThou + ".",
        ],
      });
    }
    var n2 = rand(15, 994);
    var toTen = Math.round(n2 / 10) * 10;
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Làm tròn " + n2 + " đến hàng chục:",
      type: "mc",
      options: numMc(toTen, 10),
      answer: toTen,
      explain: n2 + " làm tròn hàng chục = " + toTen,
    });
  }

  function genChuVi(week, level) {
    if (Math.random() < 0.4) {
      var c = rand(4, 15);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Hình vuông cạnh " + c + " cm. Chu vi là:",
        type: "mc",
        options: numMc(4 * c, 10),
        answer: 4 * c,
        explainSteps: [
          "Chu vi hình vuông = cạnh × 4.",
          c + " × 4 = " + 4 * c + " cm.",
        ],
      });
    }
    var d = rand(5, 20);
    var r = rand(3, 15);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "HCN dài " + d + " cm, rộng " + r + " cm. Chu vi là:",
      type: "mc",
      options: numMc(2 * (d + r), 12),
      answer: 2 * (d + r),
      explainSteps: [
        "Chu vi HCN = (dài + rộng) × 2.",
        "(" + d + " + " + r + ") × 2 = " + 2 * (d + r) + " cm.",
      ],
    });
  }

  function genDienTich(week, level) {
    if (Math.random() < 0.4) {
      var c = rand(4, 14);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: "Hình vuông cạnh " + c + " cm. Diện tích là (cm²):",
        type: "input",
        answer: c * c,
        explainSteps: [
          "Diện tích HV = cạnh × cạnh.",
          c + " × " + c + " = " + c * c + " cm².",
        ],
      });
    }
    var d = rand(5, 18);
    var r = rand(3, 14);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "HCN dài " + d + " cm, rộng " + r + " cm. Diện tích (cm²):",
      type: "input",
      answer: d * r,
      explainSteps: [
        "Diện tích HCN = dài × rộng.",
        d + " × " + r + " = " + d * r + " cm².",
      ],
      explainTip: "Đơn vị diện tích: cm² (xăng-ti-mét vuông).",
    });
  }

  function genCongTru10000(week, level) {
    var a = rand(2000, 8000);
    var b = rand(1000, 4000);
    if (Math.random() < 0.5) {
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: a + " + " + b + " = ?",
        type: "input",
        answer: a + b,
        explain: a + " + " + b + " = " + (a + b),
      });
    }
    if (a < b) {
      var t = a;
      a = b + rand(500, 2000);
      b = t;
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: a + " − " + b + " = ?",
      type: "input",
      answer: a - b,
      explain: a + " − " + b + " = " + (a - b),
    });
  }

  function genNhan4ChuSo(week, level) {
    var a = rand(1000, 3500);
    var b = level === "advanced" ? rand(3, 7) : rand(2, 5);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: a + " × " + b + " = ?",
      type: "input",
      answer: a * b,
      explain: a + " × " + b + " = " + a * b,
    });
  }

  function genChia4ChuSo(week, level) {
    var b = level === "advanced" ? rand(3, 8) : rand(2, 6);
    var qv = rand(200, 900);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: b * qv + " : " + b + " = ?",
      type: "input",
      answer: qv,
      explain: b * qv + " : " + b + " = " + qv,
    });
  }

  function genSo100000(week, level) {
    var a = rand(10000, 90000);
    var b = rand(10000, 90000);
    if (a === b) b += 100;
    var ans = a > b ? ">" : "<";
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text:
        "So sánh: " +
        a.toLocaleString("vi-VN") +
        "  ___  " +
        b.toLocaleString("vi-VN"),
      type: "mc",
      options: [">", "<", "="],
      answer: ans,
      explain: a + " " + ans + " " + b,
    });
  }

  function genCongTru100000(week, level) {
    var a = rand(20000, 70000);
    var b = rand(10000, 40000);
    if (Math.random() < 0.5) {
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: a + " + " + b + " = ?",
        type: "input",
        answer: a + b,
        explain: a + " + " + b + " = " + (a + b),
      });
    }
    if (a <= b) a = b + rand(5000, 20000);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: a + " − " + b + " = ?",
      type: "input",
      answer: a - b,
      explain: a + " − " + b + " = " + (a - b),
    });
  }

  function genDongHoThangNam(week, level) {
    if (Math.random() < 0.5) {
      var h = rand(1, 3);
      return q({
        topicId: tid(week),
        level: level,
        week: week,
        text: h + " giờ = ? phút",
        type: "mc",
        options: numMc(h * 60, 30),
        answer: h * 60,
        explain: "1 giờ = 60 phút → " + h + " giờ = " + h * 60 + " phút.",
      });
    }
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Một năm thường có bao nhiêu tháng?",
      type: "mc",
      options: ["10", "11", "12", "13"],
      answer: "12",
      explain: "Một năm có 12 tháng.",
    });
  }

  function genNhan5ChuSo(week, level) {
    var a = rand(10000, 25000);
    var b = level === "advanced" ? rand(3, 6) : rand(2, 4);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: a + " × " + b + " = ?",
      type: "input",
      answer: a * b,
      explain: a + " × " + b + " = " + a * b,
    });
  }

  function genChia5ChuSo(week, level) {
    var b = level === "advanced" ? rand(3, 7) : rand(2, 5);
    var qv = rand(2000, 8000);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: b * qv + " : " + b + " = ?",
      type: "input",
      answer: qv,
      explain: b * qv + " : " + b + " = " + qv,
    });
  }

  function genBangSoLieu(week, level) {
    var a = rand(5, 20);
    var b = rand(5, 20);
    var c = rand(5, 20);
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text:
        "Bảng điểm: An " +
        a +
        " điểm, Bình " +
        b +
        " điểm, Chi " +
        c +
        " điểm. Tổng điểm ba bạn là:",
      type: "mc",
      options: numMc(a + b + c, 10),
      answer: a + b + c,
      explain: a + " + " + b + " + " + c + " = " + (a + b + c),
    });
  }

  function genXacSuat(week, level) {
    return q({
      topicId: tid(week),
      level: level,
      week: week,
      text: "Tung một đồng xu công bằng. Khả năng ra mặt sấp là:",
      type: "mc",
      options: ["Chắc chắn xảy ra", "Không thể xảy ra", "Có thể xảy ra", "Luôn ra ngửa"],
      answer: "Có thể xảy ra",
      explainSteps: [
        "Đồng xu có 2 mặt: sấp hoặc ngửa.",
        "Ra sấp là việc có thể xảy ra (không chắc chắn 100%).",
      ],
    });
  }

  /**
   * Map tuần → danh sách skill (khớp dàn ý MathX/KNTT)
   * Mỗi phần tử là function(week, level)
   */
  function skillsForWeek(week, level) {
    var map = {
      1: [genSoDen1000, genCongTru1000],
      2: [genThanhPhanCongTru, function (w, l) { return genBangNhanChia(w, l, [2, 5]); }],
      3: [function (w, l) { return genBangNhanChia(w, l, [3, 4]); }],
      4: [genHinhPhangKhoi, genTrungDiem, function (w, l) { return genBangNhanChia(w, l, [6]); }],
      5: [function (w, l) { return genBangNhanChia(w, l, [7, 8]); }],
      6: [
        function (w, l) { return genBangNhanChia(w, l, [9]); },
        function (w, l) { return genBangNhanChia(w, l, [9]); },
      ],
      7: [genMotPhanMay, genTrungDiem],
      8: [genHinhTron, genGoc],
      9: [genHinhPhangKhoi],
      10: [genNhan2ChuSo, genGapLan],
      11: [genChia2ChuSo],
      12: [genGiamLan, genHaiBuoc],
      13: [genMmGam],
      14: [genMlNhiet],
      15: [genNhan3ChuSo, genChia3ChuSo],
      16: [genBieuThuc, genGapMayLan],
      17: [
        function (w, l) { return genBangNhanChia(w, l, [2, 3, 4, 5, 6, 7, 8, 9]); },
        genBieuThuc,
        genNhan3ChuSo,
        genChia3ChuSo,
      ],
      18: [genHinhPhangKhoi, genChuVi, genTrungDiem, genGoc, genHinhTron, genMmGam],
      19: [genSo10000],
      20: [genLaMa, genLamTron],
      21: [genChuVi, genDienTich],
      22: [genDienTich],
      23: [genCongTru10000],
      24: [genNhan4ChuSo],
      25: [genChia4ChuSo],
      26: [genSo100000],
      27: [genSo100000, genLamTron],
      28: [genCongTru100000],
      29: [genDongHoThangNam],
      30: level === "advanced" ? [genH_adv] : [genH_basic],
      31: [genNhan5ChuSo],
      32: [genChia5ChuSo],
      33: [genBangSoLieu, genXacSuat, genSo100000, genSo10000],
      34: [genCongTru100000, genNhan5ChuSo, genChia5ChuSo, genNhan4ChuSo, genChia4ChuSo],
      35: [genHinhPhangKhoi, genChuVi, genDienTich, genBangSoLieu, genXacSuat, genMmGam],
    };
    return map[week] || [genSoDen1000, genCongTru1000];
  }

  /** Chọn generator theo đúng chủ đề tuần */
  function generateMathXQuestion(week, level) {
    week = Number(week) || 0;
    if (week < 1 || week > 35) week = rand(1, 35);
    level = level === "advanced" ? "advanced" : "basic";

    var skills = skillsForWeek(week, level);
    // genH_basic expects (week, level) — ok
    var fn = pick(skills);
    var item;
    try {
      item = fn(week, level);
    } catch (e) {
      item = genSoDen1000(week, level);
    }

    // Nâng cao: đôi khi thêm bước từ genA_adv kiểu quan hệ số hạng khi tuần 1-2
    if (level === "advanced" && (week === 1 || week === 2) && Math.random() < 0.35) {
      try {
        item = genA_adv(week, level);
      } catch (e2) {
        /* keep item */
      }
    }

    item.week = week;
    item.level = level;
    item.topicId = tid(week);
    if (!item.explainSteps && item.explain && String(item.explain).indexOf("\n") >= 0) {
      item.explainSteps = String(item.explain)
        .split(/\n+/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean);
    }
    return item;
  }

  /**
   * Phạm vi tuần theo từng mục MathX
   * - mathx-t1 … mathx-t34: đúng 1 tuần
   * - 4 kỳ thi (tách riêng, không gộp):
   *   gk1 ≈ T1–9 | ck1 ≈ T1–18 | gk2 ≈ T19–27 | ck2 ≈ T19–34
   */
  var EXAM_WEEKS = {
    // Đúng vị trí dàn ý MathX
    "mathx-gk1": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "mathx-ck1": [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ],
    "mathx-gk2": [19, 20, 21, 22, 23, 24, 25, 26, 27],
    "mathx-ck2": [
      19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    ],
  };

  function weekFromTopicId(topicId) {
    var m = /^mathx-t(\d+)$/.exec(topicId || "");
    if (m) {
      var w = parseInt(m[1], 10);
      if (w >= 1 && w <= 35) return w;
    }
    return 0;
  }

  function generateMathXByTopicId(topicId, level) {
    var w = weekFromTopicId(topicId);
    if (w) {
      var item = generateMathXQuestion(w, level);
      item.topicId = topicId;
      return item;
    }
    // 4 kỳ thi — trộn trong phạm vi tuần của kỳ (không gộp 4 kỳ lại)
    var examWeeks = EXAM_WEEKS[topicId];
    if (examWeeks && examWeeks.length) {
      var ew = pick(examWeeks);
      var qe = generateMathXQuestion(ew, level);
      qe.topicId = topicId;
      qe.exam = topicId;
      // Ưu tiên bài có lời giải từng bước trong đề kiểm tra (nâng cao hơn chút khi NC)
      return qe;
    }
    // fallback
    var fb = generateMathXQuestion(rand(1, 34), level);
    fb.topicId = topicId || "mathx-t1";
    return fb;
  }

  global.MathXQuestions = {
    generateMathXQuestion: generateMathXQuestion,
    generateMathXByTopicId: generateMathXByTopicId,
    MAX_WEEK: 35,
    EXAM_WEEKS: EXAM_WEEKS,
  };
})(typeof window !== "undefined" ? window : globalThis);
