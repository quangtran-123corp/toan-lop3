const fs = require("fs");
const path = require("path");
const vm = require("vm");

const h = fs.readFileSync(path.join(__dirname, "ToanLop3.html"), "utf8");
console.log("size", h.length);
console.log("has TOPICS", h.includes("window.TOPICS"));
console.log("has generateSession", h.includes("window.generateSession"));
console.log("has boot", h.includes("function boot"));
console.log("has external script src", /script src=/.test(h));
console.log("has style topic-grid", h.includes(".topic-grid"));
console.log("has name card", h.includes("home-child-name"));
console.log("has loading", h.includes("topic-loading"));

const start = h.indexOf("<script>");
const end = h.lastIndexOf("</script>");
if (start < 0 || end < 0) {
  console.log("NO SCRIPT");
  process.exit(1);
}
const code = h.slice(start + 8, end);

const el = () => ({
  textContent: "",
  style: {},
  classList: { add() {}, remove() {} },
  value: "",
  hidden: true,
  addEventListener() {},
  querySelectorAll() {
    return [];
  },
  querySelector() {
    return el();
  },
  innerHTML: "",
  disabled: false,
  dataset: {},
  focus() {},
  appendChild() {},
  offsetWidth: 0,
});

const ctx = {
  window: null,
  document: {
    readyState: "complete",
    addEventListener() {},
    querySelector() {
      return el();
    },
    querySelectorAll() {
      return [];
    },
    getElementById() {
      return el();
    },
    body: { appendChild() {} },
  },
  localStorage: {
    _d: {},
    getItem(k) {
      return this._d[k] || null;
    },
    setItem(k, v) {
      this._d[k] = String(v);
    },
  },
  Math,
  Number,
  String,
  Object,
  Array,
  JSON,
  Date,
  isNaN,
  console,
  setTimeout,
  clearTimeout,
  AudioContext: function () {},
  confirm() {
    return false;
  },
};
ctx.window = ctx;

try {
  vm.runInNewContext(code, ctx, { timeout: 5000 });
  console.log("TOPICS len", ctx.TOPICS && ctx.TOPICS.length);
  console.log("gen ok", typeof ctx.generateSession);
  const qs = ctx.generateSession("hon-hop", "basic", 2);
  console.log("sample", qs[0].text);
  console.log("SCRIPT RUN OK");
} catch (e) {
  console.log("SCRIPT ERROR", e.stack || e.message);
  process.exit(1);
}
