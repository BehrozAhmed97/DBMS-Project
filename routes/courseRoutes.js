import express from "express";
const router = express.Router();
import { SQL }  from "../utils/db.js";

// Basic Route
router.get("/courses", async (req, res) => {
    // Fetch all rows from the courses table
    const courses = await SQL`SELECT * FROM courses ORDER BY cid;`;    
    res.status(200).json(courses);
});

export default router;