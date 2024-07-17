import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderTableComponent } from './components/order-list/order-list.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'orders', component: OrderTableComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderFormComponent, canActivate: [AuthGuard] }, 
  { path: 'order/:id', component: OrderFormComponent, canActivate: [AuthGuard] }, 
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/orders', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }