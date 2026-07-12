/**
 * Toán Lớp 3 — KNTT + MathX (toàn năm)
 */
const TOPICS = [
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
    desc: "Ôn nhiều chủ đề KNTT",
    color: "#64748B",
  },
  // —— MathX toàn năm (bám PDF tuần 1–34) ——
  {
    id: "mathx-g1",
    emoji: "📗",
    name: "MathX · T1–8",
    desc: "Số 1000 · Bảng nhân 2–9 · Chia có dư",
    color: "#0D9488",
  },
  {
    id: "mathx-g2",
    emoji: "📘",
    name: "MathX · T9–14",
    desc: "Hình học · Gấp/giảm lần",
    color: "#0891B2",
  },
  {
    id: "mathx-g3",
    emoji: "📙",
    name: "MathX · T15–18",
    desc: "Đo lường · Góc · Trung điểm",
    color: "#7C3AED",
  },
  {
    id: "mathx-g4",
    emoji: "📕",
    name: "MathX · T19–27",
    desc: "Số lớn · Nhân nhiều chữ số",
    color: "#DB2777",
  },
  {
    id: "mathx-g5",
    emoji: "📓",
    name: "MathX · T28–34",
    desc: "Tiền Việt · Ôn tập 100 000",
    color: "#EA580C",
  },
  {
    id: "mathx-hk1",
    emoji: "📅",
    name: "MathX · Học kỳ 1",
    desc: "Tuần 1–18 · CB / NC",
    color: "#2563EB",
  },
  {
    id: "mathx-hk2",
    emoji: "📅",
    name: "MathX · Học kỳ 2",
    desc: "Tuần 19–34 · CB / NC",
    color: "#C026D3",
  },
  {
    id: "mathx-hon-hop",
    emoji: "🎯",
    name: "MathX · Cả năm",
    desc: "Trộn tuần 1–34 (CB / NC)",
    color: "#4F46E5",
  },
];

function getTopic(id) {
  return (
    TOPICS.find(function (t) {
      return t.id === id;
    }) || TOPICS[TOPICS.length - 1]
  );
}

window.TOPICS = TOPICS;
window.getTopic = getTopic;
