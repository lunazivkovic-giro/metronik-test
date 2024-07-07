import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from './order.service';
import { AuthService } from './auth.service';
import { Order } from '../models/order.model';

class MockAuthService {
  getClientToken(): string {
    return 'mock-client-token';
  }
}

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch orders with GET request', () => {
    const mockOrders: Order[] = [
      { omsId: '1', expectedCompletionTime: '2024-07-07', orderId: '123', products: [], orderDetails: { factoryId: 'F001', factoryCountry: 'CountryA', productionLineId: 'P001', productCode: 'PC001', productDescription: 'Product 1' } },
      { omsId: '2', expectedCompletionTime: '2024-07-08', orderId: '124', products: [], orderDetails: { factoryId: 'F002', factoryCountry: 'CountryB', productionLineId: 'P002', productCode: 'PC002', productDescription: 'Product 2' } }
    ];

    service.getOrders().subscribe(orders => {
      expect(orders.length).toBe(2);
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/orders');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('clientToken')).toBe('mock-client-token');
    req.flush(mockOrders);
  });

  it('should create an order with POST request', () => {
    const newOrder: Order = { omsId: '3', expectedCompletionTime: '3164', orderId: '125', products: [], orderDetails: { factoryId: 'F003', factoryCountry: 'CountryC', productionLineId: 'P003', productCode: 'PC003', productDescription: 'Product 3' } };

    service.createOrder(newOrder).subscribe(response => {
      expect(response).toEqual(newOrder);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/orders');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('clientToken')).toBe('mock-client-token');
    req.flush(newOrder);
  });

  it('should fetch order by ID with GET request', () => {
    const mockOrder: Order = { omsId: '1', expectedCompletionTime: '7968', orderId: '123', products: [], orderDetails: { factoryId: 'F001', factoryCountry: 'CountryA', productionLineId: 'P001', productCode: 'PC001', productDescription: 'Product 1' } };

    service.getOrderById('1').subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/orders/1');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('clientToken')).toBe('mock-client-token');
    req.flush(mockOrder);
  });

  it('should update an order with PUT request', () => {
    const updatedOrder: Order = { omsId: '1', expectedCompletionTime: '4526', orderId: '123', products: [], orderDetails: { factoryId: 'F001', factoryCountry: 'CountryA', productionLineId: 'P001', productCode: 'PC001', productDescription: 'Updated Product Description' } };

    service.updateOrder(updatedOrder).subscribe(response => {
      expect(response).toEqual(updatedOrder);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/orders/123');
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('clientToken')).toBe('mock-client-token');
    req.flush(updatedOrder);
  });

  it('should handle network errors', () => {
    service.getOrders().subscribe({
      next: () => fail('Expected to fail'),
      error: error => {
        expect(error.message).toContain('A client-side error occurred');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/orders');
    req.error(new ErrorEvent('Network error'));
  });

  it('should handle server-side errors', () => {
    const mockError = new HttpErrorResponse({
      error: { message: 'Server error' },
      status: 500,
      statusText: 'Internal Server Error'
    });

    service.getOrders().subscribe({
      next: () => fail('Expected to fail'),
      error: error => {
        expect(error.message).toContain('A server-side error occurred: 500');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/orders');
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
  });
});