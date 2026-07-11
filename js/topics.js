/**
 * Chuong trinh Toan Lop 3 — Ket noi tri thuc voi cuoc song
 * Cac chu de luyen tap bam SGK (HK1 + HK2)
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
    name: "Hỗn hợp",
    desc: "Ôn nhiều chủ đề trong 1 lần",
    color: "#64748B",
  },
];

function getTopic(id) {
  return TOPICS.find(function (t) {
    return t.id === id;
  }) || TOPICS[TOPICS.length - 1];
}

window.TOPICS = TOPICS;
window.getTopic = getTopic;
