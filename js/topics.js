/**
 * Toán Lớp 3 — MathX (ưu tiên, từng tuần + 4 kỳ thi) rồi KNTT chung
 * MathX bám KNTT · Cơ bản / Nâng cao
 */
const TOPICS = (function () {
  var list = [];

  // —— MathX: từng tuần 1–34 (không gộp) ——
  list.push({ section: "📚 MathX — Luyện theo tuần (KNTT)" });

  var weekMeta = {
    1: "Số 3 chữ số · Cộng trừ",
    2: "Trừ · Nhân chia · Toán lời",
    3: "Bảng 3–4 · Đoạn thẳng",
    4: "Bảng 6 · Thời gian · Hình",
    5: "Bảng 7–8 · Gấp lần",
    6: "Bảng 9 · Chia có dư",
    7: "Nhân chia 9 · Toán lời",
    8: "Bảng 9 · Ôn nhân chia",
    9: "Hình học phẳng · Khối",
    10: "Hình · Đỉnh cạnh mặt",
    11: "Hình hộp · Lập phương",
    12: "Gấp lần · Giảm lần",
    13: "Gấp giảm · Toán lời",
    14: "Gấp giảm · Nhiều bước",
    15: "Đo lường · Độ dài",
    16: "Góc · Trung điểm",
    17: "Đường gấp khúc · Hình",
    18: "Ôn HK1 · Đo · Hình",
    19: "Số lớn · Cộng trừ",
    20: "Số lớn · So sánh",
    21: "Nhân số lớn",
    22: "Chia số lớn",
    23: "Nhân chia · Toán lời",
    24: "Nhân nhiều chữ số",
    25: "Chu vi · Nhân lớn",
    26: "Nhân chia phạm vi lớn",
    27: "Biểu thức · Ôn nhân",
    28: "Tiền Việt Nam",
    29: "Tiền · Mua bán",
    30: "Tiền · Đổi tờ · Thừa",
    31: "Tiền · Nhiều bước",
    32: "Ôn tập số lớn",
    33: "Ôn cộng nhân lớn",
    34: "Ôn tập phạm vi 100 000",
  };

  var colors = [
    "#0D9488",
    "#0891B2",
    "#2563EB",
    "#7C3AED",
    "#C026D3",
    "#DB2777",
    "#EA580C",
    "#CA8A04",
    "#16A34A",
    "#0F766E",
  ];

  for (var w = 1; w <= 34; w++) {
    list.push({
      id: "mathx-t" + w,
      emoji: w <= 18 ? "📗" : "📘",
      name: "MathX · Tuần " + w,
      desc: weekMeta[w] || "Luyện tuần " + w + " · CB / NC",
      color: colors[(w - 1) % colors.length],
      mathxWeek: w,
    });
  }

  // —— 4 kỳ thi MathX (tách riêng) ——
  list.push({ section: "📝 MathX — Kiểm tra (4 kỳ)" });

  list.push({
    id: "mathx-gk1",
    emoji: "📋",
    name: "Giữa kỳ I",
    desc: "Đề kiểm tra giữa HK1 · CB / NC",
    color: "#1D4ED8",
    mathxExam: "gk1",
  });
  list.push({
    id: "mathx-ck1",
    emoji: "📋",
    name: "Cuối kỳ I",
    desc: "Đề / ôn tập cuối HK1 · CB / NC",
    color: "#1E40AF",
    mathxExam: "ck1",
  });
  list.push({
    id: "mathx-gk2",
    emoji: "📋",
    name: "Giữa kỳ II",
    desc: "Đề kiểm tra giữa HK2 · CB / NC",
    color: "#7E22CE",
    mathxExam: "gk2",
  });
  list.push({
    id: "mathx-ck2",
    emoji: "📋",
    name: "Cuối kỳ II",
    desc: "Đề / ôn tập cuối HK2 · CB / NC",
    color: "#86198F",
    mathxExam: "ck2",
  });

  // —— Các dạng ôn khác (đưa xuống dưới) ——
  list.push({ section: "✏️ Ôn KNTT — Dạng bài khác" });

  var others = [
    {
      id: "on-tap-so",
      emoji: "🔢",
      name: "Số đến 10 000",
      desc: "Đọc, viết, so sánh, tròn chục/trăm",
      color: "#6366F1",
    },
    {
      id: "cong-tru",
      emoji: "➕",
      name: "Cộng · Trừ",
      desc: "Phạm vi 1000 và số lớn hơn",
      color: "#10B981",
    },
    {
      id: "bang-nhan-chia",
      emoji: "✖️",
      name: "Bảng nhân · Bảng chia",
      desc: "Bảng 2–9, tìm thành phần",
      color: "#F59E0B",
    },
    {
      id: "nhan-chia-lon",
      emoji: "🧮",
      name: "Nhân · Chia số lớn",
      desc: "Số 2–4 chữ số × / ÷ số 1 chữ số",
      color: "#EF4444",
    },
    {
      id: "hinh-hoc",
      emoji: "📐",
      name: "Hình học",
      desc: "Đoạn thẳng, góc, hình phẳng",
      color: "#8B5CF6",
    },
    {
      id: "chu-vi-dien-tich",
      emoji: "📏",
      name: "Chu vi · Diện tích",
      desc: "Hình chữ nhật, hình vuông",
      color: "#EC4899",
    },
    {
      id: "do-luong",
      emoji: "⏰",
      name: "Đo lường",
      desc: "Thời gian, tiền, độ dài, khối lượng",
      color: "#14B8A6",
    },
    {
      id: "phan-so",
      emoji: "🍕",
      name: "Phân số đơn giản",
      desc: "Một phần mấy, so sánh",
      color: "#F97316",
    },
    {
      id: "toan-loi",
      emoji: "📖",
      name: "Toán có lời văn",
      desc: "Bài toán thực tế lớp 3",
      color: "#0EA5E9",
    },
    {
      id: "hon-hop",
      emoji: "🎲",
      name: "Hỗn hợp (chung)",
      desc: "Ôn nhiều dạng ngoài MathX",
      color: "#64748B",
    },
  ];

  for (var i = 0; i < others.length; i++) list.push(others[i]);

  return list;
})();

function getTopic(id) {
  return (
    TOPICS.find(function (t) {
      return t.id === id && !t.section;
    }) ||
    TOPICS.filter(function (t) {
      return !t.section;
    }).slice(-1)[0]
  );
}

/** Chỉ các mục luyện (bỏ dòng section) */
function getPracticeTopics() {
  return TOPICS.filter(function (t) {
    return t.id && !t.section;
  });
}

window.TOPICS = TOPICS;
window.getTopic = getTopic;
window.getPracticeTopics = getPracticeTopics;
