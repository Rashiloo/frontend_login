import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordRecoveryService } from '../../services/password-recovery.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="reset-container">
      <div class="reset-card">
        <div class="reset-header">
          <h2>Restablecer Contraseña</h2>
          <p>Ingresa tu nueva contraseña</p>
        </div>
        
        <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()">
          <div class="form-group">
            <label for="newPassword">Nueva Contraseña</label>
            <input 
              type="password" 
              id="newPassword" 
              formControlName="newPassword" 
              placeholder="Ingresa tu nueva contraseña"
              class="form-control"
              required
            />
            @if (resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched) {
              <small class="error-text">La contraseña es requerida</small>
            }
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input 
              type="password" 
              id="confirmPassword" 
              formControlName="confirmPassword" 
              placeholder="Confirma tu nueva contraseña"
              class="form-control"
              required
            />
            @if (resetForm.get('confirmPassword')?.invalid && resetForm.get('confirmPassword')?.touched) {
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
          
          <button type="submit" class="reset-button" [disabled]="resetForm.invalid">
            Restablecer Contraseña
          </button>
        </form>
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
      padding: 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .reset-button:disabled {
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
    
    .success-message {
      color: #155724;
      background: #d4edda;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
    }
  `]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';

  private fb = inject(FormBuilder);
  private passwordRecoveryService = inject(PasswordRecoveryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    // Obtener el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.token) {
      this.errorMessage = 'Token inválido o expirado';
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onResetPassword() {
    if (this.resetForm.valid && this.token) {
      this.errorMessage = '';
      this.successMessage = '';
      
      const newPassword = this.resetForm.value.newPassword;
      
      this.passwordRecoveryService.resetPassword(this.token, newPassword).subscribe({
        next: (response: any) => {
          this.successMessage = 'Contraseña restablecida exitosamente';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.errorMessage = 'Error al restablecer la contraseña. El token puede haber expirado.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
    }
  }
}
