import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from './auth';

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
  private http = inject(HttpClient);
  private auth = inject(Auth);

  readonly tasks = signal<Todo[]>([]);

  private get headers() {
    const token = this.auth.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  loadTasks() {
    if (!this.auth.isLoggedIn()) return;

    this.http.get<Todo[]>(`${environment.apiUrl}/tasks`, { headers: this.headers }).subscribe({
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

    this.http
      .post<Todo>(`${environment.apiUrl}/tasks`, payload, { headers: this.headers })
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

    this.http
      .put<Todo>(`${environment.apiUrl}/tasks/${id}`, payload, { headers: this.headers })
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

    this.http.delete(`${environment.apiUrl}/tasks/${id}`, { headers: this.headers }).subscribe({
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

    this.http
      .put<Todo>(`${environment.apiUrl}/tasks/${id}`, payload, { headers: this.headers })
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
