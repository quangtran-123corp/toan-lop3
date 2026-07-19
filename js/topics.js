/**
 * Toán Lớp 3 — MathX ưu tiên (từng tuần + 4 kỳ thi đúng vị trí dàn ý)
 * Nội dung mô tả bám Lớp 3 · Sách Kết nối tri thức (MathX)
 */
const TOPICS = (function () {
  var list = [];

  /**
   * Dàn ý tuần MathX / KNTT
   * dates: khoảng tuần (tham chiếu lịch năm học)
   * content: mảng nội dung chính (hiển thị dưới tiêu đề)
   */
  var WEEKS = {
    1: {
      dates: "04/09 – 10/09",
      content: [
        "Ôn tập các số đến 1 000",
        "Ôn tập phép cộng, phép trừ trong phạm vi 1 000",
      ],
    },
    2: {
      dates: "11/09 – 17/09",
      content: [
        "Tìm thành phần trong phép cộng, phép trừ",
        "Ôn tập bảng nhân 2; 5 · bảng chia 2; 5",
      ],
    },
    3: {
      dates: "18/09 – 24/09",
      content: ["Bảng nhân 3, bảng chia 3", "Bảng nhân 4, bảng chia 4"],
    },
    4: {
      dates: "25/09 – 01/10",
      content: ["Ôn tập hình học và đo lường", "Bảng nhân 6, bảng chia 6"],
    },
    5: {
      dates: "02/10 – 08/10",
      content: ["Bảng nhân 7, bảng chia 7", "Bảng nhân 8, bảng chia 8"],
    },
    6: {
      dates: "09/10 – 15/10",
      content: [
        "Bảng nhân 9, bảng chia 9",
        "Tìm thành phần trong phép nhân, phép chia",
      ],
    },
    7: {
      dates: "16/10 – 22/10",
      content: [
        "Một phần mấy",
        "Điểm ở giữa · Trung điểm của đoạn thẳng",
      ],
    },
    8: {
      dates: "23/10 – 29/10",
      content: [
        "Hình tròn · Tâm, bán kính, đường kính",
        "Góc, góc vuông, góc không vuông",
      ],
    },
    9: {
      dates: "30/10 – 05/11",
      content: [
        "Hình tam giác, tứ giác · Hình chữ nhật, hình vuông",
        "Khối lập phương, khối hộp chữ nhật",
      ],
    },
    10: {
      dates: "06/11 – 12/11",
      content: [
        "Nhân số có hai chữ số với số có một chữ số",
        "Gấp một số lên một số lần",
      ],
    },
    11: {
      dates: "13/11 – 19/11",
      content: [
        "Phép chia hết, phép chia có dư",
        "Chia số có hai chữ số cho số có một chữ số",
      ],
    },
    12: {
      dates: "20/11 – 26/11",
      content: [
        "Giảm một số đi một số lần",
        "Bài toán giải bằng hai bước tính",
      ],
    },
    13: {
      dates: "27/11 – 03/12",
      content: ["Mi-li-mét", "Gam"],
    },
    14: {
      dates: "04/12 – 10/12",
      content: ["Mi-li-lít", "Nhiệt độ · Đơn vị đo nhiệt độ"],
    },
    15: {
      dates: "11/12 – 17/12",
      content: [
        "Nhân số có ba chữ số với số có một chữ số",
        "Chia số có ba chữ số cho số có một chữ số",
      ],
    },
    16: {
      dates: "18/12 – 24/12",
      content: [
        "Biểu thức số · Tính giá trị biểu thức số",
        "So sánh số lớn gấp mấy lần số bé",
      ],
    },
    17: {
      dates: "25/12 – 31/12",
      content: [
        "Ôn tập phép nhân, phép chia trong phạm vi 100 · 1 000",
        "Ôn tập biểu thức số",
      ],
    },
    18: {
      dates: "01/01 – 07/01",
      content: ["Ôn tập hình học và đo lường"],
    },
    19: {
      dates: "15/01 – 21/01",
      content: [
        "Các số có năm chữ số · Số 10 000",
        "So sánh các số trong phạm vi 10 000",
      ],
    },
    20: {
      dates: "22/01 – 28/01",
      content: [
        "Làm quen với chữ số La Mã",
        "Làm tròn số đến hàng chục, hàng trăm",
      ],
    },
    21: {
      dates: "29/01 – 04/02",
      content: [
        "Chu vi tam giác, tứ giác, hình chữ nhật, hình vuông",
        "Diện tích của một hình · Xăng-ti-mét vuông",
      ],
    },
    22: {
      dates: "05/02 – 11/02",
      content: ["Diện tích hình chữ nhật, diện tích hình vuông"],
    },
    23: {
      dates: "12/02 – 18/02",
      content: [
        "Phép cộng trong phạm vi 10 000",
        "Phép trừ trong phạm vi 10 000",
      ],
    },
    24: {
      dates: "19/02 – 25/02",
      content: ["Nhân số có bốn chữ số với số có một chữ số"],
    },
    25: {
      dates: "26/02 – 04/03",
      content: ["Chia số có bốn chữ số cho số có một chữ số"],
    },
    26: {
      dates: "05/03 – 11/03",
      content: ["Các số có sáu chữ số · Số 100 000"],
    },
    27: {
      dates: "12/03 – 18/03",
      content: [
        "So sánh các số trong phạm vi 100 000",
        "Làm tròn số đến hàng nghìn, hàng chục nghìn",
      ],
    },
    28: {
      dates: "19/03 – 25/03",
      content: [
        "Phép cộng trong phạm vi 100 000",
        "Phép trừ trong phạm vi 100 000",
      ],
    },
    29: {
      dates: "26/03 – 01/04",
      content: ["Xem đồng hồ · Tháng – năm"],
    },
    30: {
      dates: "02/04 – 08/04",
      content: ["Tiền Việt Nam"],
    },
    31: {
      dates: "09/04 – 15/04",
      content: ["Nhân số có năm chữ số với số có một chữ số"],
    },
    32: {
      dates: "16/04 – 22/04",
      content: ["Chia số có năm chữ số cho số có một chữ số"],
    },
    33: {
      dates: "23/04 – 29/04",
      content: [
        "Thu thập, phân loại, ghi chép số liệu · Bảng số liệu",
        "Khả năng xảy ra của một sự kiện",
        "Ôn tập các số trong phạm vi 10 000 · 100 000",
      ],
    },
    34: {
      dates: "30/04 – 06/05",
      content: [
        "Ôn tập phép cộng, phép trừ trong phạm vi 100 000",
        "Ôn tập phép nhân, phép chia trong phạm vi 100 000",
      ],
    },
    35: {
      dates: "07/05 – 13/05",
      content: [
        "Ôn tập hình học và đo lường",
        "Ôn tập bảng số liệu, khả năng xảy ra của một sự kiện",
      ],
    },
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

  function weekDesc(w) {
    var meta = WEEKS[w];
    if (!meta) return "Luyện tuần " + w + " · Cơ bản / Nâng cao";
    var lines = meta.content || [];
    var head = meta.dates ? "(" + meta.dates + ") " : "";
    return head + lines.join(" · ");
  }

  function pushWeek(w) {
    var meta = WEEKS[w] || { content: [] };
    list.push({
      id: "mathx-t" + w,
      emoji: w <= 18 ? "📗" : "📘",
      name: "MathX · Tuần " + w,
      desc: weekDesc(w),
      content: meta.content || [],
      dates: meta.dates || "",
      color: colors[(w - 1) % colors.length],
      mathxWeek: w,
    });
  }

  // —— HK1: Tuần 1–9 ——
  list.push({
    section: "📚 MathX · Học kỳ I — Luyện theo tuần (KNTT)",
  });
  for (var w = 1; w <= 9; w++) pushWeek(w);

  // Giữa kỳ I (sau tuần 9)
  list.push({ section: "📝 MathX — Ôn tập kiểm tra giữa kỳ I" });
  list.push({
    id: "mathx-gk1",
    emoji: "📋",
    name: "Giữa kỳ I",
    desc: "Ôn tập · Đề kiểm tra giữa HK1 (sau tuần 9) · 20 câu · CB / NC",
    content: [
      "Ôn tập nội dung tuần 1–9",
      "Đề ôn / đề kiểm tra giữa kỳ I · 20 câu",
    ],
    color: "#1D4ED8",
    mathxExam: "gk1",
  });

  // Tuần 10–18
  list.push({ section: "📚 MathX · Học kỳ I (tiếp) — Tuần 10–18" });
  for (w = 10; w <= 18; w++) pushWeek(w);

  // Cuối kỳ I
  list.push({
    section: "📝 MathX — Ôn tập kiểm tra học kỳ I (08/01 – 14/01)",
  });
  list.push({
    id: "mathx-ck1",
    emoji: "📋",
    name: "Cuối kỳ I",
    desc: "Đề cương ôn thi · Đề kiểm tra HK1 · CB / NC",
    content: [
      "Ôn tập học kỳ I (tuần 1–18)",
      "Đề cương ôn thi cuối học kỳ I",
      "Đề kiểm tra học kỳ I",
    ],
    color: "#1E40AF",
    mathxExam: "ck1",
  });

  // —— HK2: Tuần 19–27 ——
  list.push({
    section: "📚 MathX · Học kỳ II — Luyện theo tuần (KNTT)",
  });
  for (w = 19; w <= 27; w++) pushWeek(w);

  // Giữa kỳ II
  list.push({ section: "📝 MathX — Ôn tập kiểm tra giữa kỳ II" });
  list.push({
    id: "mathx-gk2",
    emoji: "📋",
    name: "Giữa kỳ II",
    desc: "Ôn tập · Đề kiểm tra giữa HK2 (sau tuần 27) · CB / NC",
    content: [
      "Ôn tập nội dung tuần 19–27",
      "Đề kiểm tra giữa học kỳ II",
    ],
    color: "#7E22CE",
    mathxExam: "gk2",
  });

  // Tuần 28–35
  list.push({ section: "📚 MathX · Học kỳ II (tiếp) — Tuần 28–35" });
  for (w = 28; w <= 35; w++) pushWeek(w);

  // Cuối kỳ II
  list.push({ section: "📝 MathX — Ôn tập kiểm tra học kỳ II" });
  list.push({
    id: "mathx-ck2",
    emoji: "📋",
    name: "Cuối kỳ II",
    desc: "Đề cương ôn thi · Đề kiểm tra HK2 · CB / NC",
    content: [
      "Ôn tập học kỳ II (tuần 19–35)",
      "Đề cương ôn thi cuối kỳ II",
      "Đề kiểm tra học kỳ II",
    ],
    color: "#86198F",
    mathxExam: "ck2",
  });

  // —— Dạng bài khác (xuống dưới) ——
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
      name: "Nhân · Chia nâng cao",
      desc: "Bảng cửu chương: nhiều bước, tìm X, chia dư",
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

function getPracticeTopics() {
  return TOPICS.filter(function (t) {
    return t.id && !t.section;
  });
}

window.TOPICS = TOPICS;
window.getTopic = getTopic;
window.getPracticeTopics = getPracticeTopics;
