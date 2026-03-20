import { Injectable, signal } from '@angular/core';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Task {
  readonly tasks = signal<Todo[]>([]);

  addTask(title: string, description: string = '') {
    const newTask: Todo = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      description,
      completed: false
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  toggleTask(id: string) {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  deleteTask(id: string) {
    this.tasks.update(tasks => tasks.filter(t => t.id !== id));
  }

  updateTask(id: string, newTitle: string, newDescription: string = '') {
    this.tasks.update(tasks => 
      tasks.map(t => t.id === id ? { ...t, title: newTitle, description: newDescription } : t)
    );
  }
}
