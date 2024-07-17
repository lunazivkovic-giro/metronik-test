import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthService {
  login(email: string, password: string): boolean {
    return email === 'admin@example.com' && password === 'password123';
  }
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password fields', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
  });

  it('should be invalid when email or password is missing', () => {
    component.email = '';
    component.password = '';
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    fixture.detectChanges();
    expect(component.errorMessage).toBe('Both email and password are required');
  });

  it('should navigate to /orders on successful login', () => {
    spyOn(authService, 'login').and.returnValue(true);
    const routerSpy = spyOn(router, 'navigate');

    component.email = 'admin@example.com';
    component.password = 'password123';
    component.login();

    expect(authService.login).toHaveBeenCalledWith('admin@example.com', 'password123');
    expect(routerSpy).toHaveBeenCalledWith(['/orders']);
  });

  it('should display an error message on failed login', () => {
    spyOn(authService, 'login').and.returnValue(false);

    component.email = 'wrong@example.com';
    component.password = 'wrongpassword';
    component.login();

    expect(authService.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    expect(component.errorMessage).toBe('Invalid email or password');
  });

  it('should not submit the form if email or password is missing', () => {
    component.email = '';
    component.password = '';
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    fixture.detectChanges();
    expect(component.errorMessage).toBe('Both email and password are required');
  });

});