import express, { Application, Request, Response } from "express";
import { config } from "dotenv";
config();


import { handleErrors } from "./src/middlewares/handleErrors";
import { createErrorMap } from "zod-validation-error";
import globalRouter from "./src/routes/index";
import {connectDB} from "./src/config/mongo";
import cookieParser from "cookie-parser";
import { handleUnknownRoutes } from "./src/middlewares/handleUnknownRoute";

const app: Application = express();

// Connect Database
connectDB();

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// Home Route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Welcome to admin dashboard" });
});


// Other Routes
app.use(globalRouter);




// Handle unknown routes
app.all("*splat", handleUnknownRoutes);


// Handle Errors

app.use(handleErrors);
app.use(createErrorMap());






// Server Listen
app.listen(process.env.PORT, () => {
  console.log(`Server Running successfully on port ${process.env.PORT}`);
});
