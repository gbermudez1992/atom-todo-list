import express from "express";
import { TaskInteractor } from "../../use-cases/TaskInteractor";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

/**
 * Controller for handling Task-related HTTP requests.
 * Acts as an interface between the web layer and the business logic.
 */
export class TaskController {
  /**
   * Creates a new TaskController instance.
   *
   * @param {TaskInteractor} taskInteractor - The interactor
   * for task operations.
   */
  constructor(private taskInteractor: TaskInteractor) {}

  /**
   * Retrieves all tasks for the authenticated user.
   *
   * @param {AuthenticatedRequest} req - The request object.
   * @param {express.Response} res - The response object.
   * @return {Promise<express.Response>}
   */
  async getTasks(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = req.user?.id as string;
      const tasks = await this.taskInteractor.getTasksForUser(userId);
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Creates a new task for the authenticated user.
   *
   * @param {AuthenticatedRequest} req - The request object.
   * @param {express.Response} res - The response object.
   * @return {Promise<express.Response>}
   */
  async createTask(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = req.user?.id as string;
      const data = req.body;
      if (!data) {
        return res.status(400).json({ error: "Task data is required" });
      }

      const task = await this.taskInteractor.createTaskForUser(userId, data);
      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Updates an existing task for the authenticated user.
   *
   * @param {AuthenticatedRequest} req - The request object.
   * @param {express.Response} res - The response object.
   * @return {Promise<express.Response>}
   */
  async updateTask(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = req.user?.id as string;
      const id = req.params.id as string;
      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        return res
          .status(400)
          .json({ error: "Task data is required to update" });
      }

      const updatedTask = await this.taskInteractor.updateTaskForUser(
        userId,
        id,
        data,
      );
      return res.status(200).json(updatedTask);
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  /**
   * Deletes a task for the authenticated user.
   *
   * @param {AuthenticatedRequest} req - The request object.
   * @param {express.Response} res - The response object.
   * @return {Promise<express.Response>}
   */
  async deleteTask(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = req.user?.id as string;
      const id = req.params.id as string;

      await this.taskInteractor.deleteTaskForUser(userId, id);
      return res.status(200).json({ message: "Task deleted successfully", id });
    } catch (error: any) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }
}
