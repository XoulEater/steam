import { Component } from '@angular/core';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { Order } from '../../../games/interfaces/games.interfaces';
import { OrdersService } from '../../services/orders.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [OrderCardComponent, RouterModule],
  templateUrl: './profile-page.component.html',
  styles: ``,
})
export class ProfilePageComponent {
  public orders: Order[] = [];

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
