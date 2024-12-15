/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const CreditsPieChart = () => {
    const [departments] = useState([
        { id: 1, name: "CSE" },
        { id: 2, name: "IT" },
        { id: 3, name: "AIDS" },
        { id: 4, name: "AIML" },
        { id: 5, name: "CyberSecurity" },
        { id: 6, name: "CSBS" },
        { id: 7, name: "MECH" },
        { id: 8, name: "MCT" },
        { id: 9, name: "ECE" },
        { id: 10, name: "EEE" },
        { id: 11, name: "VLSI" },
        { id: 12, name: "BME" },
        { id: 13, name: "ACT" },
        { id: 14, name: "CIVIL" },
    ]);

    const [selectedDept, setSelectedDept] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [creditsData, setCreditsData] = useState([]);
    const [viewMode, setViewMode] = useState('chart'); // Default to 'chart'
    const chartRef = useRef(null);

    useEffect(() => {
        if (selectedDept && selectedSemester) {
            fetchCredits(selectedDept, selectedSemester);
        }
    }, [selectedDept, selectedSemester]);

    const fetchCredits = async (deptName, semester) => {
        try {
            const regulation = 'R21'; // Hardcoded for R21
            const response = await axios.get('http://localhost:5000/api/courses', {
                params: { department: deptName, semester: semester, regulation: regulation },
            });
            setCreditsData(response.data || []);
        } catch (err) {
            console.error('Error fetching credits:', err);
        }
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    // Prepare data for the Pie chart
    const pieData = {
        labels: creditsData.map((item) => item.category),
        datasets: [
            {
                label: 'Credits',
                data: creditsData.map((item) => item.credits),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Department Credits Overview</h1>
            <div>
                <select onChange={(e) => setSelectedDept(e.target.value)} value={selectedDept}>
                    <option value="">Select a Department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                            {dept.name}
                        </option>
                    ))}
                </select>

                <select onChange={(e) => setSelectedSemester(e.target.value)} value={selectedSemester}>
                    <option value="">Select a Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                            Semester {sem}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ margin: '20px 0' }}>
                <button onClick={() => handleViewChange('chart')} disabled={viewMode === 'chart'}>
                    View Chart
                </button>
                <button onClick={() => handleViewChange('table')} disabled={viewMode === 'table'}>
                    View Table
                </button>
            </div>

            {viewMode === 'chart' && creditsData.length > 0 && (
                <div
                    style={{
                        width: '350px',
                        height: '350px',
                        margin: '20px auto',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                >
                    <Pie
                        ref={chartRef}
                        data={pieData}
                        options={{
                            maintainAspectRatio: false,
                            responsive: true,
                        }}
                        style={{ width: '300px', height: '300px', margin: '0 auto' }}
                    />
                </div>
            )}

            {viewMode === 'table' && creditsData.length > 0 && (
                <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Code</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Name</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Category</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits</th>
                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>LTP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {creditsData.map((course, index) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.course_code}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.course_name}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.category}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.credits}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{course.ltp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {creditsData.length === 0 && selectedDept && selectedSemester && (
                <p>No data available for the selected department and semester.</p>
            )}
        </div>
    );
};

export default CreditsPieChart;
