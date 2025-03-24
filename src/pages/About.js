// src/pages/About.js
import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <section id="about" className="about-page">
        <div className="about-content">
          <h2>Our GS TEAM 2024/25</h2>
          
          <div className="section">
            <h3>Pillar Head</h3>
            <p>Harindu Damsara Hettiarachchi</p>
          </div>
          
          <div className="section">
            <h3>Dept. Pillar Head</h3>
            <p>Govindu Sasanka</p>
          </div>
          
          <div className="section">
            <h3>National Coordinators</h3>
            <ul className="circle-list">
              <li>Kaveesha Kapuruge</li>
              <li>Lahiruni Erandi</li>
              <li>Sunera Samuditha</li>
            </ul>
          </div>
          
          <div className="section">
            <h3>Remedial Teaching Program Coordinators</h3>
            <ul className="circle-list">
              <li>Sumudu Wijebandara</li>
              <li>Suween Hansaja</li>
              <li>Sehansa Basnayake</li>
            </ul>
          </div>
        </div>
      </section>
      <footer className="about-footer">
        <p>
          Developed with ❤️ by <a href="https://github.com/sunerasamuditha" target="_blank" rel="noopener noreferrer">SUNERA SAMUDITHA</a> © 2025. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default About;
