import React, { useState, useEffect } from "react";
import { BASE } from "../lib/api";
import "./Resume.css";

const DEFAULT_CV = {
  name: "Than Seyha",
  title: "Software Developer",
  summary: "I am a recent Computer Science graduate passionate about technology and software development. Skilled in programming, problem-solving, and eager to contribute through internships and projects. Motivated and ready to grow in a dynamic tech environment.",
  profileImage: "/assets/profile1.jpg",
  education: [
    { degree: "Bachelor's Degree in Computer Science", school: "Royal University Of Phnom Penh", year: "Graduated 2025" },
    { degree: "Diploma General Education", school: "Hun Sen Sandek High School", year: "Graduated 2021" }
  ],
  cvSkills: [
    { category: "Frontend", items: "HTML, CSS, JavaScript, React.js, Bootstrap, Tailwind" },
    { category: "Backend", items: "PHP, Laravel" },
    { category: "Tools & Technologies", items: "Git, GitHub, REST APIs, MySQL, Responsive Web Design" },
    { category: "Research", items: "Google, AI" }
  ],
  languages: ["Khmer (Native)", "English (Medium)"],
  personalInfo: { gender: "Male", dob: "03 August 2002", age: "23 years old", address: "Phnom Penh, Cambodia" },
  contactLinks: {
    email: "thanseyha2002@gmail.com",
    phone: "+855 186323203",
    github: "https://github.com/seyha29",
    githubLabel: "seyha29",
    linkedin: "https://linkedin.com/in/thanseyha",
    linkedinLabel: "thanseyha",
    telegram: "@thanseyha11"
  }
};

function Resume() {
  const [cv, setCv] = useState(DEFAULT_CV);

  useEffect(() => {
    fetch(`${BASE}/portfolio/cv`)
      .then(r => r.json())
      .then(data => { if (data && data.name) setCv(data); })
      .catch(() => {});
  }, []);

  const { name, title, summary, profileImage, education, cvSkills, languages, personalInfo, contactLinks } = cv;

  return (
    <section id="resume" className="resume">
      <div className="resume-container">

        <div className="top-section">
          <div className="profile-image-container">
            <img
              src={profileImage}
              alt={name + " Profile"}
              className="profile-image"
            />
          </div>
          <div className="divider"></div>
          <div className="name-title">
            <h1 className="name">{name}</h1>
            <h2 className="title">{title}</h2>
          </div>
        </div>

        <section className="summary">
          <h3>My Summary</h3>
          <p>{summary}</p>
        </section>

        <section className="details">
          <div className="detail-section">
            <h3>Education</h3>
            <ul>
              {education.map((e, i) => (
                <li key={i}>
                  <strong>{e.degree}</strong><br />
                  {e.school}{e.year ? `, ${e.year}` : ""}
                </li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Skills</h3>
            <ul>
              {cvSkills.map((s, i) => (
                <li key={i}><strong>{s.category}:</strong> {s.items}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Languages</h3>
            <ul>
              {languages.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          </div>

          <div className="detail-section">
            <h3>Contact</h3>
            <ul>
              <li>Email: <a href={`mailto:${contactLinks.email}`}>{contactLinks.email}</a></li>
              <li>Phone: {contactLinks.phone}</li>
              <li>GitHub: <a href={contactLinks.github} target="_blank" rel="noopener noreferrer">{contactLinks.githubLabel}</a></li>
              <li>LinkedIn: <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer">{contactLinks.linkedinLabel}</a></li>
              <li>Telegram: {contactLinks.telegram}</li>
            </ul>
          </div>

          <div className="detail-section">
            <h3>Personal Info</h3>
            <ul>
              <li>Gender: {personalInfo.gender}</li>
              <li>Date of Birth: {personalInfo.dob}</li>
              <li>Age: {personalInfo.age}</li>
              <li>Address: {personalInfo.address}</li>
            </ul>
          </div>
        </section>

        <div className="download-btn-container">
          <a
            href="/assets/Resume.pdf"
            className="resume-download"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        </div>
      </div>
    </section>
  );
}

export default Resume;
