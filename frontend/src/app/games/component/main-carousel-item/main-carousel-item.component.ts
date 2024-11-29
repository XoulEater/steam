import { WishlistService } from './../../services/wishlist.service';
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

  constructor(public wishlistService: WishlistService) {}

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
    this.mainImage = this.game.images[0];

    this.inWishlist = this.wishlistService.isInWishlist(this.game._id);
    console.log(this.wishlistService.isInWishlist(this.game._id));
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
