// import dotenv from "dotenv";

// dotenv.config();

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import authRoutes from "./routes/auth.routes.js";

// import connectDB from "./config/db.js";

// const app = express();

// connectDB();

// app.use(cors());

// app.use(express.json());

// app.use(cookieParser());
// app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Reliefio Health  API Running ",
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(` Server running on http://localhost:${PORT}`);
// });


import dotenv from "dotenv";
// dotenv.config();

dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./config/db.js";

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Reliefio Health API Running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

