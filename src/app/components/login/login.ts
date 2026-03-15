import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Respuesta inválida del servidor';
        }
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
