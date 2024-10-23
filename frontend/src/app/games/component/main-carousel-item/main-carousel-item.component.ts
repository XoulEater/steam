import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-carousel-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-carousel-item.component.html',
  styles: ``,
})
export class MainCarouselItemComponent {
  @Input()
  public game!: Game;

  // TODO: Implement the wishlist feature
  // It should allow users to add and remove games from their wishlist and display the appropriate icon
  public inWishlist = false;
  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
  }
  public getWishlistIcon(): string {
    return this.inWishlist ? 'heart' : 'heart-outline';
  }
}
