// src/pages/About.js
import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <section id="about" className="about-page">
        <div className="about-content">
          <h2>Our GS TEAM 2025/26</h2>
          
          <div className="section">
            <h3>Pillar Head</h3>
            <p>Binuara Senevirathna</p>
            <p style={{ fontStyle: 'italic', fontSize: '0.7rem' }}>UG University of Ruhuna</p>
          </div>
          
          <div className="section">
            <h3>Dept. Pillar Head</h3>
            <p>Savithi Hansadi</p>
            <p style={{ fontStyle: 'italic', fontSize: '0.7rem' }}>UG University of Moratuwa</p>
          </div>
          
          <div className="section">
            <h3>National Coordinators</h3>
            <ul className="circle-list">
              <li>Sumudu Wijebandara</li>
              <p style={{ fontStyle: 'italic', fontSize: '0.7rem' }}>UG University of Moratuwa</p>
              <li>Suween Hansaja</li>
              <p style={{ fontStyle: 'italic', fontSize: '0.7rem' }}>UG University of Peradeniya</p>
              <li>Savindya Wijesinghe</li>
              <p style={{ fontStyle: 'italic', fontSize: '0.7rem' }}>UG University of Colombo </p>
            </ul>
          </div>
          
          <div className="section">
            <h3>Remedial Teaching Program Coordinators</h3>
            <ul className="circle-list">
              <li>Hiruna Heshan</li>
              <li>Pawani Kaushika</li>
              <li>Dumindu Edirisingha</li>
            </ul>
          </div>
        </div>
      </section>
      <footer className="about-footer">
        <p>
          Developed with ❤️ by <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">SUNERA SAMUDITHA</a> © 2025. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default About;
