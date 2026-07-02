import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const doc = new PDFDocument({ margin: 0, size: "A4" });
const outPath = path.resolve("artifacts/portfolio/public/assets/Resume.pdf");
doc.pipe(fs.createWriteStream(outPath));

const PW = doc.page.width;   // 595.28
const PH = doc.page.height;  // 841.89

const BLUE     = "#2563EB";
const DARKBLUE = "#1e3a8a";
const SIDEBG   = "#1e293b";
const DARK     = "#1e293b";
const GRAY     = "#475569";
const LGRAY    = "#94a3b8";
const WHITE    = "#ffffff";
const LBLUE    = "#bfdbfe";
const DIVBLUE  = "#dbeafe";

const SIDEBAR_W = 190;
const PAD       = 16;
const HDR_H     = 115;

// ── Backgrounds ───────────────────────────────────────────────────────
doc.rect(0, 0, SIDEBAR_W, PH).fill(SIDEBG);
doc.rect(SIDEBAR_W, 0, PW - SIDEBAR_W, PH).fill(WHITE);
doc.rect(0, 0, PW, HDR_H).fill(BLUE);

// ── Profile photo ─────────────────────────────────────────────────────
const photoX = SIDEBAR_W / 2;
const photoY = HDR_H + 52;
const R = 42;
doc.circle(photoX, photoY, R + 3).fill(DARKBLUE);
const photoPath = path.resolve("artifacts/portfolio/public/assets/profile1.jpg");
if (fs.existsSync(photoPath)) {
  doc.save();
  doc.circle(photoX, photoY, R).clip();
  doc.image(photoPath, photoX - R, photoY - R, { width: R * 2, height: R * 2 });
  doc.restore();
} else {
  doc.circle(photoX, photoY, R).fill(BLUE);
  doc.fontSize(9).font("Helvetica").fillColor(WHITE).text("PHOTO", photoX - 14, photoY - 5);
}

// ── Header text ───────────────────────────────────────────────────────
const hx = SIDEBAR_W + PAD;
doc.fontSize(24).font("Helvetica-Bold").fillColor(WHITE).text("Than Seyha", hx, 20);
doc.fontSize(12).font("Helvetica").fillColor(DIVBLUE).text("Software Developer", hx, 52);
doc.fontSize(8.5).fillColor(LBLUE)
   .text("thanseyha2002@gmail.com   |   +855 186 323 203   |   github.com/seyha29   |   Phnom Penh, Cambodia", hx, 82, {
     width: PW - SIDEBAR_W - PAD * 2,
   });

// ── SIDEBAR helpers ───────────────────────────────────────────────────
let sy = photoY + R + 20;

function sideSection(title) {
  sy += 8;
  doc.moveTo(PAD, sy).lineTo(SIDEBAR_W - PAD, sy).strokeColor("#334155").lineWidth(0.5).stroke();
  sy += 5;
  doc.fontSize(8.5).font("Helvetica-Bold").fillColor(BLUE)
     .text(title, PAD, sy, { width: SIDEBAR_W - PAD * 2 });
  sy = doc.y + 4;
}

function sideCat(label) {
  doc.fontSize(8.5).font("Helvetica-Bold").fillColor(WHITE)
     .text(label, PAD, sy, { width: SIDEBAR_W - PAD * 2 });
  sy = doc.y + 1;
}

function sideItem(text) {
  doc.fontSize(8).font("Helvetica").fillColor(LGRAY)
     .text(text, PAD, sy, { width: SIDEBAR_W - PAD * 2, lineGap: 1 });
  sy = doc.y + 3;
}

// Skills
sideSection("SKILLS");
sideCat("Frontend");
sideItem("HTML, CSS, JavaScript\nReact.js, Bootstrap, Tailwind");
sideCat("Backend");
sideItem("PHP, Laravel, Node.js, Express");
sideCat("Database");
sideItem("MySQL");
sideCat("Tools");
sideItem("Git, GitHub, Figma, REST APIs");

// Languages
sideSection("LANGUAGES");
sideItem("Khmer (Native)");
sideItem("English (Intermediate)");

// Personal
sideSection("PERSONAL");
const personal = [
  ["Gender",    "Male"],
  ["Born",      "03 August 2002"],
  ["Age",       "23 years old"],
  ["Address",   "Phnom Penh, Cambodia"],
  ["Telegram",  "@thanseyha11"],
  ["LinkedIn",  "linkedin.com/in/thanseyha"],
];
personal.forEach(([k, v]) => {
  doc.fontSize(7.5).font("Helvetica-Bold").fillColor(LGRAY)
     .text(k.toUpperCase(), PAD, sy, { width: SIDEBAR_W - PAD * 2 });
  sy = doc.y;
  doc.fontSize(8.5).font("Helvetica").fillColor(WHITE)
     .text(v, PAD, sy, { width: SIDEBAR_W - PAD * 2, lineGap: 1 });
  sy = doc.y + 5;
});

// ── MAIN content helpers ──────────────────────────────────────────────
const MX = SIDEBAR_W + PAD;
const MW = PW - SIDEBAR_W - PAD * 2;
let my = HDR_H + 14;

function mainSection(title) {
  my += 7;
  doc.fontSize(10).font("Helvetica-Bold").fillColor(BLUE)
     .text(title, MX, my, { width: MW });
  my = doc.y + 1;
  doc.moveTo(MX, my).lineTo(MX + MW, my).strokeColor(BLUE).lineWidth(0.7).stroke();
  my += 5;
}

function mainTitle(text) {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK)
     .text(text, MX, my, { width: MW });
  my = doc.y;
}

function mainSub(text) {
  doc.fontSize(8.5).font("Helvetica").fillColor(LGRAY)
     .text(text, MX, my, { width: MW });
  my = doc.y;
}

function mainItalic(text) {
  doc.fontSize(8.5).font("Helvetica-Oblique").fillColor(BLUE)
     .text(text, MX, my, { width: MW });
  my = doc.y;
}

function mainBody(text) {
  doc.fontSize(9).font("Helvetica").fillColor(GRAY)
     .text(text, MX, my, { width: MW, lineGap: 2 });
  my = doc.y + 2;
}

function mainLink(text) {
  doc.fontSize(8).font("Helvetica").fillColor(BLUE)
     .text(text, MX, my, { width: MW });
  my = doc.y;
}

// ── SUMMARY ───────────────────────────────────────────────────────────
mainSection("PROFILE SUMMARY");
mainBody(
  "Recent Computer Science graduate passionate about software development and web technologies. Skilled in front-end development using React, HTML, CSS and JavaScript, with hands-on experience building e-commerce platforms, university websites and portfolio projects. Eager to contribute through internships and professional roles in a dynamic tech environment."
);

// ── EXPERIENCE ────────────────────────────────────────────────────────
mainSection("EXPERIENCE");
mainTitle("Freelance Web Developer");
mainSub("Self-employed");
mainItalic("2023 - Present");
mainBody("Designed and developed responsive websites for clients: e-commerce stores, portfolio sites and landing pages using React.js, Laravel, MySQL and REST APIs.");

// ── EDUCATION ─────────────────────────────────────────────────────────
mainSection("EDUCATION");
[
  ["Bachelor of Computer Science", "Royal University of Phnom Penh  |  Graduated 2025"],
  ["Diploma - General Education",  "Hun Sen Sandek High School  |  Graduated 2021"],
].forEach(([deg, sub]) => {
  mainTitle(deg);
  mainSub(sub);
  my += 4;
});

// ── CERTIFICATES ──────────────────────────────────────────────────────
mainSection("CERTIFICATES");
[
  ["AWS Academy Cloud Foundations",       "Amazon Web Services  |  April 27, 2025"],
  ["Fortinet Network Security Associate", "Fortinet  |  June 15, 2025"],
].forEach(([title, sub]) => {
  mainTitle("- " + title);
  mainSub(sub);
  my += 3;
});

// ── PROJECTS ──────────────────────────────────────────────────────────
mainSection("PROJECTS");
const projects = [
  {
    name:  "University IU CAM Website",
    stack: "React.js, CSS Modules",
    desc:  "Responsive university website with modern UI and smooth animations.",
    url:   "seyha29.github.io/my-react-website",
  },
  {
    name:  "React E-Commerce Store",
    stack: "React.js, Stripe",
    desc:  "Shopping cart, authentication, Stripe payments, Khmer/English translation.",
    url:   "seyha29.github.io/ecomerces_react_js",
  },
  {
    name:  "Laravel E-Commerce Platform",
    stack: "Laravel, MySQL",
    desc:  "Full-stack store with product management and payment processing.",
  },
  {
    name:  "RUENG VIP - Movie Streaming",
    stack: "Node.js, Express",
    desc:  "Movie streaming web application.",
    url:   "ruengvip.com",
  },
];

projects.forEach(({ name, stack, desc, url }) => {
  mainTitle("- " + name);
  mainSub(stack);
  mainBody(desc);
  if (url) mainLink(url);
  my += 2;
});

// ── Footer ────────────────────────────────────────────────────────────
const FY = PH - 25;
doc.rect(SIDEBAR_W, FY - 4, PW - SIDEBAR_W, 30).fill("#f8fafc");
doc.fontSize(7.5).font("Helvetica").fillColor(LGRAY)
   .text(
     "thanseyha2002@gmail.com  |  +855 186 323 203  |  github.com/seyha29  |  linkedin.com/in/thanseyha",
     SIDEBAR_W + PAD, FY + 3,
     { width: PW - SIDEBAR_W - PAD * 2, align: "center" }
   );

doc.end();
console.log("PDF generated:", outPath);
