import { Component, Input } from '@angular/core';
import { Game, Order } from '../../../games/interfaces/games.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-card.component.html',
  styles: ``,
})
export class OrderCardComponent {
  @Input()
  public order!: Order;

  get firstGames(): Game[] {
    return this.order.games.slice(0, 4);
  }
}
