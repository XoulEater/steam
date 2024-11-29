import { Order } from '../../../games/interfaces/games.interfaces';
import { OrdersService } from './../../services/orders.service';
import { Component } from '@angular/core';
import { AdminOrderCardComponent } from '../admin-order-card/admin-order-card.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AdminOrderCardComponent],
  templateUrl: './orders.component.html',
  styles: ``,
})
export class OrdersComponent {
  public orders: Order[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
