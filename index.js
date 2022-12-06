import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import authRouter from "./routes/authRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import tagRouter from "./routes/tagRouter.js";
import artItemRouter from "./routes/artItemRouter.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use("/auth", authRouter);
app.use("/reviews", reviewRouter);
app.use("/tags", tagRouter);
app.use("/art-items", artItemRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
