import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "./SideBar.jsx";
import Header from "./Header.jsx";
import MainContent from "./MainContent.jsx";
import "./DashBoard.css";

function DashBoard() {
  const [selectedSemester, setSelectedSemester] = useState("1"); // Default semester
  const [courseData, setCourseData] = useState({
    // Initialize an empty object for all semesters
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": [],
    "7": [],
    "8": [],
  });

  const location = useLocation();
  const { rd } = location.state || {}; // Extract Regulation from state (if available)

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester); // Update the selected semester state
  };

  const updateCoursesForSemester = (semester, updatedCourses) => {
    setCourseData((prevData) => ({
      ...prevData,
      [semester]: updatedCourses, // Update only the selected semester's course data
    }));
  };

  return (
    <div className="app-container">
      <Header />
      <div className="layout">
        <SideBar onSelectSemester={handleSemesterSelect} />
        <MainContent
          selectedSemester={selectedSemester}
          courseData={courseData}
          onCourseDataChange={updateCoursesForSemester}
          rd={rd} // Pass Regulation to MainContent
        />
      </div>
    </div>
  );
}

export default DashBoard;
