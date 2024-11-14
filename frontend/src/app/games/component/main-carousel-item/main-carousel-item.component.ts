import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-carousel-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-carousel-item.component.html',
  styles: ``,
})
export class MainCarouselItemComponent {
  @Input()
  public game!: Game;
  public mainImage!: string;

  // TODO: Implement the wishlist feature
  // It should allow users to add and remove games from their wishlist and display the appropriate icon
  public inWishlist = false;
  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
  }

  ngOnInit(): void {
    this.mainImage = this.game.images[0];
  }

  public isChangingImage: boolean = false;
  changeImage(newImageUrl: string) {
    if (this.mainImage === newImageUrl) return;
    this.isChangingImage = true;
    setTimeout(() => {
      this.mainImage = newImageUrl;
    }, 100); // Tiempo para la transición de salida
  }

  onImageLoad() {
    this.isChangingImage = false;
  }
}
