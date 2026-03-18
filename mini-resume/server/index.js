import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// ── Routes ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start Server ───────────────────────────────────────
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Auth routes: /api/auth/login, /api/auth/register, /api/auth/logout, /api/auth/me`);
  });
}

start();
