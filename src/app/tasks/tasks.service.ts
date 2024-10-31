import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskFilter, TaskResponse, TaskStatus } from '../models/task';
import { tap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks$ = signal<Task[]>([])

  constructor(
    private http: HttpClient,
  ) {
  }

  addTask(task: Task) {
    return this.http.post<Task>('/tasks', task)
      .pipe(tap((newTask) => {
        this.tasks$.update((tasks) => [...tasks, newTask]);
      }))
  }

  deleteTask(id: number) {
    return this.http.delete<void>(`/tasks/${id}`)
      .pipe(tap(() => {
        this.tasks$.update((tasks) => tasks.filter(t => t.id !== id))
      }))
  }

  getTasks(filter: TaskFilter) {
    const params = {...filter}

    if (filter.status === TaskStatus.All) {
      delete params.status
    }

    return this.http.get<TaskResponse>('/tasks', {params})
      .pipe(tap((tasks) => {
        this.tasks$.set(tasks.data)
      }))
  }

  updateTask(task: Task, id: number) {
    return this.http.put<Task>(`/tasks/${id}`, task)
      .pipe(tap(() => {
        this.tasks$.update((tasks) => {
          const index = tasks.findIndex(t => t.id === id)
          Object.assign(tasks[index], task)
          return tasks
        })
      }))
  }
}
