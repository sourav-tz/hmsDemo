const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");

require("dotenv").config();

const superAdmin = require("./routers/superAdmin/routes");
const studentRouter = require("./routers/students/routes");
const HARouter = require("./routers/hostelAuthority/routes");
const othersRouter = require("./routers/others/routes");
const guestRouter = require("./routers/guest/guest");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.disable("x-powered-by");

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.send("NIT Hostel Backend is Live 🚀");
});

app.use("/SA", superAdmin);
app.use("/student", studentRouter);
app.use("/HA", HARouter);
app.use("/", othersRouter);
app.use("/guest", guestRouter);

module.exports = app;
