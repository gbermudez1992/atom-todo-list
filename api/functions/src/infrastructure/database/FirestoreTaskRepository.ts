import { ITaskRepository } from "../../core/repositories/ITaskRepository";
import { Task } from "../../core/entities/Task";
import { db } from "../config/firebase";

/**
 * Repository implementation for managing Task entities in Firestore.
 * Implements the ITaskRepository interface.
 */
export class FirestoreTaskRepository implements ITaskRepository {
  private collection = db.collection("tasks");

  /**
   * Retrieves all tasks associated with a specific user.
   *
   * @param {string} userId - The ID of the user whose tasks to retrieve.
   * @return {Promise<Task[]>} A promise that resolves to an array of tasks.
   */
  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await this.collection.where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Task);
  }

  /**
   * Retrieves a task by its unique identifier.
   *
   * @param {string} id - The unique identifier of the task.
   * @return {Promise<Task | null>} The task if found, or null.
   */
  async findById(id: string): Promise<Task | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Task;
  }

  /**
   * Creates a new task in the database.
   *
   * @param {Task} task - The task object to create.
   * @return {Promise<Task>} The created task with its ID.
   */
  async create(task: Task): Promise<Task> {
    const { id: _, ...data } = task;
    const docRef = await this.collection.add(data);
    return { id: docRef.id, ...data } as Task;
  }

  /**
   * Updates an existing task with the provided partial data.
   *
   * @param {string} id - The ID of the task to update.
   * @param {Partial<Task>} task - The partial task data to update.
   * @return {Promise<void>} Resolves when update is complete.
   */
  async update(id: string, task: Partial<Task>): Promise<void> {
    const { id: _, ...data } = task;
    await this.collection.doc(id).set(data, { merge: true });
  }

  /**
   * Deletes a task by its unique identifier.
   *
   * @param {string} id - The ID of the task to delete.
   * @return {Promise<void>} Resolves when deletion is complete.
   */
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
