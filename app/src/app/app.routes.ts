import { Routes, Router } from '@angular/router';
import { Login } from './login/login';
import { Main } from './main/main';
import { inject } from '@angular/core';
import { Auth } from './services/auth';

export const routes: Routes = [
  { path: 'login', component: Login },
  { 
    path: '', 
    component: Main,
    canActivate: [() => {
      const auth = inject(Auth);
      const router = inject(Router);
      return auth.isLoggedIn() ? true : router.parseUrl('/login');
    }]
  },
  { path: '**', redirectTo: '' }
];
