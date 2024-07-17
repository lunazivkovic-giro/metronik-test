import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderTableComponent implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['omsId', 'expectedCompletionTime', 'orderId', 'actions'];

  constructor(private orderService: OrderService,  private router: Router) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  editOrder(order: Order): void {
    this.router.navigate(['/order', order.orderId]);
  }
  addNewProduct(): void {
    this.router.navigate(['/order']);
    
  }
}
