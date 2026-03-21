import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { TaskInteractor } from "../../use-cases/TaskInteractor";
import { FirestoreTaskRepository } from "../../infrastructure/database/FirestoreTaskRepository";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

const taskRepository = new FirestoreTaskRepository();
const taskInteractor = new TaskInteractor(taskRepository);
const taskController = new TaskController(taskInteractor);

router.use("/tasks", authenticateToken);
router.get("/tasks", (req, res) => taskController.getTasks(req, res));
router.post("/tasks", (req, res) => taskController.createTask(req, res));
router.put("/tasks/:id", (req, res) => taskController.updateTask(req, res));
router.delete("/tasks/:id", (req, res) => taskController.deleteTask(req, res));

export default router;
