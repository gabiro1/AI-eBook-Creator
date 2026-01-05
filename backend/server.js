// server.js or app.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";

dotenv.config();

const app = express();


/* ES MODULE FIX FOR __dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* MIDDLEWARE */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  "/backend/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/exports", exportRoutes);

/* SERVER START – WAIT FOR DB FIRST */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // <- wait for MongoDB connection
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
