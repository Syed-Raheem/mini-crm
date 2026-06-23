const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://YOUR_FRONTEND_URL.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});