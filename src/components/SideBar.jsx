/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./Sidebar.css";
import MenuBookIcon from "@mui/icons-material/MenuBook";

// Updated Sidebar component that passes the selected semester to the DashBoard
const Sidebar = ({ onSelectSemester, onCourseAnalysisClick }) => {
  const semesters = [
    { icon: <MenuBookIcon />, title: "Semester 1", semester: "1" },
    { icon: <MenuBookIcon />, title: "Semester 2", semester: "2" },
    { icon: <MenuBookIcon />, title: "Semester 3", semester: "3" },
    { icon: <MenuBookIcon />, title: "Semester 4", semester: "4" },
    { icon: <MenuBookIcon />, title: "Semester 5", semester: "5" },
    { icon: <MenuBookIcon />, title: "Semester 6", semester: "6" },
    { icon: <MenuBookIcon />, title: "Semester 7", semester: "7" },
    { icon: <MenuBookIcon />, title: "Semester 8", semester: "8" }
  ];

  return (
    <div className="sidebar">
      {semesters.map((semester) => (
        <div
          key={semester.semester}
          className="semester"
          onClick={() => onSelectSemester(semester.semester)} // Pass selected semester to DashBoard
        >
          {semester.icon}
          <h3>{semester.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
