import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  readonly currentUser = signal<User | null>(null);

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser.set(JSON.parse(storedUser));
    }
  }

  login(email: string) {
    return this.http.get<User>(`${environment.apiUrl}/users?email=${email}`).pipe(
      tap({
        next: (user: User) => {
          this.currentUser.set(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', user.token);
        },
      }),
      catchError((err: any) => {
        return throwError(() => err);
      }),
    );
  }

  register(email: string, firstName: string, lastName: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/users`, {
        email,
        firstName,
        lastName,
      })
      .pipe(
        tap({
          next: (newUser: User) => {
            this.currentUser.set(newUser);
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            localStorage.setItem('token', newUser.token);
          },
        }),
        catchError((err: any) => {
          return throwError(() => err);
        }),
      );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
