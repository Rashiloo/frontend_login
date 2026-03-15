import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule], // Necesarios para [(ngModel)] y mensajes de error
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  // Estos campos deben coincidir con tu LoginRequest.java del backend
  loginData = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Token recibido:', response.token);
        this.router.navigate(['/home']); // Te manda al home si todo sale bien
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
        console.error('Error en el login', err);
      }
    });
  }
}