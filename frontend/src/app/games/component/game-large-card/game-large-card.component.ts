import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingBarComponent } from '../rating-bar/rating-bar.component';

@Component({
  selector: 'app-game-large-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingBarComponent],
  templateUrl: './game-large-card.component.html',
  styles: ``,
})
export class GameLargeCardComponent {
  @Input()
  public game!: Game;
  public mainImage!: string;

  // TODO: Implement the wishlist feature
  // TODO: Implement the discount feature
  public inWishlist = false;
  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
  }

  get discountValue(): number {
    if (!this.game.discount || !this.game.discount.value) {
      return 0;
    }
    if (this.game.discount.type === 'fixed') {
      return this.game.discount.value;
    }
    return this.game.price * (this.game.discount.value / 100);
  }

  ngOnInit(): void {
    this.mainImage = this.game.images[0];
  }
}
