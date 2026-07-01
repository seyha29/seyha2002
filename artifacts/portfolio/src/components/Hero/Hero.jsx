import React, { useEffect, useState } from "react";
import { FaGithub, FaFacebook, FaTelegramPlane, FaLinkedinIn } from "react-icons/fa";
import profilePic from "../../assets/profile1.jpg";
import "./Hero.css";

function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const textOptions = [
    "I'm a Web Developer",
    "I'm a React Specialist",
    "I'm a UI/UX Enthusiast",
    "I'm a Problem Solver"
  ];

  useEffect(() => {
    const currentFullText = textOptions[currentTextIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        setCurrentText(currentFullText.substring(0, currentText.length - 1));
        setTypingSpeed(50);
      } else {
        setCurrentText(currentFullText.substring(0, currentText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && currentText === currentFullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === "") {
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => 
          (prevIndex + 1) % textOptions.length
        );
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, currentTextIndex, isDeleting, textOptions, typingSpeed]);

  return (
    <section className="hero" id="home">
      <div className="hero-text">
        <h3>
          Hey, I'm <span className="highlight">Than Seyha</span>
        </h3>
        <h1>
          <span className="typed-text">{currentText}</span>
        </h1>
        <p>
          Freelance web developer skilled in modern JavaScript frameworks. 
          I create responsive, accessible, and performant web applications 
          with clean code and intuitive user experiences.
        </p>
        <div className="social-icons">
          <a 
            href="https://github.com/seyha29" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a 
            href="https://www.facebook.com/than.seyha.9235/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a 
            href="https://t.me/thanseyha11" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <FaTelegramPlane />
          </a>
          <a 
            href="https://www.linkedin.com/in/thanseyha/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>
      
      <div className="hero-image">
        <div className="tech-ring"></div>
        <img 
          src={profilePic} 
          alt="Than Seyha" 
          loading="lazy" 
          width="280" 
          height="280"
        />
      </div>
    </section>
  );
}

export default Hero;
