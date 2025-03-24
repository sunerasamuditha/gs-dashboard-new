import { useState, useEffect } from 'react';

const useDistrictData = () => {
  const [data, setData] = useState({
    overall: { districtData: [], nationalStats: [] },
    remedialTeaching: { districtData: [], nationalStats: [] },
    paperSeminars: { districtData: [], nationalStats: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Process district data: combine two header rows into composite headers
  const processDistrictData = (rawData) => {
    if (!rawData || rawData.length < 2) return [];
    const header1 = rawData[0];
    const header2 = rawData[1];
    const fixedHeader1 = header1.map((h, i) =>
      h.trim() === '' && i > 0 ? header1[i - 1].trim() : h.trim()
    );
    const compositeHeaders = fixedHeader1.map((h, i) =>
      i >= 2 && header2[i] && header2[i].trim() !== ''
        ? `${h} - ${header2[i].trim()}`
        : h
    );

    console.log('Composite Headers:', compositeHeaders);
    const rows = rawData.slice(2);
    return rows.map((row) => {
      const obj = {};
      compositeHeaders.forEach((key, i) => {
        obj[key] = row[i] !== undefined ? row[i] : null;
      });
      return obj;
    });
  };

  // Updated processing function for overall national stats
  const processNationalStatsOverall = (rawData) => {
    if (!rawData || rawData.length < 5) return [];
    const result = [];
    for (let i = 3; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;

      const metricName = row[0]?.toLowerCase() || '';
      if (metricName.includes('seminars') || metricName.includes('programs')) {
        const nextRow = rawData[i + 1];
        if (nextRow && nextRow.length >= 5) {
          result.push({
            metric: row[0],
            values: nextRow.slice(1).map((val) => val || '0'),
          });
          i++; // Skip the numeric row already processed
        }
      } else if (
        metricName.includes('fb posts published') ||
        metricName.includes('number of students reached') ||
        metricName.includes('districts covered') ||
        metricName.includes('seminar week')
      ) {
        result.push({
          metric: row[0],
          values: row.slice(1).map((val) => val || '0'),
        });
      }
    }
    return result;
  };

  // Processing for remedial teaching national stats
  const processNationalStatsRemedial = (rawData) => {
    if (!rawData || rawData.length < 5) return [];
    const result = [];
    for (let i = 3; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;
      const metricName = row[0]?.toLowerCase() || '';
      if (metricName.includes('seminars') || metricName.includes('programs')) {
        const nextRow = rawData[i + 1];
        if (nextRow && nextRow.length >= 5) {
          result.push({
            metric: row[0],
            values: nextRow.slice(1).map((val) => val || '0'),
          });
          i++;
        }
      } else {
        result.push({
          metric: row[0],
          values: row.slice(1).map((val) => val || '0'),
        });
      }
    }
    return result;
  };

  // Processing for paper seminars national stats
  const processNationalStatsPaper = (rawData) => {
    if (!rawData || rawData.length < 5) return [];
    const result = [];
    for (let i = 3; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;
      const metricName = row[0]?.toLowerCase() || '';
      if (metricName.includes('seminars') || metricName.includes('programs')) {
        const nextRow = rawData[i + 1];
        if (nextRow && nextRow.length >= 5) {
          result.push({
            metric: row[0],
            values: nextRow.slice(1).map((val) => val || '0'),
          });
          i++;
        }
      } else {
        result.push({
          metric: row[0],
          values: row.slice(1).map((val) => val || '0'),
        });
      }
    }
    return result;
  };

  useEffect(() => {
    fetch('https://gsdashboard-backend.onrender.com/api/sheet-data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then((rawData) => {
        const processedData = {
          overall: {
            districtData: processDistrictData(rawData.overall.districtData),
            nationalStats: processNationalStatsOverall(rawData.overall.nationalStats),
          },
          remedialTeaching: {
            districtData: processDistrictData(rawData.remedialTeaching.districtData),
            nationalStats: processNationalStatsRemedial(rawData.remedialTeaching.nationalStats),
          },
          paperSeminars: {
            districtData: processDistrictData(rawData.paperSeminars.districtData),
            nationalStats: processNationalStatsPaper(rawData.paperSeminars.nationalStats),
          },
        };
        setData(processedData);
        setLoading(false);
      })
      .catch((err) => {
        
        setError(err);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};

export default useDistrictData;
