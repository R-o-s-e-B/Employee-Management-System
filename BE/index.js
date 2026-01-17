const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const config = require("./config");

const { verifyToken } = require("./middlewares/auth");

const mongoose = require("mongoose");

const authRouter = require("./routers/authRouter");
const deptRouter = require("./routers/deptRouter");
const employeeRouter = require("./routers/employeeRouter");
const orgRouter = require("./routers/orgRouter");

const app = express();

app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(config.mongo_uri)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server" });
});

app.use("/auth", authRouter);
app.use("/org", verifyToken, orgRouter);
app.use("/dept", verifyToken, deptRouter);
app.use("/employee", employeeRouter);

app.listen(config.port, () => {
  console.log("Listening...");
});
