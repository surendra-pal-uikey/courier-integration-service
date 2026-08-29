import createError from "http-errors";
import "dotenv/config";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { sequelize } from "./src/config/database/mysql.js";
import { connectMongoDB } from "./src/config/database/mongodb.js";

import shipmentRoutes from "./src/routes/shipment.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Recreate __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/orders", shipmentRoutes);

app.use(function (req, res, next) {
  next(createError(404));
});

// middleware to generate a unique request ID for each incoming request
app.use((req, res, next) => {
  req.requestId = req.headers["x-request-id"] || uuidv4();
  next();
});

app.use(errorHandler);

async function startServer() {
  try {
    await sequelize.authenticate();
    await connectMongoDB();
    console.log("MySQL Database connected via Sequelize.");
    console.log("MongoDb Database connected via mongoose.");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync();
      console.log("Models synchronized with MySQL schema.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to MySQL or MongoDB database:", error);
    process.exit(1);
  }
}

startServer();
