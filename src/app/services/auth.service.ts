import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })

export class AuthService {

  private API_URL = environment.apiUrl;



  constructor(private http: HttpClient) {}



  login(credentials: {email: string, password: string}): Observable<any> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.API_URL}/login`, credentials, { headers }).pipe(

      tap((res: any) => {

        if (res && res.token) {

          localStorage.setItem('token', res.token);

        }

      })

    );

  }



  register(userData: {firstName: string, lastName: string, email: string, password: string}): Observable<any> {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.API_URL}/register`, userData, { headers });

  }



  logout() {

    localStorage.removeItem('token');

  }



  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');

  }



  getToken(): string | null {

    return localStorage.getItem('token');

  }

}

