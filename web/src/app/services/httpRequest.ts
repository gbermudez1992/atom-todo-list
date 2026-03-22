import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class HttpRequest {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private router = inject(Router);

  private get headers(): HttpHeaders {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 403) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
    return throwError(() => error);
  }

  get<T>(url: string, options: any = {}): Observable<T> {
    const defaultOptions = { headers: this.headers };
    return this.http
      .get<T>(url, { ...defaultOptions, ...options })
      .pipe(catchError((err) => this.handleError(err))) as Observable<T>;
  }

  post<T>(url: string, body: any | null, options: any = {}): Observable<T> {
    const defaultOptions = { headers: this.headers };
    return this.http
      .post<T>(url, body, { ...defaultOptions, ...options })
      .pipe(catchError((err) => this.handleError(err))) as Observable<T>;
  }

  put<T>(url: string, body: any | null, options: any = {}): Observable<T> {
    const defaultOptions = { headers: this.headers };
    return this.http
      .put<T>(url, body, { ...defaultOptions, ...options })
      .pipe(catchError((err) => this.handleError(err))) as Observable<T>;
  }

  delete<T>(url: string, options: any = {}): Observable<T> {
    const defaultOptions = { headers: this.headers };
    return this.http
      .delete<T>(url, { ...defaultOptions, ...options })
      .pipe(catchError((err) => this.handleError(err))) as Observable<T>;
  }
}
