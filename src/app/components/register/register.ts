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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.registerData.firstName.trim() || !this.registerData.lastName.trim()) {
      this.errorMessage = 'Debes ingresar nombre y apellido';
      return;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.registerData.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    const userToRegister = {
      firstName: this.registerData.firstName.trim(),
      lastName: this.registerData.lastName.trim(),
      email: this.registerData.email.trim(),
      password: this.registerData.password
    };

    this.authService.register(userToRegister).subscribe({
      next: (response) => {
        this.successMessage = 'Usuario creado exitosamente. Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Error al crear usuario. El email podría estar en uso.';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
