import React, { useState, useEffect } from "react";
import { fetchPortfolio, saveSection } from "../lib/api";
import "./Admin.css";

function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_authed");
    if (stored === "1") setAuthed(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const contact = await fetch("/api/portfolio/contact").then(r => r.json());
      await saveSection("contact", contact, password);
      setAuthed(true);
      sessionStorage.setItem("admin_authed", "1");
      sessionStorage.setItem("admin_pw", password);
      setAuthError("");
    } catch {
      setAuthError("Wrong password. Try again.");
    }
  };

  const loadData = async () => {
    const d = await fetchPortfolio();
    setData(d);
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  const save = async (section, value) => {
    setSaving(true);
    setSaveMsg("");
    const pw = sessionStorage.getItem("admin_pw") || password;
    try {
      await saveSection(section, value, pw);
      setSaveMsg("✓ Saved successfully!");
      loadData();
    } catch {
      setSaveMsg("✗ Failed to save. Check password.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <h2>Admin Dashboard</h2>
          <p>Enter your admin password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
            />
            {authError && <p className="admin-error">{authError}</p>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  if (!data) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-right">
          {saveMsg && <span className={`save-msg ${saveMsg.startsWith("✓") ? "success" : "error"}`}>{saveMsg}</span>}
          <a href="/" className="admin-back-btn">← Back to Portfolio</a>
          <button className="admin-logout" onClick={() => { sessionStorage.clear(); setAuthed(false); }}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        {["projects", "certificates", "skills", "about", "contact"].map((tab) => (
          <button key={tab} className={`admin-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === "projects" && <ProjectsEditor projects={data.projects} onSave={(v) => save("projects", v)} saving={saving} />}
        {activeTab === "certificates" && <CertificatesEditor certs={data.certificates} onSave={(v) => save("certificates", v)} saving={saving} />}
        {activeTab === "skills" && <SkillsEditor skills={data.skills} onSave={(v) => save("skills", v)} saving={saving} />}
        {activeTab === "about" && <AboutEditor about={data.about} onSave={(v) => save("about", v)} saving={saving} />}
        {activeTab === "contact" && <ContactEditor contact={data.contact} onSave={(v) => save("contact", v)} saving={saving} />}
      </div>
    </div>
  );
}

function ProjectsEditor({ projects, onSave, saving }) {
  const [items, setItems] = useState(projects);
  useEffect(() => setItems(projects), [projects]);

  const update = (i, field, val) => {
    const next = items.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
    setItems(next);
  };
  const updateTags = (i, val) => {
    const next = items.map((p, idx) => idx === i ? { ...p, tags: val.split(",").map(t => t.trim()).filter(Boolean) } : p);
    setItems(next);
  };
  const add = () => setItems([...items, { id: Date.now().toString(), title: "", description: "", image: "", link: "", tags: [] }]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Projects</h2>
        <button className="add-btn" onClick={add}>+ Add Project</button>
      </div>
      {items.map((p, i) => (
        <div key={p.id || i} className="admin-card">
          <div className="admin-card-header">
            <h3>{p.title || "New Project"}</h3>
            <button className="remove-btn" onClick={() => remove(i)}>✕ Remove</button>
          </div>
          <div className="form-grid">
            <label>Title<input value={p.title} onChange={e => update(i, "title", e.target.value)} /></label>
            <label>Link<input value={p.link} onChange={e => update(i, "link", e.target.value)} /></label>
            <label className="full">Description<textarea value={p.description} onChange={e => update(i, "description", e.target.value)} rows={3} /></label>
            <label>Image path<input value={p.image} onChange={e => update(i, "image", e.target.value)} placeholder="/assets/projects/project1.jpg" /></label>
            <label>Tags (comma-separated)<input value={p.tags?.join(", ")} onChange={e => updateTags(i, e.target.value)} placeholder="React, CSS, Responsive" /></label>
          </div>
        </div>
      ))}
      <button className="save-btn" onClick={() => onSave(items)} disabled={saving}>{saving ? "Saving..." : "Save Projects"}</button>
    </div>
  );
}

function CertificatesEditor({ certs, onSave, saving }) {
  const [items, setItems] = useState(certs);
  useEffect(() => setItems(certs), [certs]);

  const update = (i, field, val) => setItems(items.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  const updateSkills = (i, val) => setItems(items.map((c, idx) => idx === i ? { ...c, skills: val.split(",").map(s => s.trim()).filter(Boolean) } : c));
  const add = () => setItems([...items, { id: Date.now().toString(), title: "", issuer: "", date: "", link: "", image: "", skills: [] }]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Certificates</h2>
        <button className="add-btn" onClick={add}>+ Add Certificate</button>
      </div>
      {items.map((c, i) => (
        <div key={c.id || i} className="admin-card">
          <div className="admin-card-header">
            <h3>{c.title || "New Certificate"}</h3>
            <button className="remove-btn" onClick={() => remove(i)}>✕ Remove</button>
          </div>
          <div className="form-grid">
            <label className="full">Title<input value={c.title} onChange={e => update(i, "title", e.target.value)} /></label>
            <label>Issuer<input value={c.issuer} onChange={e => update(i, "issuer", e.target.value)} /></label>
            <label>Date<input value={c.date} onChange={e => update(i, "date", e.target.value)} placeholder="April 27, 2025" /></label>
            <label className="full">Certificate Link<input value={c.link} onChange={e => update(i, "link", e.target.value)} /></label>
            <label>Image path<input value={c.image} onChange={e => update(i, "image", e.target.value)} /></label>
            <label>Skills (comma-separated)<input value={c.skills?.join(", ")} onChange={e => updateSkills(i, e.target.value)} /></label>
          </div>
        </div>
      ))}
      <button className="save-btn" onClick={() => onSave(items)} disabled={saving}>{saving ? "Saving..." : "Save Certificates"}</button>
    </div>
  );
}

function SkillsEditor({ skills, onSave, saving }) {
  const [items, setItems] = useState(skills);
  useEffect(() => setItems(skills), [skills]);

  const update = (i, field, val) => setItems(items.map((s, idx) => idx === i ? { ...s, [field]: field === "level" ? Number(val) : val } : s));
  const add = () => setItems([...items, { id: Date.now().toString(), name: "", level: 50, color: "#6366f1", category: "Frontend" }]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Skills</h2>
        <button className="add-btn" onClick={add}>+ Add Skill</button>
      </div>
      {items.map((s, i) => (
        <div key={s.id || i} className="admin-card compact">
          <div className="skill-row">
            <label>Name<input value={s.name} onChange={e => update(i, "name", e.target.value)} style={{ width: 130 }} /></label>
            <label>Level ({s.level}%)
              <input type="range" min={0} max={100} value={s.level} onChange={e => update(i, "level", e.target.value)} style={{ width: 160 }} />
            </label>
            <label>Color<input type="color" value={s.color || "#6366f1"} onChange={e => update(i, "color", e.target.value)} style={{ width: 50, height: 36, padding: 2 }} /></label>
            <label>Category
              <select value={s.category} onChange={e => update(i, "category", e.target.value)}>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Tools</option>
                <option>Other</option>
              </select>
            </label>
            <button className="remove-btn sm" onClick={() => remove(i)}>✕</button>
          </div>
          <div className="skill-preview-bar">
            <div style={{ width: `${s.level}%`, backgroundColor: s.color || "#6366f1", height: 6, borderRadius: 3, transition: "width 0.3s" }} />
          </div>
        </div>
      ))}
      <button className="save-btn" onClick={() => onSave(items)} disabled={saving}>{saving ? "Saving..." : "Save Skills"}</button>
    </div>
  );
}

function AboutEditor({ about, onSave, saving }) {
  const [form, setForm] = useState(about);
  useEffect(() => setForm(about), [about]);

  const update = (field, val) => setForm({ ...form, [field]: val });

  return (
    <div className="admin-section">
      <h2>About Me</h2>
      <div className="admin-card">
        <div className="form-grid">
          <label className="full">Bio Paragraph 1<textarea value={form.bio1} onChange={e => update("bio1", e.target.value)} rows={4} /></label>
          <label className="full">Bio Paragraph 2<textarea value={form.bio2} onChange={e => update("bio2", e.target.value)} rows={4} /></label>
          <label>Experience<input value={form.experience} onChange={e => update("experience", e.target.value)} placeholder="2+ Years" /></label>
          <label>Location<input value={form.location} onChange={e => update("location", e.target.value)} /></label>
          <label>Status<input value={form.status} onChange={e => update("status", e.target.value)} placeholder="Available" /></label>
        </div>
      </div>
      <button className="save-btn" onClick={() => onSave(form)} disabled={saving}>{saving ? "Saving..." : "Save About"}</button>
    </div>
  );
}

function ContactEditor({ contact, onSave, saving }) {
  const [form, setForm] = useState(contact);
  useEffect(() => setForm(contact), [contact]);

  const update = (field, val) => setForm({ ...form, [field]: val });

  return (
    <div className="admin-section">
      <h2>Contact Info</h2>
      <div className="admin-card">
        <div className="form-grid">
          <label>Email<input type="email" value={form.email} onChange={e => update("email", e.target.value)} /></label>
          <label>Phone<input value={form.phone} onChange={e => update("phone", e.target.value)} /></label>
          <label className="full">Location<input value={form.location} onChange={e => update("location", e.target.value)} /></label>
        </div>
      </div>
      <button className="save-btn" onClick={() => onSave(form)} disabled={saving}>{saving ? "Saving..." : "Save Contact"}</button>
    </div>
  );
}

export default Admin;
