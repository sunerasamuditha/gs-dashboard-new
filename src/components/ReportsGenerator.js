import React, { useState, useEffect, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import './ReportsGenerator.css';

const DATA_URL = 'https://raw.githubusercontent.com/sunerasamuditha/gs_pipeline/main/reports_data.json';

const knownMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const ReportsGenerator = () => {
    const [rawData, setRawData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        year: '',
        month: '',
        district: '',
        type: ''
    });

    const [options, setOptions] = useState({
        years: [],
        districts: [],
        types: []
    });

    const [smartInput, setSmartInput] = useState('');
    const [knownTypes, setKnownTypes] = useState(new Set());
    const [knownDistricts, setKnownDistricts] = useState(new Set());

    // Levenshtein Distance for Typos
    const getEditDistance = (a, b) => {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) { matrix[i][j] = matrix[i - 1][j - 1]; }
                else { matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)); }
            }
        }
        return matrix[b.length][a.length];
    };

    useEffect(() => {
        fetch(DATA_URL)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch data');
                return res.text();
            })
            .then(text => {
                // Replace NaN with null to make it valid JSON
                const sanitizedText = text.replace(/:\s*NaN/g, ': null'); 
                const data = JSON.parse(sanitizedText);
                
                // Clean data
                const cleanedData = data.map(row => ({
                    ...row,
                    District: row.District ? row.District.trim() : "",
                    'Type of Seminar': row['Type of Seminar'] ? row['Type of Seminar'].trim() : "",
                    'Name of the School ': row['Name of the School '] ? row['Name of the School '].trim() : "",
                    // Ensure numeric values are numbers
                    'Number of Students participated': Number(row['Number of Students participated']) || 0
                }));
                setRawData(cleanedData);
                setFilteredData(cleanedData);
                initDropdowns(cleanedData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading data:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const initDropdowns = (data) => {
        const yearSet = new Set();
        const distSet = new Set();
        const typeSet = new Set();

        data.forEach(row => {
            if (row.Date) yearSet.add(row.Date.substring(0, 4));
            if (row.District) distSet.add(row.District);
            if (row['Type of Seminar']) typeSet.add(row['Type of Seminar']);
        });

        setOptions({
            years: Array.from(yearSet).sort().reverse(),
            districts: Array.from(distSet).sort(),
            types: Array.from(typeSet).sort()
        });
        setKnownTypes(typeSet);
        setKnownDistricts(distSet);
    };

    const applyFilters = useCallback(() => {
        let result = rawData;
        const { year, month, district, type } = filters;

        result = result.filter(row => {
            const rYear = row.Date ? row.Date.substring(0, 4) : "";
            const rMonth = row.Date ? row.Date.substring(5, 7) : "";
            const rDist = row.District || "";
            const rType = row['Type of Seminar'] || "";

            return (!year || rYear === year) &&
                   (!month || rMonth === month) &&
                   (!district || rDist === district) &&
                   (!type || rType === type);
        });

        setFilteredData(result);
    }, [filters, rawData]);

    useEffect(() => {
        applyFilters();
    }, [filters, applyFilters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSmartInputChange = (e) => {
        const input = e.target.value;
        setSmartInput(input);
        
        if (!input) {
            setFilters({ year: '', month: '', district: '', type: '' });
            return;
        }

        const words = input.toLowerCase().split(' ');
        const newFilters = { year: '', month: '', district: '', type: '' };

        words.forEach(word => {
            if (word.length < 3 && isNaN(word)) return;

            // Detect Year
            if (!isNaN(word) && word.length === 4) {
                newFilters.year = word;
            }

            // Detect Month (Fuzzy)
            knownMonths.forEach((mon, idx) => {
                if (getEditDistance(word, mon.toLowerCase()) <= 1) {
                    newFilters.month = String(idx + 1).padStart(2, '0');
                }
            });

            // Detect District (Fuzzy)
            Array.from(knownDistricts).forEach(dist => {
                if (getEditDistance(word, dist.toLowerCase()) <= 1) {
                    // Find exact match in options if possible, or use the known district
                    const match = options.districts.find(d => d.toLowerCase() === dist.toLowerCase()) || dist;
                    newFilters.district = match;
                }
            });

            // Detect Type (Fuzzy)
            Array.from(knownTypes).forEach(type => {
                if (type.toLowerCase().includes(word) || getEditDistance(word, type.toLowerCase()) <= 2) {
                    newFilters.type = type;
                }
            });
        });

        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    };

    const generatePDF = () => {
        if (filteredData.length === 0) {
            alert("No data to export!");
            return;
        }

        const doc = new jsPDF();

        // Title
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text("Ganitha Saviya - Seminar Report", 14, 13);

        // Metadata
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

        // Show active filters in PDF
        let filterText = "Filters: ";
        const activeFilters = [];
        if (filters.year) activeFilters.push(`Year: ${filters.year}`);
        if (filters.month) activeFilters.push(`Month: ${knownMonths[parseInt(filters.month) - 1]}`);
        if (filters.district) activeFilters.push(`District: ${filters.district}`);
        if (filters.type) activeFilters.push(`Type: ${filters.type}`);
        
        filterText += activeFilters.length > 0 ? activeFilters.join(", ") : "None (All Records)";
        doc.text(filterText, 14, 35);

        // Table
        autoTable(doc, {
            startY: 40,
            head: [['Date', 'District', 'School', 'Type', 'Medium', 'Students', 'Volunteers']],
            body: filteredData.map(r => [
                r.Date,
                r.District,
                r['Name of the School '],
                r['Type of Seminar'],
                r.Medium || "-",
                r['Number of Students participated'],
                r.Volunteers || "-"
            ]),
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 8 }
        });

        doc.save(`GS_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const getMonthName = (monthCode) => {
        if (!monthCode) return '';
        return knownMonths[parseInt(monthCode) - 1];
    };

    return (
        <div className="reports-generator-section">
            <div className="reports-generator-container">
                <div className="reports-header">
                    <h2>Report Generator</h2>
                </div>

                <div className="reports-search-section">
                    <input
                        type="text"
                        className="reports-smart-input"
                        id="smartInput"
                        placeholder="Search: Type 'Galle Remedial May 2024' (Handles typos!)"
                        value={smartInput}
                        onChange={handleSmartInputChange}
                    />
                </div>

                <div className="reports-filters">
                    <div className="reports-filter-group">
                        <label>YEAR</label>
                        <select
                            className="reports-select"
                            value={filters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                        >
                            <option value="">All Years</option>
                            {options.years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="reports-filter-group">
                        <label>MONTH</label>
                        <select
                            className="reports-select"
                            value={filters.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                        >
                            <option value="">All Months</option>
                            {knownMonths.map((m, i) => (
                                <option key={i} value={String(i + 1).padStart(2, '0')}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="reports-filter-group">
                        <label>DISTRICT</label>
                        <select
                            className="reports-select"
                            value={filters.district}
                            onChange={(e) => handleFilterChange('district', e.target.value)}
                        >
                            <option value="">All Districts</option>
                            {options.districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="reports-filter-group">
                        <label>TYPE OF SEMINAR</label>
                        <select
                            className="reports-select"
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                        >
                            <option value="">All Types</option>
                            {options.types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                <div className="reports-chips">
                    {filters.year && <div className="reports-chip active">Year: {filters.year}</div>}
                    {filters.month && <div className="reports-chip active">Month: {getMonthName(filters.month)}</div>}
                    {filters.district && <div className="reports-chip active">District: {filters.district}</div>}
                    {filters.type && <div className="reports-chip active">Type: {filters.type}</div>}
                </div>

                <div className="reports-actions">
                    <div className="reports-status">
                        {loading ? "Loading data..." : error ? `Error: ${error}` : `Found ${filteredData.length} records`}
                    </div>
                    <button className="reports-btn" onClick={generatePDF} disabled={loading || filteredData.length === 0}>
                        📥 Download PDF Report
                    </button>
                </div>

                <div className="reports-table-container">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>School</th>
                                <th>District</th>
                                <th>Type</th>
                                <th>Medium</th>
                                <th>Students</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.slice(0, 5).map((row, index) => (
                                <tr key={index}>
                                    <td>{row.Date}</td>
                                    <td>{row['Name of the School ']}</td>
                                    <td>{row.District}</td>
                                    <td>{row['Type of Seminar']}</td>
                                    <td>{row.Medium || "-"}</td>
                                    <td>{row['Number of Students participated']}</td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No records found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsGenerator;
