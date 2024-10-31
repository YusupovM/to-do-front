import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginForm } from '../models/login-form'

export const AUTH_TOKEN = 'auth-token'

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN)
  }

  login(data: LoginForm): Observable<any> {
    return this.http.post<{ token: string }>('/auth/login', data)
      .pipe(
        tap((response) => {
          localStorage.setItem(AUTH_TOKEN, response.token)
        }),
      )
  }

  logout() {
    localStorage.removeItem(AUTH_TOKEN)
    this.router.navigate(['/login'])
  }

}
