import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="recovery-container">
      <div class="recovery-card">
        <div class="recovery-header">
          <h2>Recuperar Contraseña</h2>
          <p>Ingresa tu correo electrónico para recibir instrucciones</p>
        </div>
        
        <form [formGroup]="forgotForm" (ngSubmit)="onForgotPassword()">
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
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }
          
          <button type="submit" class="recovery-button" [disabled]="forgotForm.invalid">
            Enviar Instrucciones
          </button>
        </form>
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
      max-width: 400px;
    }
    
    .recovery-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .recovery-header h2 {
      color: #333;
      margin: 0;
    }
    
    .recovery-header p {
      color: #666;
      margin: 10px 0;
    }
    
    .form-group {
      margin-bottom: 15px;
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
    }
    
    .recovery-button {
      width: 100%;
      padding: 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .recovery-button:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .error-message {
      color: #dc3545;
      background: #f8d7da;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
    }
  `]
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private passwordRecoveryService: PasswordRecoveryService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onForgotPassword() {
    if (this.forgotForm.valid) {
      this.errorMessage = '';
      this.passwordRecoveryService.forgotPassword(this.forgotForm.value.email).subscribe({
        next: (response: any) => {
          alert('Se han enviado instrucciones a tu correo');
        },
        error: (error: any) => {
          this.errorMessage = 'Error al enviar instrucciones. Inténtalo de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, ingresa un correo válido';
    }
  }
}
