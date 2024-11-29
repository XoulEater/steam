import { Component } from '@angular/core';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { Order } from '../../../games/interfaces/games.interfaces';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../admin/services/orders.service';

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
    this.ordersService.getOrderByUser().subscribe((orders) => {
      this.orders = orders;
    });
  }
}
