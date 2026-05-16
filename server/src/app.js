import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import Auth from './routes/AuthRoutes.js';
import Blog from './routes/BlogRoutes.js';
import Like from './routes/LikeRoutes.js';
import User from './routes/UserRoutes.js';
import cookieParser from "cookie-parser";

config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', Auth);
app.use('/blog', Blog);
app.use('/like', Like);
app.use('/user', User)

export default app;