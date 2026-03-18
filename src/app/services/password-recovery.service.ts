import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';



@Injectable({

  providedIn: 'root'

})

export class PasswordRecoveryService {

  private readonly API_URL = environment.apiUrl;



  constructor(private http: HttpClient) {}



  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  /**
   * Verifica identidad con código (RF-15)
   */
  verifyIdentity(email: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.API_URL}/verify-identity`, { 
      email, 
      verificationCode,
      actionType: 'PASSWORD_RESET'
    });
  }

  /**
   * Resetea contraseña con verificación (RF-15)
   */
  resetPasswordWithVerification(
    email: string, 
    resetToken: string, 
    operationToken: string, 
    verificationCode: string,
    newPassword: string
  ): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password-with-verification`, {
      email,
      resetToken,
      operationToken,
      verificationCode,
      newPassword
    });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reset-password`, { token, newPassword });
  }



  changePassword(currentPassword: string, newPassword: string): Observable<any> {

    return this.http.post(`${this.API_URL}/change-password`, { currentPassword, newPassword });

  }

}

