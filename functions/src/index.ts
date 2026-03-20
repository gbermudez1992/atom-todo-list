import { onRequest } from "firebase-functions/https";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends express.Request {
  user?: {
    id: string;
    email: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

const authenticateToken = (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Access token is missing" });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    req.user = user as { id: string; email: string };
    next();
  });
};

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Task {
  title: string;
  description: string;
  creationDate: string;
  status: "completed" | "pending" | "deleted";
  userId: string;
}

// Users Routes
app.get("/users", async (req, res): Promise<express.Response> => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== "string") {
      return res
        .status(400)
        .json({ error: "Email is required as a query parameter" });
    }
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = snapshot.docs[0];
    const userData = user.data();
    const token = jwt.sign({ id: user.id, email: userData.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.status(200).json({ id: user.id, ...userData, token });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/users", async (req, res): Promise<express.Response> => {
  try {
    const { firstName, lastName, email } = req.body as User;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!firstName || typeof firstName !== "string") {
      return res.status(400).json({ error: "First name is required" });
    }
    if (!lastName || typeof lastName !== "string") {
      return res.status(400).json({ error: "Last name is required" });
    }

    // Check if user exists
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      const user = snapshot.docs[0];
      const userData = user.data();
      const token = jwt.sign({ id: user.id, email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        id: user.id,
        message: "User already exists",
        ...userData,
        token,
      });
    }

    const newUserRef = await usersRef.add({ firstName, lastName, email });
    const token = jwt.sign({ id: newUserRef.id, email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res
      .status(201)
      .json({ id: newUserRef.id, firstName, lastName, email, token });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// Protect all Tasks Routes
app.use("/tasks", authenticateToken);

// Tasks Routes
app.get(
  "/tasks",
  async (req: AuthenticatedRequest, res): Promise<express.Response> => {
    try {
      const userId = req.user?.id as string;
      const snapshot = await db
        .collection("tasks")
        .where("userId", "==", userId)
        .get();
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  },
);

app.post(
  "/tasks",
  async (req: AuthenticatedRequest, res): Promise<express.Response> => {
    try {
      const userId = req.user?.id as string;
      const data = req.body as Task;
      if (!data) {
        return res.status(400).json({ error: "Task data is required" });
      }
      const taskData = { ...data, userId };
      const newTaskRef = await db.collection("tasks").add(taskData);
      return res.status(201).json({ id: newTaskRef.id, ...taskData });
    } catch (error) {
      return res.status(500).json({ error: "Failed to add task" });
    }
  },
);

app.put(
  "/tasks/:id",
  async (
    req: AuthenticatedRequest,
    res: express.Response,
  ): Promise<express.Response> => {
    try {
      const userId = req.user?.id as string;
      const id = req.params.id as string;
      const data = req.body as Partial<Task>;

      const taskRef = db.collection("tasks").doc(id);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      if (taskDoc.data()?.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to edit this task" });
      }

      if (!data || Object.keys(data).length === 0) {
        return res
          .status(400)
          .json({ error: "Task data is required to update" });
      }

      delete data.userId; // Prevent userId from being modified manually

      await taskRef.set(data, { merge: true });
      return res.status(200).json({ id, ...taskDoc.data(), ...data });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update task" });
    }
  },
);

app.delete(
  "/tasks/:id",
  async (
    req: AuthenticatedRequest,
    res: express.Response,
  ): Promise<express.Response> => {
    try {
      const userId = req.user?.id as string;
      const id = req.params.id as string;

      const taskRef = db.collection("tasks").doc(id);
      const taskDoc = await taskRef.get();

      if (!taskDoc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      if (taskDoc.data()?.userId !== userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized to delete this task" });
      }

      await taskRef.delete();
      return res.status(200).json({ message: "Task deleted successfully", id });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete task" });
    }
  },
);

export const api = onRequest(app);
