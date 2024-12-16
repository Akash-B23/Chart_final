/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./courseDetails.css";

const CourseDetails = ({ department, regulation }) => {
  const semester = "4"; // Hardcoding the semester value for this component.
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const departments = [
    { value: "CSE", label: "CSE" },
    { value: "AIML", label: "AIML" },
    { value: "AIDS", label: "AIDS" },
    { value: "IT", label: "IT" },
    { value: "CSBS", label: "CSBS" },
    { value: "CYS", label: "CYS" },
    { value: "ECE", label: "ECE" },
    { value: "EEE", label: "EEE" },
    { value: "ACT", label: "ACT" },
    { value: "VLSI", label: "VLSI" },
    { value: "MECH", label: "MECH" },
    { value: "MCT", label: "MCT" },
    { value: "CIVIL", label: "CIVIL" },
    { value: "BIOMED", label: "BIOMED" },
  ];

  const getStoredCourses = () => {
    const storedCourses = localStorage.getItem(`courses-semester-${semester}`);
    return storedCourses ? JSON.parse(storedCourses) : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const storedCourses = getStoredCourses();

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
    if (field === "gate_common" && (value === "Common" || value === "Both")) {
      updatedCourses[index]["common_dept"] = [];
    } else if (field === "gate_common") {
      updatedCourses[index]["common_dept"] = [];
    }
    setCourses(updatedCourses);
    localStorage.setItem(
      `courses-semester-${semester}`,
      JSON.stringify(updatedCourses)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalCredits = courses.reduce(
      (sum, course) => sum + (parseFloat(course.credits) || 0),
      0
    );

    if (totalCredits > 26) {
      alert("Total credits exceed 26. Please adjust the course credits.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/semester-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses }),
      });

      if (response.ok) {
        alert("Courses submitted successfully!");
        localStorage.removeItem(`courses-semester-${semester}`);
      } else {
        alert("Failed to submit courses.");
      }
    } catch (error) {
      console.error("Error submitting courses:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#f9f9f9", // Matches the table background
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#f9f9f9", // Matches the table background
      color: "#333", // Ensures text is visible
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#d0ebff" : state.isFocused ? "#e9f5ff" : "#f9f9f9", // Highlighting for selected and focused options
      color: state.isSelected ? "#0056b3" : "#333", // Text color for selected and non-selected options
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e3f2fd", // Background color for selected values
      color: "#333",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#333", // Text color for selected value labels
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#333",
      ":hover": {
        backgroundColor: "#ffebee",
        color: "#d32f2f",
      },
    }),
  };


  return (
    <div className="semester-container">
      <h2 className="semester-header">Semester {semester} - Course Details</h2>
      <div className="table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Sno</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Category</th>
              <th>T/P</th>
              <th>Gate/Common</th>
              <th>Common Departments</th>
              <th>Credits</th>
              <th>LTP</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.sno}</td>
                <td>
                  <input
                    type="text"
                    value={course.course_code}
                    onChange={(e) =>
                      handleChange(index, "course_code", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={course.course_name}
                    onChange={(e) =>
                      handleChange(index, "course_name", e.target.value)
                    }
                  />
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td className="common-width">
                  {course.gate_common === "Common" || course.gate_common === "Both" ? (
                    <Select
                      isMulti
                      options={departments}
                      value={departments.filter((dept) =>
                        course.common_dept.includes(dept.value)
                      )}
                      onChange={(selectedOptions) =>
                        handleChange(
                          index,
                          "common_dept",
                          selectedOptions.map((option) => option.value)
                        )
                      }
                      closeMenuOnSelect={false}
                      styles={customStyles}
                    />
                  ) : (
                    <span>Not Applicable</span>
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    value={course.credits}
                    onChange={(e) =>
                      handleChange(index, "credits", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={course.ltp}
                    onChange={(e) =>
                      handleChange(index, "ltp", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-container">
          <button className="add-course" onClick={addCourse}>
            Add Course
          </button>
          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
