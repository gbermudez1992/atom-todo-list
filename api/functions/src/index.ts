import { onRequest } from "firebase-functions/https";
import express from "express";
import cors from "cors";
import userRoutes from "./web/routes/userRoutes";
import taskRoutes from "./web/routes/taskRoutes";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use("/", userRoutes);
app.use("/", taskRoutes);

export const api = onRequest(app);
