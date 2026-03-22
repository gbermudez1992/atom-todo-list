import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Auth } from './auth';
import { HttpRequest } from './httpRequest';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Task {
  private httpRequest = inject(HttpRequest);
  private auth = inject(Auth);

  readonly tasks = signal<Todo[]>([]);

  loadTasks() {
    if (!this.auth.isLoggedIn()) return;

    this.httpRequest.get<Todo[]>(`${environment.apiUrl}/tasks`).subscribe({
      next: (tasks) => this.tasks.set(tasks),
      error: (err) => console.error('Failed to load tasks', err),
    });
  }

  addTask(title: string, description: string = '') {
    const payload = {
      title,
      description,
      completed: false,
    };

    this.httpRequest
      .post<Todo>(`${environment.apiUrl}/tasks`, payload)
      .subscribe({
        next: (newTask) => this.tasks.update((t) => [...t, newTask]),
        error: (err) => console.error('Failed to add task', err),
      });
  }

  toggleTask(id: string) {
    const task = this.tasks().find((t) => t.id === id);
    if (!task) return;

    const payload = { completed: !task.completed };

    this.tasks.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, ...payload } : t)));

    this.httpRequest
      .put<Todo>(`${environment.apiUrl}/tasks/${id}`, payload)
      .subscribe({
        error: (err) => {
          console.error('Failed to toggle task', err);
          this.tasks.update((tasks) =>
            tasks.map((t) => (t.id === id ? { ...t, completed: task.completed } : t)),
          );
        },
      });
  }

  deleteTask(id: string) {
    const previousTasks = this.tasks();
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));

    this.httpRequest.delete(`${environment.apiUrl}/tasks/${id}`).subscribe({
      error: (err) => {
        console.error('Failed to delete task', err);
        this.tasks.set(previousTasks);
      },
    });
  }

  updateTask(id: string, newTitle: string, newDescription: string = '') {
    const task = this.tasks().find((t) => t.id === id);
    if (!task) return;

    const payload = { title: newTitle, description: newDescription };

    this.tasks.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, ...payload } : t)));

    this.httpRequest
      .put<Todo>(`${environment.apiUrl}/tasks/${id}`, payload)
      .subscribe({
        error: (err) => {
          console.error('Failed to update task', err);
          this.tasks.update((tasks) =>
            tasks.map((t) =>
              t.id === id ? { ...t, title: task.title, description: task.description } : t,
            ),
          );
        },
      });
  }
}
