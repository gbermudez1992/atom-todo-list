export interface Task {
  id?: string;
  title: string;
  description?: string;
  creationDate: string;
  completed: boolean;
  userId: string;
}
