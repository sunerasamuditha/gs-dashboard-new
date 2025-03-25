import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MapSection from './pages/MapSection';
import About from './pages/About';
import useDistrictData from './useDistrictData';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { districtData, loading, error } = useDistrictData();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  const [theme, setTheme] = useState('light');
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const districtMap = useMemo(() => {
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

  /*const handleDistrictClick = useCallback((districtName) => {
    if (districtMap[districtName]) {
      setSelectedDistrict(districtMap[districtName]);
    } else {
      setSelectedDistrict(null);
    }
  }, [districtMap]);

  const handleDistrictHover = useCallback((districtName) => {
    setHoveredDistrict(districtName);
  }, []);*/

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setIsNavbarVisible(true); // Show at top
      } else if (currentScrollY > lastScrollY) {
        setIsNavbarVisible(false); // Hide when scrolling down
      } else {
        setIsNavbarVisible(true); // Show when scrolling up
      }
      lastScrollY = currentScrollY;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.scrollY > 0) {
          setIsNavbarVisible(false); // Hide after 2s inactivity
        }
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`App ${theme === 'dark' ? 'dark' : ''}`}>
      <Navbar theme={theme} toggleTheme={toggleTheme} isVisible={isNavbarVisible} />
      <div className="content">
        <Home />
        <MapSection />
        <About />
      </div>
      {loading && <div className="loading-indicator">Loading district data...</div>}
      {error && <div className="error-indicator">Error loading data: {error.message}</div>}
      {hoveredDistrict && (
        <div className="hover-indicator">
          Hovering: {hoveredDistrict}
        </div>
      )}
      {selectedDistrict && (
        <div className="selected-indicator">
          Selected District: {selectedDistrict['Districts']}
        </div>
      )}
       <Analytics />
    </div>
  );
}

export default App;
