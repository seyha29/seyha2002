import React, { useState, useEffect } from "react";
import profilePic from "../../assets/profile.jpg";
import { Link } from "react-router-dom";
import "./About.css";
import { fetchPortfolio } from "../../lib/api";

const DEFAULT_ABOUT = {
  bio1: "I'm a web developer and designer with over two years of experience creating and redesigning websites for better functionality and visual appeal. I specialize in front-end development using HTML, CSS, JavaScript, and React, and have built a range of projects including e-commerce platforms, budget trackers, and reservation systems.",
  bio2: "I also have experience with Node.js, Express, Figma, and other tools. I focus on delivering responsive, user-friendly websites and can assist with content updates, feature improvements, and complete redesigns tailored to client needs.",
};

function About() {
  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [about, setAbout] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    document.body.classList.remove("light");
    fetchPortfolio()
      .then((data) => { if (data.about) setAbout(data.about); })
      .catch(() => {});
  }, []);

  return (
    <section className="about" id="aboutme">
      <div className="about-container">
        <div className="about-image" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
          <div className="image-wrapper">
            <img src={profilePic} alt="Portrait of Than Seyha" className={hovering ? "hovering" : ""} />
            <div className="glow-effect"></div>
          </div>
        </div>
        <div className="about-text">
          <h2><span className="highlight">About</span> Me</h2>
          <div className="text-content">
            <p>{about.bio1}</p>
            <p>{about.bio2}</p>
          </div>
          <Link to="/resume" className={`read-more-btn ${clicked ? "clicked" : ""}`} onClick={() => setClicked(true)}>
            <span>View My Resume</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default About;
