const cron = require("node-cron");
const { Op } = require("sequelize");

require("dotenv").config();

const app = require("./app");
const db = require("./models");

if (process.env.BOT_ENABLED !== "false") {
  require("./bot");
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");

    if (process.env.CRON_ENABLED === "false") {
      return;
    }

    cron.schedule("0 0 * * *", async () => {
      try {
        if (!db.studentTemp) {
          console.log("Cron: studentTemp model missing - skipping cleanup");
          return;
        }

        const deleted = await db.studentTemp.destroy({
          where: {
            expiresAt: {
              [Op.lt]: new Date(),
            },
          },
        });

        console.log(`Cron Job: Deleted ${deleted} expired studentTemp entries.`);
      } catch (error) {
        console.error("Cron Job Error:", error.message);
      }
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
