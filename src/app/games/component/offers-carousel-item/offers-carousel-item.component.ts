import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../services/wishlist.service';

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

  constructor(public wishlistService: WishlistService) {}

  get discountValue(): number {
    if (!this.game.discount || !this.game.discount.value) {
      return 0;
    }
    if (this.game.discount.type === 'fixed') {
      return this.game.discount.value;
    }
    return this.game.price * (this.game.discount.value / 100);
  }

  public inWishlist: boolean = false;
  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
    if (this.inWishlist) {
      this.wishlistService.addGameToWishlist(this.game._id).subscribe();
    } else {
      this.wishlistService.removeGameFromWishlist(this.game._id).subscribe();
    }
  }

  ngOnInit(): void {
    this.inWishlist = this.wishlistService.isInWishlist(this.game._id);
    console.log(this.wishlistService.isInWishlist(this.game._id));
  }
}
