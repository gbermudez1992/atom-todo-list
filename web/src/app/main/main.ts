import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
import { Task, Todo } from '../services/task';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})
export class Main implements OnInit {
  auth = inject(Auth);
  taskService = inject(Task);
  router = inject(Router);

  newTaskTitle = '';
  newTaskDescription = '';
  editingTaskId: string | null = null;
  editTaskTitle = '';
  editTaskDescription = '';

  ngOnInit() {
    this.taskService.loadTasks();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask(this.newTaskTitle.trim(), this.newTaskDescription.trim());
      this.newTaskTitle = '';
      this.newTaskDescription = '';
    }
  }

  toggleTask(id: string) {
    this.taskService.toggleTask(id);
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id);
  }

  startEdit(task: Todo) {
    this.editingTaskId = task.id;
    this.editTaskTitle = task.title;
    this.editTaskDescription = task.description || '';
  }

  saveEdit() {
    if (this.editingTaskId && this.editTaskTitle.trim()) {
      this.taskService.updateTask(this.editingTaskId, this.editTaskTitle.trim(), this.editTaskDescription.trim());
    }
    this.editingTaskId = null;
    this.editTaskTitle = '';
    this.editTaskDescription = '';
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editTaskTitle = '';
    this.editTaskDescription = '';
  }
}
