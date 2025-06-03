// frontend/gsdashboard/src/components/NationalStats.js

import React from 'react';
import './NationalStats.css';

const NationalStats = ({ nationalStats, instance }) => {
  if (!nationalStats || nationalStats.length === 0) {
    return null;
  }

  // Prepare placeholders
  let sin = 0, tam = 0, eng = 0, total = 0;
  let fbPosts = 0, studentsReached = 0, districtsCovered = 0, seminarWeek = 0;

  // Titles by instance
  let title = '';
  switch (instance) {
    case 'overall':
      title = 'Ganitha Saviya 2025/26 Total Seminar Program Summary';
      break;
    case 'remedialTeaching':
      title = 'Ganitha Saviya 2025/26 Total Remedial Teaching Program Summary';
      break;
    case 'paperSeminars':
      title = 'Ganitha Saviya 2025/26 Total Paper Seminar Program Summary';
      break;
    default:
      title = 'Ganitha Saviya Statistics';
  }

  // Parse the array of { metric, values } to fill in the stats
  nationalStats.forEach((row) => {
    const { metric, values } = row;
    if (metric.toLowerCase().includes('seminars') || metric.toLowerCase().includes('programs')) {
      // The row that has Sinhala/Tamil/English/Total
      sin = values[3] || 0;
      tam = values[4] || 0;
      eng = values[5] || 0;
      total = values[6] || 0;
    } else if (metric.toLowerCase().includes('fb posts published')) {
      fbPosts = values[3] || 0;
    } else if (metric.toLowerCase().includes('number of students reached')) {
      studentsReached = values[3] || 0;
    } else if (metric.toLowerCase().includes('districts covered')) {
      districtsCovered = values[3] || 0;
    } else if (metric.toLowerCase().includes('seminar week')) {
      seminarWeek = values[3] || 0;
    }
  });

  return (
    <div className="national-stats-container">
      {/* Title */}
      <h2 className="national-stats-title">{title}</h2>

      {/* Statistics Table */}
      <table className="national-stats-table">
        <thead>
          <tr>
            <th>Sinhala</th>
            <th>Tamil</th>
            <th>English</th>
            <th>Total Seminars</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{sin}</td>
            <td>{tam}</td>
            <td>{eng}</td>
            <td>{total}</td>
          </tr>
          <tr>
            <td colSpan="4">
              <strong style={{ fontWeight: '400', fontStyle:'italic' }}>FB posts published:</strong> {fbPosts}
            </td>
          </tr>
          <tr>
            <td colSpan="4">
              <strong style={{ fontWeight: '400', fontStyle:'italic' }}>Number of students reached:</strong> {studentsReached}
            </td>
          </tr>
          <tr>
            <td colSpan="4">
              <strong style={{ fontWeight: '400', fontStyle:'italic' }}>Districts Covered:</strong> {districtsCovered}
            </td>
          </tr>
          {/* Show "Seminar week" only for the overall instance */}
          {instance === 'overall' && (
            <tr>
              <td colSpan="4">
                <strong style={{ fontWeight: '400', fontStyle:'italic' }}>Seminar week:</strong> {seminarWeek}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NationalStats;
