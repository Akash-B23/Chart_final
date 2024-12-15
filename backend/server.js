import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import semesterRoutes from "./routes/semesterRoutes.js";
import creditsDisplayRoutes from "./routes/creditsDisplayRoutes.js";

dotenv.config();
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/", semesterRoutes);
app.use("/api", creditsDisplayRoutes);

// PostgreSQL connection pool
// eslint-disable-next-line no-unused-vars
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "arjuncoc101",
  database: "curriculum",
  port: 5432,
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
