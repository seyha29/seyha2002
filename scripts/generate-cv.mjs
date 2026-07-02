import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const doc = new PDFDocument({ margin: 50, size: "A4" });
const outPath = path.resolve("artifacts/portfolio/public/assets/Resume.pdf");
doc.pipe(fs.createWriteStream(outPath));

const W = doc.page.width;
const BLUE = "#2563EB";
const DARK = "#1e293b";
const GRAY = "#64748b";
const LIGHT = "#f1f5f9";
const WHITE = "#ffffff";

// ── Header background ──────────────────────────────────────────
doc.rect(0, 0, W, 130).fill(BLUE);

// Profile circle placeholder
doc.circle(90, 65, 42).fill(WHITE);
doc.fontSize(10).fillColor(BLUE).text("PHOTO", 68, 59);

// Name & title
doc.fontSize(26).font("Helvetica-Bold").fillColor(WHITE).text("Than Seyha", 148, 28);
doc.fontSize(13).font("Helvetica").fillColor("#bfdbfe").text("Software Developer", 148, 60);

// Contact row
const contacts = [
  "thanseyha2002@gmail.com",
  "+855 186 323 203",
  "github.com/seyha29",
  "Phnom Penh, Cambodia",
];
doc.fontSize(8).fillColor("#dbeafe");
let cx = 148;
contacts.forEach((c, i) => {
  doc.text(c, cx, 84);
  cx += doc.widthOfString(c) + 20;
});

doc.y = 145;

// ── Helper: section heading ────────────────────────────────────
function sectionHeading(title) {
  doc.moveDown(0.6);
  doc.fontSize(11).font("Helvetica-Bold").fillColor(BLUE).text(title.toUpperCase());
  doc
    .moveTo(50, doc.y + 2)
    .lineTo(W - 50, doc.y + 2)
    .strokeColor(BLUE)
    .lineWidth(1)
    .stroke();
  doc.moveDown(0.4);
}

// ── Helper: body text ──────────────────────────────────────────
function body(text, options = {}) {
  doc.fontSize(9.5).font("Helvetica").fillColor(DARK).text(text, { lineGap: 2, ...options });
}

function label(text) {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK).text(text, { continued: true });
}

// ── SUMMARY ───────────────────────────────────────────────────
sectionHeading("Profile Summary");
body(
  "Recent Computer Science graduate from the Royal University of Phnom Penh, passionate about software development and web technologies. Skilled in front-end development using React, HTML, CSS and JavaScript, with hands-on experience building e-commerce platforms, university websites, and portfolio projects. Eager to contribute through internships and professional roles in a dynamic tech environment."
);

// ── Two-column layout helper ───────────────────────────────────
const LEFT = 50;
const RIGHT = 310;
const COL_W = 235;

// ── EXPERIENCE ────────────────────────────────────────────────
sectionHeading("Experience");

function expEntry(role, company, period, desc) {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK).text(role, { continued: true });
  doc.fontSize(9.5).font("Helvetica").fillColor(GRAY).text(`  —  ${company}`);
  doc.fontSize(8.5).font("Helvetica-Oblique").fillColor(GRAY).text(period);
  body(desc, { lineGap: 2 });
  doc.moveDown(0.3);
}

expEntry(
  "Freelance Web Developer",
  "Self-employed",
  "2023 – Present",
  "Designed and developed responsive websites for clients, including e-commerce stores, portfolio sites, and landing pages using React.js, Laravel, MySQL, and REST APIs."
);

// ── EDUCATION ─────────────────────────────────────────────────
sectionHeading("Education");

function eduEntry(degree, school, year) {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK).text(degree);
  doc.fontSize(9.5).font("Helvetica").fillColor(GRAY).text(`${school}  ·  ${year}`);
  doc.moveDown(0.3);
}

eduEntry("Bachelor of Computer Science", "Royal University of Phnom Penh", "Graduated 2025");
eduEntry("Diploma — General Education", "Hun Sen Sandek High School", "Graduated 2021");

// ── Save Y for two-column start ────────────────────────────────
const twoColY = doc.y + 8;

// ── LEFT COLUMN — SKILLS ─────────────────────────────────────
doc.y = twoColY;
doc.x = LEFT;
doc.fontSize(11).font("Helvetica-Bold").fillColor(BLUE).text("SKILLS", LEFT, twoColY, { width: COL_W });
doc.moveTo(LEFT, doc.y + 2).lineTo(LEFT + COL_W, doc.y + 2).strokeColor(BLUE).lineWidth(1).stroke();
doc.moveDown(0.4);

const skills = [
  ["Frontend", "HTML · CSS · JavaScript · React.js · Bootstrap · Tailwind"],
  ["Backend", "PHP · Laravel · Node.js · Express"],
  ["Database", "MySQL"],
  ["Tools", "Git · GitHub · REST APIs · Figma · Responsive Design"],
  ["Research", "Google · AI tools"],
];

skills.forEach(([cat, items]) => {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK).text(cat + ":", LEFT, doc.y, { width: COL_W });
  doc.fontSize(9).font("Helvetica").fillColor(GRAY).text(items, LEFT, doc.y, { width: COL_W, lineGap: 1 });
  doc.moveDown(0.25);
});

// ── RIGHT COLUMN — LANGUAGES & PERSONAL ─────────────────────
const rightY = twoColY;
doc.y = rightY;
doc.fontSize(11).font("Helvetica-Bold").fillColor(BLUE).text("LANGUAGES", RIGHT, rightY, { width: COL_W });
doc.moveTo(RIGHT, doc.y + 2).lineTo(RIGHT + COL_W, doc.y + 2).strokeColor(BLUE).lineWidth(1).stroke();
doc.moveDown(0.4);

["Khmer — Native", "English — Intermediate"].forEach((l) => {
  doc.fontSize(9.5).font("Helvetica").fillColor(DARK).text(l, RIGHT, doc.y, { width: COL_W });
  doc.moveDown(0.2);
});

doc.moveDown(0.6);
doc.fontSize(11).font("Helvetica-Bold").fillColor(BLUE).text("PERSONAL INFO", RIGHT, doc.y, { width: COL_W });
doc.moveTo(RIGHT, doc.y + 2).lineTo(RIGHT + COL_W, doc.y + 2).strokeColor(BLUE).lineWidth(1).stroke();
doc.moveDown(0.4);

const personal = [
  ["Gender", "Male"],
  ["Date of Birth", "03 August 2002"],
  ["Age", "23 years old"],
  ["Address", "Phnom Penh, Cambodia"],
  ["Telegram", "@thanseyha11"],
  ["LinkedIn", "linkedin.com/in/thanseyha"],
];

personal.forEach(([k, v]) => {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK).text(k + ": ", RIGHT, doc.y, { continued: true, width: COL_W });
  doc.font("Helvetica").fillColor(GRAY).text(v, { width: COL_W });
  doc.moveDown(0.15);
});

// ── CERTIFICATES ──────────────────────────────────────────────
const afterCols = Math.max(doc.y, twoColY + 180);
doc.y = afterCols + 10;
doc.x = LEFT;

sectionHeading("Certificates");

const certs = [
  ["AWS Academy Cloud Foundations", "Amazon Web Services", "April 27, 2025"],
  ["Fortinet Network Security Associate", "Fortinet", "June 15, 2025"],
];

certs.forEach(([title, issuer, date]) => {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK).text(`• ${title}`, { continued: true });
  doc.fontSize(9.5).font("Helvetica").fillColor(GRAY).text(`  —  ${issuer}  ·  ${date}`);
  doc.moveDown(0.2);
});

// ── PROJECTS ──────────────────────────────────────────────────
sectionHeading("Projects");

const projects = [
  ["University IU CAM Website", "React.js, CSS Modules", "Responsive university website with modern UI and smooth animations.", "https://seyha29.github.io/my-react-website/"],
  ["React E-Commerce Store", "React.js, Stripe", "Full-featured store with cart, authentication, payment integration, Khmer/English translation, and receipt download.", "https://seyha29.github.io/ecomerces_react_js/"],
  ["Laravel E-Commerce Platform", "Laravel, MySQL", "Full-stack e-commerce with product management and payment processing."],
  ["RUENG VIP — Movie Streaming", "Node.js, Express", "Movie streaming web app.", "http://ruengvip.com/"],
];

projects.forEach(([name, stack, desc, link]) => {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK).text(`• ${name}`, { continued: true });
  doc.fontSize(9).font("Helvetica").fillColor(BLUE).text(`  [${stack}]`);
  body(desc);
  if (link) {
    doc.fontSize(8.5).fillColor(BLUE).text(link, { underline: true });
  }
  doc.moveDown(0.25);
});

// ── Footer ─────────────────────────────────────────────────────
doc.moveDown(0.5);
const footerY = doc.page.height - 40;
doc.moveTo(50, footerY).lineTo(W - 50, footerY).strokeColor("#e2e8f0").lineWidth(0.5).stroke();
doc.fontSize(8).font("Helvetica").fillColor(GRAY).text(
  "thanseyha2002@gmail.com  ·  +855 186 323 203  ·  github.com/seyha29  ·  linkedin.com/in/thanseyha",
  50,
  footerY + 6,
  { align: "center", width: W - 100 }
);

doc.end();
console.log("PDF generated at:", outPath);
