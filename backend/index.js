const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const cron = require("node-cron");
const { Op } = require("sequelize");

// Routers
const superAdmin = require("./routers/superAdmin/routes");
const studentRouter = require("./routers/students/routes");
const HARouter = require("./routers/hostelAuthority/routes");
const othersRouter = require("./routers/others/routes");
const guestRouter = require("./routers/guest/guest");

require("dotenv").config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.disable("x-powered-by");

app.use(
  cors({
    origin: "http://localhost:5173",   // 🔥 hardcode this
    credentials: true,
  })
);

// Routes

app.use("/SA", superAdmin);
app.use("/student", studentRouter);
app.use("/HA", HARouter);
app.use("/", othersRouter);
app.use("/guest", guestRouter);

// Start server and handle DB connection
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

db.sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connection has been established successfully.");

    // Automatic sync is disabled - use migrations instead
    // await db.sequelize.sync({ alter: true });
    // console.log("Database ready - use migrations for schema changes");

    // Run Cron Job daily at midnight
    const { studentTemp } = db;
    cron.schedule("0 0 * * *", async () => {
      try {
        const now = new Date();
        const deleted = await studentTemp.destroy({
          where: {
            expiresAt: {
              [Op.lt]: now,
            },
          },
        });
        console.log(`Cron Job: Deleted ${deleted} expired studentTemp entries.`);
      } catch (err) {
        console.error("Cron Job Error:", err);
      }
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
