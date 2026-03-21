import { Task } from "../entities/Task";

export interface ITaskRepository {
  findByUserId(userId: string): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, task: Partial<Task>): Promise<void>;
  delete(id: string): Promise<void>;
}
