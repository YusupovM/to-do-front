import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard'

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./tasks/tasks.component').then(m => m.TaskListComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
  },
]
