import express from "express";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";
import {errorMiddleware} from "./middlewares/errorMiddlewares.js"
import authRouter from "./routes/authRouter.js"
import bookRouter from "./routes/bookRouter.js"
import borrowRouter from "./routes/borrowRouter.js"
import userRouter from "./routes/userRouter.js"
import expressFileUpload from "express-fileupload"
import nodemon from "nodemon";
import { notifyUsers } from "./Services/notifyUsers.js";
import { removeUnverified } from "./Services/removeUnverifiedAcc.js";


export const app = express();

// Load environment variables
config({path: "./config/config.env"});

// Verify environment variables are loaded
if (!process.env.PORT) {
    console.error("PORT is not defined in environment variables");
    process.exit(1);
}

app.use(cors({
    origin:  ["http://localhost:5173", "http://localhost:5175"], // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

//http://localhost:4000/api/v1/auth/register

notifyUsers();
removeUnverified();
connectDB();

app.use(errorMiddleware);