import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";

import authRouter from "./routes/authRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import tagRouter from "./routes/tagRouter.js";
import artItemRouter from "./routes/artItemRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/reviews", reviewRouter);
app.use("/tags", tagRouter);
app.use("/art-items", artItemRouter);
app.use("/category", categoryRouter);

app.use(errorMiddleware);

mongoose.set("strictQuery", true);
// (node:15644) [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if
// you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
// (Use `node --trace-deprecation ...` to show where the warning was created)

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);

    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
