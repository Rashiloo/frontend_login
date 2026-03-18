import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="reset-container">
      <div class="reset-card">
        <div class="reset-header">
          <h2>Restablecer Contraseña</h2>
          <p>Ingresa tu nueva contraseña</p>
        </div>
        
        @if (!hasRequiredParams) {
          <div class="error-message">
            Token inválido o expirado. Por favor, solicita un nuevo código de recuperación.
          </div>
          <div class="back-link">
            <a routerLink="/forgot-password">Solicitar nuevo código</a>
          </div>
        } @else {
          <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()">
            <div class="verification-badge">
              <span>✅ Identidad verificada</span>
              <small>{{ email }}</small>
            </div>

            <div class="form-group">
              <label for="newPassword">Nueva Contraseña</label>
              <input 
                type="password" 
                id="newPassword" 
                formControlName="newPassword" 
                placeholder="Mínimo 6 caracteres"
                class="form-control"
                required
              />
              @if (resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched) {
                <small class="error-text">La contraseña debe tener al menos 6 caracteres</small>
              }
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirmar Contraseña</label>
              <input 
                type="password" 
                id="confirmPassword" 
                formControlName="confirmPassword" 
                placeholder="Repite tu contraseña"
                class="form-control"
                required
              />
              @if (resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched) {
                <small class="error-text">Las contraseñas no coinciden</small>
              }
            </div>
            
            @if (errorMessage) {
              <div class="error-message">
                {{ errorMessage }}
              </div>
            }
            
            @if (successMessage) {
              <div class="success-message">
                {{ successMessage }}
              </div>
            }
            
            <button type="submit" class="reset-button" [disabled]="resetForm.invalid || isLoading">
              {{ isLoading ? 'Procesando...' : 'Restablecer Contraseña' }}
            </button>
          </form>
        }
        
        <div class="back-link">
          <a routerLink="/login">← Volver al login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .reset-card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    
    .reset-header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .reset-header h2 {
      color: #333;
      margin: 0;
    }
    
    .reset-header p {
      color: #666;
      margin: 10px 0;
    }

    .verification-badge {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 20px;
    }

    .verification-badge span {
      display: block;
      font-weight: bold;
      font-size: 16px;
    }

    .verification-badge small {
      display: block;
      opacity: 0.9;
      margin-top: 5px;
      font-size: 14px;
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
    
    .error-text {
      color: #dc3545;
      font-size: 12px;
      display: block;
      margin-top: 5px;
    }
    
    .reset-button {
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
    
    .reset-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .reset-button:hover:not(:disabled) {
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
    
    .success-message {
      color: #155724;
      background: #d4edda;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
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
export class ResetPasswordComponent {
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  
  token: string = '';
  email: string = '';
  operationToken: string = '';
  verificationCode: string = '';
  hasRequiredParams: boolean = false;

  private fb = inject(FormBuilder);
  private passwordRecoveryService = inject(PasswordRecoveryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token') || '';
      this.email = params.get('email') || '';
      this.operationToken = params.get('operationToken') || '';
      this.verificationCode = params.get('code') || '';
      
      this.hasRequiredParams = !!(this.token && this.email && this.operationToken && this.verificationCode);
      
      if (!this.hasRequiredParams) {
        this.errorMessage = 'Faltan parámetros de verificación. Por favor, reinicia el proceso de recuperación.';
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onResetPassword() {
    if (this.resetForm.valid && this.hasRequiredParams) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const newPassword = this.resetForm.value.newPassword;
      
      console.log('🔥 Enviando reset-password:', {
        email: this.email,
        token: this.token,
        operationToken: this.operationToken,
        verificationCode: this.verificationCode,
        newPassword: newPassword
      });
      
      this.passwordRecoveryService.resetPasswordWithVerification(
        this.email,
        this.token,
        this.operationToken,
        this.verificationCode,
        newPassword
      ).subscribe({
        next: (response: any) => {
          console.log('✅ Respuesta reset-password:', response);
          this.isLoading = false;
          this.successMessage = 'Contraseña restablecida exitosamente. Redirigiendo al login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          console.log('❌ Error reset-password:', error);
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al restablecer la contraseña. El token puede haber expirado.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
    }
  }
}
