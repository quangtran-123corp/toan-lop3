const fs = require("fs");
const path = require("path");

const css = fs.readFileSync(path.join(__dirname, "css", "styles.css"), "utf8");
const topics = fs.readFileSync(path.join(__dirname, "js", "topics.js"), "utf8");
const storage = fs.readFileSync(path.join(__dirname, "js", "storage.js"), "utf8");
const questions = fs.readFileSync(path.join(__dirname, "js", "questions.js"), "utf8");
const mathx = fs.readFileSync(path.join(__dirname, "js", "mathx-questions.js"), "utf8");
const sounds = fs.readFileSync(path.join(__dirname, "js", "sounds.js"), "utf8");
const characters = fs.readFileSync(path.join(__dirname, "js", "characters.js"), "utf8");
const emailReport = fs.readFileSync(path.join(__dirname, "js", "email-report.js"), "utf8");
const app = fs.readFileSync(path.join(__dirname, "js", "app.js"), "utf8");
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

const bodyStart = html.indexOf("<body");
const bodyOpenEnd = html.indexOf(">", bodyStart);
const bodyEnd = html.lastIndexOf("</body>");
let body = html.slice(bodyOpenEnd + 1, bodyEnd);

// Remove external scripts / noscript from body
body = body.replace(/<script[\s\S]*?<\/script>/gi, "");
body = body.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
body = body.trim();

const out = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#4F46E5" />
  <title>Toán Lớp 3 — Kết Nối Tri Thức</title>
  <style>
${css}
  </style>
</head>
<body>
${body}

<script>
/* ===== TOPICS ===== */
${topics}

/* ===== STORAGE ===== */
${storage}

/* ===== QUESTIONS ===== */
${questions}

/* ===== MATHX (KNTT tuần 1–5) ===== */
${mathx}

/* ===== SOUNDS ===== */
${sounds}

/* ===== CHARACTERS (reward 100%) ===== */
${characters}

/* ===== EMAIL REPORT ===== */
${emailReport}

/* ===== APP ===== */
${app}
</script>
</body>
</html>
`;

const singlePath = path.join(__dirname, "ToanLop3.html");
const indexPath = path.join(__dirname, "index.html");
fs.writeFileSync(singlePath, out, "utf8");
fs.writeFileSync(indexPath, out, "utf8");
console.log("OK", out.length, "bytes -> ToanLop3.html + index.html");
