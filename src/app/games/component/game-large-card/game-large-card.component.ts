import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingBarComponent } from '../rating-bar/rating-bar.component';
import { WishlistService } from '../../services/wishlist.service';

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

  constructor(public wishlistService: WishlistService) {}

  public inWishlist = false;
  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
    if (this.inWishlist) {
      this.wishlistService.addGameToWishlist(this.game._id).subscribe();
    } else {
      this.wishlistService.removeGameFromWishlist(this.game._id).subscribe();
    }
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

    this.inWishlist = this.wishlistService.isInWishlist(this.game._id);
    console.log(this.wishlistService.isInWishlist(this.game._id));
  }
}
