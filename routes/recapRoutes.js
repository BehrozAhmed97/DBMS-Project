import express from "express";
const router = express.Router();
const { SQL } = await import("../utils/db.js");


router.get("/years", async (req, res) => {
    try {
        const years = await SQL`SELECT DISTINCT year FROM recap ORDER BY year DESC;`;
        res.status(200).json(years.map(y => y.year));
    } catch (error) {
        console.error("Error fetching years:", error);
        res.status(500).json({ error: "Failed to load years" });
    }
});


router.get("/semesters-by-year", async (req, res) => {
    try {
        const { year } = req.query;
        if (!year) return res.status(400).json({ error: "Missing year parameter" });
        
        const semesters = await SQL`SELECT DISTINCT semester FROM recap WHERE year = ${year};`;
        res.status(200).json(semesters.map(s => s.semester));
    } catch (error) {
        console.error("Error fetching semesters:", error);
        res.status(500).json({ error: "Failed to load semesters" });
    }
});


router.get("/classes-by-semester", async (req, res) => {
    try {
        const { year, semester } = req.query;
        if (!year || !semester) return res.status(400).json({ error: "Missing parameters" });

        const classes = await SQL`
            SELECT DISTINCT class FROM recap 
            WHERE year = ${year} AND semester = ${semester} 
            ORDER BY class;
        `;
        res.status(200).json(classes.map(c => c.class));
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ error: "Failed to load classes" });
    }
});


router.get("/courses-by-class", async (req, res) => {
    try {
        const { year, semester, classBatch } = req.query;
        if (!year || !semester || !classBatch) return res.status(400).json({ error: "Missing parameters" });

        const courses = await SQL`
            SELECT r.rid, c.code, c.title 
            FROM recap r
            JOIN course c ON r.cid = c.cid
            WHERE r.year = ${year} AND r.semester = ${semester} AND r.class = ${classBatch}
            ORDER BY c.title;
        `;
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Failed to load courses" });
    }
});


router.get("/recap-analysis/:rid", async (req, res) => {
    try {
        const { rid } = req.params;

        const recapMeta = await SQL`
            SELECT r.rid, r.semester, r.year, r.class, c.code, c.title
            FROM recap r
            JOIN course c ON r.cid = c.cid
            WHERE r.rid = ${rid};
        `;

        if (recapMeta.length === 0) {
            return res.status(404).json({ error: "Recap sheet record not found" });
        }

        const gradeCounts = await SQL`
            SELECT g.grade, COUNT(s.regno) as student_count
            FROM (
                SELECT regno, SUM(marks) as total_score
                FROM marks
                WHERE rid = ${rid}
                GROUP BY regno
            ) s
            JOIN grade g ON s.total_score >= g.start AND s.total_score <= g."end"
            GROUP BY g.grade
            ORDER BY g.grade;
        `;

        const totalStudents = gradeCounts.reduce((sum, row) => sum + parseInt(row.student_count || 0), 0);

        const distributionBreakdown = gradeCounts.map(row => {
            const count = parseInt(row.student_count || 0);
            const percentage = totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(2) : 0;
            return {
                grade: row.grade,
                count: count,
                percentage: `${percentage}%`
            };
        });

        res.status(200).json({
            meta: recapMeta[0],
            totalStudents: totalStudents,
            distribution: distributionBreakdown
        });

    } catch (error) {
        console.error("Grade Analysis Query Failure:", error);
        res.status(500).json({ error: "Internal processing validation error" });
    }
});

export default router;