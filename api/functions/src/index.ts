import { onRequest } from "firebase-functions/https";
import express from "express";
import cors from "cors";
import userRoutes from "./web/routes/userRoutes";
import taskRoutes from "./web/routes/taskRoutes";

const app = express();

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
const envOrigins = process.env.ALLOWED_ORIGINS;
const allowedOrigins = envOrigins ? envOrigins.split(",") : [];

app.use(
  cors({
    origin: isEmulator ? true : allowedOrigins,
  }),
);

app.use(express.json());

app.use("/", userRoutes);
app.use("/", taskRoutes);

export const api = onRequest(app);
