import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const doc = new PDFDocument({ margin: 0, size: "A4" });
const outPath = path.resolve("artifacts/portfolio/public/assets/Resume.pdf");
doc.pipe(fs.createWriteStream(outPath));

const PW = doc.page.width;   // 595
const PH = doc.page.height;  // 842

const BLUE     = "#2563EB";
const DARKBLUE = "#1e3a8a";
const DARK     = "#1e293b";
const GRAY     = "#475569";
const LGRAY    = "#94a3b8";
const WHITE    = "#ffffff";
const DIVIDER  = "#dbeafe";
const BGRIGHT  = "#f8fafc";

const SIDEBAR_W = 195;
const MAIN_X    = SIDEBAR_W;
const MAIN_W    = PW - SIDEBAR_W;
const PAD       = 18;

// ─── SIDEBAR background ─────────────────────────────────────────────
doc.rect(0, 0, SIDEBAR_W, PH).fill(DARK);

// ─── MAIN background ────────────────────────────────────────────────
doc.rect(SIDEBAR_W, 0, MAIN_W, PH).fill(WHITE);

// ─── HEADER strip (full width) ──────────────────────────────────────
const HDR_H = 120;
doc.rect(0, 0, PW, HDR_H).fill(BLUE);

// Profile photo circle
const cx = SIDEBAR_W / 2;
const cy = HDR_H + 54;
const radius = 44;
doc.circle(cx, cy, radius + 3).fill(DARKBLUE);  // border
doc.circle(cx, cy, radius).fill(BLUE);           // placeholder fill (will be overridden if photo exists)

// Try to embed actual profile photo
const photoPath = path.resolve("artifacts/portfolio/public/assets/profile1.jpg");
if (fs.existsSync(photoPath)) {
  doc.save();
  doc.circle(cx, cy, radius).clip();
  doc.image(photoPath, cx - radius, cy - radius, { width: radius * 2, height: radius * 2 });
  doc.restore();
} else {
  doc.fontSize(9).font("Helvetica").fillColor(WHITE).text("PHOTO", cx - 16, cy - 6);
}

// Name & title in header
doc.fontSize(22).font("Helvetica-Bold").fillColor(WHITE)
   .text("Than Seyha", SIDEBAR_W + PAD, 22, { width: MAIN_W - PAD * 2 });
doc.fontSize(12).font("Helvetica").fillColor(DIVIDER)
   .text("Software Developer", SIDEBAR_W + PAD, 52, { width: MAIN_W - PAD * 2 });

// Contact icons row
const contacts = [
  { icon: "✉", val: "thanseyha2002@gmail.com" },
  { icon: "☏", val: "+855 186 323 203" },
  { icon: "⌂", val: "Phnom Penh, Cambodia" },
];
let cx2 = SIDEBAR_W + PAD;
const cy2 = 82;
doc.fontSize(8).fillColor("#bfdbfe");
contacts.forEach(({ icon, val }) => {
  doc.font("Helvetica-Bold").text(icon + " ", cx2, cy2, { continued: true });
  doc.font("Helvetica").text(val + "   ", { continued: true });
  cx2 += doc.widthOfString(icon + " " + val + "   ");
});
doc.text("", { continued: false });

// ─── SIDEBAR content ────────────────────────────────────────────────
let sy = cy + radius + 24;  // start below photo circle

function sideLabel(text) {
  doc.rect(0, sy, SIDEBAR_W, 1).fill("#334155");
  sy += 6;
  doc.fontSize(9).font("Helvetica-Bold").fillColor(BLUE)
     .text(text, PAD, sy, { width: SIDEBAR_W - PAD * 2 });
  sy = doc.y + 5;
}

function sideText(text, opts = {}) {
  doc.fontSize(8.5).font("Helvetica").fillColor(LGRAY)
     .text(text, PAD, sy, { width: SIDEBAR_W - PAD * 2, lineGap: 1, ...opts });
  sy = doc.y + 3;
}

function sideBold(text) {
  doc.fontSize(8.5).font("Helvetica-Bold").fillColor(WHITE)
     .text(text, PAD, sy, { width: SIDEBAR_W - PAD * 2 });
  sy = doc.y + 1;
}

// Skills
sideLabel("SKILLS");

const skills = [
  ["Frontend", "HTML, CSS, JavaScript\nReact.js, Bootstrap, Tailwind"],
  ["Backend",  "PHP, Laravel, Node.js\nExpress"],
  ["Database", "MySQL"],
  ["Tools",    "Git, GitHub, Figma\nREST APIs"],
];
skills.forEach(([cat, items]) => {
  sideBold(cat);
  sideText(items);
  sy += 2;
});

sy += 4;
sideLabel("LANGUAGES");
sideText("Khmer (Native)");
sideText("English (Intermediate)");

sy += 4;
sideLabel("PERSONAL");
const personal = [
  ["Gender",  "Male"],
  ["Born",    "03 August 2002"],
  ["Age",     "23 years old"],
  ["Address", "Phnom Penh\nCambodia"],
  ["Telegram","@thanseyha11"],
];
personal.forEach(([k, v]) => {
  doc.fontSize(7.5).font("Helvetica-Bold").fillColor(LGRAY)
     .text(k.toUpperCase(), PAD, sy, { width: SIDEBAR_W - PAD * 2 });
  sy = doc.y;
  doc.fontSize(8.5).font("Helvetica").fillColor(WHITE)
     .text(v, PAD, sy, { width: SIDEBAR_W - PAD * 2, lineGap: 1 });
  sy = doc.y + 5;
});

sy += 4;
sideLabel("LINKS");
[
  "github.com/seyha29",
  "linkedin.com/in/thanseyha",
].forEach(l => {
  doc.fontSize(8).font("Helvetica").fillColor(BLUE)
     .text(l, PAD, sy, { width: SIDEBAR_W - PAD * 2, underline: false });
  sy = doc.y + 3;
});

// ─── MAIN content ───────────────────────────────────────────────────
const MX  = MAIN_X + PAD;
const MW  = MAIN_W - PAD * 2;
let my = HDR_H + 18;

function mainSection(title) {
  my += 6;
  doc.fontSize(10).font("Helvetica-Bold").fillColor(BLUE)
     .text(title, MX, my, { width: MW });
  my = doc.y + 1;
  doc.moveTo(MX, my).lineTo(MX + MW, my).strokeColor(BLUE).lineWidth(0.8).stroke();
  my += 5;
}

function mainBody(text, opts = {}) {
  doc.fontSize(9).font("Helvetica").fillColor(GRAY)
     .text(text, MX, my, { width: MW, lineGap: 2, ...opts });
  my = doc.y + 3;
}

function mainBold(text, opts = {}) {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK)
     .text(text, MX, my, { width: MW, ...opts });
  my = doc.y;
}

// SUMMARY
mainSection("PROFILE SUMMARY");
mainBody(
  "Recent Computer Science graduate passionate about software development and web technologies. Skilled in front-end development using React, HTML, CSS and JavaScript, with hands-on experience building e-commerce platforms, university websites, and portfolio projects. Eager to contribute through internships and professional roles in a dynamic tech environment."
);

// EXPERIENCE
mainSection("EXPERIENCE");
doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK)
   .text("Freelance Web Developer", MX, my, { width: MW, continued: true });
doc.fontSize(9).font("Helvetica").fillColor(LGRAY).text("  —  Self-employed");
my = doc.y;
doc.fontSize(8.5).font("Helvetica-Oblique").fillColor(BLUE)
   .text("2023 – Present", MX, my, { width: MW });
my = doc.y + 1;
mainBody("Designed and developed responsive websites for clients: e-commerce stores, portfolio sites, and landing pages using React.js, Laravel, MySQL and REST APIs.");

// EDUCATION
mainSection("EDUCATION");

[
  ["Bachelor of Computer Science", "Royal University of Phnom Penh", "Graduated 2025"],
  ["Diploma — General Education",  "Hun Sen Sandek High School",       "Graduated 2021"],
].forEach(([deg, school, year]) => {
  doc.fontSize(10).font("Helvetica-Bold").fillColor(DARK).text(deg, MX, my, { width: MW });
  my = doc.y;
  doc.fontSize(9).font("Helvetica").fillColor(GRAY).text(`${school}  ·  ${year}`, MX, my, { width: MW });
  my = doc.y + 5;
});

// CERTIFICATES
mainSection("CERTIFICATES");
[
  ["AWS Academy Cloud Foundations",       "Amazon Web Services", "April 27, 2025"],
  ["Fortinet Network Security Associate", "Fortinet",            "June 15, 2025"],
].forEach(([title, issuer, date]) => {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK)
     .text("▸  " + title, MX, my, { width: MW, continued: true });
  doc.fontSize(9).font("Helvetica").fillColor(LGRAY).text(`   ${issuer}  ·  ${date}`);
  my = doc.y + 3;
});

// PROJECTS
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
    name:  "RUENG VIP — Movie Streaming",
    stack: "Node.js, Express",
    desc:  "Movie streaming web application.",
    url:   "ruengvip.com",
  },
];

projects.forEach(({ name, stack, desc, url }) => {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(DARK)
     .text("▸  " + name, MX, my, { width: MW, continued: true });
  doc.fontSize(8.5).font("Helvetica").fillColor(BLUE).text(`  [${stack}]`);
  my = doc.y;
  doc.fontSize(9).font("Helvetica").fillColor(GRAY).text(desc, MX, my, { width: MW });
  my = doc.y;
  if (url) {
    doc.fontSize(8).fillColor(BLUE).text(url, MX, my, { width: MW });
    my = doc.y;
  }
  my += 4;
});

// ─── Footer ─────────────────────────────────────────────────────────
const FOOTER_Y = PH - 28;
doc.rect(SIDEBAR_W, FOOTER_Y - 2, MAIN_W, 30).fill(BGRIGHT);
doc.fontSize(7.5).font("Helvetica").fillColor(LGRAY)
   .text(
     "thanseyha2002@gmail.com  ·  +855 186 323 203  ·  github.com/seyha29  ·  linkedin.com/in/thanseyha",
     MAIN_X + PAD, FOOTER_Y + 4,
     { width: MAIN_W - PAD * 2, align: "center" }
   );

doc.end();
console.log("PDF generated at:", outPath);
