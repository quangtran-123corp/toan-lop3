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
        var w = rand(4, 12);
        var k = pick([2, 3, 4]);
        var L = w * k;
        return q({
          topicId: tid(week),
          level: level,
          week: week,
          text:
            "Hình chữ nhật dài " +
            L +
            " cm, dài gấp " +
            k +
            " lần rộng. Tổng chiều dài và chiều rộng là:",
          type: "input",
          answer: L + w,
          explainSteps: [
            "Chiều rộng = chiều dài : " + k + " = " + L + " : " + k + " = " + w + " cm.",
            "Tổng = " + L + " + " + w + " = " + (L + w) + " cm.",
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

  /** Chọn generator theo tuần */
  function generateMathXQuestion(week, level) {
    week = Number(week) || 0;
    if (week < 1 || week > 34) week = rand(1, 34);
    var isAdv = level === "advanced";
    var item;

    if (week <= 5) item = isAdv ? genA_adv(week, level) : genA_basic(week, level);
    else if (week <= 8) item = isAdv ? genB_adv(week, level) : genB_basic(week, level);
    else if (week <= 11) item = isAdv ? genC_adv(week, level) : genC_basic(week, level);
    else if (week <= 14) item = isAdv ? genD_adv(week, level) : genD_basic(week, level);
    else if (week <= 18) item = isAdv ? genE_adv(week, level) : genE_basic(week, level);
    else if (week <= 23) item = isAdv ? genF_adv(week, level) : genF_basic(week, level);
    else if (week <= 27) item = isAdv ? genF_adv(week, level) : genG_basic(week, level);
    else if (week <= 31) item = isAdv ? genH_adv(week, level) : genH_basic(week, level);
    else item = isAdv ? genI_adv(week, level) : genI_basic(week, level);

    item.week = week;
    item.level = level;
    if (!item.topicId || item.topicId.indexOf("mathx") !== 0) {
      item.topicId = tid(week);
    }
    // Fallback explainSteps từ explain nhiều dòng
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

  var TOPIC_WEEKS = {
    "mathx-t1": [1],
    "mathx-t2": [2],
    "mathx-t3": [3],
    "mathx-t4": [4],
    "mathx-t5": [5],
    "mathx-g1": [1, 2, 3, 4, 5, 6, 7, 8],
    "mathx-g2": [9, 10, 11, 12, 13, 14],
    "mathx-g3": [15, 16, 17, 18],
    "mathx-g4": [19, 20, 21, 22, 23, 24, 25, 26, 27],
    "mathx-g5": [28, 29, 30, 31, 32, 33, 34],
    "mathx-hk1": null, // 1-18
    "mathx-hk2": null, // 19-34
    "mathx-hon-hop": null, // 1-34
  };

  function generateMathXByTopicId(topicId, level) {
    var weeks = TOPIC_WEEKS[topicId];
    var w;
    if (topicId === "mathx-hk1") w = rand(1, 18);
    else if (topicId === "mathx-hk2") w = rand(19, 34);
    else if (topicId === "mathx-hon-hop" || !weeks) w = rand(1, 34);
    else if (weeks.length === 1) w = weeks[0];
    else w = pick(weeks);
    var item = generateMathXQuestion(w, level);
    item.topicId = topicId;
    return item;
  }

  global.MathXQuestions = {
    generateMathXQuestion: generateMathXQuestion,
    generateMathXByTopicId: generateMathXByTopicId,
    MAX_WEEK: 34,
  };
})(typeof window !== "undefined" ? window : globalThis);
