import { Router, type IRouter } from "express";
import fs from "fs";
import path from "path";

const DATA_FILE = path.resolve(process.cwd(), "data/portfolio.json");

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable is required");
}

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function authMiddleware(req: any, res: any, next: any) {
  const auth = req.headers["x-admin-password"];
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.get("/portfolio/all", (_req, res) => {
  res.json(readData());
});

router.get("/portfolio/projects", (_req, res) => {
  res.json(readData().projects);
});

router.get("/portfolio/certificates", (_req, res) => {
  res.json(readData().certificates);
});

router.get("/portfolio/skills", (_req, res) => {
  res.json(readData().skills);
});

router.get("/portfolio/about", (_req, res) => {
  res.json(readData().about);
});

router.get("/portfolio/contact", (_req, res) => {
  res.json(readData().contact);
});

router.put("/portfolio/projects", authMiddleware, (req, res) => {
  const data = readData();
  data.projects = req.body;
  writeData(data);
  res.json({ success: true });
});

router.put("/portfolio/certificates", authMiddleware, (req, res) => {
  const data = readData();
  data.certificates = req.body;
  writeData(data);
  res.json({ success: true });
});

router.put("/portfolio/skills", authMiddleware, (req, res) => {
  const data = readData();
  data.skills = req.body;
  writeData(data);
  res.json({ success: true });
});

router.put("/portfolio/about", authMiddleware, (req, res) => {
  const data = readData();
  data.about = req.body;
  writeData(data);
  res.json({ success: true });
});

router.put("/portfolio/contact", authMiddleware, (req, res) => {
  const data = readData();
  data.contact = req.body;
  writeData(data);
  res.json({ success: true });
});

export default router;
