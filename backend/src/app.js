import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse } from './utils/ApiResponse.js';

// ---------------------------------------------------------------------------------

const app = express();

// ---------------------------------------------------------------------------------

app.use(cors({
    origin: process.env.CORS_ORIGIN  || process.env.FRONTEND_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}));


app.use(express.json({
    limit: "20kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(cookieParser())

// ----------------------------------------------------------------------------------

import userRouter from "./routes/user.routes.js";

app.use("/api/v1/users", userRouter);

app.get('/', (req, res) => {
    res.status(200).json(new ApiResponse(200, null, 'Welcome to Sweet Shop API'));
});



// ----------------------------------------------------------------------------------

export { app };