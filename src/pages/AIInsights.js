import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';
import './AIInsights.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AIInsights = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sunerasamuditha/gs_pipeline/main/dashboard_data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch AI insights data');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <section className="ai-insights-section d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </section>
  );

  if (error) return (
    <section className="ai-insights-section d-flex justify-content-center align-items-center">
      <div className="text-danger">Error loading AI Insights: {error}</div>
    </section>
  );

  if (!data) return null;

  // Prepare Chart Data
  // Sort district breakdown by value for better visualization
  const sortedDistricts = Object.entries(data.district_breakdown)
    .sort(([, a], [, b]) => b - a);
  
  const districtLabels = sortedDistricts.map(([k]) => k);
  const districtValues = sortedDistricts.map(([, v]) => v);

  const chartData = {
    labels: districtLabels,
    datasets: [
      {
        label: 'Seminars per District',
        data: districtValues,
        backgroundColor: 'rgba(0, 152, 218, 0.7)',
        borderColor: 'rgba(0, 152, 218, 1)',
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(100, 255, 218, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'District Breakdown (Seminars)',
        color: '#888',
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#888'
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#888',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  const renderInsights = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Check for bold pattern **...**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="insight-text mb-2">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <span key={i} className="insight-highlight">{part.slice(2, -2)}</span>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <section className="ai-insights-section">
      <Container>
        <motion.h2 
          className="ai-section-title"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          AI Overview & Insights
        </motion.h2>
        
        <Row className="mb-5 g-4">
          <Col md={4}>
            <motion.div 
              className="ai-card text-center d-flex flex-column justify-content-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="ai-stat-value">{data.total_seminars}</div>
              <div className="ai-stat-label">Total Seminars</div>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div 
              className="ai-card text-center d-flex flex-column justify-content-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="ai-stat-value">{data.total_students.toLocaleString()}</div>
              <div className="ai-stat-label">Total Students</div>
            </motion.div>
          </Col>
          <Col md={4}>
            <motion.div 
              className="ai-card text-center d-flex flex-column justify-content-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="ai-stat-value" style={{ fontSize: '2rem' }}>{data.last_updated}</div>
              <div className="ai-stat-label">Last Updated</div>
            </motion.div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col xs={12}>
            <motion.div 
              className="ai-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ height: '400px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </motion.div>
          </Col>
        </Row>

        <Row className="mb-5 g-4">
          <Col lg={6}>
            <motion.div 
              className="ai-card"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4>Resource Forecast</h4>
              <div className="table-responsive">
                <Table hover className="mt-3 align-middle">
                  <thead>
                    <tr>
                      <th>District</th>
                      <th className="text-center">Predicted Students</th>
                      <th className="text-center">Paper Sheets Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.ai_resource_forecast).map(([district, info]) => (
                      <tr key={district}>
                        <td>{district}</td>
                        <td className="text-center">{info.predicted_students}</td>
                        <td className="text-center">{info.paper_sheets_needed}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </motion.div>
          </Col>
          <Col lg={6}>
            <motion.div 
              className="ai-card"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4>Demand Predictions</h4>
              <div className="table-responsive">
                <Table hover className="mt-3 align-middle">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th className="text-end">Demand Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ai_demand_predictions.map((item, index) => (
                      <tr key={index}>
                        <td>{item.school}</td>
                        <td className="demand-score text-end">{item.demand_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </motion.div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col xs={12}>
            <motion.div 
              className="ai-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4>Volunteer Risks (High Churn)</h4>
              <div className="table-responsive">
                <Table hover className="mt-3 align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Risk Level</th>
                      <th>Reason</th>
                      <th>Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ai_volunteer_risks.map((volunteer, index) => (
                      <tr key={index}>
                        <td>{volunteer.name}</td>
                        <td><Badge bg="danger" className="px-3 py-2">{volunteer.risk_level}</Badge></td>
                        <td>{volunteer.reason}</td>
                        <td>{volunteer.last_active}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </motion.div>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <motion.div 
              className="ai-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h4>AI Remarks & Insights</h4>
              <div className="mt-4">
                {renderInsights(data.ai_remarks_insights)}
              </div>
            </motion.div>
          </Col>
        </Row>

      </Container>
    </section>
  );
};

export default AIInsights;
