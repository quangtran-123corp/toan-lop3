/**
 * Sinh cau hoi Toan Lop 3 — Co ban & Nang cao
 * Bam dinh huong SGK Ket noi tri thuc voi cuoc song
 */

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
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

function mc(answer, distractors, count) {
  count = count || 4;
  var opts = {};
  opts[String(answer)] = true;
  var list = [String(answer)];
  for (var i = 0; i < distractors.length; i++) {
    if (list.length >= count) break;
    var d = String(distractors[i]);
    if (!opts[d]) {
      opts[d] = true;
      list.push(d);
    }
  }
  while (list.length < count) {
    var n = Number(answer);
    var v;
    if (!isNaN(n)) {
      v = String(n + rand(-15, 15) || n + 1);
    } else {
      v = String(answer) + "?";
    }
    if (!opts[v]) {
      opts[v] = true;
      list.push(v);
    }
  }
  return shuffle(list);
}

function numMc(answer, spread) {
  spread = spread || 10;
  var a = Number(answer);
  var d = {};
  var dist = [];
  while (dist.length < 3) {
    var delta = rand(1, spread) * (Math.random() < 0.5 ? 1 : -1);
    var v = a + delta;
    if (v !== a && v >= 0 && !d[v]) {
      d[v] = true;
      dist.push(v);
    }
  }
  return mc(a, dist);
}

function q(partial) {
  return {
    type: partial.type || "mc",
    topicId: partial.topicId,
    level: partial.level,
    text: partial.text,
    visual: partial.visual || null,
    /** Hiện sau khi bé chọn đáp án (vd: tô vàng đáp án đúng) */
    visualAfter: partial.visualAfter || null,
    options: partial.options || null,
    answer: String(partial.answer),
    explain: partial.explain || "",
    explainSteps: partial.explainSteps || null,
    explainTip: partial.explainTip || null,
  };
}

function genOnTapSo(level) {
  if (level === "basic") {
    var mode = pick(["compare", "place", "round", "order", "write"]);
    if (mode === "compare") {
      var a = rand(100, 999);
      var b = rand(100, 999);
      if (a === b) b += 1;
      var ans = a > b ? ">" : a < b ? "<" : "=";
      return q({
        topicId: "on-tap-so",
        level: level,
        text: "So sánh: " + a + "  ___  " + b,
        type: "mc",
        options: [">", "<", "="],
        answer: ans,
        explain: a + " " + ans + " " + b,
      });
    }
    if (mode === "place") {
      var n = rand(100, 999);
      var hundreds = Math.floor(n / 100);
      var tens = Math.floor((n % 100) / 10);
      var ones = n % 10;
      var which = pick(["hundreds", "tens", "ones"]);
      var label, ansP;
      if (which === "hundreds") {
        label = "chữ số hàng trăm";
        ansP = hundreds;
      } else if (which === "tens") {
        label = "chữ số hàng chục";
        ansP = tens;
      } else {
        label = "chữ số hàng đơn vị";
        ansP = ones;
      }
      return q({
        topicId: "on-tap-so",
        level: level,
        text: "Số " + n + ": " + label + " là bao nhiêu?",
        type: "mc",
        options: numMc(ansP, 5),
        answer: ansP,
        explain: n + " = " + hundreds + " trăm " + tens + " chục " + ones + " đơn vị.",
      });
    }
    if (mode === "round") {
      var nr = rand(15, 95);
      var ansR = Math.round(nr / 10) * 10;
      return q({
        topicId: "on-tap-so",
        level: level,
        text: "Làm tròn số " + nr + " đến hàng chục gần nhất:",
        type: "mc",
        options: numMc(ansR, 10),
        answer: ansR,
        explain: nr + " làm tròn đến hàng chục là " + ansR + ".",
      });
    }
    if (mode === "order") {
      var oa = rand(100, 400);
      var ob = oa + rand(10, 80);
      var oc = ob + rand(10, 80);
      var nums = shuffle([oa, ob, oc]);
      var ordered = oa + " < " + ob + " < " + oc;
      return q({
        topicId: "on-tap-so",
        level: level,
        text: "Sắp xếp tăng dần: " + nums.join(", "),
        type: "mc",
        options: shuffle([
          ordered,
          oc + " < " + ob + " < " + oa,
          oa + " < " + oc + " < " + ob,
          ob + " < " + oa + " < " + oc,
        ]),
        answer: ordered,
        explain: "Thứ tự tăng dần: " + ordered,
      });
    }
    var h = rand(1, 9);
    var t = rand(0, 9);
    var o = rand(0, 9);
    var ansW = h * 100 + t * 10 + o;
    return q({
      topicId: "on-tap-so",
      level: level,
      text: h + " trăm " + t + " chục " + o + " đơn vị = ?",
      type: "mc",
      options: numMc(ansW, 50),
      answer: ansW,
      explain: h + "×100 + " + t + "×10 + " + o + " = " + ansW,
    });
  }

  var modeA = pick(["compare4", "between", "round100", "value", "diff"]);
  if (modeA === "compare4") {
    var a4 = rand(1000, 9999);
    var b4 = rand(1000, 9999);
    if (a4 === b4) b4 += 10;
    var ans4 = a4 > b4 ? ">" : "<";
    return q({
      topicId: "on-tap-so",
      level: level,
      text: "So sánh: " + a4.toLocaleString("vi-VN") + "  ___  " + b4.toLocaleString("vi-VN"),
      type: "mc",
      options: [">", "<", "="],
      answer: ans4,
      explain: a4 + " " + ans4 + " " + b4,
    });
  }
  if (modeA === "between") {
    var ab = rand(200, 800);
    return q({
      topicId: "on-tap-so",
      level: level,
      text: "Số liền sau của " + ab + " là?",
      type: "input",
      answer: ab + 1,
      explain: ab + " + 1 = " + (ab + 1),
    });
  }
  if (modeA === "round100") {
    var n100 = rand(150, 950);
    var ans100 = Math.round(n100 / 100) * 100;
    return q({
      topicId: "on-tap-so",
      level: level,
      text: "Làm tròn " + n100 + " đến hàng trăm gần nhất:",
      type: "mc",
      options: numMc(ans100, 100),
      answer: ans100,
      explain: n100 + " ≈ " + ans100,
    });
  }
  if (modeA === "value") {
    var nv = rand(1000, 9999);
    var thou = Math.floor(nv / 1000);
    return q({
      topicId: "on-tap-so",
      level: level,
      text: "Trong số " + nv.toLocaleString("vi-VN") + ", chữ số hàng nghìn là?",
      type: "mc",
      options: numMc(thou, 4),
      answer: thou,
      explain: "Hàng nghìn của " + nv + " là " + thou + ".",
    });
  }
  var da = rand(300, 900);
  var db = rand(100, da - 50);
  return q({
    topicId: "on-tap-so",
    level: level,
    text: da + " nhiều hơn " + db + " bao nhiêu đơn vị?",
    type: "input",
    answer: da - db,
    explain: da + " − " + db + " = " + (da - db),
  });
}

function genCongTru(level) {
  if (level === "basic") {
    var mode = pick(["add", "sub", "add3", "missing"]);
    if (mode === "add") {
      var a = rand(100, 499);
      var b = rand(50, 400);
      var ans = a + b;
      return q({
        topicId: "cong-tru",
        level: level,
        text: a + " + " + b + " = ?",
        type: pick(["mc", "input"]),
        options: numMc(ans, 20),
        answer: ans,
        explain: a + " + " + b + " = " + ans,
      });
    }
    if (mode === "sub") {
      var sa = rand(200, 999);
      var sb = rand(50, Math.min(400, sa - 10));
      var sans = sa - sb;
      return q({
        topicId: "cong-tru",
        level: level,
        text: sa + " − " + sb + " = ?",
        type: pick(["mc", "input"]),
        options: numMc(sans, 20),
        answer: sans,
        explain: sa + " − " + sb + " = " + sans,
      });
    }
    if (mode === "add3") {
      var x = rand(20, 80);
      var y = rand(20, 80);
      var z = rand(10, 50);
      var sum3 = x + y + z;
      return q({
        topicId: "cong-tru",
        level: level,
        text: x + " + " + y + " + " + z + " = ?",
        type: "mc",
        options: numMc(sum3, 15),
        answer: sum3,
        explain: x + " + " + y + " + " + z + " = " + sum3,
      });
    }
    var ma = rand(100, 500);
    var mb = rand(50, 300);
    var msum = ma + mb;
    return q({
      topicId: "cong-tru",
      level: level,
      text: ma + " + ☐ = " + msum + ". Tìm số trong ô trống.",
      type: "mc",
      options: numMc(mb, 20),
      answer: mb,
      explain: msum + " − " + ma + " = " + mb,
    });
  }

  var modeA = pick(["add5", "sub5", "chain4", "findX", "word2step", "compare"]);
  if (modeA === "add5") {
    var a5 = rand(10000, 45000);
    var b5 = rand(10000, 45000);
    return q({
      topicId: "cong-tru",
      level: level,
      text: a5.toLocaleString("vi-VN") + " + " + b5.toLocaleString("vi-VN") + " = ?",
      type: "input",
      answer: a5 + b5,
      explain: a5 + " + " + b5 + " = " + (a5 + b5),
    });
  }
  if (modeA === "sub5") {
    var s5a = rand(30000, 90000);
    var s5b = rand(10000, s5a - 5000);
    return q({
      topicId: "cong-tru",
      level: level,
      text: s5a.toLocaleString("vi-VN") + " − " + s5b.toLocaleString("vi-VN") + " = ?",
      type: "input",
      answer: s5a - s5b,
      explain: s5a + " − " + s5b + " = " + (s5a - s5b),
    });
  }
  if (modeA === "chain4") {
    var ca = rand(1000, 5000);
    var cb = rand(500, 3000);
    var cc = rand(200, 2000);
    var cd = rand(100, 1500);
    var chainAns = ca + cb - cc + cd;
    return q({
      topicId: "cong-tru",
      level: level,
      text: ca.toLocaleString("vi-VN") + " + " + cb.toLocaleString("vi-VN") + " − " + cc.toLocaleString("vi-VN") + " + " + cd.toLocaleString("vi-VN") + " = ?",
      type: "input",
      answer: chainAns,
      explain: ca + " + " + cb + " − " + cc + " + " + cd + " = " + chainAns,
    });
  }
  if (modeA === "findX") {
    var fx1 = rand(2000, 8000);
    var fx2 = rand(1000, 5000);
    var fxSum = fx1 + fx2;
    var askPlus = Math.random() < 0.5;
    if (askPlus) {
      return q({
        topicId: "cong-tru",
        level: level,
        text: "☐ + " + fx1.toLocaleString("vi-VN") + " = " + fxSum.toLocaleString("vi-VN") + ". Tìm số trong ô trống.",
        type: "input",
        answer: fx2,
        explain: fxSum + " − " + fx1 + " = " + fx2,
      });
    }
    return q({
      topicId: "cong-tru",
      level: level,
      text: fxSum.toLocaleString("vi-VN") + " − ☐ = " + fx1.toLocaleString("vi-VN") + ". Tìm số trong ô trống.",
      type: "input",
      answer: fx2,
      explain: fxSum + " − " + fx1 + " = " + fx2,
    });
  }
  if (modeA === "word2step") {
    var w1 = rand(3000, 8000);
    var w2 = rand(1500, 4000);
    var w3 = rand(500, 2000);
    return q({
      topicId: "cong-tru",
      level: level,
      text:
        "Cửa hàng có " + w1.toLocaleString("vi-VN") + " kg gạo. Buổi sáng bán " +
        w2.toLocaleString("vi-VN") + " kg, buổi chiều nhập thêm " +
        w3.toLocaleString("vi-VN") + " kg. Hỏi cửa hàng còn bao nhiêu kg gạo?",
      type: "input",
      answer: w1 - w2 + w3,
      explain: w1 + " − " + w2 + " + " + w3 + " = " + (w1 - w2 + w3),
    });
  }
  // compare: so sánh biểu thức
  var cmpA = rand(2000, 5000);
  var cmpB = rand(1000, 3000);
  var cmpC = rand(2000, 5000);
  var cmpD = rand(1000, 3000);
  var left = cmpA + cmpB;
  var right = cmpC + cmpD;
  var cmpAns = left > right ? ">" : left < right ? "<" : "=";
  return q({
    topicId: "cong-tru",
    level: level,
    text: cmpA.toLocaleString("vi-VN") + " + " + cmpB.toLocaleString("vi-VN") + "  ___  " + cmpC.toLocaleString("vi-VN") + " + " + cmpD.toLocaleString("vi-VN"),
    type: "mc",
    options: [">", "<", "="],
    answer: cmpAns,
    explain: left + " " + cmpAns + " " + right,
  });
}

function genBangNhanChia(level) {
  if (level === "basic") {
    var n = rand(2, 9);
    var m = rand(2, 9);
    if (Math.random() < 0.55) {
      return q({
        topicId: "bang-nhan-chia",
        level: level,
        text: n + " × " + m + " = ?",
        type: "mc",
        options: numMc(n * m, 8),
        answer: n * m,
        explain: n + " × " + m + " = " + n * m,
      });
    }
    var product = n * m;
    return q({
      topicId: "bang-nhan-chia",
      level: level,
      text: product + " : " + n + " = ?",
      type: "mc",
      options: numMc(m, 5),
      answer: m,
      explain: product + " : " + n + " = " + m + " vì " + n + " × " + m + " = " + product,
    });
  }

  var mode = pick(["mixed", "chain3", "divRem", "gap", "wordMul", "compare"]);
  if (mode === "mixed") {
    var ma = rand(3, 9);
    var mb = rand(3, 9);
    var mc2 = rand(2, 8);
    var md = rand(2, 6);
    var mixAns = ma * mb + mc2 * md;
    return q({
      topicId: "bang-nhan-chia",
      level: level,
      text: ma + " × " + mb + " + " + mc2 + " × " + md + " = ?",
      type: "input",
      answer: mixAns,
      explain: ma + " × " + mb + " = " + (ma * mb) + "; " + mc2 + " × " + md + " = " + (mc2 * md) + "; tổng = " + mixAns,
    });
  }
  if (mode === "chain3") {
    var ca = rand(3, 9);
    var cb = rand(3, 9);
    var cc = rand(2, 5);
    return q({
      topicId: "bang-nhan-chia",
      level: level,
      text: ca + " × " + cb + " × " + cc + " = ?",
      type: "input",
      answer: ca * cb * cc,
      explain: ca + " × " + cb + " = " + (ca * cb) + ", rồi × " + cc + " = " + (ca * cb * cc),
    });
  }
  if (mode === "divRem") {
    var dv = rand(3, 9);
    var dq = rand(5, 9);
    var dr = rand(1, dv - 1);
    var dTotal = dv * dq + dr;
    return q({
      topicId: "bang-nhan-chia",
      level: level,
      text: dTotal + " chia cho " + dv + " được thương bao nhiêu, dư bao nhiêu? (nhập thương)",
      type: "input",
      answer: dq,
      explain: dTotal + " = " + dv + " × " + dq + " + " + dr + " → thương " + dq + " dư " + dr,
      explainTip: "Số dư là " + dr,
    });
  }
  if (mode === "gap") {
    var ga = rand(4, 9);
    var gb = rand(4, 9);
    var gProd = ga * gb;
    var gSub = rand(5, 20);
    return q({
      topicId: "bang-nhan-chia",
      level: level,
      text: ga + " × " + gb + " − " + gSub + " = ?",
      type: "input",
      answer: gProd - gSub,
      explain: ga + " × " + gb + " = " + gProd + "; " + gProd + " − " + gSub + " = " + (gProd - gSub),
    });
  }
  if (mode === "wordMul") {
    var wGap = rand(2, 5);
    var wSmall = rand(6, 15);
    var wBig = wSmall * wGap;
    return q({
      topicId: "bang-nhan-chia",
      level: level,
      text: "Anh có số bi gấp " + wGap + " lần em. Em có " + wSmall + " viên bi. Hỏi anh có bao nhiêu viên bi?",
      type: "input",
      answer: wBig,
      explain: wSmall + " × " + wGap + " = " + wBig,
    });
  }
  // compare: so sánh hai tích
  var cA = rand(3, 9);
  var cB = rand(3, 9);
  var cC = rand(3, 9);
  var cD = rand(3, 9);
  var cLeft = cA * cB;
  var cRight = cC * cD;
  var cAns = cLeft > cRight ? ">" : cLeft < cRight ? "<" : "=";
  return q({
    topicId: "bang-nhan-chia",
    level: level,
    text: cA + " × " + cB + "  ___  " + cC + " × " + cD,
    type: "mc",
    options: [">", "<", "="],
    answer: cAns,
    explain: (cA * cB) + " " + cAns + " " + (cC * cD),
  });
}

function genNhanChiaLon(level) {
  if (level === "basic") {
    if (Math.random() < 0.5) {
      var a = rand(12, 48);
      var b = rand(2, 5);
      return q({
        topicId: "nhan-chia-lon",
        level: level,
        text: a + " × " + b + " = ?",
        type: "mc",
        options: numMc(a * b, 15),
        answer: a * b,
        explain: a + " × " + b + " = " + a * b,
      });
    }
    var bb = rand(2, 6);
    var qv = rand(11, 35);
    var aa = bb * qv;
    return q({
      topicId: "nhan-chia-lon",
      level: level,
      text: aa + " : " + bb + " = ?",
      type: "mc",
      options: numMc(qv, 8),
      answer: qv,
      explain: aa + " : " + bb + " = " + qv,
    });
  }

  var mode = pick(["mul3dig", "div3dig", "mulAdd", "remain", "wordBig", "findDiv"]);
  if (mode === "mul3dig") {
    var m1 = rand(102, 498);
    var m2 = rand(3, 9);
    return q({
      topicId: "nhan-chia-lon",
      level: level,
      text: m1 + " × " + m2 + " = ?",
      type: "input",
      answer: m1 * m2,
      explain: m1 + " × " + m2 + " = " + (m1 * m2),
    });
  }
  if (mode === "div3dig") {
    var d2 = rand(3, 9);
    var dq = rand(50, 150);
    var d1 = d2 * dq;
    return q({
      topicId: "nhan-chia-lon",
      level: level,
      text: d1 + " : " + d2 + " = ?",
      type: "input",
      answer: dq,
      explain: d1 + " : " + d2 + " = " + dq,
    });
  }
  if (mode === "mulAdd") {
    var maA = rand(25, 99);
    var maB = rand(3, 7);
    var maC = rand(20, 80);
    var maD = rand(2, 6);
    var maAns = maA * maB + maC * maD;
    return q({
      topicId: "nhan-chia-lon",
      level: level,
      text: maA + " × " + maB + " + " + maC + " × " + maD + " = ?",
      type: "input",
      answer: maAns,
      explain: maA + " × " + maB + " = " + (maA * maB) + "; " + maC + " × " + maD + " = " + (maC * maD) + "; tổng = " + maAns,
    });
  }
  if (mode === "remain") {
    var rb = rand(4, 9);
    var rq = rand(30, 80);
    var rr = rand(1, rb - 1);
    var ra = rb * rq + rr;
    return q({
      topicId: "nhan-chia-lon",
      level: level,
      text: "Chia " + ra + " cho " + rb + ". Số dư là bao nhiêu?",
      type: "input",
      answer: rr,
      explain: ra + " = " + rb + " × " + rq + " + " + rr + " → dư " + rr,
    });
  }
  if (mode === "wordBig") {
    var boxes = rand(3, 8);
    var perBox = rand(24, 65);
    var extra = rand(12, 45);
    var wbAns = boxes * perBox + extra;
    return q({
      topicId: "nhan-chia-lon",
      level: level,
      text:
        "Kho có " + boxes + " thùng, mỗi thùng " + perBox +
        " quyển sách, ngoài ra còn " + extra +
        " quyển lẻ. Tất cả có bao nhiêu quyển sách?",
      type: "input",
      answer: wbAns,
      explain: boxes + " × " + perBox + " + " + extra + " = " + wbAns,
    });
  }
  // findDiv: tìm số bị chia
  var fdDiv = rand(4, 9);
  var fdQ = rand(30, 99);
  var fdN = fdDiv * fdQ;
  return q({
    topicId: "nhan-chia-lon",
    level: level,
    text: "Một số chia cho " + fdDiv + " được " + fdQ + ". Số đó là bao nhiêu?",
    type: "input",
    answer: fdN,
    explain: fdQ + " × " + fdDiv + " = " + fdN,
  });
}

/* ========== Hình minh họa SVG cho Hình học ========== */
function svgWrap(inner, w, h) {
  w = w || 280;
  h = h || 160;
  return (
    '<div class="geo-fig">' +
    '<svg viewBox="0 0 ' +
    w +
    " " +
    h +
    '" width="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="display:block;max-width:100%;height:auto;overflow:visible">' +
    '<rect width="' +
    w +
    '" height="' +
    h +
    '" fill="#F8FAFC" rx="12"/>' +
    inner +
    "</svg></div>"
  );
}

function geoDot(x, y, label, labelY) {
  labelY = labelY == null ? y + 16 : labelY;
  return (
    '<circle cx="' +
    x +
    '" cy="' +
    y +
    '" r="5" fill="#4F46E5"/>' +
    (label
      ? '<text x="' +
        x +
        '" y="' +
        labelY +
        '" text-anchor="middle" font-size="13" font-weight="800" fill="#1E1B4B" font-family="Nunito,sans-serif">' +
        label +
        "</text>"
      : "")
  );
}

function geoSegment(aLabel, bLabel, midLabel, lenLabel, halfLabel) {
  var y = 70;
  var x1 = 40;
  var x2 = 240;
  var xm = (x1 + x2) / 2;
  var mid =
    midLabel != null
      ? geoDot(xm, y, midLabel, y - 14) +
        '<line x1="' +
        xm +
        '" y1="' +
        (y - 8) +
        '" x2="' +
        xm +
        '" y2="' +
        (y + 8) +
        '" stroke="#EC4899" stroke-width="2"/>'
      : "";
  var lenTxt = lenLabel
    ? '<text x="' +
      xm +
      '" y="115" text-anchor="middle" font-size="14" font-weight="800" fill="#6366F1" font-family="Nunito,sans-serif">' +
      lenLabel +
      "</text>"
    : "";
  var halfTxt = halfLabel
    ? '<text x="' +
      (x1 + xm) / 2 +
      '" y="50" text-anchor="middle" font-size="12" font-weight="800" fill="#059669" font-family="Nunito,sans-serif">' +
      halfLabel +
      "</text>" +
      '<text x="' +
      (xm + x2) / 2 +
      '" y="50" text-anchor="middle" font-size="12" font-weight="800" fill="#059669" font-family="Nunito,sans-serif">' +
      halfLabel +
      "</text>"
    : "";
  return svgWrap(
    '<line x1="' +
      x1 +
      '" y1="' +
      y +
      '" x2="' +
      x2 +
      '" y2="' +
      y +
      '" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>' +
      geoDot(x1, y, aLabel) +
      geoDot(x2, y, bLabel) +
      mid +
      lenTxt +
      halfTxt,
    280,
    140
  );
}

function geoSquare(showRightAngles, sideLabel) {
  var s = 90;
  var x = 95;
  var y = 30;
  var marks = "";
  if (showRightAngles) {
    var corners = [
      [x, y],
      [x + s, y],
      [x + s, y + s],
      [x, y + s],
    ];
    // small right-angle marks
    marks =
      '<path d="M' +
      (x + 12) +
      " " +
      y +
      " V" +
      (y + 12) +
      " H" +
      x +
      '" fill="none" stroke="#F59E0B" stroke-width="2"/>' +
      '<path d="M' +
      (x + s - 12) +
      " " +
      y +
      " V" +
      (y + 12) +
      " H" +
      (x + s) +
      '" fill="none" stroke="#F59E0B" stroke-width="2"/>';
  }
  var lab = sideLabel
    ? '<text x="' +
      (x + s + 10) +
      '" y="' +
      (y + s / 2 + 4) +
      '" font-size="13" font-weight="800" fill="#7C3AED" font-family="Nunito,sans-serif">' +
      sideLabel +
      "</text>"
    : "";
  return svgWrap(
    '<rect x="' +
      x +
      '" y="' +
      y +
      '" width="' +
      s +
      '" height="' +
      s +
      '" fill="#EEF2FF" stroke="#4F46E5" stroke-width="3" rx="2"/>' +
      marks +
      lab +
      '<text x="140" y="145" text-anchor="middle" font-size="13" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">Hình vuông</text>',
    280,
    160
  );
}

function geoRect(showRightAngles, wLabel, hLabel) {
  var w = 140;
  var h = 80;
  var x = 70;
  var y = 35;
  var marks = showRightAngles
    ? '<path d="M' +
      (x + 12) +
      " " +
      y +
      " V" +
      (y + 12) +
      " H" +
      x +
      '" fill="none" stroke="#F59E0B" stroke-width="2"/>' +
      '<path d="M' +
      (x + w - 12) +
      " " +
      y +
      " V" +
      (y + 12) +
      " H" +
      (x + w) +
      '" fill="none" stroke="#F59E0B" stroke-width="2"/>' +
      '<path d="M' +
      (x + 12) +
      " " +
      (y + h) +
      " V" +
      (y + h - 12) +
      " H" +
      x +
      '" fill="none" stroke="#F59E0B" stroke-width="2"/>' +
      '<path d="M' +
      (x + w - 12) +
      " " +
      (y + h) +
      " V" +
      (y + h - 12) +
      " H" +
      (x + w) +
      '" fill="none" stroke="#F59E0B" stroke-width="2"/>'
    : "";
  var labs =
    (wLabel
      ? '<text x="' +
        (x + w / 2) +
        '" y="' +
        (y + h + 18) +
        '" text-anchor="middle" font-size="12" font-weight="800" fill="#7C3AED" font-family="Nunito,sans-serif">' +
        wLabel +
        "</text>"
      : "") +
    (hLabel
      ? '<text x="' +
        (x + w + 8) +
        '" y="' +
        (y + h / 2 + 4) +
        '" font-size="12" font-weight="800" fill="#7C3AED" font-family="Nunito,sans-serif">' +
        hLabel +
        "</text>"
      : "");
  return svgWrap(
    '<rect x="' +
      x +
      '" y="' +
      y +
      '" width="' +
      w +
      '" height="' +
      h +
      '" fill="#FDF4FF" stroke="#A855F7" stroke-width="3" rx="2"/>' +
      marks +
      labs +
      '<text x="140" y="150" text-anchor="middle" font-size="13" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">Hình chữ nhật</text>',
    280,
    165
  );
}

function geoTriangle() {
  return svgWrap(
    '<polygon points="140,25 50,130 230,130" fill="#ECFDF5" stroke="#059669" stroke-width="3"/>' +
      geoDot(140, 25, "A", 18) +
      geoDot(50, 130, "B", 148) +
      geoDot(230, 130, "C", 148) +
      '<text x="140" y="100" text-anchor="middle" font-size="13" font-weight="800" fill="#047857" font-family="Nunito,sans-serif">Hình tam giác</text>',
    280,
    165
  );
}

function geoCircle(showRadius, showDiameter, rLabel, dLabel) {
  // Nhãn kích thước đặt NGOÀI hình tròn — tránh che dấu = và chữ O
  var cx = 140;
  var cy = 70;
  var r = 48;
  var parts =
    '<circle cx="' +
    cx +
    '" cy="' +
    cy +
    '" r="' +
    r +
    '" fill="#EFF6FF" stroke="#2563EB" stroke-width="3"/>' +
    // Tâm
    '<circle cx="' +
    cx +
    '" cy="' +
    cy +
    '" r="5" fill="#DC2626"/>' +
    '<text x="' +
    (cx - 14) +
    '" y="' +
    (cy + 5) +
    '" text-anchor="end" font-size="14" font-weight="900" fill="#DC2626" font-family="Nunito,sans-serif">O</text>';

  if (showRadius) {
    var rx2 = cx + r;
    parts +=
      // Bán kính (đoạn đỏ)
      '<line x1="' +
      cx +
      '" y1="' +
      cy +
      '" x2="' +
      rx2 +
      '" y2="' +
      cy +
      '" stroke="#DC2626" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="' +
      rx2 +
      '" cy="' +
      cy +
      '" r="4" fill="#DC2626"/>' +
      // Mũi tên nhỏ
      '<polygon points="' +
      rx2 +
      "," +
      cy +
      " " +
      (rx2 - 8) +
      "," +
      (cy - 5) +
      " " +
      (rx2 - 8) +
      "," +
      (cy + 5) +
      '" fill="#DC2626"/>' +
      // Nhãn rõ ràng dưới hình — không đè lên đường kính
      '<rect x="70" y="128" width="140" height="28" rx="8" fill="#FEE2E2" stroke="#FECACA" stroke-width="1"/>' +
      '<text x="' +
      cx +
      '" y="147" text-anchor="middle" font-size="14" font-weight="900" fill="#B91C1C" font-family="Nunito,sans-serif">' +
      (rLabel || "ban kinh r") +
      "</text>";
  }
  if (showDiameter) {
    parts +=
      '<line x1="' +
      (cx - r) +
      '" y1="' +
      cy +
      '" x2="' +
      (cx + r) +
      '" y2="' +
      cy +
      '" stroke="#7C3AED" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="' +
      (cx - r) +
      '" cy="' +
      cy +
      '" r="5" fill="#7C3AED"/>' +
      '<circle cx="' +
      (cx + r) +
      '" cy="' +
      cy +
      '" r="5" fill="#7C3AED"/>' +
      '<text x="' +
      (cx - r) +
      '" y="' +
      (cy - 12) +
      '" text-anchor="middle" font-size="13" font-weight="900" fill="#6D28D9" font-family="Nunito,sans-serif">A</text>' +
      '<text x="' +
      (cx + r) +
      '" y="' +
      (cy - 12) +
      '" text-anchor="middle" font-size="13" font-weight="900" fill="#6D28D9" font-family="Nunito,sans-serif">B</text>' +
      '<rect x="55" y="128" width="170" height="28" rx="8" fill="#EDE9FE" stroke="#DDD6FE" stroke-width="1"/>' +
      '<text x="' +
      cx +
      '" y="147" text-anchor="middle" font-size="14" font-weight="900" fill="#5B21B6" font-family="Nunito,sans-serif">' +
      (dLabel || "duong kinh AB") +
      "</text>";
  }
  return svgWrap(parts, 280, 170);
}

/**
 * Vẽ góc.
 * opts.showMeasure: hiện số đo (mặc định true). false = ẩn số, chỉ hiện sau khi bé trả lời.
 * opts.showKind: hiện nhãn Góc vuông/nhọn/tù (mặc định true).
 */
function geoAngle(deg, opts) {
  opts = opts || {};
  var showMeasure = opts.showMeasure !== false;
  var showKind = opts.showKind !== false;
  deg = Number(deg) || 90;
  var cx = 100;
  var cy = 120;
  var len = 90;
  var rad = (deg * Math.PI) / 180;
  var x2 = cx + len;
  var y2 = cy;
  var x3 = cx + len * Math.cos(rad);
  var y3 = cy - len * Math.sin(rad);
  // arc for angle mark
  var arcR = 28;
  var ax = cx + arcR;
  var ay = cy;
  var bx = cx + arcR * Math.cos(rad);
  var by = cy - arcR * Math.sin(rad);
  var large = deg > 180 ? 1 : 0;
  var arc =
    '<path d="M' +
    ax +
    " " +
    ay +
    " A" +
    arcR +
    " " +
    arcR +
    " 0 " +
    large +
    " 0 " +
    bx +
    " " +
    by +
    '" fill="none" stroke="#F59E0B" stroke-width="3"/>';
  // right angle square if 90 (dấu góc vuông SGK — không tiết lộ số đo)
  var right =
    deg === 90
      ? '<path d="M' +
        (cx + 16) +
        " " +
        cy +
        " V" +
        (cy - 16) +
        " H" +
        cx +
        '" fill="none" stroke="#F59E0B" stroke-width="2.5"/>'
      : "";

  var measureHtml = "";
  if (showMeasure) {
    measureHtml =
      '<rect x="' +
      (cx + 28) +
      '" y="' +
      (cy - 48) +
      '" width="52" height="26" rx="8" fill="#FEF3C7" stroke="#FCD34D" stroke-width="1"/>' +
      '<text x="' +
      (cx + 54) +
      '" y="' +
      (cy - 30) +
      '" text-anchor="middle" font-size="16" font-weight="900" fill="#B45309" font-family="Nunito,sans-serif">' +
      deg +
      "°</text>";
  } else {
    // Chỗ trống / dấu hỏi — không lộ đáp án
    measureHtml =
      '<rect x="' +
      (cx + 28) +
      '" y="' +
      (cy - 48) +
      '" width="44" height="26" rx="8" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1"/>' +
      '<text x="' +
      (cx + 50) +
      '" y="' +
      (cy - 30) +
      '" text-anchor="middle" font-size="16" font-weight="900" fill="#94A3B8" font-family="Nunito,sans-serif">?</text>';
  }

  var kindHtml = "";
  if (showKind) {
    kindHtml =
      '<text x="200" y="40" font-size="13" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">' +
      (deg === 90 ? "Góc vuông" : deg > 90 ? "Góc tù" : "Góc nhọn") +
      "</text>";
  }

  return svgWrap(
    '<line x1="' +
      cx +
      '" y1="' +
      cy +
      '" x2="' +
      x2 +
      '" y2="' +
      y2 +
      '" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="' +
      cx +
      '" y1="' +
      cy +
      '" x2="' +
      x3 +
      '" y2="' +
      y3 +
      '" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>' +
      (deg === 90 ? right : arc) +
      '<circle cx="' +
      cx +
      '" cy="' +
      cy +
      '" r="5" fill="#4F46E5"/>' +
      measureHtml +
      kindHtml,
    280,
    160
  );
}

function geoTwoAngles(d1, d2) {
  return (
    '<div class="geo-fig geo-fig-pair">' +
    geoAngle(d1).replace('class="geo-fig"', 'class="geo-fig mini"') +
    geoAngle(d2).replace('class="geo-fig"', 'class="geo-fig mini"') +
    "</div>"
  );
}

function geoPolyline(segs) {
  // three segments zigzag with labels
  var pts = [
    [30, 100],
    [100, 40],
    [180, 110],
    [250, 50],
  ];
  var d =
    "M" +
    pts[0][0] +
    " " +
    pts[0][1] +
    " L" +
    pts[1][0] +
    " " +
    pts[1][1] +
    " L" +
    pts[2][0] +
    " " +
    pts[2][1] +
    " L" +
    pts[3][0] +
    " " +
    pts[3][1];
  var labels = "";
  for (var i = 0; i < 3; i++) {
    var mx = (pts[i][0] + pts[i + 1][0]) / 2;
    var my = (pts[i][1] + pts[i + 1][1]) / 2 - 10;
    labels +=
      '<text x="' +
      mx +
      '" y="' +
      my +
      '" text-anchor="middle" font-size="12" font-weight="800" fill="#DB2777" font-family="Nunito,sans-serif">' +
      segs[i] +
      " cm</text>";
  }
  return svgWrap(
    '<path d="' +
      d +
      '" fill="none" stroke="#4F46E5" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      labels +
      geoDot(pts[0][0], pts[0][1], "A") +
      geoDot(pts[3][0], pts[3][1], "D", pts[3][1] - 12),
    280,
    150
  );
}

function geoShapeGallery(highlightName) {
  // Lưới 2x2 — mỗi ô đủ chỗ, tránh cắt hình tròn khi xếp 1 hàng
  var cellW = 140;
  var cellH = 120;
  var items = [
    {
      name: "Hình vuông",
      draw:
        '<rect x="40" y="22" width="60" height="60" fill="#EEF2FF" stroke="#4F46E5" stroke-width="3" rx="2"/>',
    },
    {
      name: "Hình tròn",
      draw:
        '<circle cx="70" cy="52" r="30" fill="#EFF6FF" stroke="#2563EB" stroke-width="3"/>',
    },
    {
      name: "Hình tam giác",
      draw:
        '<polygon points="70,20 30,82 110,82" fill="#ECFDF5" stroke="#059669" stroke-width="3"/>',
    },
    {
      name: "Hình chữ nhật",
      draw:
        '<rect x="28" y="32" width="84" height="48" fill="#FDF4FF" stroke="#A855F7" stroke-width="3" rx="2"/>',
    },
  ];
  var g = "";
  for (var i = 0; i < items.length; i++) {
    var col = i % 2;
    var row = Math.floor(i / 2);
    var x = col * cellW;
    var y = row * cellH;
    var hi = highlightName && items[i].name === highlightName;
    g +=
      '<g transform="translate(' +
      x +
      "," +
      y +
      ')">' +
      '<rect x="8" y="8" width="' +
      (cellW - 16) +
      '" height="' +
      (cellH - 16) +
      '" rx="14" fill="' +
      (hi ? "#FEF3C7" : "#FFFFFF") +
      '" stroke="' +
      (hi ? "#F59E0B" : "#E2E8F0") +
      '" stroke-width="' +
      (hi ? "3" : "2") +
      '"/>' +
      items[i].draw +
      '<text x="70" y="105" text-anchor="middle" font-size="13" font-weight="800" fill="#334155" font-family="Nunito,sans-serif">' +
      items[i].name +
      "</text></g>";
  }
  return svgWrap(g, cellW * 2, cellH * 2);
}

function geoCountDotsOnShape(kind) {
  if (kind === "tamgiac") {
    return {
      visual: geoTriangle(),
      sides: 3,
      vertices: 3,
      name: "hình tam giác",
    };
  }
  if (kind === "vuong") {
    return {
      visual: geoSquare(true, null),
      sides: 4,
      vertices: 4,
      name: "hình vuông",
    };
  }
  return {
    visual: geoRect(true, null, null),
    sides: 4,
    vertices: 4,
    name: "hình chữ nhật",
  };
}

/* ========== SVG bổ sung kiểu MathX (không lộ đáp án trên hình) ========== */

/** Hình tròn với n bán kính (không ghi số) — hỏi đếm bán kính */
function geoCircleRadiiCount(n) {
  n = Math.max(2, Math.min(6, Number(n) || 4));
  var cx = 140;
  var cy = 88;
  var r = 62;
  var parts =
    '<circle cx="' +
    cx +
    '" cy="' +
    cy +
    '" r="' +
    r +
    '" fill="#FEF9C3" stroke="#1E293B" stroke-width="3"/>' +
    '<circle cx="' +
    cx +
    '" cy="' +
    cy +
    '" r="5" fill="#DC2626"/>';
  // n bán kính: phân bố góc (tránh chồng lên nhau)
  for (var i = 0; i < n; i++) {
    var ang = (-90 + (i * 360) / n) * (Math.PI / 180);
    // nếu n lẻ, xoay nhẹ để dễ nhìn
    if (n === 5) ang = (-90 + i * 72) * (Math.PI / 180);
    if (n === 3) ang = (-90 + i * 120) * (Math.PI / 180);
    if (n === 4) ang = (i * 90) * (Math.PI / 180); // + / trục
    if (n === 6) ang = (i * 60) * (Math.PI / 180);
    var x2 = cx + r * Math.cos(ang);
    var y2 = cy + r * Math.sin(ang);
    parts +=
      '<line x1="' +
      cx +
      '" y1="' +
      cy +
      '" x2="' +
      x2 +
      '" y2="' +
      y2 +
      '" stroke="#1E293B" stroke-width="2.5"/>';
  }
  // Không ghi số n trên hình
  return svgWrap(parts, 280, 190);
}

/** Hình tròn chỉ vẽ bán kính OA (không ghi độ dài đáp án) */
function geoCircleRadiusOnly(rLabel) {
  // rLabel chỉ hiện giá trị ĐÃ CHO (vd r = 5 cm). Không hiện đường kính.
  return geoCircle(true, false, rLabel || "bán kính", null);
}

/** Hình tròn chỉ vẽ đường kính AB (không ghi bán kính) */
function geoCircleDiameterOnly(dLabel) {
  return geoCircle(false, true, null, dLabel || "đường kính AB");
}

/**
 * Đa giác đếm góc vuông (MathX tuần 8).
 * kind: "trap2" | "house3" | "rect4" | "trap1" | "L2"
 * Trả { visual, rightAngles }
 * Không vẽ dấu vuông / số — bé tự nhận biết.
 */
function geoCountRightAnglesFig(kind) {
  var map = {
    trap2: {
      // hình thang vuông (2 góc vuông)
      d: "M40,40 H160 L220,140 H40 Z",
      fill: "#BBF7D0",
      ans: 2,
    },
    house3: {
      // hình nhà: 3 góc vuông dưới
      d: "M50,70 L140,20 L230,70 V150 H50 Z",
      fill: "#FDE68A",
      ans: 2,
    },
    rect4: {
      d: "M50,40 H230 V140 H50 Z",
      fill: "#BFDBFE",
      ans: 4,
    },
    trap1: {
      d: "M50,50 H180 L230,140 H50 Z",
      fill: "#FDE047",
      ans: 1,
    },
    L2: {
      // chữ L: 6 góc ngoài? đếm góc vuông trong đa giác: 6 đỉnh, 4 góc vuông điển hình
      d: "M60,30 H140 V90 H200 V150 H60 Z",
      fill: "#FBCFE8",
      ans: 4,
    },
    tri0: {
      d: "M140,30 L50,150 H230 Z",
      fill: "#A7F3D0",
      ans: 0,
    },
  };
  var info = map[kind] || map.trap2;
  var inner =
    '<path d="' +
    info.d +
    '" fill="' +
    info.fill +
    '" stroke="#0F172A" stroke-width="3" stroke-linejoin="round"/>';
  return {
    visual: svgWrap(inner, 280, 180),
    rightAngles: info.ans,
  };
}

/**
 * Ba góc a) b) c) — chỉ 1 góc vuông (rightIdx 0..2).
 * Không ghi số đo, không nhãn "góc vuông".
 */
function geoThreeAnglesPick(rightIdx) {
  rightIdx = rightIdx == null ? 0 : rightIdx;
  var degs = [45, 90, 120];
  // đặt góc vuông đúng vị trí rightIdx
  var ordered = [45, 120, 60];
  ordered[rightIdx] = 90;
  if (rightIdx !== 0) ordered[0] = 45;
  if (rightIdx !== 1) ordered[1] = rightIdx === 0 ? 50 : 50;
  if (rightIdx !== 2) ordered[2] = 130;
  // rebuild cleanly
  var pool = [50, 130, 35];
  ordered = [];
  var pi = 0;
  for (var i = 0; i < 3; i++) {
    if (i === rightIdx) ordered.push(90);
    else ordered.push(pool[pi++]);
  }
  var labels = ["a", "b", "c"];
  var g = "";
  var cellW = 100;
  for (var j = 0; j < 3; j++) {
    var deg = ordered[j];
    var ox = 20 + j * cellW;
    var oy = 100;
    var len = 55;
    var rad = (deg * Math.PI) / 180;
    var x2 = ox + len;
    var y2 = oy;
    var x3 = ox + len * Math.cos(rad);
    var y3 = oy - len * Math.sin(rad);
    // Không vẽ dấu vuông / số đo — bé nhìn độ mở của góc (kiểu MathX)
    var arc =
      '<path d="M' +
      (ox + 16) +
      " " +
      oy +
      " A16 16 0 0 0 " +
      (ox + 16 * Math.cos(rad)) +
      " " +
      (oy - 16 * Math.sin(rad)) +
      '" fill="none" stroke="#94A3B8" stroke-width="2"/>';
    g +=
      "<g>" +
      '<line x1="' +
      ox +
      '" y1="' +
      oy +
      '" x2="' +
      x2 +
      '" y2="' +
      y2 +
      '" stroke="#334155" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="' +
      ox +
      '" y1="' +
      oy +
      '" x2="' +
      x3 +
      '" y2="' +
      y3 +
      '" stroke="#334155" stroke-width="3" stroke-linecap="round"/>' +
      arc +
      '<text x="' +
      (ox + 28) +
      '" y="150" text-anchor="middle" font-size="16" font-weight="900" fill="#4F46E5" font-family="Nunito,sans-serif">' +
      labels[j] +
      ")</text></g>";
  }
  return svgWrap(g, 320, 170);
}

/**
 * Hàng hình a/b/c chọn đúng loại.
 * shapes: [{kind, label}]
 * kind: triangle | rect | square | trap | diamond | para | right-tri | pentagon
 *
 * Lưu ý phân biệt:
 * - square: đứng thẳng, cạnh bằng, có dấu góc vuông
 * - diamond (hình thoi): dẹt ngang rõ (không phải vuông xoay 45°)
 * - para: hình bình hành nghiêng, dài ≠ rộng
 */
function geoPickShapesRow(shapes) {
  var g = "";
  var n = shapes.length;
  var cellW = Math.floor(320 / Math.max(n, 1));
  for (var i = 0; i < n; i++) {
    var s = shapes[i];
    var cx = cellW * i + cellW / 2;
    var draw = "";
    if (s.kind === "triangle") {
      // tam giác đều-ish — đáy rộng, đỉnh nhọn
      draw =
        '<polygon points="' +
        cx +
        ",28 " +
        (cx - 40) +
        ",112 " +
        (cx + 40) +
        ',112" fill="#ECFDF5" stroke="#047857" stroke-width="2.5"/>';
    } else if (s.kind === "right-tri") {
      draw =
        '<polygon points="' +
        (cx - 36) +
        ",40 " +
        (cx - 36) +
        ",112 " +
        (cx + 40) +
        ',112" fill="#FEF3C7" stroke="#B45309" stroke-width="2.5"/>';
    } else if (s.kind === "square") {
      // Vuông đứng + dấu góc vuông — không nhầm thoi
      var ss = 58;
      var sx = cx - ss / 2;
      var sy = 42;
      draw =
        '<rect x="' +
        sx +
        '" y="' +
        sy +
        '" width="' +
        ss +
        '" height="' +
        ss +
        '" fill="#EEF2FF" stroke="#3730A3" stroke-width="2.8"/>' +
        '<path d="M' +
        (sx + 12) +
        " " +
        (sy + ss) +
        " V" +
        (sy + ss - 12) +
        " H" +
        sx +
        '" fill="none" stroke="#F59E0B" stroke-width="2"/>' +
        // gạch giữa 2 cạnh kề để gợi ý cạnh bằng
        '<line x1="' +
        (sx + 18) +
        '" y1="' +
        (sy + ss + 6) +
        '" x2="' +
        (sx + ss - 18) +
        '" y2="' +
        (sy + ss + 6) +
        '" stroke="#6366F1" stroke-width="2"/>' +
        '<line x1="' +
        (sx + ss + 6) +
        '" y1="' +
        (sy + 18) +
        '" x2="' +
        (sx + ss + 6) +
        '" y2="' +
        (sy + ss - 18) +
        '" stroke="#6366F1" stroke-width="2"/>';
    } else if (s.kind === "rect") {
      // HCN rõ: dài gấp ~1.7 rộng
      draw =
        '<rect x="' +
        (cx - 48) +
        '" y="52" width="96" height="52" fill="#FDF4FF" stroke="#7E22CE" stroke-width="2.5"/>' +
        '<path d="M' +
        (cx - 48 + 12) +
        " 104 V92 H" +
        (cx - 48) +
        '" fill="none" stroke="#F59E0B" stroke-width="2"/>';
    } else if (s.kind === "trap") {
      draw =
        '<polygon points="' +
        (cx - 26) +
        ",40 " +
        (cx + 26) +
        ",40 " +
        (cx + 48) +
        ",112 " +
        (cx - 48) +
        ',112" fill="#FEF9C3" stroke="#A16207" stroke-width="2.5"/>';
    } else if (s.kind === "diamond" || s.kind === "rhombus") {
      // Hình thoi RẤT DẸT + góc nhọn rõ — KHÔNG phải vuông xoay 45°
      // (vuông xoay có đường chéo ngang ≈ dọc; thoi này ngang >> dọc)
      draw =
        '<polygon points="' +
        cx +
        ",58 " +
        (cx + 58) +
        ",78 " +
        cx +
        ",98 " +
        (cx - 58) +
        ',78" fill="#FFE4E6" stroke="#BE123C" stroke-width="2.5"/>';
    } else if (s.kind === "para") {
      // Hình bình hành nghiêng rõ — cạnh dài nằm ngang, lệch trái-phải
      // (không có góc vuông → không phải HCN)
      draw =
        '<polygon points="' +
        (cx - 14) +
        ",50 " +
        (cx + 52) +
        ",50 " +
        (cx + 34) +
        ",108 " +
        (cx - 32) +
        ',108" fill="#E0E7FF" stroke="#4338CA" stroke-width="2.5"/>';
    } else if (s.kind === "pentagon") {
      draw =
        '<polygon points="' +
        cx +
        ",32 " +
        (cx + 38) +
        ",58 " +
        (cx + 24) +
        ",112 " +
        (cx - 24) +
        ",112 " +
        (cx - 38) +
        ',58" fill="#F3E8FF" stroke="#7E22CE" stroke-width="2.5"/>';
    } else if (s.kind === "circle") {
      draw =
        '<circle cx="' +
        cx +
        '" cy="78" r="36" fill="#DBEAFE" stroke="#1D4ED8" stroke-width="2.5"/>';
    } else {
      draw =
        '<polygon points="' +
        (cx - 36) +
        ",112 " +
        cx +
        ",32 " +
        (cx + 36) +
        ',112" fill="#ECFDF5" stroke="#047857" stroke-width="2.5"/>';
    }
    g +=
      draw +
      '<text x="' +
      cx +
      '" y="148" text-anchor="middle" font-size="15" font-weight="900" fill="#4F46E5" font-family="Nunito,sans-serif">' +
      (s.label || String.fromCharCode(97 + i)) +
      ")</text>";
  }
  return svgWrap(g, 320, 168);
}

/**
 * Xáo trộn vị trí đáp án đúng trong hàng hình a/b/c/d.
 *
 * Quy tắc tránh nhầm (lớp 3):
 * - Hỏi HCN (không phải vuông): KHÔNG dùng diamond/thoi xoay (dễ nhìn như vuông/HCN).
 *   Distractor an toàn: square, triangle, trap, circle, para, right-tri.
 * - Hỏi vuông: được dùng diamond dẹt + para + trap (khác rõ vuông đứng).
 * - Hỏi thoi: không dùng square xoay; square phải đứng + dấu góc.
 */
function geoPickShapesQuiz(correctKind, distractorKinds) {
  // Bộ distractor mặc định an toàn theo loại câu
  if (!distractorKinds || !distractorKinds.length) {
    if (correctKind === "rect") {
      // Không diamond: thoi xoay dễ bị chọn nhầm là HCN/vuông
      distractorKinds = ["square", "triangle", "trap", "circle", "para", "right-tri"];
    } else if (correctKind === "square") {
      distractorKinds = ["rect", "triangle", "trap", "para", "circle", "right-tri"];
      // thoi dẹt OK khi hỏi vuông (khác rõ vuông đứng có dấu góc)
      distractorKinds.push("diamond");
    } else if (correctKind === "diamond") {
      distractorKinds = ["square", "rect", "triangle", "trap", "circle", "para"];
    } else {
      distractorKinds = ["trap", "rect", "para", "circle", "right-tri", "triangle"];
    }
  }
  // Cứng: câu HCN tuyệt đối không lẫn diamond
  if (correctKind === "rect") {
    distractorKinds = distractorKinds.filter(function (k) {
      return k !== "diamond" && k !== "rhombus";
    });
  }

  var opts = [correctKind];
  var pool = distractorKinds.slice().filter(function (k) {
    return k !== correctKind;
  });
  while (opts.length < 4 && pool.length) {
    var idx = Math.floor(Math.random() * pool.length);
    opts.push(pool.splice(idx, 1)[0]);
  }
  for (var i = opts.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = opts[i];
    opts[i] = opts[j];
    opts[j] = t;
  }
  var labels = ["a", "b", "c", "d"];
  var shapes = opts.map(function (k, i) {
    return { kind: k, label: labels[i] };
  });
  var ansIdx = opts.indexOf(correctKind);
  return {
    visual: geoPickShapesRow(shapes.slice(0, Math.min(4, shapes.length))),
    answer: labels[ansIdx],
    options: labels.slice(0, shapes.length),
  };
}

/** Lưới m×n ô vuông nhỏ — hỏi đếm (không ghi đáp án) */
function geoSquareGrid(cols, rows) {
  cols = cols || 3;
  rows = rows || 2;
  var cell = 36;
  var pad = 40;
  var w = pad * 2 + cols * cell;
  var h = pad * 2 + rows * cell + 10;
  var g = "";
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      g +=
        '<rect x="' +
        (pad + c * cell) +
        '" y="' +
        (pad + r * cell) +
        '" width="' +
        cell +
        '" height="' +
        cell +
        '" fill="#FFF" stroke="#0F172A" stroke-width="2"/>';
    }
  }
  return svgWrap(g, Math.max(w, 200), h);
}

/** Khối lập phương / hộp chữ nhật (wireframe) — không ghi số mặt/đỉnh */
function geoCubeFig() {
  // isometric-ish cube
  var g =
    // back face hint
    '<path d="M90,50 L170,50 L210,90 L210,160 L130,160 L90,120 Z" fill="#E0E7FF" stroke="#4F46E5" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M90,50 L130,90 L210,90" fill="none" stroke="#4F46E5" stroke-width="2"/>' +
    '<path d="M130,90 L130,160" fill="none" stroke="#4F46E5" stroke-width="2"/>' +
    '<text x="150" y="185" text-anchor="middle" font-size="13" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">Khối lập phương</text>';
  return svgWrap(g, 280, 200);
}

function geoPrismFig() {
  var g =
    '<path d="M60,70 L160,70 L210,110 L210,165 L110,165 L60,125 Z" fill="#FCE7F3" stroke="#DB2777" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M60,70 L110,110 L210,110" fill="none" stroke="#DB2777" stroke-width="2"/>' +
    '<path d="M110,110 L110,165" fill="none" stroke="#DB2777" stroke-width="2"/>' +
    '<text x="140" y="190" text-anchor="middle" font-size="13" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">Khối hộp chữ nhật</text>';
  return svgWrap(g, 280, 210);
}

/**
 * Thanh phân số: totalParts ô, coloredParts tô màu.
 * Không ghi số đáp án; chỉ minh họa "một phần mấy".
 */
function geoFractionStrip(totalParts, coloredParts) {
  totalParts = Math.max(2, Math.min(8, totalParts || 4));
  coloredParts = Math.max(0, Math.min(totalParts, coloredParts == null ? 1 : coloredParts));
  var pad = 24;
  var barW = 240;
  var barH = 44;
  var cellW = barW / totalParts;
  var g =
    '<text x="140" y="28" text-anchor="middle" font-size="13" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">Chia đều ' +
    totalParts +
    " phần</text>";
  for (var i = 0; i < totalParts; i++) {
    var fill = i < coloredParts ? "#A78BFA" : "#F8FAFC";
    g +=
      '<rect x="' +
      (pad + i * cellW) +
      '" y="40" width="' +
      cellW +
      '" height="' +
      barH +
      '" fill="' +
      fill +
      '" stroke="#4F46E5" stroke-width="2"/>';
  }
  return svgWrap(g, 280, 110);
}

/** Đoạn AB có trung điểm M — chỉ gắn nhãn cho phần đã cho (không lộ đáp án) */
function geoMidpointFig(opts) {
  opts = opts || {};
  // opts.given: "half" | "full" | "none"
  // opts.halfLabel / opts.fullLabel
  var half = opts.given === "half" ? opts.halfLabel || null : null;
  var full = opts.given === "full" ? opts.fullLabel || null : null;
  // Nếu hỏi nửa: chỉ hiện full; nếu hỏi cả: chỉ hiện half
  return geoSegment("A", "B", "M", full, half);
}

function genHinhHoc(level) {
  if (level === "basic") {
    var mode = pick([
      "midpoint",
      "midpoint2",
      "sides",
      "vertices",
      "angle",
      "shape",
      "shape2",
      "radius",
      "diameter",
      "countSidesPic",
      "rightAnglePic",
      "gallery",
    ]);
    if (mode === "midpoint") {
      var len = pick([6, 8, 10, 12, 14, 16, 18, 20, 24, 30]);
      var ans = len / 2;
      var pts = pick(["AB", "CD", "MN", "PQ"]);
      var aL = pts.charAt(0);
      var bL = pts.charAt(1);
      return q({
        topicId: "hinh-hoc",
        level: level,
        text:
          "Đoạn thẳng " +
          pts +
          " dài " +
          len +
          " cm. M là trung điểm. Độ dài " +
          aL +
          "M là bao nhiêu cm?",
        type: "mc",
        options: numMc(ans, 4),
        answer: ans,
        explain: "Trung điểm chia đôi: " + len + " : 2 = " + ans + " cm",
        visual: geoSegment(aL, bL, "M", pts + " = " + len + " cm", null),
      });
    }
    if (mode === "midpoint2") {
      var half = pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
      return q({
        topicId: "hinh-hoc",
        level: level,
        text:
          "Trung điểm M chia đoạn AB thành 2 phần bằng nhau, mỗi phần " +
          half +
          " cm. AB dài bao nhiêu cm?",
        type: "mc",
        options: numMc(half * 2, 4),
        answer: half * 2,
        explain: half + " × 2 = " + half * 2 + " cm",
        visual: geoSegment("A", "B", "M", null, half + " cm"),
      });
    }
    if (mode === "sides" || mode === "countSidesPic") {
      var kind = pick(["vuong", "chu-nhat", "tamgiac"]);
      var info = geoCountDotsOnShape(kind);
      return q({
        topicId: "hinh-hoc",
        level: level,
        text: "Nhìn hình: " + info.name + " có bao nhiêu cạnh?",
        type: "mc",
        options: numMc(info.sides, 2),
        answer: info.sides,
        explain: info.name + " có " + info.sides + " cạnh.",
        visual: info.visual,
      });
    }
    if (mode === "vertices") {
      var kindV = pick(["vuong", "chu-nhat", "tamgiac"]);
      var infoV = geoCountDotsOnShape(kindV);
      return q({
        topicId: "hinh-hoc",
        level: level,
        text: "Nhìn hình: " + infoV.name + " có bao nhiêu đỉnh?",
        type: "mc",
        options: numMc(infoV.vertices, 2),
        answer: infoV.vertices,
        explain: infoV.name + " có " + infoV.vertices + " đỉnh.",
        visual: infoV.visual,
      });
    }
    if (mode === "angle" || mode === "rightAnglePic") {
      return q({
        topicId: "hinh-hoc",
        level: level,
        text: "Nhìn hình góc dưới. Góc vuông có số đo bằng bao nhiêu độ?",
        type: "mc",
        options: ["45", "60", "90", "180"],
        answer: "90",
        explain: "Góc vuông = 90° (dấu hình vuông nhỏ ở đỉnh góc).",
        // Ẩn số 90° trước; hiện sau khi bé chọn đáp án
        visual: geoAngle(90, { showMeasure: false, showKind: true }),
        visualAfter: geoAngle(90, { showMeasure: true, showKind: true }),
      });
    }
    if (mode === "shape" || mode === "gallery") {
      var ask = pick([
        { q: "Hình nào có 3 cạnh?", a: "Hình tam giác" },
        { q: "Hình nào không có cạnh?", a: "Hình tròn" },
        { q: "Hình nào có 4 cạnh bằng nhau và 4 góc vuông?", a: "Hình vuông" },
        { q: "Hình nào có 4 góc vuông, cạnh dài hơn cạnh rộng?", a: "Hình chữ nhật" },
      ]);
      return q({
        topicId: "hinh-hoc",
        level: level,
        text: ask.q + " (xem các hình minh họa)",
        type: "mc",
        options: shuffle(["Hình vuông", "Hình tròn", "Hình tam giác", "Hình chữ nhật"]),
        answer: ask.a,
        explain: "Đáp án: " + ask.a,
        // Không tô vàng trước — chỉ highlight sau khi bé chọn đáp án
        visual: geoShapeGallery(null),
        visualAfter: geoShapeGallery(ask.a),
      });
    }
    if (mode === "shape2") {
      return q({
        topicId: "hinh-hoc",
        level: level,
        text: "Nhìn hình chữ nhật. Hình này có bao nhiêu góc vuông?",
        type: "mc",
        options: ["2", "3", "4", "5"],
        answer: "4",
        explain: "Hình chữ nhật có 4 góc vuông.",
        visual: geoRect(true, null, null),
      });
    }
    if (mode === "radius") {
      // Cơ bản: chỉ bảng nhân 2 (r = 2–9), tránh nhân số 2 chữ số
      var r0 = rand(2, 9);
      return q({
        topicId: "hinh-hoc",
        level: level,
        text: "Hình tròn có bán kính " + r0 + " cm (đoạn đỏ OA). Đường kính bằng bao nhiêu cm?",
        type: "mc",
        options: numMc(r0 * 2, 4),
        answer: r0 * 2,
        explain: "Đường kính = 2 × bán kính = " + r0 * 2 + " cm (bảng nhân 2)",
        visual: geoCircle(true, false, "r = " + r0 + " cm", null),
      });
    }
    // d chẵn 4–18 → r 1 chữ số, chỉ cần bảng chia 2
    var d0 = pick([4, 6, 8, 10, 12, 14, 16, 18]);
    return q({
      topicId: "hinh-hoc",
      level: level,
      text: "Hình tròn có đường kính AB = " + d0 + " cm. Bán kính bằng bao nhiêu cm?",
      type: "mc",
      options: numMc(d0 / 2, 3),
      answer: d0 / 2,
      explain: "Bán kính = đường kính : 2 = " + d0 / 2 + " cm (bảng chia 2)",
      visual: geoCircle(false, true, null, "d = " + d0 + " cm"),
    });
  }

  // Nâng cao
  var modeA = pick([
    "mid2",
    "radius",
    "diam",
    "angle2",
    "count",
    "compareAngle",
    "path",
    "squareSide",
    "whichAngle",
  ]);
  if (modeA === "mid2") {
    var am = rand(4, 15);
    var name = pick(["AB", "CD", "EF"]);
    return q({
      topicId: "hinh-hoc",
      level: level,
      text:
        "M là trung điểm " +
        name +
        ". " +
        name.charAt(0) +
        "M = " +
        am +
        " cm. Độ dài " +
        name +
        " là?",
      type: "input",
      answer: am * 2,
      explain: name + " = 2 × " + am + " = " + am * 2 + " cm",
      visual: geoSegment(name.charAt(0), name.charAt(1), "M", null, am + " cm"),
    });
  }
  if (modeA === "radius") {
    // Nâng cao hình học: vẫn ưu tiên bảng nhân 2 (r ≤ 9); đôi khi r 10–12 sau khi đã quen
    var r = Math.random() < 0.7 ? rand(3, 9) : rand(10, 12);
    return q({
      topicId: "hinh-hoc",
      level: level,
      text: "Hình tròn có bán kính " + r + " cm. Đường kính bằng bao nhiêu cm?",
      type: "input",
      answer: r * 2,
      explain: "Đường kính = 2 × " + r + " = " + r * 2 + " cm",
      visual: geoCircle(true, false, "r = " + r + " cm", null),
    });
  }
  if (modeA === "diam") {
    // Ưu tiên d chẵn trong bảng chia 2 (≤ 18); thỉnh thoảng 20–24
    var diam = Math.random() < 0.75 ? pick([8, 10, 12, 14, 16, 18]) : pick([20, 22, 24]);
    return q({
      topicId: "hinh-hoc",
      level: level,
      text: "Đường kính hình tròn là " + diam + " cm. Bán kính bằng?",
      type: "input",
      answer: diam / 2,
      explain: diam + " : 2 = " + diam / 2,
      visual: geoCircle(false, true, null, "d = " + diam + " cm"),
    });
  }
  if (modeA === "angle2" || modeA === "whichAngle") {
    var deg = pick([30, 45, 60, 90, 120, 150]);
    var cmp = deg > 90 ? "lớn hơn" : deg < 90 ? "bé hơn" : "bằng";
    return q({
      topicId: "hinh-hoc",
      level: level,
      text: "Nhìn hình: góc " + deg + "° so với góc vuông thì thế nào?",
      type: "mc",
      options: ["lớn hơn", "bé hơn", "bằng", "không so sánh được"],
      answer: cmp,
      explain: deg + "° " + cmp + " 90°.",
      visual: geoAngle(deg),
    });
  }
  if (modeA === "compareAngle") {
    var a1 = pick([45, 60, 90, 120]);
    var a2 = pick([30, 45, 90, 135]);
    while (a1 === a2) a2 = pick([30, 45, 90, 135, 150]);
    var ansC = a1 > a2 ? ">" : a1 < a2 ? "<" : "=";
    return q({
      topicId: "hinh-hoc",
      level: level,
      text: "So sánh hai góc trong hình: " + a1 + "°  ___  " + a2 + "°",
      type: "mc",
      options: [">", "<", "="],
      answer: ansC,
      explain: a1 + "° " + ansC + " " + a2 + "°",
      visual: geoTwoAngles(a1, a2),
    });
  }
  if (modeA === "path") {
    var segs = [rand(3, 9), rand(3, 9), rand(3, 9)];
    var sum = segs[0] + segs[1] + segs[2];
    return q({
      topicId: "hinh-hoc",
      level: level,
      text:
        "Đường gấp khúc trong hình gồm 3 đoạn: " +
        segs[0] +
        " cm, " +
        segs[1] +
        " cm, " +
        segs[2] +
        " cm. Tổng độ dài là?",
      type: "input",
      answer: sum,
      explain: segs[0] + " + " + segs[1] + " + " + segs[2] + " = " + sum,
      visual: geoPolyline(segs),
    });
  }
  if (modeA === "squareSide") {
    var side = rand(3, 12);
    return q({
      topicId: "hinh-hoc",
      level: level,
      text: "Hình vuông cạnh " + side + " cm. Tất cả các cạnh cộng lại (chu vi) bằng?",
      type: "input",
      answer: side * 4,
      explain: side + " × 4 = " + side * 4,
      visual: geoSquare(true, side + " cm"),
    });
  }
  return q({
    topicId: "hinh-hoc",
    level: level,
    text: "Nhìn hình: hình chữ nhật có tất cả bao nhiêu góc vuông?",
    type: "mc",
    options: ["2", "3", "4", "5"],
    answer: "4",
    explain: "Có 4 góc vuông.",
    visual: geoRect(true, null, null),
  });
}

/* ========== Hình minh họa Chu vi · Diện tích ========== */
function measureRect(opts) {
  opts = opts || {};
  var longL = opts.longLabel || "";
  var shortL = opts.shortLabel || "";
  var title = opts.title || "Hình chữ nhật";
  var unit = opts.unit || "cm";
  var showPeri = !!opts.showPerimeter;
  var showArea = !!opts.showArea;
  var showFence = !!opts.showFence;
  var gridCols = opts.gridCols || 0;
  var gridRows = opts.gridRows || 0;

  var W = 280;
  var H = 175;
  // scale rect to fit
  var maxW = showFence ? 150 : 160;
  var maxH = showFence ? 85 : 95;
  var aspect = 1.6;
  if (opts.aspect) aspect = opts.aspect;
  var rw = maxW;
  var rh = Math.round(maxW / aspect);
  if (rh > maxH) {
    rh = maxH;
    rw = Math.round(maxH * aspect);
  }
  var x = Math.round((W - rw) / 2);
  var y = showFence ? 32 : 28;

  var fill = showArea ? "#C7D2FE" : "#EEF2FF";
  if (showFence) fill = "#D1FAE5";

  var inner =
    '<rect x="' +
    x +
    '" y="' +
    y +
    '" width="' +
    rw +
    '" height="' +
    rh +
    '" fill="' +
    fill +
    '" stroke="#4F46E5" stroke-width="3" rx="3"/>';

  // grid for area visualization (unit squares)
  if (gridCols > 0 && gridRows > 0 && gridCols <= 12 && gridRows <= 10) {
    var cellW = rw / gridCols;
    var cellH = rh / gridRows;
    var g = "";
    for (var c = 0; c < gridCols; c++) {
      for (var r = 0; r < gridRows; r++) {
        g +=
          '<rect x="' +
          (x + c * cellW) +
          '" y="' +
          (y + r * cellH) +
          '" width="' +
          cellW +
          '" height="' +
          cellH +
          '" fill="' +
          ((c + r) % 2 === 0 ? "#A5B4FC" : "#C7D2FE") +
          '" stroke="#6366F1" stroke-width="1" opacity="0.95"/>';
      }
    }
    inner =
      g +
      '<rect x="' +
      x +
      '" y="' +
      y +
      '" width="' +
      rw +
      '" height="' +
      rh +
      '" fill="none" stroke="#4F46E5" stroke-width="3" rx="2"/>';
  }

  // perimeter highlight (dashed outer path)
  if (showPeri) {
    inner +=
      '<rect x="' +
      (x - 4) +
      '" y="' +
      (y - 4) +
      '" width="' +
      (rw + 8) +
      '" height="' +
      (rh + 8) +
      '" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="6 4" rx="4"/>';
  }

  // fence posts around yard
  if (showFence) {
    var fx = x - 10;
    var fy = y - 10;
    var fw = rw + 20;
    var fh = rh + 20;
    inner =
      '<rect x="' +
      fx +
      '" y="' +
      fy +
      '" width="' +
      fw +
      '" height="' +
      fh +
      '" fill="none" stroke="#059669" stroke-width="3" stroke-dasharray="8 5" rx="4"/>' +
      '<text x="' +
      (fx + fw / 2) +
      '" y="' +
      (fy - 4) +
      '" text-anchor="middle" font-size="11" font-weight="800" fill="#059669" font-family="Nunito,sans-serif">🚧 hàng rào</text>' +
      inner;
  }

  // dimension arrows / labels
  if (longL) {
    inner +=
      '<line x1="' +
      x +
      '" y1="' +
      (y + rh + 14) +
      '" x2="' +
      (x + rw) +
      '" y2="' +
      (y + rh + 14) +
      '" stroke="#7C3AED" stroke-width="2"/>' +
      '<polygon points="' +
      x +
      "," +
      (y + rh + 14) +
      " " +
      (x + 6) +
      "," +
      (y + rh + 10) +
      " " +
      (x + 6) +
      "," +
      (y + rh + 18) +
      '" fill="#7C3AED"/>' +
      '<polygon points="' +
      (x + rw) +
      "," +
      (y + rh + 14) +
      " " +
      (x + rw - 6) +
      "," +
      (y + rh + 10) +
      " " +
      (x + rw - 6) +
      "," +
      (y + rh + 18) +
      '" fill="#7C3AED"/>' +
      '<text x="' +
      (x + rw / 2) +
      '" y="' +
      (y + rh + 28) +
      '" text-anchor="middle" font-size="13" font-weight="900" fill="#7C3AED" font-family="Nunito,sans-serif">' +
      longL +
      (unit ? " " + unit : "") +
      "</text>";
  }
  if (shortL) {
    inner +=
      '<line x1="' +
      (x + rw + 12) +
      '" y1="' +
      y +
      '" x2="' +
      (x + rw + 12) +
      '" y2="' +
      (y + rh) +
      '" stroke="#DB2777" stroke-width="2"/>' +
      '<polygon points="' +
      (x + rw + 12) +
      "," +
      y +
      " " +
      (x + rw + 8) +
      "," +
      (y + 6) +
      " " +
      (x + rw + 16) +
      "," +
      (y + 6) +
      '" fill="#DB2777"/>' +
      '<polygon points="' +
      (x + rw + 12) +
      "," +
      (y + rh) +
      " " +
      (x + rw + 8) +
      "," +
      (y + rh - 6) +
      " " +
      (x + rw + 16) +
      "," +
      (y + rh - 6) +
      '" fill="#DB2777"/>' +
      '<text x="' +
      (x + rw + 18) +
      '" y="' +
      (y + rh / 2 + 4) +
      '" font-size="13" font-weight="900" fill="#DB2777" font-family="Nunito,sans-serif">' +
      shortL +
      (unit ? " " + unit : "") +
      "</text>";
  }

  if (showArea && opts.areaHint) {
    inner +=
      '<text x="' +
      (x + rw / 2) +
      '" y="' +
      (y + rh / 2 + 5) +
      '" text-anchor="middle" font-size="14" font-weight="900" fill="#3730A3" font-family="Nunito,sans-serif">' +
      opts.areaHint +
      "</text>";
  }

  inner +=
    '<text x="' +
    W / 2 +
    '" y="' +
    (H - 6) +
    '" text-anchor="middle" font-size="12" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">' +
    title +
    "</text>";

  return svgWrap(inner, W, H);
}

function measureSquare(opts) {
  opts = opts || {};
  var side = opts.sideLabel || "";
  var unit = opts.unit || "cm";
  var showPeri = !!opts.showPerimeter;
  var showArea = !!opts.showArea;
  var gridN = opts.gridN || 0;
  var W = 260;
  var H = 170;
  var s = 100;
  var x = Math.round((W - s) / 2) - 10;
  var y = 22;

  var fill = showArea ? "#FBCFE8" : "#FDF4FF";
  var inner =
    '<rect x="' +
    x +
    '" y="' +
    y +
    '" width="' +
    s +
    '" height="' +
    s +
    '" fill="' +
    fill +
    '" stroke="#A855F7" stroke-width="3" rx="3"/>';

  if (gridN > 0 && gridN <= 8) {
    var cell = s / gridN;
    var g = "";
    for (var i = 0; i < gridN; i++) {
      for (var j = 0; j < gridN; j++) {
        g +=
          '<rect x="' +
          (x + i * cell) +
          '" y="' +
          (y + j * cell) +
          '" width="' +
          cell +
          '" height="' +
          cell +
          '" fill="' +
          ((i + j) % 2 === 0 ? "#F9A8D4" : "#FBCFE8") +
          '" stroke="#DB2777" stroke-width="1"/>';
      }
    }
    inner =
      g +
      '<rect x="' +
      x +
      '" y="' +
      y +
      '" width="' +
      s +
      '" height="' +
      s +
      '" fill="none" stroke="#A855F7" stroke-width="3"/>';
  }

  if (showPeri) {
    inner +=
      '<rect x="' +
      (x - 5) +
      '" y="' +
      (y - 5) +
      '" width="' +
      (s + 10) +
      '" height="' +
      (s + 10) +
      '" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="6 4" rx="4"/>';
  }

  if (side) {
    inner +=
      '<line x1="' +
      (x + s + 10) +
      '" y1="' +
      y +
      '" x2="' +
      (x + s + 10) +
      '" y2="' +
      (y + s) +
      '" stroke="#DB2777" stroke-width="2"/>' +
      '<text x="' +
      (x + s + 16) +
      '" y="' +
      (y + s / 2 + 4) +
      '" font-size="13" font-weight="900" fill="#DB2777" font-family="Nunito,sans-serif">' +
      side +
      " " +
      unit +
      "</text>" +
      '<line x1="' +
      x +
      '" y1="' +
      (y + s + 12) +
      '" x2="' +
      (x + s) +
      '" y2="' +
      (y + s + 12) +
      '" stroke="#7C3AED" stroke-width="2"/>' +
      '<text x="' +
      (x + s / 2) +
      '" y="' +
      (y + s + 26) +
      '" text-anchor="middle" font-size="13" font-weight="900" fill="#7C3AED" font-family="Nunito,sans-serif">' +
      side +
      " " +
      unit +
      "</text>";
  }

  if (showArea && opts.areaHint) {
    inner +=
      '<text x="' +
      (x + s / 2) +
      '" y="' +
      (y + s / 2 + 5) +
      '" text-anchor="middle" font-size="13" font-weight="900" fill="#9D174D" font-family="Nunito,sans-serif">' +
      opts.areaHint +
      "</text>";
  }

  if (opts.periLabel) {
    inner +=
      '<text x="' +
      W / 2 +
      '" y="14" text-anchor="middle" font-size="12" font-weight="800" fill="#B45309" font-family="Nunito,sans-serif">Chu vi = ' +
      opts.periLabel +
      "</text>";
  }

  inner +=
    '<text x="' +
    W / 2 +
    '" y="' +
    (H - 6) +
    '" text-anchor="middle" font-size="12" font-weight="800" fill="#64748B" font-family="Nunito,sans-serif">' +
    (opts.title || "Hình vuông") +
    "</text>";

  return svgWrap(inner, W, H);
}

function genChuViDienTich(level) {
  if (level === "basic") {
    var modeB = pick(["periR", "periS", "areaRSmall", "areaSSmall", "formula"]);
    if (modeB === "periR") {
      var d = rand(3, 12);
      var r = rand(2, Math.min(10, d));
      var ans = 2 * (d + r);
      return q({
        topicId: "chu-vi-dien-tich",
        level: level,
        text:
          "Hình chữ nhật dài " +
          d +
          " cm, rộng " +
          r +
          " cm. Chu vi bằng bao nhiêu cm? (đường nét đứt vàng = chu vi)",
        type: "mc",
        options: numMc(ans, 8),
        answer: ans,
        explain: "C = (dài + rộng) × 2 = (" + d + " + " + r + ") × 2 = " + ans,
        visual: measureRect({
          longLabel: String(d),
          shortLabel: String(r),
          unit: "cm",
          showPerimeter: true,
          title: "Chu vi hình chữ nhật",
          aspect: d / Math.max(r, 1),
        }),
      });
    }
    if (modeB === "periS") {
      var c = rand(3, 12);
      return q({
        topicId: "chu-vi-dien-tich",
        level: level,
        text: "Hình vuông cạnh " + c + " cm. Chu vi bằng bao nhiêu cm?",
        type: "mc",
        options: numMc(4 * c, 8),
        answer: 4 * c,
        explain: "C = cạnh × 4 = " + c + " × 4 = " + 4 * c,
        visual: measureSquare({
          sideLabel: String(c),
          unit: "cm",
          showPerimeter: true,
          title: "Chu vi hình vuông",
        }),
      });
    }
    if (modeB === "areaRSmall") {
      var dc = rand(3, 6);
      var rc = rand(2, 5);
      return q({
        topicId: "chu-vi-dien-tich",
        level: level,
        text:
          "Hình chữ nhật dài " +
          dc +
          " ô, rộng " +
          rc +
          " ô. Diện tích bằng bao nhiêu ô vuông?",
        type: "mc",
        options: numMc(dc * rc, 6),
        answer: dc * rc,
        explain: "S = dài × rộng = " + dc + " × " + rc + " = " + dc * rc,
        visual: measureRect({
          longLabel: String(dc),
          shortLabel: String(rc),
          unit: "ô",
          showArea: true,
          gridCols: dc,
          gridRows: rc,
          title: "Đếm ô — Diện tích",
          aspect: dc / rc,
        }),
      });
    }
    if (modeB === "areaSSmall") {
      var n = rand(2, 5);
      return q({
        topicId: "chu-vi-dien-tich",
        level: level,
        text: "Hình vuông cạnh " + n + " ô. Diện tích bằng bao nhiêu ô vuông?",
        type: "mc",
        options: numMc(n * n, 5),
        answer: n * n,
        explain: "S = " + n + " × " + n + " = " + n * n,
        visual: measureSquare({
          sideLabel: String(n),
          unit: "ô",
          showArea: true,
          gridN: n,
          title: "Đếm ô — Diện tích hình vuông",
        }),
      });
    }
    // formula reminder
    var df = rand(4, 10);
    var rf = rand(3, 8);
    return q({
      topicId: "chu-vi-dien-tich",
      level: level,
      text:
        "Hình chữ nhật dài " +
        df +
        " cm, rộng " +
        rf +
        " cm. Chu vi bằng bao nhiêu cm?",
      type: "mc",
      options: numMc(2 * (df + rf), 8),
      answer: 2 * (df + rf),
      explain: "C = (" + df + " + " + rf + ") × 2 = " + 2 * (df + rf),
      visual: measureRect({
        longLabel: String(df),
        shortLabel: String(rf),
        unit: "cm",
        showPerimeter: true,
        title: "C = (dài + rộng) × 2",
        aspect: df / rf,
      }),
    });
  }

  // Nâng cao
  var mode = pick(["areaR", "areaS", "periFromArea", "fence", "areaRGrid", "findWidth"]);
  if (mode === "areaR" || mode === "areaRGrid") {
    var d2 = rand(4, 12);
    var r2 = rand(3, 10);
    var useGrid = mode === "areaRGrid" && d2 <= 8 && r2 <= 6;
    return q({
      topicId: "chu-vi-dien-tich",
      level: level,
      text:
        "Hình chữ nhật dài " +
        d2 +
        " cm, rộng " +
        r2 +
        " cm. Diện tích bằng bao nhiêu cm²?",
      type: "input",
      answer: d2 * r2,
      explain: "S = dài × rộng = " + d2 + " × " + r2 + " = " + d2 * r2,
      visual: measureRect({
        longLabel: String(d2),
        shortLabel: String(r2),
        unit: "cm",
        showArea: true,
        gridCols: useGrid ? d2 : 0,
        gridRows: useGrid ? r2 : 0,
        areaHint: useGrid ? "" : "S = dài × rộng",
        title: "Diện tích hình chữ nhật",
        aspect: d2 / r2,
      }),
    });
  }
  if (mode === "areaS") {
    var cs = rand(4, 12);
    var gN = cs <= 6 ? cs : 0;
    return q({
      topicId: "chu-vi-dien-tich",
      level: level,
      text: "Hình vuông cạnh " + cs + " cm. Diện tích bằng bao nhiêu cm²?",
      type: "input",
      answer: cs * cs,
      explain: "S = cạnh × cạnh = " + cs + " × " + cs + " = " + cs * cs,
      visual: measureSquare({
        sideLabel: String(cs),
        unit: "cm",
        showArea: true,
        gridN: gN,
        areaHint: gN ? "" : "S = cạnh × cạnh",
        title: "Diện tích hình vuông",
      }),
    });
  }
  if (mode === "periFromArea") {
    var cp = rand(5, 12);
    var peri = 4 * cp;
    return q({
      topicId: "chu-vi-dien-tich",
      level: level,
      text: "Hình vuông có chu vi " + peri + " cm. Cạnh hình vuông dài bao nhiêu cm?",
      type: "input",
      answer: cp,
      explain: "Cạnh = chu vi : 4 = " + peri + " : 4 = " + cp,
      visual: measureSquare({
        sideLabel: "?",
        unit: "cm",
        showPerimeter: true,
        periLabel: peri + " cm",
        title: "Tìm cạnh từ chu vi",
      }),
    });
  }
  if (mode === "findWidth") {
    var length = rand(8, 18);
    var width = rand(3, 10);
    var peri2 = 2 * (length + width);
    return q({
      topicId: "chu-vi-dien-tich",
      level: level,
      text:
        "Hình chữ nhật chu vi " +
        peri2 +
        " cm, dài " +
        length +
        " cm. Chiều rộng bằng bao nhiêu cm?",
      type: "input",
      answer: width,
      explain:
        "C = (dài + rộng) × 2 ⇒ rộng = C : 2 − dài = " +
        peri2 / 2 +
        " − " +
        length +
        " = " +
        width,
      visual: measureRect({
        longLabel: String(length),
        shortLabel: "?",
        unit: "cm",
        showPerimeter: true,
        title: "Chu vi = " + peri2 + " cm — tìm rộng",
        aspect: length / Math.max(width, 1),
      }),
    });
  }
  var fd = rand(8, 20);
  var fr = rand(5, 12);
  return q({
    topicId: "chu-vi-dien-tich",
    level: level,
    text:
      "Sân hình chữ nhật dài " +
      fd +
      " m, rộng " +
      fr +
      " m. Cần bao nhiêu mét hàng rào để rào quanh sân?",
    type: "input",
    answer: 2 * (fd + fr),
    explain: "Chu vi = (" + fd + " + " + fr + ") × 2 = " + 2 * (fd + fr) + " m",
    visual: measureRect({
      longLabel: String(fd),
      shortLabel: String(fr),
      unit: "m",
      showFence: true,
      title: "Rào quanh sân = chu vi",
      aspect: fd / fr,
    }),
  });
}

function genDoLuong(level) {
  if (level === "basic") {
    var mode = pick(["time", "money", "length", "mass"]);
    if (mode === "time") {
      var h = rand(1, 10);
      return q({
        topicId: "do-luong",
        level: level,
        text: h + " giờ = ? phút",
        type: "mc",
        options: numMc(h * 60, 30),
        answer: h * 60,
        explain: "1 giờ = 60 phút → " + h + " giờ = " + h * 60 + " phút",
      });
    }
    if (mode === "money") {
      var a = rand(2, 9) * 1000;
      var b = rand(1, 5) * 1000;
      return q({
        topicId: "do-luong",
        level: level,
        text:
          a.toLocaleString("vi-VN") +
          " đồng + " +
          b.toLocaleString("vi-VN") +
          " đồng = ? đồng",
        type: "mc",
        options: numMc(a + b, 2000),
        answer: a + b,
        explain: a + " + " + b + " = " + (a + b),
      });
    }
    if (mode === "length") {
      var m = rand(2, 9);
      return q({
        topicId: "do-luong",
        level: level,
        text: m + " m = ? cm",
        type: "mc",
        options: numMc(m * 100, 50),
        answer: m * 100,
        explain: "1 m = 100 cm → " + m + " m = " + m * 100 + " cm",
      });
    }
    var kg = rand(2, 8);
    return q({
      topicId: "do-luong",
      level: level,
      text: kg + " kg = ? g",
      type: "mc",
      options: numMc(kg * 1000, 500),
      answer: kg * 1000,
      explain: "1 kg = 1000 g → " + kg + " kg = " + kg * 1000 + " g",
    });
  }

  var modeA = pick(["timeReverse", "moneyChange", "compareUnit", "timeDuration", "lengthCompare", "massWord"]);
  if (modeA === "timeReverse") {
    var totalMin = rand(65, 250);
    var rh = Math.floor(totalMin / 60);
    var rm = totalMin % 60;
    return q({
      topicId: "do-luong",
      level: level,
      text: totalMin + " phút = ? giờ ? phút. Số phút lẻ là bao nhiêu?",
      type: "input",
      answer: rm,
      explain: totalMin + " phút = " + rh + " giờ " + rm + " phút (" + rh + " × 60 = " + (rh * 60) + "; lẻ " + rm + " phút)",
    });
  }
  if (modeA === "moneyChange") {
    var items = rand(2, 4);
    var priceItem = rand(8, 25) * 1000;
    var totalPay = (items * priceItem) + rand(5, 30) * 1000;
    totalPay = Math.ceil(totalPay / 10000) * 10000; // làm tròn lên chục nghìn
    var totalCost = items * priceItem;
    var change = totalPay - totalCost;
    return q({
      topicId: "do-luong",
      level: level,
      text:
        "Mua " + items + " quyển vở, mỗi quyển giá " +
        priceItem.toLocaleString("vi-VN") + " đồng. Đưa " +
        totalPay.toLocaleString("vi-VN") + " đồng. Được trả lại bao nhiêu đồng?",
      type: "input",
      answer: change,
      explain: items + " × " + priceItem + " = " + totalCost + "; thối " + totalPay + " − " + totalCost + " = " + change,
    });
  }
  if (modeA === "compareUnit") {
    var kg1 = rand(1, 5);
    var g1 = rand(100, 900);
    var totalG1 = kg1 * 1000 + g1;
    var totalG2 = rand(1500, 6000);
    var cmpAns = totalG1 > totalG2 ? ">" : totalG1 < totalG2 ? "<" : "=";
    return q({
      topicId: "do-luong",
      level: level,
      text: kg1 + " kg " + g1 + " g  ___  " + totalG2.toLocaleString("vi-VN") + " g",
      type: "mc",
      options: [">", "<", "="],
      answer: cmpAns,
      explain: kg1 + " kg " + g1 + " g = " + totalG1 + " g; " + totalG1 + " " + cmpAns + " " + totalG2,
    });
  }
  if (modeA === "timeDuration") {
    var startH = rand(7, 11);
    var startM = pick([0, 15, 20, 30, 45]);
    var durH = rand(1, 3);
    var durM = pick([15, 20, 25, 30, 40, 45]);
    var endTotalMin = startH * 60 + startM + durH * 60 + durM;
    var endH = Math.floor(endTotalMin / 60);
    var endM = endTotalMin % 60;
    return q({
      topicId: "do-luong",
      level: level,
      text:
        "Bé bắt đầu học lúc " + startH + " giờ " + (startM > 0 ? startM + " phút" : "") +
        ", học trong " + durH + " giờ " + durM + " phút. Bé học xong lúc mấy giờ? (nhập số giờ)",
      type: "input",
      answer: endH,
      explain: startH + "h" + (startM || "00") + " + " + durH + "h" + durM + " = " + endH + "h" + (endM < 10 ? "0" : "") + endM,
    });
  }
  if (modeA === "lengthCompare") {
    var m1 = rand(2, 8);
    var cm1 = rand(10, 90);
    var totalCm1 = m1 * 100 + cm1;
    var totalCm2 = rand(200, 900);
    var lcAns = totalCm1 > totalCm2 ? ">" : totalCm1 < totalCm2 ? "<" : "=";
    return q({
      topicId: "do-luong",
      level: level,
      text: m1 + " m " + cm1 + " cm  ___  " + totalCm2 + " cm",
      type: "mc",
      options: [">", "<", "="],
      answer: lcAns,
      explain: m1 + " m " + cm1 + " cm = " + totalCm1 + " cm; " + totalCm1 + " " + lcAns + " " + totalCm2,
    });
  }
  // massWord: bài toán cân nặng nhiều bước
  var bags = rand(3, 6);
  var perBag = rand(2, 8);
  var eaten = rand(1, 5);
  var massAns = bags * perBag - eaten;
  return q({
    topicId: "do-luong",
    level: level,
    text:
      "Có " + bags + " túi cam, mỗi túi nặng " + perBag +
      " kg. Sau khi lấy ra " + eaten + " kg cam thì còn bao nhiêu kg?",
    type: "input",
    answer: massAns,
    explain: bags + " × " + perBag + " − " + eaten + " = " + massAns + " kg",
  });
}

function genPhanSo(level) {
  if (level === "basic") {
    var mode = pick(["oneOf", "oneOf2", "shade", "compare", "compare2", "half"]);
    if (mode === "oneOf" || mode === "oneOf2") {
      var d = pick([2, 3, 4, 5, 6, 8, 10]);
      var k = rand(2, 8);
      var total = d * k;
      var ans = total / d;
      var item = pick(["quả táo", "viên bi", "cái kẹo", "học sinh", "bông hoa"]);
      var text =
        mode === "oneOf"
          ? "Một phần " + d + " của " + total + " là bao nhiêu?"
          : "Có " + total + " " + item + ". Một phần " + d + " bằng bao nhiêu?";
      return q({
        topicId: "phan-so",
        level: level,
        text: text,
        type: "mc",
        options: numMc(ans, 4),
        answer: ans,
        explain: total + " : " + d + " = " + ans,
      });
    }
    if (mode === "shade") {
      var d2 = pick([2, 3, 4, 5, 6, 8]);
      var shape = pick(["Hình tròn", "Hình vuông", "Hình chữ nhật"]);
      return q({
        topicId: "phan-so",
        level: level,
        text:
          shape +
          " chia " +
          d2 +
          " phần bằng nhau, tô 1 phần. Phần đã tô là?",
        type: "mc",
        options: shuffle([
          "1/" + d2,
          "1/" + (d2 + 1),
          "1/" + Math.max(2, d2 - 1),
          "2/" + d2,
        ]),
        answer: "1/" + d2,
        explain: "Tô 1 trong " + d2 + " phần → 1/" + d2,
      });
    }
    if (mode === "half") {
      var totalH = pick([10, 12, 14, 16, 18, 20, 24, 30, 40]);
      return q({
        topicId: "phan-so",
        level: level,
        text: "Một nửa của " + totalH + " là bao nhiêu?",
        type: "mc",
        options: numMc(totalH / 2, 5),
        answer: totalH / 2,
        explain: totalH + " : 2 = " + totalH / 2,
      });
    }
    if (mode === "compare2") {
      var pairs = [
        ["1/2", "1/3", ">"],
        ["1/4", "1/2", "<"],
        ["1/5", "1/3", "<"],
        ["1/6", "1/2", "<"],
        ["1/3", "1/4", ">"],
        ["1/8", "1/4", "<"],
      ];
      var pr = pick(pairs);
      return q({
        topicId: "phan-so",
        level: level,
        text: "So sánh: " + pr[0] + "  ___  " + pr[1],
        type: "mc",
        options: [">", "<", "="],
        answer: pr[2],
        explain: pr[0] + " " + pr[2] + " " + pr[1],
      });
    }
    var cPairs = [
      { opts: ["1/2", "1/4"], ans: "1/2", why: "1/2 > 1/4" },
      { opts: ["1/3", "1/5"], ans: "1/3", why: "1/3 > 1/5" },
      { opts: ["1/6", "1/2"], ans: "1/2", why: "1/2 > 1/6" },
      { opts: ["1/8", "1/4"], ans: "1/4", why: "1/4 > 1/8" },
    ];
    var cp = pick(cPairs);
    return q({
      topicId: "phan-so",
      level: level,
      text: "Phân số nào lớn hơn: " + cp.opts[0] + " hay " + cp.opts[1] + "?",
      type: "mc",
      options: [cp.opts[0], cp.opts[1], "Bằng nhau", "Không so sánh được"],
      answer: cp.ans,
      explain: cp.why,
    });
  }

  var modeA = pick(["part", "compare2", "word", "of", "remain"]);
  if (modeA === "part") {
    var d3 = pick([3, 4, 5, 6, 8]);
    var n3 = rand(2, d3 - 1);
    var total3 = d3 * rand(2, 8);
    var ans3 = (total3 / d3) * n3;
    return q({
      topicId: "phan-so",
      level: level,
      text: n3 + "/" + d3 + " của " + total3 + " bằng bao nhiêu?",
      type: "input",
      answer: ans3,
      explain:
        "Một phần " +
        d3 +
        " của " +
        total3 +
        " là " +
        total3 / d3 +
        ", vậy " +
        n3 +
        "/" +
        d3 +
        " = " +
        ans3,
    });
  }
  if (modeA === "compare2") {
    var dens = shuffle([2, 3, 4, 5, 6, 8]).slice(0, 2);
    var x = dens[0];
    var y = dens[1];
    var ansCmp = x < y ? ">" : "<"; // 1/x vs 1/y
    return q({
      topicId: "phan-so",
      level: level,
      text: "So sánh: 1/" + x + "  ___  1/" + y,
      type: "mc",
      options: ["<", ">", "="],
      answer: ansCmp,
      explain: "Mẫu càng lớn (tử = 1) thì phân số càng nhỏ: 1/" + x + " " + ansCmp + " 1/" + y,
    });
  }
  if (modeA === "word") {
    var dw = pick([2, 3, 4, 5]);
    var answ = rand(3, 10);
    var totalw = answ * dw;
    var thing = pick(["cái bánh", "quyển vở", "quả cam", "viên bi"]);
    return q({
      topicId: "phan-so",
      level: level,
      text: "Có " + totalw + " " + thing + ". Lấy 1/" + dw + ". Được bao nhiêu?",
      type: "input",
      answer: answ,
      explain: totalw + " : " + dw + " = " + answ,
    });
  }
  if (modeA === "remain") {
    var dr = pick([2, 3, 4]);
    var unit = rand(4, 12);
    var totalR = unit * dr;
    var taken = unit; // 1/dr
    var left = totalR - taken;
    return q({
      topicId: "phan-so",
      level: level,
      text: "Có " + totalR + " cái kẹo, ăn 1/" + dr + ". Còn lại bao nhiêu cái?",
      type: "input",
      answer: left,
      explain: "Ăn " + taken + ", còn " + totalR + " − " + taken + " = " + left,
    });
  }
  var totals = [
    [24, 3, 8],
    [18, 3, 6],
    [20, 4, 5],
    [30, 5, 6],
    [16, 4, 4],
    [36, 3, 12],
    [28, 4, 7],
  ];
  var tf = pick(totals);
  var who = pick(["nam", "nữ", "đội A", "đội B"]);
  return q({
    topicId: "phan-so",
    level: level,
    text: "Có " + tf[0] + " học sinh, 1/" + tf[1] + " là " + who + ". Có bao nhiêu em?",
    type: "mc",
    options: numMc(tf[2], 4),
    answer: tf[2],
    explain: tf[0] + " : " + tf[1] + " = " + tf[2],
  });
}

function genToanLoi(level) {
  if (level === "basic") {
    var mode = pick(["buy", "share", "age", "pages"]);
    if (mode === "buy") {
      var price = rand(5, 20);
      var qty = rand(2, 6);
      return q({
        topicId: "toan-loi",
        level: level,
        text:
          "Mỗi cái bút chì giá " +
          price +
          " 000 đồng. Mua " +
          qty +
          " cái hết bao nhiêu nghìn đồng?",
        type: "mc",
        options: numMc(price * qty, 10),
        answer: price * qty,
        explain: price + " × " + qty + " = " + price * qty,
      });
    }
    if (mode === "share") {
      var each = rand(4, 12);
      var groups = rand(3, 8);
      var total = each * groups;
      return q({
        topicId: "toan-loi",
        level: level,
        text:
          groups +
          " bạn chia đều " +
          total +
          " viên bi. Mỗi bạn được bao nhiêu viên?",
        type: "mc",
        options: numMc(each, 5),
        answer: each,
        explain: total + " : " + groups + " = " + each,
      });
    }
    if (mode === "age") {
      var child = rand(8, 10);
      var dad = child + rand(25, 32);
      return q({
        topicId: "toan-loi",
        level: level,
        text: "Bé " + child + " tuổi, bố " + dad + " tuổi. Bố hơn bé bao nhiêu tuổi?",
        type: "mc",
        options: numMc(dad - child, 5),
        answer: dad - child,
        explain: dad + " − " + child + " = " + (dad - child),
      });
    }
    var day = rand(8, 15);
    var days = rand(3, 6);
    return q({
      topicId: "toan-loi",
      level: level,
      text:
        "Mỗi ngày bé đọc " +
        day +
        " trang sách. " +
        days +
        " ngày bé đọc được bao nhiêu trang?",
      type: "mc",
      options: numMc(day * days, 12),
      answer: day * days,
      explain: day + " × " + days + " = " + day * days,
    });
  }

  var modeA = pick(["threeStep", "buyGive", "gap", "multiCompare", "mixed", "fraction"]);
  if (modeA === "threeStep") {
    var boxes = rand(3, 6);
    var perBox = rand(10, 24);
    var eaten = rand(8, 20);
    var given = rand(5, 15);
    var tsAns = boxes * perBox - eaten - given;
    return q({
      topicId: "toan-loi",
      level: level,
      text:
        "Mẹ mua " + boxes + " hộp bánh, mỗi hộp có " + perBox +
        " cái. Bé ăn " + eaten + " cái, cho bạn " + given +
        " cái. Hỏi còn lại bao nhiêu cái bánh?",
      type: "input",
      answer: tsAns,
      explain: boxes + " × " + perBox + " = " + (boxes * perBox) + "; " + (boxes * perBox) + " − " + eaten + " − " + given + " = " + tsAns,
    });
  }
  if (modeA === "buyGive") {
    var price = rand(8, 25);
    var qty = rand(3, 7);
    var money = price * qty + rand(10, 40);
    var changeAns = money - price * qty;
    return q({
      topicId: "toan-loi",
      level: level,
      text:
        "Mỗi quyển vở giá " + price + " 000 đồng. Mua " + qty +
        " quyển, đưa " + money + " 000 đồng. Được trả lại bao nhiêu nghìn đồng?",
      type: "input",
      answer: changeAns,
      explain: qty + " × " + price + " = " + (price * qty) + "; thối " + money + " − " + (price * qty) + " = " + changeAns,
    });
  }
  if (modeA === "gap") {
    var gap = rand(2, 5);
    var smaller = rand(15, 40);
    var bigger = smaller * gap;
    var sumBoth = smaller + bigger;
    return q({
      topicId: "toan-loi",
      level: level,
      text:
        "Anh có số bi gấp " + gap + " lần em. Em có " + smaller +
        " viên bi. Hỏi cả hai anh em có tất cả bao nhiêu viên bi?",
      type: "input",
      answer: sumBoth,
      explain: "Anh: " + smaller + " × " + gap + " = " + bigger + "; tổng: " + smaller + " + " + bigger + " = " + sumBoth,
    });
  }
  if (modeA === "multiCompare") {
    var personA = rand(30, 80);
    var lessB = rand(10, 25);
    var personB = personA - lessB;
    var moreC = rand(5, 20);
    var personC = personB + moreC;
    return q({
      topicId: "toan-loi",
      level: level,
      text:
        "An có " + personA + " nhãn vở. Bình ít hơn An " + lessB +
        " nhãn. Chi nhiều hơn Bình " + moreC + " nhãn. Hỏi Chi có bao nhiêu nhãn vở?",
      type: "input",
      answer: personC,
      explain: "Bình: " + personA + " − " + lessB + " = " + personB + "; Chi: " + personB + " + " + moreC + " = " + personC,
    });
  }
  if (modeA === "mixed") {
    var students = rand(4, 8);
    var pencils = rand(3, 6);
    var erasers = rand(2, 4);
    var totalItems = students * pencils + students * erasers;
    return q({
      topicId: "toan-loi",
      level: level,
      text:
        "Cô giáo phát cho mỗi bạn " + pencils + " bút chì và " + erasers +
        " cục tẩy. Lớp có " + students + " bạn. Cô cần tất cả bao nhiêu đồ dùng?",
      type: "input",
      answer: totalItems,
      explain: students + " × " + pencils + " + " + students + " × " + erasers + " = " + (students * pencils) + " + " + (students * erasers) + " = " + totalItems,
    });
  }
  // fraction word problem
  var fTotal = pick([24, 30, 36, 40, 48, 60]);
  var fDiv = pick([2, 3, 4, 5, 6]);
  while (fTotal % fDiv !== 0) fDiv = pick([2, 3, 4, 5, 6]);
  var fPart = fTotal / fDiv;
  var fRemain = fTotal - fPart;
  return q({
    topicId: "toan-loi",
    level: level,
    text:
      "Có " + fTotal + " quả táo. Cho bạn 1/" + fDiv +
      " số táo đó. Hỏi còn lại bao nhiêu quả?",
    type: "input",
    answer: fRemain,
    explain: "Cho: " + fTotal + " : " + fDiv + " = " + fPart + "; còn: " + fTotal + " − " + fPart + " = " + fRemain,
  });
}

var GENERATORS = {
  "on-tap-so": genOnTapSo,
  "cong-tru": genCongTru,
  "bang-nhan-chia": genBangNhanChia,
  "nhan-chia-lon": genNhanChiaLon,
  "hinh-hoc": genHinhHoc,
  "chu-vi-dien-tich": genChuViDienTich,
  "do-luong": genDoLuong,
  "phan-so": genPhanSo,
  "toan-loi": genToanLoi,
};

var ALL_IDS = Object.keys(GENERATORS);

/** Khóa duy nhất để chống trùng trong 1 phiên */
function questionKey(item) {
  var text = String(item.text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  var ans = String(item.answer || "")
    .toLowerCase()
    .replace(/\s+/g, "");
  return text + "||" + ans;
}

/**
 * Khóa "cấu trúc" — tránh lặp cùng dạng số dù lời văn hơi khác
 * (vd: 3×4 và 3×4; hoặc so sánh cùng cặp số)
 */
function structureKey(item) {
  var text = String(item.text || "");
  var nums = text.match(/\d+/g) || [];
  var ops = [];
  if (text.indexOf("×") >= 0 || text.indexOf("x") >= 0 || /nhân/i.test(text)) ops.push("mul");
  if (text.indexOf(":") >= 0 || text.indexOf("÷") >= 0 || /chia/i.test(text)) ops.push("div");
  if (text.indexOf("+") >= 0) ops.push("add");
  if (text.indexOf("−") >= 0 || text.indexOf("-") >= 0) ops.push("sub");
  if (text.indexOf("___") >= 0 || /so sánh/i.test(text)) ops.push("cmp");
  // Chuẩn hóa phép nhân/chia giao hoán: 3×4 ~ 4×3
  if (ops.indexOf("mul") >= 0 && nums.length >= 2) {
    var a = Number(nums[0]);
    var b = Number(nums[1]);
    if (!isNaN(a) && !isNaN(b)) {
      return item.topicId + "|mul|" + Math.min(a, b) + "x" + Math.max(a, b);
    }
  }
  return item.topicId + "|" + ops.join("+") + "|" + nums.join(",") + "|" + String(item.answer);
}

function generateQuestion(topicId, level) {
  // MathX (bám KNTT — dạng đề tương đương tuần 1–5)
  if (
    topicId &&
    (topicId.indexOf("mathx-") === 0 || topicId === "mathx") &&
    typeof MathXQuestions !== "undefined" &&
    MathXQuestions.generateMathXByTopicId
  ) {
    return MathXQuestions.generateMathXByTopicId(topicId, level);
  }
  if (topicId === "hon-hop") {
    var id = pick(ALL_IDS);
    return GENERATORS[id](level);
  }
  var gen = GENERATORS[topicId] || GENERATORS["bang-nhan-chia"];
  return gen(level);
}

/**
 * Sinh 1 phiên không trùng câu.
 * - Thử nhiều lần để lấy câu mới
 * - Hỗn hợp: xoay vòng chủ đề để đa dạng
 * - Loại trùng nội dung + trùng cấu trúc số liệu
 */
function generateSession(topicId, level, count) {
  count = Math.max(1, Math.min(30, Number(count) || 10));
  var list = [];
  var seenExact = {};
  var seenStruct = {};
  var maxAttempts = count * 40;
  var attempts = 0;

  // Với hỗn hợp: xếp lịch chủ đề xoay vòng
  var topicPlan = null;
  if (topicId === "hon-hop") {
    topicPlan = [];
    var pool = shuffle(ALL_IDS.slice());
    var pi = 0;
    for (var t = 0; t < count; t++) {
      topicPlan.push(pool[pi % pool.length]);
      pi++;
      if (pi % pool.length === 0) pool = shuffle(ALL_IDS.slice());
    }
  }

  while (list.length < count && attempts < maxAttempts) {
    attempts++;
    var tid = topicPlan ? topicPlan[list.length] : topicId;
    // 30% thời gian random topic khác trong hon-hop để tránh kẹt
    if (topicPlan && attempts % 7 === 0) {
      tid = pick(ALL_IDS);
    }
    var item = generateQuestion(tid, level);
    if (!item || !item.text) continue;

    var ek = questionKey(item);
    var sk = structureKey(item);
    if (seenExact[ek] || seenStruct[sk]) continue;

    seenExact[ek] = true;
    seenStruct[sk] = true;
    list.push(item);
  }

  // Nếu vẫn thiếu (pool quá hẹp): nới lỏng chỉ chống trùng exact text
  while (list.length < count && attempts < maxAttempts * 2) {
    attempts++;
    var tid2 = topicPlan ? pick(ALL_IDS) : topicId;
    var item2 = generateQuestion(tid2, level);
    if (!item2 || !item2.text) continue;
    var ek2 = questionKey(item2);
    if (seenExact[ek2]) continue;
    seenExact[ek2] = true;
    list.push(item2);
  }

  // Cuối cùng: chấp nhận câu mới dù trùng cấu trúc (tránh session rỗng)
  while (list.length < count) {
    list.push(generateQuestion(topicId === "hon-hop" ? pick(ALL_IDS) : topicId, level));
  }

  return list;
}

window.generateQuestion = generateQuestion;
window.generateSession = generateSession;
window.questionKey = questionKey;
