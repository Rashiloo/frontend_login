import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="recovery-container">
      <div class="recovery-card">
        <div class="recovery-header">
          <h2>{{ getTitle() }}</h2>
          <p>{{ getSubtitle() }}</p>
        </div>

        @if (currentStep === 'email') {
          <form [formGroup]="emailForm" (ngSubmit)="onSubmitEmail()">
            <div class="form-group">
              <label for="email">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="tu@email.com"
                class="form-control"
                required
              />
            </div>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }

            <button type="submit" class="recovery-button" [disabled]="emailForm.invalid || isLoading">
              {{ isLoading ? 'Enviando...' : 'Enviar Código de Verificación' }}
            </button>
          </form>
        }

        @if (currentStep === 'verification') {
          <form [formGroup]="verificationForm" (ngSubmit)="onSubmitVerification()">
            <div class="verification-info">
              <p>Código enviado a:</p>
              <strong>{{ emailForm.value.email }}</strong>
            </div>

            <div class="form-group">
              <label for="verificationCode">Código de Verificación (6 dígitos)</label>
              <input 
                type="text" 
                id="verificationCode" 
                formControlName="verificationCode" 
                placeholder="000000"
                class="form-control code-input"
                maxlength="6"
                required
              />
            </div>

            @if (errorMessage) {
              <div class="error-message">{{ errorMessage }}</div>
            }

            @if (remainingAttempts !== null && remainingAttempts > 0) {
              <div class="attempts-warning">Intentos restantes: {{ remainingAttempts }}</div>
            }

            <button type="submit" class="recovery-button" [disabled]="verificationForm.invalid || isLoading">
              {{ isLoading ? 'Verificando...' : 'Verificar Identidad' }}
            </button>

            <div class="resend-section">
              <button type="button" class="link-button" (click)="resendCode()" [disabled]="isLoading">
                Reenviar código
              </button>
            </div>
          </form>
        }

        @if (currentStep === 'success') {
          <div class="success-message">
            <div class="success-icon">✅</div>
            <h3>¡Identidad Verificada!</h3>
            <p>Redirigiendo para cambiar tu contraseña...</p>
          </div>
        }

        <div class="back-link">
          <a routerLink="/login">← Volver al login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recovery-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .recovery-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
    }

    .recovery-header {
      text-align: center;
      margin-bottom: 25px;
    }

    .recovery-header h2 {
      color: #333;
      margin: 0;
      font-size: 24px;
    }

    .recovery-header p {
      color: #666;
      margin: 10px 0 0 0;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #555;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 16px;
    }

    .form-control.code-input {
      font-size: 24px;
      text-align: center;
      letter-spacing: 8px;
      font-weight: bold;
    }

    .recovery-button {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      font-size: 16px;
      margin-top: 10px;
    }

    .recovery-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .recovery-button:hover:not(:disabled) {
      opacity: 0.9;
    }

    .error-message {
      color: #dc3545;
      background: #f8d7da;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
    }

    .attempts-warning {
      color: #856404;
      background: #fff3cd;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
      font-size: 14px;
    }

    .verification-info {
      background: #e7f3ff;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      text-align: center;
    }

    .verification-info p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 14px;
    }

    .verification-info strong {
      color: #333;
      font-size: 16px;
    }

    .success-message {
      text-align: center;
      padding: 20px 0;
    }

    .success-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .success-message h3 {
      color: #28a745;
      margin: 0 0 10px 0;
    }

    .success-message p {
      color: #666;
      margin: 5px 0;
    }

    .resend-section {
      text-align: center;
      margin-top: 20px;
    }

    .link-button {
      background: none;
      border: none;
      color: #667eea;
      text-decoration: underline;
      cursor: pointer;
      font-size: 14px;
    }

    .link-button:disabled {
      color: #999;
      cursor: not-allowed;
      text-decoration: none;
    }

    .back-link {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .back-link a {
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
    }

    .back-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  verificationForm: FormGroup;
  
  currentStep: 'email' | 'verification' | 'success' = 'email';
  isLoading = false;
  errorMessage = '';
  remainingAttempts: number | null = null;
  
  resetToken: string = '';
  operationToken: string = '';

  private fb = inject(FormBuilder);
  private passwordRecoveryService = inject(PasswordRecoveryService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  getTitle(): string {
    switch (this.currentStep) {
      case 'email': return 'Recuperar Contraseña';
      case 'verification': return 'Verificar Identidad';
      case 'success': return '¡Verificación Exitosa!';
      default: return 'Recuperar Contraseña';
    }
  }

  getSubtitle(): string {
    switch (this.currentStep) {
      case 'email': return 'Ingresa tu correo para recibir un código de verificación';
      case 'verification': return 'Ingresa el código de 6 dígitos enviado a tu email';
      case 'success': return 'Identidad confirmada. Redirigiendo...';
      default: return '';
    }
  }

  onSubmitEmail() {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const email = this.emailForm.value.email;
      console.log('🔥 Enviando email:', email);

      this.passwordRecoveryService.forgotPassword(email).subscribe({
        next: (response: any) => {
          console.log('✅ Respuesta del backend:', response);
          this.isLoading = false;
          this.resetToken = response.resetToken;
          this.remainingAttempts = response.remainingAttempts || 3;
          this.currentStep = 'verification';
          console.log('🔥 Cambiando a paso verification. currentStep:', this.currentStep);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.log('❌ Error del backend:', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al enviar el código. Intenta de nuevo.';
        }
      });
    }
  }

  onSubmitVerification() {
    if (this.verificationForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const email = this.emailForm.value.email;
      const code = this.verificationForm.value.verificationCode;
      
      console.log('🔥 Enviando verificación:', { email, code });

      this.passwordRecoveryService.verifyIdentity(email, code).subscribe({
        next: (response: any) => {
          this.isLoading = false;

          if (response.verified) {
            this.operationToken = response.operationToken;
            this.currentStep = 'success';
            
            setTimeout(() => {
              this.router.navigate(['/reset-password'], {
                queryParams: {
                  token: this.resetToken,
                  email: email,
                  operationToken: this.operationToken,
                  code: code
                }
              });
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Código inválido';
            this.remainingAttempts = response.remainingAttempts;
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al verificar el código. Intenta de nuevo.';
        }
      });
    }
  }

  resendCode() {
    if (this.emailForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const email = this.emailForm.value.email;

      this.passwordRecoveryService.forgotPassword(email).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.resetToken = response.resetToken;
          this.remainingAttempts = response.remainingAttempts || 3;
          alert('Se ha enviado un nuevo código de verificación a tu email.');
        },
        error: (error: any) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al reenviar el código.';
        }
      });
    }
  }
}
