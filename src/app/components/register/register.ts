import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    // Validar que las contraseñas coincidan
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.successMessage = '';
      return;
    }

    // Validar longitud mínima de contraseña
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      this.successMessage = '';
      return;
    }

    // Crear objeto para enviar al backend
    const userToRegister = {
      name: this.registerData.name,
      email: this.registerData.email,
      password: this.registerData.password
    };

    // Llamar al servicio de registro
    this.authService.register(userToRegister).subscribe({
      next: (response: any) => {
        this.successMessage = 'Usuario creado exitosamente. Redirigiendo al login...';
        this.errorMessage = '';
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        this.errorMessage = 'Error al crear usuario. El email podría estar en uso.';
        this.successMessage = '';
        console.error('Error en el registro', err);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
