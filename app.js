const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const errorHander = require("./middlewares/error");

// Load env variables
dotenv.config({ path: "./config/config.env" });

//Route files
const auth = require("./routes/auth");
const image = require("./routes/image");

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/image", image);

// Middlewares are linear. It must appear after all the routes that need it have been mounted
app.use(errorHander);

module.exports = app;
