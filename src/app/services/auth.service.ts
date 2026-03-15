import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Asegúrate de que este puerto coincida con tu backend de Spring Boot
  private API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, credentials).pipe(
      tap((res: any) => {
        // Guardamos el token que genera tu JwtUtil.java
        localStorage.setItem('token', res.token);
      })
    );
  }

  register(userData: {name: string, email: string, password: string}): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  logout() {
    localStorage.removeItem('token');
  }
}