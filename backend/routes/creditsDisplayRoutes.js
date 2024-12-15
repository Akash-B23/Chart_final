import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

router.get("/credits", async (req, res) => {
    try {
        const department = req.query.department;
        const semester = parseInt(req.query.semester, 10);  // Convert to integer
        if (!department || isNaN(semester)) {
            return res.status(400).json({ message: "Missing department or invalid semester parameter" });
        }

        // Query to fetch credits and category for the selected department and semester
        const result = await pool.query(
            "SELECT credits, category FROM r21 WHERE department = $1 AND semester = $2",
            [department, semester]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No courses found for the selected department and semester" });
        }

        // Sum up all the credits for the selected department and semester
        const totalCredits = result.rows.reduce((sum, course) => sum + course.credits, 0);

        // Calculate the percentage for each course credit and return the category as well
        const creditsWithPercentage = result.rows.map(course => ({
            category: course.category,
            credits: course.credits,
            percentage: (course.credits / totalCredits * 100).toFixed(2),  // Calculate percentage
        }));

        res.json(creditsWithPercentage); // Return credits, category, and percentage
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving course credits" });
    }
});

router.get("/courses", async (req, res) => {
    const { department, semester, regulation } = req.query;

    if (!department || !semester || !regulation) {
        return res.status(400).send("Missing required query parameters: department, semester, or regulation");
    }

    try {
        const query = `
        SELECT sno, department, regulation, semester, course_code, course_name, category, tp, gate_common, common_dept, credits, ltp
        FROM courses
        WHERE department = $1 AND semester = $2 AND regulation = $3
      `;
        const values = [department, semester, regulation];

        const { rows } = await pool.query(query, values);

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).send({ message: "No courses found for the given department, semester, and regulation." });
        }
    } catch (error) {
        console.error("Error fetching courses:", error.message);
        res.status(500).send({ message: "Error fetching courses." });
    }
});


export default router;