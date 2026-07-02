import React, { useState, useEffect } from "react";
import { fetchPortfolio, saveSection, BASE } from "../lib/api";
import "./Admin.css";

function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState("projects");
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const pwRef = React.useRef("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const contact = await fetch(`${BASE}/portfolio/contact`).then(r => r.json());
      await saveSection("contact", contact, password);
      pwRef.current = password;
      setAuthed(true);
      setAuthError("");
    } catch {
      setAuthError("Wrong password. Try again.");
    }
  };

  const loadData = async () => {
    const d = await fetchPortfolio();
    const cv = await fetch(`${BASE}/portfolio/cv`).then(r => r.json());
    setData({ ...d, cv });
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  const save = async (section, value) => {
    setSaving(true);
    setSaveMsg("");
    try {
      await saveSection(section, value, pwRef.current);
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
          <button className="admin-logout" onClick={() => { pwRef.current = ""; setAuthed(false); setPassword(""); }}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        {["projects", "certificates", "skills", "about", "contact", "cv"].map((tab) => (
          <button key={tab} className={`admin-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab === "cv" ? "CV" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === "projects" && <ProjectsEditor projects={data.projects} onSave={(v) => save("projects", v)} saving={saving} />}
        {activeTab === "certificates" && <CertificatesEditor certs={data.certificates} onSave={(v) => save("certificates", v)} saving={saving} />}
        {activeTab === "skills" && <SkillsEditor skills={data.skills} onSave={(v) => save("skills", v)} saving={saving} />}
        {activeTab === "about" && <AboutEditor about={data.about} onSave={(v) => save("about", v)} saving={saving} />}
        {activeTab === "contact" && <ContactEditor contact={data.contact} onSave={(v) => save("contact", v)} saving={saving} />}
        {activeTab === "cv" && <CVEditor cv={data.cv} onSave={(v) => save("cv", v)} saving={saving} />}
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

function CVEditor({ cv, onSave, saving }) {
  const [form, setForm] = useState(cv);
  const [previewImage, setPreviewImage] = useState(cv.profileImage);
  useEffect(() => { setForm(cv); setPreviewImage(cv.profileImage); }, [cv]);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const updateNested = (field, subfield, val) => setForm(f => ({ ...f, [field]: { ...f[field], [subfield]: val } }));

  const updateExp = (i, field, val) => {
    const exp = form.experience.map((e, idx) => idx === i ? { ...e, [field]: val } : e);
    setForm(f => ({ ...f, experience: exp }));
  };
  const addExp = () => setForm(f => ({ ...f, experience: [...(f.experience || []), { role: "", company: "", period: "", description: "" }] }));
  const removeExp = (i) => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }));

  const updateEdu = (i, field, val) => {
    const edu = form.education.map((e, idx) => idx === i ? { ...e, [field]: val } : e);
    setForm(f => ({ ...f, education: edu }));
  };
  const addEdu = () => setForm(f => ({ ...f, education: [...f.education, { degree: "", school: "", year: "" }] }));
  const removeEdu = (i) => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  const updateSkill = (i, field, val) => {
    const skills = form.cvSkills.map((s, idx) => idx === i ? { ...s, [field]: val } : s);
    setForm(f => ({ ...f, cvSkills: skills }));
  };
  const addSkill = () => setForm(f => ({ ...f, cvSkills: [...f.cvSkills, { category: "", items: "" }] }));
  const removeSkill = (i) => setForm(f => ({ ...f, cvSkills: f.cvSkills.filter((_, idx) => idx !== i) }));

  const updateLang = (i, val) => {
    const langs = form.languages.map((l, idx) => idx === i ? val : l);
    setForm(f => ({ ...f, languages: langs }));
  };
  const addLang = () => setForm(f => ({ ...f, languages: [...f.languages, ""] }));
  const removeLang = (i) => setForm(f => ({ ...f, languages: f.languages.filter((_, idx) => idx !== i) }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPreviewImage(base64);
      setForm(f => ({ ...f, profileImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-section">
      <h2>CV / Resume</h2>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16, color: "#60a5fa" }}>Profile Photo</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img
            src={previewImage}
            alt="Profile"
            style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #3b82f6" }}
          />
          <div>
            <label className="cv-upload-label">
              📷 Upload New Photo
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
            </label>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>JPG, PNG supported. Will save to API.</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16, color: "#60a5fa" }}>Basic Info</h3>
        <div className="form-grid">
          <label>Full Name<input value={form.name} onChange={e => update("name", e.target.value)} /></label>
          <label>Title / Role<input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Software Developer" /></label>
          <label className="full">Summary<textarea value={form.summary} onChange={e => update("summary", e.target.value)} rows={4} /></label>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ color: "#60a5fa" }}>Experience</h3>
          <button className="add-btn" onClick={addExp}>+ Add</button>
        </div>
        {(form.experience || []).map((e, i) => (
          <div key={i} className="cv-sub-card">
            <div className="form-grid">
              <label>Role / Position<input value={e.role} onChange={ev => updateExp(i, "role", ev.target.value)} placeholder="Frontend Developer" /></label>
              <label>Company<input value={e.company} onChange={ev => updateExp(i, "company", ev.target.value)} placeholder="Company Name" /></label>
              <label>Period<input value={e.period} onChange={ev => updateExp(i, "period", ev.target.value)} placeholder="2023 – Present" /></label>
              <label className="full">Description<textarea value={e.description} onChange={ev => updateExp(i, "description", ev.target.value)} rows={2} /></label>
            </div>
            <button className="remove-btn sm" onClick={() => removeExp(i)} style={{ marginTop: 8 }}>✕ Remove</button>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ color: "#60a5fa" }}>Education</h3>
          <button className="add-btn" onClick={addEdu}>+ Add</button>
        </div>
        {form.education.map((e, i) => (
          <div key={i} className="cv-sub-card">
            <div className="form-grid">
              <label className="full">Degree / Certificate<input value={e.degree} onChange={ev => updateEdu(i, "degree", ev.target.value)} /></label>
              <label>School / Institution<input value={e.school} onChange={ev => updateEdu(i, "school", ev.target.value)} /></label>
              <label>Year<input value={e.year} onChange={ev => updateEdu(i, "year", ev.target.value)} placeholder="Graduated 2025" /></label>
            </div>
            <button className="remove-btn sm" onClick={() => removeEdu(i)} style={{ marginTop: 8 }}>✕ Remove</button>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ color: "#60a5fa" }}>Skills (CV)</h3>
          <button className="add-btn" onClick={addSkill}>+ Add Row</button>
        </div>
        {form.cvSkills.map((s, i) => (
          <div key={i} className="cv-sub-card">
            <div className="form-grid">
              <label>Category<input value={s.category} onChange={e => updateSkill(i, "category", e.target.value)} placeholder="Frontend" /></label>
              <label>Items<input value={s.items} onChange={e => updateSkill(i, "items", e.target.value)} placeholder="HTML, CSS, JavaScript" /></label>
            </div>
            <button className="remove-btn sm" onClick={() => removeSkill(i)} style={{ marginTop: 8 }}>✕ Remove</button>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h3 style={{ color: "#60a5fa" }}>Languages</h3>
          <button className="add-btn" onClick={addLang}>+ Add</button>
        </div>
        {form.languages.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input value={l} onChange={e => updateLang(i, e.target.value)} placeholder="Khmer (Native)" style={{ flex: 1 }} />
            <button className="remove-btn sm" onClick={() => removeLang(i)}>✕</button>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16, color: "#60a5fa" }}>Personal Info</h3>
        <div className="form-grid">
          <label>Gender<input value={form.personalInfo.gender} onChange={e => updateNested("personalInfo", "gender", e.target.value)} /></label>
          <label>Date of Birth<input value={form.personalInfo.dob} onChange={e => updateNested("personalInfo", "dob", e.target.value)} placeholder="03 August 2002" /></label>
          <label>Age<input value={form.personalInfo.age} onChange={e => updateNested("personalInfo", "age", e.target.value)} placeholder="23 years old" /></label>
          <label>Address<input value={form.personalInfo.address} onChange={e => updateNested("personalInfo", "address", e.target.value)} /></label>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ marginBottom: 16, color: "#60a5fa" }}>Contact Links</h3>
        <div className="form-grid">
          <label>Email<input value={form.contactLinks.email} onChange={e => updateNested("contactLinks", "email", e.target.value)} /></label>
          <label>Phone<input value={form.contactLinks.phone} onChange={e => updateNested("contactLinks", "phone", e.target.value)} /></label>
          <label>GitHub URL<input value={form.contactLinks.github} onChange={e => updateNested("contactLinks", "github", e.target.value)} /></label>
          <label>GitHub Label<input value={form.contactLinks.githubLabel} onChange={e => updateNested("contactLinks", "githubLabel", e.target.value)} /></label>
          <label>LinkedIn URL<input value={form.contactLinks.linkedin} onChange={e => updateNested("contactLinks", "linkedin", e.target.value)} /></label>
          <label>LinkedIn Label<input value={form.contactLinks.linkedinLabel} onChange={e => updateNested("contactLinks", "linkedinLabel", e.target.value)} /></label>
          <label>Telegram<input value={form.contactLinks.telegram} onChange={e => updateNested("contactLinks", "telegram", e.target.value)} /></label>
        </div>
      </div>

      <button className="save-btn" onClick={() => onSave(form)} disabled={saving}>{saving ? "Saving..." : "Save CV"}</button>
    </div>
  );
}

export default Admin;
