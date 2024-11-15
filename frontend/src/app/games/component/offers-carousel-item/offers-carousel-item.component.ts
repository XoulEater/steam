import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers-carousel-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './offers-carousel-item.component.html',
  styles: ``,
})
export class OffersCarouselItemComponent {
  @Input()
  public game!: Game;

  @Input()
  public small = false;

  get discountValue(): number {
    if (!this.game.discount || !this.game.discount.value) {
      return 0;
    }
    if (this.game.discount.type === 'fixed') {
      return this.game.discount.value;
    }
    return this.game.price * (this.game.discount.value / 100);
  }
}
