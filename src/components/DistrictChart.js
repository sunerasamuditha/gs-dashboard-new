import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const parseNumber = (val) => Number(val) || 0;

const DistrictChart = ({ districtData }) => {
  // Define metric keys based on instance; adjust these based on your sheet
  const metricPairs = {
    overall: [
      { label: 'Seminar (Within Week)', key: 'Total Seminar Count - Within Last Week' },
      { label: 'Seminar (Cumulative)', key: 'Total Seminar Count - Cumulative' },
      { label: 'Students (Within Week)', key: 'Students Reached - Within Last Week' },
      { label: 'Students (Cumulative)', key: 'Students Reached - Cumulative' },
      { label: 'Facebook (Within Week)', key: 'Facebook posts - Within Last Week' },
      { label: 'Facebook (Cumulative)', key: 'Facebook posts - Cumulative' },
    ],
    remedialTeaching: [
      { label: 'RTP (Within Week)', key: 'Total Seminar Count - Within Last Week' }, // Adjust keys
      { label: 'RTP (Cumulative)', key: 'Total Seminar Count - Cumulative' },
      // Add more as needed
    ],
    paperSeminars: [
      { label: 'Paper Seminar (Within Week)', key: 'Total Seminar Count - Within Last Week' }, // Adjust keys
      { label: 'Paper Seminar (Cumulative)', key: 'Total Seminar Count - Cumulative' },
      // Add more as needed
    ]
  };

  // Determine instance (you’d need to pass this prop from the parent)
  const instance = 'overall'; // Placeholder; pass as prop or infer
  const metrics = metricPairs[instance] || metricPairs.overall;

  const labels = metrics.map(m => m.label);
  const datasetValues = metrics.map(m => parseNumber(districtData[m.key]));

  const data = {
    labels,
    datasets: [{
      label: districtData['Districts'],
      data: datasetValues,
      backgroundColor: metrics.map((_, i) => `rgba(${75 + i * 50}, 192, ${192 - i * 50}, 0.6)`),
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${districtData['Districts']} - Key Metrics` },
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default DistrictChart;