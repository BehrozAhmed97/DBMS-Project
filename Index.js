import express from "express";
import courseRoutes from "./routes/courseRoutes.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const PORT = 4000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + "/public"));

app.use(express.json());

app.use("/api", courseRoutes);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "index.html")),
);

app.listen(PORT, () =>
  console.log(`Express server running at http://localhost:${PORT}`),
);