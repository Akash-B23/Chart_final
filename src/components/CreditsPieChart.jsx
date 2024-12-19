/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
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
    const [semesterData, setSemesterData] = useState({});
    const [categoryData, setCategoryData] = useState({});
    const [viewMode, setViewMode] = useState('chart'); // Default to 'chart'

    const categoryMapping = {
        HSMC: 'Humanities & Social Science Courses (HSMC)',
        BSC: 'Basic Science Courses (BSC)',
        ESC: 'Engineering Science Courses (ESC)',
        PCC: 'Program Core Courses (PCC)',
        PEC: 'Professional Elective Courses (PEC)',
        OEC: 'Open Elective Courses (OEC)',
        EEC: 'Employability Enhancement Courses (EEC)',
        MC: 'Mandatory Courses (MC)',
    };

    useEffect(() => {
        if (selectedDept) {
            fetchSemesterData(selectedDept);
            fetchCategoryData(selectedDept);
        }
    }, [selectedDept]);

    const fetchSemesterData = async (department) => {
        try {
            const regulation = "R21"; // Hardcoded regulation
            const response = await axios.get("http://localhost:5000/api/courses/semester", {
                params: { department, regulation },
            });
            setSemesterData(response.data);
        } catch (err) {
            console.error(err);
            setSemesterData({});
        }
    };

    const fetchCategoryData = async (department) => {
        try {
            const regulation = "R21"; // Hardcoded regulation
            const response = await axios.get("http://localhost:5000/api/courses/category", {
                params: { department, regulation },
            });
            setCategoryData(response.data);
        } catch (err) {
            console.error(err);
            setCategoryData({});
        }
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    // Prepare pie chart data for semester-wise distribution
    const pieChartData = {
        labels: Object.keys(semesterData),
        datasets: [
            {
                data: Object.values(semesterData).map((courses) => courses.length),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40',
                    '#9966FF', '#FFCD56', '#66BB6A', '#FF6F61', '#42A5F5',
                ],
                hoverBackgroundColor: [
                    '#FF4863', '#36A0D6', '#FFAC39', '#4BB0A2', '#FF8F3A',
                    '#9961FF', '#FFD033', '#66A658', '#FF6F58', '#4296F1',
                ],
            },
        ],
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Department Courses Overview</h1>
            <div>
                <select onChange={(e) => setSelectedDept(e.target.value)} value={selectedDept}>
                    <option value="">Select a Department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                            {dept.name}
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

            {viewMode === 'chart' && semesterData && Object.keys(semesterData).length > 0 && (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <Pie data={pieChartData} />
                </div>
            )}

            {viewMode === 'chart' && (Object.keys(semesterData).length === 0) && (
                <p>No data available for the selected department.</p>
            )}

            {viewMode === 'table' && (
                <div>
                    {/* Semester-wise tables */}
                    {Object.entries(semesterData).map(([semester, courses]) => (
                        <div key={semester} style={{ marginBottom: '20px' }}>
                            <h2>Semester {semester}</h2>

                            {courses.length > 0 ? (
                                <table
                                    style={{
                                        margin: '10px auto',
                                        borderCollapse: 'collapse',
                                        width: '80%',
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Code</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Name</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits</th>
                                            <th style={{ border: '1px solid #ddd', padding: '8px' }}>LTP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => (
                                            <tr key={index}>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    {course.course_code}
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    {course.course_name}
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    {course.credits}
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    {course.ltp}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No records available for Semester {semester}.</p>
                            )}
                        </div>
                    ))}

                    {/* Category-wise tables */}
                    {Object.entries(categoryData).map(([category, courses]) => (
                        <div key={category} style={{ marginBottom: '20px' }}>
                            <h3>{categoryMapping[category]}</h3>
                            <table
                                style={{
                                    margin: '10px auto',
                                    borderCollapse: 'collapse',
                                    width: '80%',
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Code</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Course Name</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Semester</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Credits</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>LTP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, index) => (
                                        <tr key={index}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                {course.course_code}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                {course.course_name}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                {course.semester || 'N/A'}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                {course.credits}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                {course.ltp}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CreditsPieChart;
