import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const doc = new PDFDocument({ margin: 0, size: "A4" });
const outPath = path.resolve("artifacts/portfolio/public/assets/Resume.pdf");
doc.pipe(fs.createWriteStream(outPath));

const PW  = doc.page.width;   // 595.28
const PH  = doc.page.height;  // 841.89

// ── Colours matching the portfolio website ────────────────────────────
const BG     = "#ffffff";   // dark navy page background
const CARD   = "#f1f5f9";   // slightly lighter card/section bg
const BLUE   = "#3b82f6";   // blue headings
const WHITE  = "#1e293b";   // body text
const LGRAY  = "#475569";   // sub-text gray
const LBLUE  = "#60a5fa";   // link blue

// ── Margins / layout ─────────────────────────────────────────────────
const M   = 36;             // outer margin
const GAP = 20;             // gap between two columns
const CW  = (PW - M * 2 - GAP) / 2;  // each column width
const LX  = M;             // left column X
const RX  = M + CW + GAP; // right column X

// ── Whole page background ─────────────────────────────────────────────
doc.rect(0, 0, PW, PH).fill(BG);

// ── Header ────────────────────────────────────────────────────────────
// Profile photo
const photoPath = path.resolve("artifacts/portfolio/public/assets/profile1.jpg");
const photoR = 44;
const photoX = M + photoR;
const photoY = M + photoR + 4;

// Blue ring
doc.circle(photoX, photoY, photoR + 3).lineWidth(3).strokeColor(BLUE).stroke();

if (fs.existsSync(photoPath)) {
  doc.save();
  doc.circle(photoX, photoY, photoR).clip();
  doc.image(photoPath, photoX - photoR, photoY - photoR, { width: photoR * 2, height: photoR * 2 });
  doc.restore();
} else {
  doc.circle(photoX, photoY, photoR).fill(CARD);
}

// Name & title
const nameX = M + photoR * 2 + 22;
doc.fontSize(28).font("Helvetica-Bold").fillColor(WHITE)
   .text("Than Seyha", nameX, M + 12, { width: PW - nameX - M });
doc.fontSize(13).font("Helvetica").fillColor(LGRAY)
   .text("Software Developer", nameX, M + 48, { width: PW - nameX - M });

// Contact bar below header
const headerBottom = M + photoR * 2 + 18;
const contacts = "thanseyha2002@gmail.com   |   +855 186323203   |   github.com/seyha29   |   Phnom Penh, Cambodia";
doc.fontSize(8).font("Helvetica").fillColor(LGRAY)
   .text(contacts, M, headerBottom, { width: PW - M * 2, align: "center" });

let curY = headerBottom + 10;

// ── Single centered blue line below header ────────────────────────────
doc.moveTo(M, curY).lineTo(PW - M, curY).strokeColor(BLUE).lineWidth(1.5).stroke();
curY += 14;

// ── Helper: horizontal divider (no-op) ───────────────────────────────
function divider(_y) {}

// ── Helper: section heading (blue text, no underline) ─────────────────
function sectionHeading(label, x, y, w) {
  doc.fontSize(14).font("Helvetica-Bold").fillColor(BLUE).text(label, x, y, { width: w });
  return doc.y + 5;
}

// ── Helper: entry title ───────────────────────────────────────────────
function entryTitle(text, x, y, w) {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(WHITE).text(text, x, y, { width: w });
  return doc.y;
}

// ── Helper: entry sub ─────────────────────────────────────────────────
function entrySub(text, x, y, w) {
  doc.fontSize(9.5).font("Helvetica").fillColor(LGRAY).text(text, x, y, { width: w });
  return doc.y;
}

// ── Helper: entry italic (period) ─────────────────────────────────────
function entryItalic(text, x, y, w) {
  doc.fontSize(9).font("Helvetica-Oblique").fillColor(BLUE).text(text, x, y, { width: w });
  return doc.y;
}

// ── Helper: body text ─────────────────────────────────────────────────
function bodyText(text, x, y, w) {
  doc.fontSize(9.5).font("Helvetica").fillColor(WHITE).text(text, x, y, { width: w, lineGap: 2 });
  return doc.y + 2;
}

// ── Helper: inline bold+normal ────────────────────────────────────────
function boldLine(boldPart, normalPart, x, y, w) {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(WHITE).text(boldPart, x, y, { width: w, continued: false });
  const lineY = doc.y - doc.currentLineHeight(true);
  const bw = doc.widthOfString(boldPart);
  doc.fontSize(9.5).font("Helvetica").fillColor(WHITE).text(normalPart, x + bw, lineY, { width: w - bw, lineGap: 2 });
  return doc.y + 2;
}

// ── MY SUMMARY (full width) ───────────────────────────────────────────
divider(curY);
curY += 6;
curY = sectionHeading("My Summary", LX, curY, PW - M * 2);
curY = bodyText(
  "I am a recent Computer Science graduate passionate about technology and software development. " +
  "Skilled in programming, problem-solving, and eager to contribute through internships and projects. " +
  "Motivated and ready to grow in a dynamic tech environment.",
  LX, curY, PW - M * 2
);
curY += 8;

// ── EDUCATION  |  EXPERIENCE  (two columns) ───────────────────────────
const row1Y = curY;
divider(row1Y);
curY = row1Y + 6;

// — Left: Education —
let ly = sectionHeading("Education", LX, curY, CW);

const eduItems = [
  ["Bachelor's Degree in Computer Science", "Royal University Of Phnom Penh, Graduated 2025"],
  ["Diploma General Education",             "Hun Sen Sandek High School, Graduated 2021"],
];
eduItems.forEach(([title, sub]) => {
  ly = entryTitle(title, LX, ly, CW);
  ly = entrySub(sub, LX, ly, CW);
  ly += 10;
});
const leftEndY1 = ly;

// — Right: Experience —
let ry = sectionHeading("Experience", RX, curY, CW);

ry = entryTitle("Freelance Web Developer", RX, ry, CW);
ry = entrySub("Self-employed", RX, ry, CW);
ry = entryItalic("2023 - Present", RX, ry, CW);
ry = bodyText(
  "Built and maintained websites for clients including e-commerce platforms, portfolio sites, and landing pages using React, Laravel, and MySQL.",
  RX, ry, CW
);
const rightEndY1 = ry;

curY = Math.max(leftEndY1, rightEndY1) + 8;

// ── SKILLS  |  LANGUAGES  (two columns) ──────────────────────────────
divider(curY);
curY += 6;

// — Left: Skills —
ly = sectionHeading("Skills", LX, curY, CW);

const skillItems = [
  ["Frontend: ",             "HTML, CSS, JavaScript, React.js, Bootstrap, Tailwind"],
  ["Backend: ",              "PHP, Laravel"],
  ["Tools & Technologies: ", "Git, GitHub, REST APIs, MySQL, Responsive Web Design"],
  ["Research: ",             "Google, AI"],
];
skillItems.forEach(([bold, normal]) => {
  ly = boldLine(bold, normal, LX, ly, CW);
  ly += 5;
});
const leftEndY2 = ly;

// — Right: Languages —
ry = sectionHeading("Languages", RX, curY, CW);

["Khmer (Native)", "English (Medium)"].forEach((lang) => {
  ry = bodyText(lang, RX, ry, CW);
  ry += 5;
});
const rightEndY2 = ry;

curY = Math.max(leftEndY2, rightEndY2) + 8;

// ── CONTACT  |  PERSONAL INFO  (two columns) ─────────────────────────
divider(curY);
curY += 6;

// — Left: Contact —
ly = sectionHeading("Contact", LX, curY, CW);

const contactItems = [
  ["Email: ",    "thanseyha2002@gmail.com"],
  ["Phone: ",    "+855 186323203"],
  ["GitHub: ",   "seyha29"],
  ["LinkedIn: ", "thanseyha"],
  ["Telegram: ", "@thanseyha11"],
];
contactItems.forEach(([bold, val]) => {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(WHITE).text(bold, LX, ly, { width: CW, continued: false });
  const bw = doc.widthOfString(bold);
  const lineY2 = ly;
  doc.fontSize(9.5).font("Helvetica").fillColor(LBLUE).text(val, LX + bw, lineY2, { width: CW - bw });
  ly = doc.y;
  ly += 8;
});
const leftEndY3 = ly;

// — Right: Personal Info —
ry = sectionHeading("Personal Info", RX, curY, CW);

const personalItems = [
  ["Gender: ",        "Male"],
  ["Date of Birth: ", "03 August 2002"],
  ["Age: ",           "23 years old"],
  ["Address: ",       "Phnom Penh, Cambodia"],
];
personalItems.forEach(([bold, val]) => {
  const bw = doc.widthOfString(bold) + 1;
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(WHITE).text(bold, RX, ry, { width: CW, continued: false });
  const lineY3 = ry;
  doc.fontSize(9.5).font("Helvetica").fillColor(WHITE).text(val, RX + bw, lineY3, { width: CW - bw });
  ry = doc.y;
  ry += 8;
});
const rightEndY3 = ry;

curY = Math.max(leftEndY3, rightEndY3) + 8;

// ── CERTIFICATES (full width) ─────────────────────────────────────────
if (curY < PH - 80) {
  divider(curY);
  curY += 6;
  curY = sectionHeading("Certificates", LX, curY, PW - M * 2);

  [
    ["AWS Academy Cloud Foundations",       "Amazon Web Services  |  April 27, 2025"],
    ["Fortinet Network Security Associate", "Fortinet  |  June 15, 2025"],
  ].forEach(([title, sub]) => {
    curY = entryTitle("- " + title, LX, curY, PW - M * 2);
    curY = entrySub(sub, LX, curY, PW - M * 2);
    curY += 4;
  });
}

// ── Download note ─────────────────────────────────────────────────────
const noteY = PH - 24;
doc.fontSize(7.5).font("Helvetica").fillColor(LGRAY)
   .text(
     "thanseyha2002@gmail.com  |  +855 186323203  |  github.com/seyha29  |  linkedin.com/in/thanseyha",
     M, noteY, { width: PW - M * 2, align: "center" }
   );

doc.end();
console.log("PDF generated:", outPath);
