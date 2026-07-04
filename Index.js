import express from "express";
import courseRoutes from "./routes/courseRoutes.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = 4000;

// Recreate __dirname since it is not globally available in ES Modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware to serve static client-side files (like app.js) from the public folder
app.use(express.static(__dirname + "/public"));

// CRITICAL: Middleware to parse incoming JSON request payloads (needed for POST requests)
app.use(express.json());

// Map all REST API endpoints under the /api prefix
app.use("/api", courseRoutes);

// Route to serve your single-page application dashboard interface
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "index.html")),
);

app.listen(PORT, () =>
  console.log(`Express server running at http://localhost:${PORT}`),
);