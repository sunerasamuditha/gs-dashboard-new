//frontend\gsdashboard\src\components\DistrictDetailPanel.js
import React from 'react';
import { motion } from 'framer-motion';
//import DistrictChart from './DistrictChart';
import './DistrictDetailPanel.css'; 
// import { useState } from 'react';

const panelVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

const DistrictDetailPanel = ({ districtData, onClose }) => {
  if (!districtData) return null;
  return (
    <motion.div
  className="district-detail-panel"
  style={{ 
    position: 'absolute',
    top: '10%',
    right: '20px',
    transform: 'translateY(-50%)',
    width: '425px',
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    padding: '24px',
    zIndex: 1000,
    border: '1px solid rgba(255, 255, 255, 0.3)'
  }}
  variants={panelVariants}
  initial="hidden"
  animate="visible"
  exit="exit"
  transition={{ duration: 0.6 }}
>
  <button 
    onClick={onClose} 
    style={{ 
      marginBottom: '1rem', 
      padding: '0.5rem 1rem', 
      cursor: 'pointer',       
      background: '#0098da',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '8px',
      color: 'white',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      transition: 'background 0.3s ease, color 0.3s ease, transform 0.2s ease'
    }}
    onMouseOver={(e) => {
      e.target.style.background = 'rgba(100, 255, 218, 0.3)';
      e.target.style.color = 'white';
    }}
    onMouseOut={(e) => {
      e.target.style.background = '#0098da';
      e.target.style.color = 'white';
    }}
    onMouseDown={(e) => {
      e.target.style.transform = 'scale(0.95)';
    }}
    onMouseUp={(e) => {
      e.target.style.transform = 'scale(1)';
    }}
  >
    Close
  </button>

  <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#000046', textAlign: 'left', marginLeft: '1rem' }}>
    {districtData['Districts']} Overview
  </h2>

  

  <div style={{ marginTop: '2rem', textAlign: 'left', marginLeft: '1rem' }}>
    <h4 style={{ color: '#000046' }}>Additional Details</h4>

    <p style={{ marginTop: '1.3rem', fontWeight: '500', fontSize: '1.19rem' }}>Responsible Coordinator: <strong>{districtData['Responsible Coordinator']}</strong></p>
<p style={{ fontWeight: '500', fontSize: '1.19rem' }}>Total Seminar Count (Within Week): <strong>{districtData['Total Seminar Count - Within Last Week']}</strong></p>
<p style={{ fontWeight: '500', fontSize: '1.19rem' }}>Total Seminar Count (Cumulative): <strong>{districtData['Total Seminar Count - Cumulative']}</strong></p>
<p style={{ fontWeight: '500', fontSize: '1.19rem' }}>Students Reached (Within Week): <strong>{districtData['Students Reached - Within Last Week']}</strong></p>
<p style={{ fontWeight: '500', fontSize: '1.19rem' }}>Students Reached (Cumulative): <strong>{districtData['Students Reached - Cumulative']}</strong></p>
<p style={{ fontWeight: '500', fontSize: '1.19rem' }}>Facebook Posts (Within Week): <strong>{districtData['Facebook posts - Within Last Week']}</strong></p>
<p style={{ fontWeight: '500', fontSize: '1.19rem' }}>Facebook Posts (Cumulative): <strong>{districtData['Facebook posts - Cumulative']}</strong></p>

  </div>
</motion.div>

  );
};

export default DistrictDetailPanel;
