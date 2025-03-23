// frontend\gsdashboard\src\components\SummaryChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SummaryChart = ({ districtData, currentInstance }) => {
  // If there's no data, don't render anything
  if (!districtData || districtData.length === 0) return null;

  // 1) Filter out any row that has "Total Seminar Count" in the "Districts" field
  const filteredData = districtData.filter(
    (d) => d['Districts']?.trim().toLowerCase() !== 'total seminar count'
  );

  // 2) Sort by the "Total Seminar Count - Cumulative" descending (optional)
  const sorted = [...filteredData].sort((a, b) => {
    const aVal = Number(a['Total Seminar Count - Cumulative'] || 0);
    const bVal = Number(b['Total Seminar Count - Cumulative'] || 0);
    return bVal - aVal;
  });

  // District names on the X-axis
  const labels = sorted.map((d) => d['Districts']);
  // Cumulative seminar counts on the Y-axis
  const values = sorted.map((d) =>
    Number(d['Total Seminar Count - Cumulative'] || 0)
  );

  // Chart title based on instance
  let chartTitle = '';
  switch (currentInstance) {
    case 'remedialTeaching':
      chartTitle = 'Remedial Teaching Programs by District (Cumulative)';
      break;
    case 'paperSeminars':
      chartTitle = 'Paper Seminars by District (Cumulative)';
      break;
    default:
      chartTitle = 'Overall Seminars by District (Cumulative)';
      break;
  }

  // Prepare data for Chart.js
  const dataForChart = {
    labels,
    datasets: [
      {
        label: '', // keep it empty to hide the legend label
        data: values,
        backgroundColor: 'rgba(0, 152, 253, 0.5)',
        borderColor: 'rgb(6, 95, 124)',
        borderWidth: 1
      }
    ]
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 20,
          family: 'Arial, sans-serif',
          weight: '500'
        },
        color: '#000046'
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#000046' // X-axis label color
        },
        grid: {
          color: '' // X-axis grid line color
        },
        border: {
          color: '#000046' // X-axis border line color (Chart.js v3+)
        }
      },
      y: {
        ticks: {
          color: '#000046' // Y-axis label color
        },
        grid: {
          color: '' // Y-axis grid line color
        },
        border: {
          color: '#000046' // Y-axis border line color (Chart.js v3+)
        }
      }
    }
  };

  return <Bar data={dataForChart} options={options} />;
};

export default SummaryChart;
