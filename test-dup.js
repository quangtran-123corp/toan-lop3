const fs = require("fs");
const path = require("path");
const vm = require("vm");

const code =
  fs.readFileSync(path.join(__dirname, "js", "topics.js"), "utf8") +
  "\n" +
  fs.readFileSync(path.join(__dirname, "js", "questions.js"), "utf8");

const ctx = {
  window: {},
  Math,
  Number,
  String,
  Object,
  Array,
  JSON,
  Date,
  isNaN,
  console,
};
ctx.window = ctx;
vm.runInNewContext(code, ctx);

function measure(id, lv, n, rounds) {
  let totalDup = 0;
  let worst = 0;
  for (let r = 0; r < rounds; r++) {
    const qs = ctx.generateSession(id, lv, n);
    const keys = qs.map((q) => ctx.questionKey(q));
    const uniq = new Set(keys);
    const dup = n - uniq.size;
    totalDup += dup;
    if (dup > worst) worst = dup;
  }
  const avg = totalDup / rounds;
  console.log(
    (id + " " + lv).padEnd(28),
    "n=" + n,
    "avg_dup=" + avg.toFixed(2),
    "worst=" + worst,
    avg === 0 ? "OK" : "WARN"
  );
}

const topics = [
  "hon-hop",
  "on-tap-so",
  "cong-tru",
  "bang-nhan-chia",
  "nhan-chia-lon",
  "hinh-hoc",
  "chu-vi-dien-tich",
  "do-luong",
  "phan-so",
  "toan-loi",
];

console.log("--- 50 rounds × 10 câu ---");
topics.forEach((t) => {
  measure(t, "basic", 10, 50);
  measure(t, "advanced", 10, 50);
});

console.log("--- 20 rounds × 20 câu ---");
measure("hon-hop", "basic", 20, 20);
measure("hinh-hoc", "basic", 20, 20);
measure("phan-so", "basic", 20, 20);
