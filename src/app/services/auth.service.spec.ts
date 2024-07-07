import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

describe('AuthService', () => {
  let service: AuthService;
  let platformId: Object;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: 'browser' } 
      ]
    });
    service = TestBed.inject(AuthService);
    platformId = TestBed.inject(PLATFORM_ID);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true for valid login credentials', () => {
    expect(service.login('admin@example.com', 'password123')).toBeTrue();
  });

  it('should return false for invalid login credentials', () => {
    expect(service.login('wrong@example.com', 'wrongpassword')).toBeFalse();
  });

  it('should store client token in localStorage on successful login', () => {
    spyOn(localStorage, 'setItem');
    service.login('admin@example.com', 'password123');
    expect(localStorage.setItem).toHaveBeenCalledWith('clientToken', btoa('admin@example.com:password123'));
  });

  it('should remove client token from localStorage on logout', () => {
    spyOn(localStorage, 'removeItem');
    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('clientToken');
  });

  it('should correctly report authentication status based on localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(btoa('admin@example.com:password123'));
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should generate a token correctly', () => {
    const token = service['generateToken']('admin@example.com', 'password123');
    expect(token).toBe(btoa('admin@example.com:password123'));
  });
});