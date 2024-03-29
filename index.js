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
import adminRouter from "./routes/adminRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.set("trust proxy", 1);
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/reviews", reviewRouter);
app.use("/tags", tagRouter);
app.use("/art-items", artItemRouter);
app.use("/category", categoryRouter);
app.use("/admin", adminRouter);

app.use(errorMiddleware);

mongoose.set("strictQuery", true);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);

    app.listen(PORT, () => console.log(`Server started on ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
