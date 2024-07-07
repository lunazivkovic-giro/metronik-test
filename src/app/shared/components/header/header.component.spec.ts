import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from './header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

class MockAuthService {
  isAuthenticated(): boolean {
    return false; 
  }
  logout(): void {}
}

class MockRouter {
  navigate(path: string[]) {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        MatToolbarModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method on login button click', () => {
    spyOn(component, 'login').and.callThrough();
    spyOn(authService, 'isAuthenticated').and.returnValue(false);

    fixture.detectChanges();
    const loginButton = fixture.debugElement.query(By.css('.auth-button'));
    loginButton.triggerEventHandler('click', null);

    expect(component.login).toHaveBeenCalled();
  });

  it('should call logout method on logout button click', () => {
    spyOn(component, 'logout').and.callThrough();
    spyOn(authService, 'isAuthenticated').and.returnValue(true);

    fixture.detectChanges();
    const logoutButton = fixture.debugElement.query(By.css('.auth-button'));
    logoutButton.triggerEventHandler('click', null);

    expect(component.logout).toHaveBeenCalled();
  });

  it('should navigate to login on logout', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.logout();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to login on login', () => {
    const routerSpy = spyOn(router, 'navigate');
    component.login();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should show settings button when authenticated', () => {
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    fixture.detectChanges();
    const settingsButton = fixture.debugElement.query(By.css('.settings-button'));
    expect(settingsButton).toBeTruthy();
  });
});