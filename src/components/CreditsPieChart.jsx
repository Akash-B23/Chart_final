/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";

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

    const [selectedDept, setSelectedDept] = useState("");
    const [semesterData, setSemesterData] = useState({});
    const [categoryData, setCategoryData] = useState({});
    const [error, setError] = useState("");

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
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error fetching semester data");
            setSemesterData({});
        }
    };

    const fetchCategoryData = async (department) => {
        try {
            const regulation = "R21"; // Hardcoded regulation
            const response = await axios.get("http://localhost:5000/api/courses/category", {
                params: { department, regulation },
            });
            console.log(response.data); // Log category data to inspect it
            setCategoryData(response.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error fetching category data");
            setCategoryData({});
        }
    };


    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Department Courses Overview</h1>
            <select onChange={(e) => setSelectedDept(e.target.value)} value={selectedDept}>
                <option value="">Select a Department</option>
                {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                        {dept.name}
                    </option>
                ))}
            </select>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {Object.keys(semesterData).length > 0 ? (
                <div style={{ marginTop: "20px" }}>
                    {/* Semester-wise tables */}
                    {Object.entries(semesterData).map(([semester, courses]) => (
                        <div key={semester} style={{ marginBottom: "20px" }}>
                            <h2>Semester {semester}</h2>

                            {courses.length > 0 ? (
                                <table
                                    style={{
                                        margin: "10px auto",
                                        borderCollapse: "collapse",
                                        width: "80%",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Course Code</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Course Name</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Credits</th>
                                            <th style={{ border: "1px solid #ddd", padding: "8px" }}>LTP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map((course, index) => (
                                            <tr key={index}>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                    {course.course_code}
                                                </td>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                    {course.course_name}
                                                </td>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                    {course.credits}
                                                </td>
                                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
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
                </div>
            ) : (
                selectedDept && <p>No semester data available for the selected department.</p>
            )}

            {Object.keys(categoryData).length > 0 ? (
                <div style={{ marginTop: "30px" }}>
                    <h2>Category-wise Data</h2>
                    {Object.entries(categoryData).map(([category, courses]) => (
                        <div key={category} style={{ marginBottom: "20px" }}>
                            <h3>{categoryMapping[category]}</h3>
                            <table
                                style={{
                                    margin: "10px auto",
                                    borderCollapse: "collapse",
                                    width: "80%",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Course Code</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Course Name</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Semester</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Credits</th>
                                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>LTP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course, index) => (
                                        <tr key={index}>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {course.course_code}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {course.course_name}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {course.semester || 'N/A'} {/* Added default fallback for semester */}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {course.credits}
                                            </td>
                                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                                {course.ltp}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ) : (
                selectedDept && <p>No category data available for the selected department.</p>
            )}
        </div>
    );
};

export default CreditsPieChart;
