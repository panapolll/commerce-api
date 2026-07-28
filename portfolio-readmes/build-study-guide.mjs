import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const files = [
  { title: 'ภาพรวมทั้งโปรเจกต์', path: join(__dirname, '00-OVERVIEW.md') },
  { title: 'Commerce API (หลัก)', path: join(root, 'README.md') },
  { title: 'Commerce API (สรุปสั้น)', path: join(__dirname, 'Commerce-API-README.md') },
  { title: 'API Gateway', path: join(__dirname, 'Api-Gateway-README.md') },
  { title: 'Auth Service', path: join(__dirname, 'Auth-Service-README.md') },
  { title: 'Frontend', path: join(__dirname, 'Frontend-README.md') },
  { title: 'Notification Service', path: join(__dirname, 'Notification-README.md') },
];

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inCode = false;
  let codeBuf = [];
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (!tableRows.length) return;
    html += '<table>\n';
    tableRows.forEach((row, i) => {
      const tag = i === 0 ? 'th' : 'td';
      const cells = row.split('|').filter((c) => c.trim());
      if (cells.length) {
        html += '<tr>' + cells.map((c) => `<${tag}>${inline(c.trim())}</${tag}>`).join('') + '</tr>\n';
      }
    });
    html += '</table>\n';
    tableRows = [];
    inTable = false;
  };

  const inline = (text) => {
    return escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) {
        html += `<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>\n`;
        codeBuf = [];
        inCode = false;
      } else {
        flushTable();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (line.startsWith('|')) {
      if (line.includes('---')) continue;
      inTable = true;
      tableRows.push(line);
      continue;
    } else if (inTable) {
      flushTable();
    }
    if (line.startsWith('# ')) {
      html += `<h1>${inline(line.slice(2))}</h1>\n`;
    } else if (line.startsWith('## ')) {
      html += `<h2>${inline(line.slice(3))}</h2>\n`;
    } else if (line.startsWith('### ')) {
      html += `<h3>${inline(line.slice(4))}</h3>\n`;
    } else if (line.startsWith('> ')) {
      html += `<blockquote>${inline(line.slice(2))}</blockquote>\n`;
    } else if (line.startsWith('- ')) {
      html += `<li>${inline(line.slice(2))}</li>\n`;
    } else if (/^\d+\.\s/.test(line)) {
      html += `<li>${inline(line.replace(/^\d+\.\s/, ''))}</li>\n`;
    } else if (line.trim() === '---') {
      html += '<hr>\n';
    } else if (line.trim()) {
      html += `<p>${inline(line)}</p>\n`;
    }
  }
  flushTable();
  if (inCode && codeBuf.length) {
    html += `<pre><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>\n`;
  }
  return html;
}

let body = '';
for (const file of files) {
  const md = readFileSync(file.path, 'utf8');
  body += `<section class="chapter">\n`;
  body += mdToHtml(md);
  body += `</section>\n`;
}

const html = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Fruit Shop — คู่มือทบทวน</title>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Sarabun', sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #1a1a1a;
      max-width: 210mm;
      margin: 0 auto;
      padding: 12mm 15mm;
    }
    h1 { font-size: 20pt; color: #166534; border-bottom: 2px solid #4ade80; padding-bottom: 6px; margin-top: 0; }
    h2 { font-size: 14pt; color: #14532d; margin-top: 18px; page-break-after: avoid; }
    h3 { font-size: 12pt; color: #333; page-break-after: avoid; }
    .cover { text-align: center; padding: 40mm 0 30mm; page-break-after: always; }
    .cover h1 { font-size: 28pt; border: none; }
    .cover p { font-size: 13pt; color: #555; }
    .chapter { page-break-before: always; }
    .chapter:first-of-type { page-break-before: auto; }
    pre {
      background: #f4f4f5;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 10px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      page-break-inside: avoid;
    }
    code { font-family: 'JetBrains Mono', monospace; font-size: 9pt; background: #f0f0f0; padding: 1px 4px; border-radius: 3px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 10pt; page-break-inside: avoid; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
    th { background: #ecfdf5; font-weight: 600; }
    blockquote { border-left: 4px solid #4ade80; margin: 8px 0; padding: 6px 12px; background: #f0fdf4; }
    li { margin: 4px 0 4px 18px; }
    hr { border: none; border-top: 1px solid #ddd; margin: 16px 0; }
    @media print {
      body { padding: 0; }
      .chapter { page-break-before: always; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>🍎 Fruit Shop</h1>
    <p><strong>คู่มือทบทวนโปรเจกต์ Portfolio</strong></p>
    <p>Microservices — NestJS + React + MongoDB + Omise</p>
    <p>Panapol Sukcharoen</p>
    <p style="margin-top:24px;font-size:10pt;color:#888;">พิมพ์ออกมาอ่านก่อนสัมภาษณ์ · commerce-api / portfolio-readmes</p>
  </div>
  ${body}
</body>
</html>`;

const htmlPath = join(__dirname, 'Fruit-Shop-Study-Guide.html');
const pdfPath = join(__dirname, 'Fruit-Shop-Study-Guide.pdf');

writeFileSync(htmlPath, html, 'utf8');
console.log('Wrote', htmlPath);

try {
  execSync(
    `google-chrome --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file://${htmlPath}"`,
    { stdio: 'inherit' },
  );
  console.log('Wrote', pdfPath);
} catch {
  console.log('PDF: เปิด Fruit-Shop-Study-Guide.html ใน Chrome แล้ว Ctrl+P → Save as PDF');
}
