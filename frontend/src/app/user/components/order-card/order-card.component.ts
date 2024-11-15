import { Component, Input } from '@angular/core';
import { Order } from '../../../games/interfaces/games.interfaces';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [],
  templateUrl: './order-card.component.html',
  styles: ``,
})
export class OrderCardComponent {
  @Input()
  public order!: Order;
}
