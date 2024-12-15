/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import "./courseDetails.css";

const CourseDetails = ({ department, regulation }) => {
  const semester = "3"; // Hardcoding the semester value for this component.
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState({}); // Object to track each dropdown state

  const departments = [
    "CSE",
    "AIML",
    "AIDS",
    "IT",
    "CSBS",
    "CYS",
    "ECE",
    "EEE",
    "ACT",
    "VLSI",
    "MECH",
    "MCT",
    "CIVIL",
    "BIOMED",
  ];

  // This will store the courses in localStorage under the key `courses-semester-{semester}`
  const getStoredCourses = () => {
    const storedCourses = localStorage.getItem(`courses-semester-${semester}`);
    return storedCourses ? JSON.parse(storedCourses) : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const storedCourses = getStoredCourses();

      // If data is available in localStorage, load it; else, fetch from the server
      if (storedCourses) {
        setCourses(storedCourses);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/semester-details?department=${department}&regulation=${regulation}&semester=${semester}`
        );

        if (response.ok) {
          const data = await response.json();
          const maxSno =
            data.length > 0 ? Math.max(...data.map((course) => course.sno)) : 1;
          const fullCourses = Array.from({ length: maxSno }, (_, index) => {
            const sno = index + 1;
            return (
              data.find((course) => course.sno === sno) || {
                sno,
                department,
                regulation,
                course_code: "",
                course_name: "",
                category: "",
                tp: "Theory",
                gate_common: "Gate",
                common_dept: [],
                semester,
                credits: "",
                ltp: "",
              }
            );
          });

          setCourses(fullCourses);
        } else if (response.status === 404) {
          setCourses([
            {
              sno: 1,
              department,
              regulation,
              course_code: "",
              course_name: "",
              category: "",
              tp: "Theory",
              gate_common: "Gate",
              common_dept: [],
              semester,
              credits: "",
              ltp: "",
            },
          ]);
        } else {
          throw new Error("Unexpected response from server");
        }
      } catch (err) {
        setError("Error fetching course details.");
        setCourses([
          {
            sno: 1,
            department,
            regulation,
            course_code: "",
            course_name: "",
            category: "",
            tp: "Theory",
            gate_common: "Gate",
            common_dept: [],
            semester,
            credits: "",
            ltp: "",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [department, regulation, semester]);

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        sno: courses.length + 1,
        department,
        regulation,
        course_code: "",
        course_name: "",
        category: "",
        tp: "Theory",
        gate_common: "Gate",
        common_dept: [],
        semester,
        credits: "",
        ltp: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    setCourses(updatedCourses);
    // Store the updated courses in localStorage immediately
    localStorage.setItem(
      `courses-semester-${semester}`,
      JSON.stringify(updatedCourses)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure courses state is correctly updated
    const updatedCourses = courses.map((course) => ({
      ...course,
      common_dept: course.common_dept || [], // Handle empty common_dept fields
    }));
    // Calculate total credits
    const totalCredits = courses.reduce(
      (sum, course) => sum + (parseFloat(course.credits) || 0),
      0
    );

    // Check if total credits are less than or equal to 26
    if (totalCredits > 26) {
      alert("Total credits exceed 26. Please adjust the course credits.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/semester-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: updatedCourses }),
      });

      if (response.ok) {
        alert("Courses submitted successfully!");
        // Clear the stored courses after successful submission
        localStorage.removeItem(`courses-semester-${semester}`);
      } else {
        alert("Failed to submit courses.");
      }
    } catch (error) {
      console.error("Error submitting courses:", error);
    }
  };

  const handleCheckboxChange = (index, department) => {
    const updatedCourses = [...courses];
    const currentDepartments = updatedCourses[index].common_dept || [];
    updatedCourses[index].common_dept = currentDepartments.includes(department)
      ? currentDepartments.filter((d) => d !== department)
      : [...currentDepartments, department];
    setCourses(updatedCourses);
    // Store the updated courses in localStorage immediately
    localStorage.setItem(
      `courses-semester-${semester}`,
      JSON.stringify(updatedCourses)
    );
  };

  const toggleDropdown = (index) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the dropdown visibility for the clicked index
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="semester-container">
      <h2 className="semester-header">Semester {semester} - Course Details</h2>
      <div className="form-container">
        {courses.map((course, index) => (
          <div key={index} className="course-row">
            <h3 className="course-header">Course {course.sno}</h3>
            <form className="form-grid">
              <div className="form-group">
                <label>Sno</label>
                <input type="text" value={course.sno} readOnly />
              </div>
              <div className="form-group">
                <label>Course Code</label>
                <input
                  type="text"
                  placeholder="Course Code"
                  value={course.course_code}
                  onChange={(e) =>
                    handleChange(index, "course_code", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Course Name</label>
                <input
                  type="text"
                  placeholder="Course Name"
                  value={course.course_name}
                  onChange={(e) =>
                    handleChange(index, "course_name", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={course.category}
                  onChange={(e) =>
                    handleChange(index, "category", e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  <option value="HSMC">HSMC</option>
                  <option value="BSC">BSC</option>
                  <option value="ESC">ESC</option>
                  <option value="PCC">PCC</option>
                </select>
              </div>
              <div className="form-group">
                <label>T/P</label>
                <select
                  value={course.tp}
                  onChange={(e) => handleChange(index, "tp", e.target.value)}
                >
                  <option value="Theory">Theory</option>
                  <option value="Practical">Practical</option>
                  <option value="Theory cum Practical">
                    Theory cum Practical
                  </option>
                </select>
              </div>
              <div className="form-group">
                <label>Gate/Common</label>
                <select
                  value={course.gate_common}
                  onChange={(e) =>
                    handleChange(index, "gate_common", e.target.value)
                  }
                >
                  <option value="Gate">Gate</option>
                  <option value="Common">Common</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              {course.gate_common === "Common" && (
                <div className="form-group">
                  <label>Common for Departments</label>
                  <div
                    className="dropdown-field"
                    onClick={() => toggleDropdown(index)} // Toggle the specific dropdown
                  >
                    {course.common_dept.length > 0
                      ? course.common_dept.join(", ")
                      : "Select Departments"}
                  </div>
                  {dropdownOpen[index] && (
                    <div className="checkbox-box">
                      {departments.map((dept) => (
                        <label key={dept} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={course.common_dept.includes(dept)}
                            onChange={() => handleCheckboxChange(index, dept)}
                          />
                          {dept}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="form-group">
                <label>Credits</label>
                <input
                  type="number"
                  placeholder="Credits"
                  value={course.credits}
                  onChange={(e) =>
                    handleChange(index, "credits", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label>LTP</label>
                <input
                  type="text"
                  placeholder="LTP"
                  value={course.ltp}
                  onChange={(e) => handleChange(index, "ltp", e.target.value)}
                />
              </div>
            </form>
          </div>
        ))}

        <div className="button-container">
          <button className="add-course" type="button" onClick={addCourse}>
            Add Course
          </button>
          <button className="submit" type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
