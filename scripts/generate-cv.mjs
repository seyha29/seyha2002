import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const doc = new PDFDocument({ margin: 0, size: "A4" });
const outPath = path.resolve("artifacts/portfolio/public/assets/Resume.pdf");
doc.pipe(fs.createWriteStream(outPath));

const PW = doc.page.width;
const PH = doc.page.height;

const BLUE  = "#2563EB";
const DARK  = "#1e293b";
const GRAY  = "#475569";
const LGRAY = "#94a3b8";
const LBLUE = "#60a5fa";

const M   = 36;
const GAP = 24;
const CW  = (PW - M * 2 - GAP) / 2;
const LX  = M;
const RX  = M + CW + GAP;
const SEC = 14;  // gap between sections

// ── Full white page ────────────────────────────────────────────────────
doc.rect(0, 0, PW, PH).fill("#ffffff");

// ── Profile photo ──────────────────────────────────────────────────────
const photoR = 42;
const photoX = M + photoR;
const photoY = M + photoR + 4;
const photoPath = path.resolve("artifacts/portfolio/public/assets/profile1.jpg");
doc.circle(photoX, photoY, photoR + 3).lineWidth(3).strokeColor(BLUE).stroke();
if (fs.existsSync(photoPath)) {
  doc.save();
  doc.circle(photoX, photoY, photoR).clip();
  doc.image(photoPath, photoX - photoR, photoY - photoR, { width: photoR * 2, height: photoR * 2 });
  doc.restore();
}

// ── Header name & title ────────────────────────────────────────────────
const nameX = M + photoR * 2 + 20;
doc.fontSize(26).font("Helvetica-Bold").fillColor(DARK)
   .text("Than Seyha", nameX, M + 10, { width: PW - nameX - M });
doc.fontSize(12).font("Helvetica").fillColor(GRAY)
   .text("Software Developer", nameX, M + 44, { width: PW - nameX - M });

// ── Contact row ────────────────────────────────────────────────────────
const hdrBottom = M + photoR * 2 + 16;
doc.fontSize(8).font("Helvetica").fillColor(LGRAY)
   .text(
     "thanseyha2002@gmail.com   |   +855 186323203   |   github.com/seyha29   |   Phnom Penh, Cambodia",
     M, hdrBottom, { width: PW - M * 2, align: "center" }
   );

// ── Single blue line ───────────────────────────────────────────────────
const lineY = hdrBottom + 14;
doc.moveTo(M, lineY).lineTo(PW - M, lineY).strokeColor(BLUE).lineWidth(1.5).stroke();

let curY = lineY + SEC;

// ── HELPERS ────────────────────────────────────────────────────────────

// Section heading — blue, no underline
function heading(label, x, y, w) {
  doc.fontSize(13).font("Helvetica-Bold").fillColor(BLUE).text(label, x, y, { width: w });
  return doc.y + 4;
}

// Bold title line
function titleLine(text, x, y, w) {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK).text(text, x, y, { width: w });
  return doc.y + 1;
}

// Gray sub line
function subLine(text, x, y, w) {
  doc.fontSize(9).font("Helvetica").fillColor(GRAY).text(text, x, y, { width: w });
  return doc.y + 2;
}

// Italic blue line (for date/period)
function italicLine(text, x, y, w) {
  doc.fontSize(9).font("Helvetica-Oblique").fillColor(BLUE).text(text, x, y, { width: w });
  return doc.y + 1;
}

// Body text
function bodyLine(text, x, y, w) {
  doc.fontSize(9.5).font("Helvetica").fillColor(DARK).text(text, x, y, { width: w, lineGap: 1.5 });
  return doc.y + 3;
}

// Bold label + normal text on same line (uses continued:true so wrapping stays at x)
function boldInline(bold, normal, x, y, w) {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK)
     .text(bold, x, y, { width: w, continued: true });
  doc.font("Helvetica").fillColor(DARK)
     .text(normal, { lineGap: 1.5 });
  return doc.y + 5;
}

// ── MY SUMMARY (full width) ────────────────────────────────────────────
curY = heading("My Summary", LX, curY, PW - M * 2);
curY = bodyLine(
  "I am a recent Computer Science graduate passionate about technology and software development. " +
  "Skilled in programming, problem-solving, and eager to contribute through internships and projects. " +
  "Motivated and ready to grow in a dynamic tech environment.",
  LX, curY, PW - M * 2
);
curY += SEC;

// ── EDUCATION | EXPERIENCE ────────────────────────────────────────────
const row1Start = curY;

// Left: Education
let ly = heading("Education", LX, row1Start, CW);
ly = titleLine("Bachelor's Degree in Computer Science", LX, ly, CW);
ly = subLine("Royal University Of Phnom Penh, Graduated 2025", LX, ly, CW);
ly += 6;
ly = titleLine("Diploma General Education", LX, ly, CW);
ly = subLine("Hun Sen Sandek High School, Graduated 2021", LX, ly, CW);

// Right: Experience
let ry = heading("Experience", RX, row1Start, CW);
ry = titleLine("Freelance Web Developer", RX, ry, CW);
ry = subLine("Self-employed", RX, ry, CW);
ry = italicLine("2023 - Present", RX, ry, CW);
ry = bodyLine(
  "Built and maintained websites for clients including e-commerce platforms, portfolio sites, and landing pages using React, Laravel, and MySQL.",
  RX, ry, CW
);

curY = Math.max(ly, ry) + SEC;

// ── SKILLS | LANGUAGES ────────────────────────────────────────────────
const row2Start = curY;

// Left: Skills
ly = heading("Skills", LX, row2Start, CW);
ly = boldInline("Frontend: ",             "HTML, CSS, JavaScript, React.js, Bootstrap, Tailwind", LX, ly, CW);
ly = boldInline("Backend: ",              "PHP, Laravel", LX, ly, CW);
ly = boldInline("Tools & Technologies: ", "Git, GitHub, REST APIs, MySQL, Responsive Web Design", LX, ly, CW);
ly = boldInline("Research: ",             "Google, AI", LX, ly, CW);

// Right: Languages
ry = heading("Languages", RX, row2Start, CW);
ry = bodyLine("Khmer (Native)", RX, ry, CW);
ry += 2;
ry = bodyLine("English (Medium)", RX, ry, CW);

curY = Math.max(ly, ry) + SEC;

// ── CONTACT | PERSONAL INFO ───────────────────────────────────────────
const row3Start = curY;

// Left: Contact
ly = heading("Contact", LX, row3Start, CW);

function contactRow(label, value, isLink, x, y, w) {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK)
     .text(label, x, y, { width: w, continued: true });
  doc.font("Helvetica").fillColor(isLink ? LBLUE : DARK)
     .text(value, { lineGap: 1.5 });
  return doc.y + 5;
}

ly = contactRow("Email: ",    "thanseyha2002@gmail.com", true,  LX, ly, CW);
ly = contactRow("Phone: ",    "+855 186323203",           false, LX, ly, CW);
ly = contactRow("GitHub: ",   "seyha29",                  true,  LX, ly, CW);
ly = contactRow("LinkedIn: ", "thanseyha",                true,  LX, ly, CW);
ly = contactRow("Telegram: ", "@thanseyha11",             false, LX, ly, CW);

// Right: Personal Info
ry = heading("Personal Info", RX, row3Start, CW);

function infoRow(label, value, x, y, w) {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK)
     .text(label, x, y, { width: w, continued: true });
  doc.font("Helvetica").fillColor(DARK)
     .text(value, { lineGap: 1.5 });
  return doc.y + 5;
}

ry = infoRow("Gender: ",        "Male",                 RX, ry, CW);
ry = infoRow("Date of Birth: ", "03 August 2002",       RX, ry, CW);
ry = infoRow("Age: ",           "23 years old",         RX, ry, CW);
ry = infoRow("Address: ",       "Phnom Penh, Cambodia", RX, ry, CW);

curY = Math.max(ly, ry) + SEC;

// ── CERTIFICATES (full width) ─────────────────────────────────────────
curY = heading("Certificates", LX, curY, PW - M * 2);
[
  ["AWS Academy Cloud Foundations",       "Amazon Web Services  |  April 27, 2025"],
  ["Fortinet Network Security Associate", "Fortinet  |  June 15, 2025"],
].forEach(([title, sub]) => {
  curY = titleLine("- " + title, LX, curY, PW - M * 2);
  curY = subLine(sub, LX, curY, PW - M * 2);
  curY += 4;
});

// ── Footer ────────────────────────────────────────────────────────────
doc.fontSize(7.5).font("Helvetica").fillColor(LGRAY)
   .text(
     "thanseyha2002@gmail.com  |  +855 186323203  |  github.com/seyha29  |  linkedin.com/in/thanseyha",
     M, PH - 22, { width: PW - M * 2, align: "center" }
   );

doc.end();
console.log("PDF generated:", outPath);
