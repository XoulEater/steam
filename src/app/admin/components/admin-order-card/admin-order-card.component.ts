import { OrdersService } from './../../services/orders.service';
import { Component, Input } from '@angular/core';
import { Game, Order } from '../../../games/interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-order-card.component.html',
  styles: ``,
})
export class AdminOrderCardComponent {
  @Input()
  public order!: Order;

  get firstGames(): Game[] {
    return this.order.games.slice(0, 4).map((game) => game.game);
  }

  constructor(private ordersService: OrdersService) {}

  updateOrderStatus(order: Order) {
    this.ordersService.updateOrderStatus(order.status, order._id).subscribe();
  }
}
