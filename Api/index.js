import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router from "./routes/appRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(`${err.message}`));

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.all("*", (req, res, next) => {
  res.status(404).json({ message: "Inavalid Request" });
});

app.listen(process.env.APP_PORT, () => {
  console.log(`App running on ${process.env.APP_PORT}`);
});
