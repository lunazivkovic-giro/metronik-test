import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private hardcodedEmail: string = 'admin@example.com';
  private hardcodedPassword: string = 'password123';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  login(email: string, password: string): boolean {
    if (email === this.hardcodedEmail && password === this.hardcodedPassword) {
      this.isLoggedIn = true;
      if (isPlatformBrowser(this.platformId)) {
        const clientToken = this.generateToken(email, password);
        localStorage.setItem('clientToken', clientToken);
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('clientToken');
    }
  }
  getClientToken(): string | null {
    return localStorage.getItem('clientToken');
  }
  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const clientToken = this.getClientToken();
      this.isLoggedIn = !!clientToken;
    }
    return this.isLoggedIn;
  }

  private generateToken(username: string, password: string): string {
    return btoa(`${username}:${password}`);
  }
}