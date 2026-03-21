import { ITaskRepository } from "../core/repositories/ITaskRepository";
import { Task } from "../core/entities/Task";

/**
 * Interactor for managing Task entities.
 * Handles business logic for task operations.
 */
export class TaskInteractor {
  /**
   * Creates a new TaskInteractor instance.
   *
   * @param {ITaskRepository} taskRepository - The repository
   * for task operations.
   */
  constructor(private taskRepository: ITaskRepository) {}

  /**
   * Retrieves all tasks for a specific user.
   *
   * @param {string} userId - The ID of the user.
   * @return {Promise<Task[]>} An array of tasks for the user.
   */
  async getTasksForUser(userId: string) {
    return this.taskRepository.findByUserId(userId);
  }

  /**
   * Creates a new task for a specific user.
   *
   * @param {string} userId - The ID of the user.
   * @param {Omit<Task, "userId" | "id" | "creationDate">} data - The task data.
   * @return {Promise<Task>} The created task.
   */
  async createTaskForUser(
    userId: string,
    data: Omit<Task, "userId" | "id" | "creationDate">,
  ) {
    const task: Task = {
      ...data,
      userId,
      creationDate: new Date().toISOString(),
    };
    return this.taskRepository.create(task);
  }

  /**
   * Updates an existing task for a specific user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} taskId - The ID of the task to update.
   * @param {Partial<Task>} data - The task data to update.
   * @return {Promise<Task>} The updated task.
   */
  async updateTaskForUser(userId: string, taskId: string, data: Partial<Task>) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      const err = new Error("Task not found");
      (err as any).statusCode = 404;
      throw err;
    }
    if (task.userId !== userId) {
      const err = new Error("Unauthorized to edit this task");
      (err as any).statusCode = 403;
      throw err;
    }

    delete data.userId; // Prevent hijacking
    await this.taskRepository.update(taskId, data);
    return { id: taskId, ...task, ...data };
  }

  /**
   * Deletes a task for a specific user.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} taskId - The ID of the task to delete.
   * @return {Promise<void>} Resolves when the task is deleted.
   */
  async deleteTaskForUser(userId: string, taskId: string) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      const err = new Error("Task not found");
      (err as any).statusCode = 404;
      throw err;
    }
    if (task.userId !== userId) {
      const err = new Error("Unauthorized to delete this task");
      (err as any).statusCode = 403;
      throw err;
    }

    await this.taskRepository.delete(taskId);
  }
}
