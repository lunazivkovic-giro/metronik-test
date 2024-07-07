import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly apiUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const clientToken = this.authService.getClientToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'clientToken': clientToken ? clientToken : ''
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else if (error.status === 0) {
      console.error('Network error or CORS issue:', error);
      errorMessage = `A network error occurred. Please check your network connection or CORS settings.`;
    } else {
      errorMessage = `A server-side error occurred: ${error.status} ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getOrders(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  createOrder(order: Order): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, order, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getOrderById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  updateOrder(order: Order): Observable<any> {
    console.log(order)
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/${order.orderId}`, order, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }
}
