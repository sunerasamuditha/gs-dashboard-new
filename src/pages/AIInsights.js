import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  Container,
  Table,
  Badge,
  Tabs,
  Tab,
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip as BSTooltip,
} from 'react-bootstrap';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
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
import ReportsGenerator from '../components/ReportsGenerator';
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
  const [districtView, setDistrictView] = useState('top10');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [activeTab, setActiveTab] = useState('forecast');
  const [showAllInsights, setShowAllInsights] = useState(false);
  const chartRef = useRef(null);

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

  const districtBreakdown = useMemo(() => data?.district_breakdown || {}, [data]);
  const resourceForecast = useMemo(() => data?.ai_resource_forecast || {}, [data]);
  const volunteerRisks = useMemo(
    () => (Array.isArray(data?.ai_volunteer_risks) ? data.ai_volunteer_risks : []),
    [data]
  );
  const demandPredictions = useMemo(
    () => (Array.isArray(data?.ai_demand_predictions) ? data.ai_demand_predictions : []),
    [data]
  );

  const stats = useMemo(() => {
    const districtCount = Object.keys(districtBreakdown).length;
    const volunteerRiskCount = volunteerRisks.length;
    return {
      districtCount,
      volunteerRiskCount,
    };
  }, [districtBreakdown, volunteerRisks]);

  const sortedDistricts = useMemo(() => {
    return Object.entries(districtBreakdown).sort(([, a], [, b]) => b - a);
  }, [districtBreakdown]);

  const chartRows = useMemo(() => {
    const rows = districtView === 'top10' ? sortedDistricts.slice(0, 10) : sortedDistricts;
    return {
      labels: rows.map(([k]) => k),
      values: rows.map(([, v]) => v),
    };
  }, [sortedDistricts, districtView]);

  const chartData = useMemo(() => {
    const bg = chartRows.labels.map((label) =>
      selectedDistrict && label === selectedDistrict
        ? 'rgba(100, 255, 218, 0.85)'
        : 'rgba(0, 152, 218, 0.55)'
    );
    const border = chartRows.labels.map((label) =>
      selectedDistrict && label === selectedDistrict
        ? 'rgba(100, 255, 218, 1)'
        : 'rgba(0, 152, 218, 1)'
    );

    return {
      labels: chartRows.labels,
      datasets: [
        {
          label: 'Seminars',
          data: chartRows.values,
          backgroundColor: bg,
          borderColor: border,
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(100, 255, 218, 0.75)',
        },
      ],
    };
  }, [chartRows, selectedDistrict]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'District Breakdown (Seminars)',
          color: '#334155',
          font: {
            size: 14,
            weight: '600'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30, 41, 59, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            title: (items) => items?.[0]?.label || '',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.06)',
          },
          ticks: {
            color: '#64748b',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#64748b',
            autoSkip: true,
            maxTicksLimit: districtView === 'all' ? 10 : 12,
            maxRotation: districtView === 'all' ? 0 : 35,
            minRotation: districtView === 'all' ? 0 : 35,
          },
        },
      },
    }),
    [districtView]
  );

  const onChartClick = (event) => {
    const elements = getElementAtEvent(chartRef.current, event);
    if (!elements?.length) return;
    const idx = elements[0].index;
    const label = chartRows.labels[idx];
    if (label) {
      setSelectedDistrict(label);
      setActiveTab('forecast');
    }
  };

  const selectedForecast = useMemo(() => {
    if (!selectedDistrict) return null;
    return resourceForecast[selectedDistrict] || null;
  }, [selectedDistrict, resourceForecast]);

  const selectedDistrictSeminars = useMemo(() => {
    if (!selectedDistrict) return null;
    return districtBreakdown[selectedDistrict] ?? null;
  }, [selectedDistrict, districtBreakdown]);

  const splitBold = (text) => {
    const parts = String(text).split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <span key={i} className="insight-highlight">
            {part.slice(2, -2)}
          </span>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  const insightItems = useMemo(() => {
    const text = data?.ai_remarks_insights;
    if (!text) return [];    
    
    return String(text)
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => line.replace(/^(\*|-|\d+\.)\s*/, ''));
  }, [data]);

  const visibleInsightItems = showAllInsights ? insightItems : insightItems.slice(0, 4);

  const getRiskBadgeClass = (level) => {
    const l = (level || '').toLowerCase();
    if (l.includes('critical')) return 'risk-critical';
    if (l.includes('high')) return 'risk-high';
    if (l.includes('moderate')) return 'risk-moderate';
    return 'risk-default';
  };

  if (loading) {
    return (
      <section className="ai-insights-section d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="ai-insights-section d-flex justify-content-center align-items-center">
        <div className="text-light">Error loading AI Insights: {error}</div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="ai-insights-section d-flex justify-content-center align-items-center">
        <div className="text-light">AI Insights data is unavailable.</div>
      </section>
    );
  }

  return (
    <section className="ai-insights-section" id="ai-insights">
      <Container fluid className="ai-insights-container">
        <motion.div
          className="ai-insights-shell"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="ai-insights-top">
            <div className="ai-title-block">
              <h2 className="ai-section-title">
                Smart Overview & Insights
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <BSTooltip id="ai-tooltip">
                      This AI-powered segment analyzes real-time data to forecast resource needs, identify volunteer risks, and provide actionable insights for better decision-making.
                    </BSTooltip>
                  }
                >
                  <span className="ms-2" style={{ cursor: 'pointer', verticalAlign: 'middle', opacity: 0.8 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-info-circle-fill" viewBox="0 0 16 16">
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                    </svg>
                  </span>
                </OverlayTrigger>
              </h2>
              <div className="ai-subtitle">
                <span className="ai-subtitle-label">Last updated:</span> {data.last_updated}
              </div>
            </div>

            <div className="ai-stat-strip">
              <div className="ai-mini-stat">
                <div className="ai-mini-value">{Number(data.total_seminars || 0).toLocaleString()}</div>
                <div className="ai-mini-label">Seminars</div>
              </div>
              <div className="ai-mini-stat">
                <div className="ai-mini-value">{Number(data.total_students || 0).toLocaleString()}</div>
                <div className="ai-mini-label">Students</div>
              </div>
              <div className="ai-mini-stat">
                <div className="ai-mini-value">{stats.volunteerRiskCount}</div>
                <div className="ai-mini-label">High Risks</div>
              </div>
            </div>
          </div>

          <div className="ai-insights-main">
            <div className="ai-card ai-chart-card">
              <div className="ai-card-header">
                <div className="ai-card-title">District Breakdown</div>

                <div className="ai-card-actions">
                  <ButtonGroup size="sm" className="ai-toggle">
                    <Button
                      variant={districtView === 'top10' ? 'primary' : 'outline-light'}
                      onClick={() => setDistrictView('top10')}
                    >
                      Top 10
                    </Button>
                    <Button
                      variant={districtView === 'all' ? 'primary' : 'outline-light'}
                      onClick={() => setDistrictView('all')}
                    >
                      All
                    </Button>
                  </ButtonGroup>

                  {selectedDistrict ? (
                    <div className="ai-selected">
                      <Badge bg="light" text="dark" className="ai-selected-badge">
                        {selectedDistrict}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline-light"
                        className="ai-clear-btn"
                        onClick={() => setSelectedDistrict(null)}
                      >
                        Clear
                      </Button>
                    </div>
                  ) : (
                    <div className="ai-hint">Tap a bar to focus</div>
                  )}
                </div>
              </div>

              <div className="ai-chart-area">
                <Bar ref={chartRef} data={chartData} options={chartOptions} onClick={onChartClick} />
              </div>

              <div className="ai-selection-row">
                <div className="ai-selection-item">
                  <span className="ai-selection-label">Seminars:</span>{' '}
                  <span className="ai-selection-value">
                    {selectedDistrict ? (selectedDistrictSeminars ?? '—') : '—'}
                  </span>
                </div>
                <div className="ai-selection-item">
                  <span className="ai-selection-label">:</span>{' '}
                  <span className="ai-selection-value">
                    {selectedDistrict && selectedForecast
                      ? `${selectedForecast.predicted_students} students / ${selectedForecast.paper_sheets_needed} sheets`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="ai-card ai-tabs-card">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'forecast')}
                className="ai-tabs"
                justify
              >
                <Tab eventKey="forecast" title="Forecast">
                  <div className="ai-tab-body">
                    <div className="table-responsive">
                      <Table hover className="ai-table align-middle">
                        <thead>
                          <tr>
                            <th>District</th>
                            <th className="text-center">Pred. Students</th>
                            <th className="text-center">Sheets</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(resourceForecast).map(([district, info]) => (
                            <tr
                              key={district}
                              className={`ai-forecast-row ${selectedDistrict === district ? 'ai-row-active' : ''}`}
                              onClick={() => setSelectedDistrict(district)}
                            >
                              <td>{district}</td>
                              <td className="text-center">{info.predicted_students}</td>
                              <td className="text-center">{info.paper_sheets_needed}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="demand" title="Demand">
                  <div className="ai-tab-body">
                    <div className="table-responsive">
                      <Table hover className="ai-table align-middle">
                        <thead>
                          <tr>
                            <th>School</th>
                            <th className="text-end">Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {demandPredictions.map((item, index) => (
                            <tr key={index}>
                              <td>{item.school}</td>
                              <td className="text-end demand-score">{item.demand_score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="risks" title={`Risks (${stats.volunteerRiskCount})`}>
                  <div className="ai-tab-body">
                    <div className="table-responsive">
                      <Table hover className="ai-table align-middle">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Risk</th>
                            <th>Reason</th>
                          </tr>
                        </thead>
                        <tbody>
                          {volunteerRisks.map((volunteer, index) => (
                            <tr key={index}>
                              <td>{volunteer.name}</td>
                              <td>
                                <span className={`badge rounded-pill ai-risk-badge ${getRiskBadgeClass(volunteer.risk_level)}`}>
                                  {volunteer.risk_level}
                                </span>
                              </td>
                              <td>{volunteer.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Tab>

                <Tab eventKey="insights" title="Insights">
                  <div className="ai-tab-body">
                    <div className="ai-insight-list">
                      {visibleInsightItems.length === 0 ? (
                        <div className="ai-empty">No insights available.</div>
                      ) : (
                        <ul className="ai-insight-ul">
                          {visibleInsightItems.map((item, idx) => (
                            <li key={idx} className="ai-insight-li">
                              {splitBold(item)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {insightItems.length > 4 && (
                      <div className="ai-insight-actions">
                        <Button
                          size="sm"
                          variant="outline-light"
                          onClick={() => setShowAllInsights((v) => !v)}
                        >
                          {showAllInsights ? 'Show less' : 'Show more'}
                        </Button>
                      </div>
                    )}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </motion.div>
        
        <ReportsGenerator />
      </Container>
    </section>
  );
};

export default AIInsights;
