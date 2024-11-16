import { Component, Input } from '@angular/core';
import { Game } from '../../../games/interfaces/games.interfaces';
import { RatingBarComponent } from '../../../games/component/rating-bar/rating-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-game-card',
  standalone: true,
  imports: [RatingBarComponent, CommonModule],
  templateUrl: './admin-game-card.component.html',
  styles: ``,
})
export class AdminGameCardComponent {
  @Input()
  public game!: Game;

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
