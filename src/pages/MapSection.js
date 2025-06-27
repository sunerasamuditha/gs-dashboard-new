import React, { useState } from 'react';
import SriLankaMapThree from '../components/SriLankaMapThree';
import DistrictDetailPanel from '../components/DistrictDetailPanel';
import DistrictDetailPanelRTP from '../components/DistrictDetailPanelRTP';
import DistrictDetailPanelPaper from '../components/DistrictDetailPanelPaper';
import SummaryChart from '../components/SummaryChart';
import OceanWaves from '../components/OceanWaves';
import useDistrictData from '../useDistrictData';
import useResponsive from '../hooks/useResponsive';
import NationalStats from '../components/NationalStats';
import './MapSection.css';

function MapSection() {
  const { data, loading, error } = useDistrictData();
  const { device, isMobile, isTablet, isDesktop } = useResponsive();
  const [currentInstance, setCurrentInstance] = useState('overall');
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  

  const instanceData = data[currentInstance];
  const districtData = instanceData.districtData;
  const nationalStats = instanceData.nationalStats;

  
  const labelMetric =
    currentInstance === 'overall'
      ? 'Total Seminar Count - Cumulative'
      : currentInstance === 'remedialTeaching'
      ? 'Total Seminar Count - Cumulative'
      : currentInstance === 'paperSeminars'
      ? 'Total Seminar Count - Cumulative'
      : 'Total Seminar Count - Cumulative';

  const colorMetric =
    currentInstance === 'overall'
      ? 'Total Seminar Count - Within Last Week'
      : currentInstance === 'remedialTeaching'
      ? 'Total Seminar Count - Within Last Week'
      : currentInstance === 'paperSeminars'
      ? 'Total Seminar Count - Within Last Week'
      : 'Total Seminar Count - Within Last Week';

  

  const districtMap = React.useMemo(() => {
    const map = {};
    if (districtData && districtData.length > 0) {
      districtData.forEach((d) => {
        if (d['Districts']) {
          map[d['Districts'].trim()] = d;
        }
      });
    }
    return map;
  }, [districtData]);

  

  const handleDistrictClick = React.useCallback(
    (districtName) => {
      if (districtMap[districtName]) {
        setSelectedDistrict(districtMap[districtName]);
      } else {
        setSelectedDistrict(null);
      }
    },
    [districtMap]
  );

  const handleDistrictHover = React.useCallback((districtName) => {
    setHoveredDistrict(districtName);
  }, []);

  const renderDistrictDetailPanel = () => {
    if (!selectedDistrict) return null;
    switch (currentInstance) {
      case 'overall':
        return (
          <DistrictDetailPanel
            districtData={selectedDistrict}
            onClose={() => setSelectedDistrict(null)}
          />
        );
      case 'remedialTeaching':
        return (
          <DistrictDetailPanelRTP
            districtData={selectedDistrict}
            onClose={() => setSelectedDistrict(null)}
          />
        );
      case 'paperSeminars':
        return (
          <DistrictDetailPanelPaper
            districtData={selectedDistrict}
            onClose={() => setSelectedDistrict(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section id="map" className="map-section">
      <OceanWaves />



      <div className="instance-selector">
        <button onClick={() => setCurrentInstance('overall')}>Overall</button>
        <button onClick={() => setCurrentInstance('remedialTeaching')}>
          Remedial Teaching Programs
        </button>
        <button onClick={() => setCurrentInstance('paperSeminars')}>
          Paper Seminars
        </button>
      </div>
      <div className="map-container">
        <SriLankaMapThree
          districtMap={districtMap}
          onDistrictHover={handleDistrictHover}
          onDistrictClick={handleDistrictClick}
          colorMetric={colorMetric}
          labelMetric={labelMetric}
        />
      </div>

      {/* National Stats Box */}
      <div className="map-stats-box">
        <NationalStats nationalStats={nationalStats} instance={currentInstance} />
      </div>

      <div className="map-bar-chart">
        {districtData && (
          <SummaryChart districtData={districtData} currentInstance={currentInstance} />
        )}
      </div>

      {loading && <div className="loading-overlay">Loading data...</div>}
      {error && <div className="error-overlay">Error: {error.message}</div>}

      {renderDistrictDetailPanel()}

      {hoveredDistrict && (
        <div className="hover-indicator">{hoveredDistrict}</div>
      )}

      <div className="map-legend">
        <span className="legend-icon"></span>
        <span className="legend-text">Last Week Active Districts</span>
      </div>

    </section>
  );
}

export default MapSection;
