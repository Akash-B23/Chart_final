import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Endpoint to fetch aggregated credits data for charts
router.get("/credits", async (req, res) => {
    try {
        const department = req.query.department;
        if (!department) {
            return res.status(400).json({ message: "Missing department parameter" });
        }

        // Query to fetch credits and category for the selected department
        const result = await pool.query(
            "SELECT credits, category FROM r21 WHERE department = $1",
            [department]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No courses found for the selected department" });
        }

        // Sum up all the credits for the selected department
        const totalCredits = result.rows.reduce((sum, course) => sum + course.credits, 0);

        // Calculate the percentage for each course credit and return the category as well
        const creditsWithPercentage = result.rows.map(course => ({
            category: course.category,
            credits: course.credits,
            percentage: ((course.credits / totalCredits) * 100).toFixed(2), // Calculate percentage
        }));

        res.json(creditsWithPercentage); // Return credits, category, and percentage
    } catch (error) {
        console.error("Error retrieving course credits:", error.message);
        res.status(500).json({ message: "Error retrieving course credits" });
    }
});

// Endpoint to fetch courses grouped by semester
router.get("/courses/semester", async (req, res) => {
    const { department, regulation } = req.query;

    if (!department || !regulation) {
        return res.status(400).json({ message: "Missing required query parameters: department or regulation" });
    }

    try {
        const query = `
        SELECT semester, course_code, course_name, credits, ltp
        FROM courses
        WHERE department = $1 AND regulation = $2
        ORDER BY semester
      `;
        const values = [department, regulation];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No courses found for the given department and regulation." });
        }

        // Grouping courses by semester
        const groupedData = rows.reduce((acc, course) => {
            if (!acc[course.semester]) {
                acc[course.semester] = [];
            }
            acc[course.semester].push({
                course_code: course.course_code,
                course_name: course.course_name,
                credits: course.credits,
                ltp: course.ltp,
            });
            return acc;
        }, {});

        // Ensure all semesters are included, even those with no courses
        const allSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
        allSemesters.forEach(semester => {
            if (!groupedData[semester]) {
                groupedData[semester] = [];
            }
        });

        res.status(200).json(groupedData);
    } catch (error) {
        console.error("Error fetching courses:", error.message);
        res.status(500).json({ message: "Error fetching courses." });
    }
});

// Endpoint to fetch courses grouped by category and include semester
router.get("/courses/category", async (req, res) => {
    const { department, regulation } = req.query;

    if (!department || !regulation) {
        return res.status(400).json({ message: "Missing required query parameters: department or regulation" });
    }

    try {
        const query = `
        SELECT category, semester, course_code, course_name, credits, ltp
        FROM courses
        WHERE department = $1 AND regulation = $2
        ORDER BY category, semester
      `;
        const values = [department, regulation];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No courses found for the given department and regulation." });
        }

        // Grouping courses by category and including semester data
        const groupedData = rows.reduce((acc, course) => {
            if (!acc[course.category]) {
                acc[course.category] = [];
            }
            acc[course.category].push({
                semester: course.semester, // Include semester here
                course_code: course.course_code,
                course_name: course.course_name,
                credits: course.credits,
                ltp: course.ltp,
            });
            return acc;
        }, {});

        res.status(200).json(groupedData);
    } catch (error) {
        console.error("Error fetching courses:", error.message);
        res.status(500).json({ message: "Error fetching courses." });
    }
});

export default router;
