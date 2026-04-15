import { Routes, Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { Login } from './login/login';
import { Main } from './main/main';
import { inject } from '@angular/core';
import { Auth } from './services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.parseUrl('/login');
};

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Main,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' }
];
