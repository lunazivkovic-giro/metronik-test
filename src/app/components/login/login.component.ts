import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Both email and password are required';
      return;
    }

    if (this.authService.login(this.email, this.password)) {
      this.router.navigate(['/orders']);
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }
}