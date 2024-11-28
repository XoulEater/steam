import { GamesService } from './../../services/games.service';
import { CartService } from '../../services/cart.service';
import { Component } from '@angular/core';
import { Game, Review } from '../../interfaces/games.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { OffersCarouselItemComponent } from '../../component/offers-carousel-item/offers-carousel-item.component';
import { ReviewSectionComponent } from '../../component/review-section/review-section.component';
import { RatingBarComponent } from '../../component/rating-bar/rating-bar.component';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule,
    OffersCarouselItemComponent,
    ReviewSectionComponent,
    RatingBarComponent,
  ],
  templateUrl: './game-page.component.html',
  styles: ``,
})
export class GamePageComponent {
  public game!: Game;
  public mainImage!: string;
  public similarGames: Game[] = [];
  public discount: boolean = true;
  public inWishlist = false;

  public isChangingImage: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private gamesService: GamesService,
    private cartService: CartService
  ) {}

  get discountValue(): number {
    if (!this.game.discount || !this.game.discount.value) {
      return 0;
    }
    if (this.game.discount.type === 'fixed') {
      return this.game.discount.value;
    }
    return this.game.price * (this.game.discount.value / 100);
  }

  // Método para cambiar la imagen principal con una transición
  changeImage(newImageUrl: string) {
    if (newImageUrl === this.mainImage) return;
    this.isChangingImage = true;
    setTimeout(() => {
      this.mainImage = newImageUrl;
    }, 150); // Tiempo para la transición de salida
  }

  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
  }

  onImageLoad() {
    this.isChangingImage = false;
  }

  onReviewAdded(review: Review) {
    this.gamesService.addReview(this.game._id, review).subscribe((response) => {
      if (response) {
        console.log('Review added successfully');
        this.game.reviews.push(review);
      }
    });
  }

  addToCart(): void {
    this.cartService.addGameToCart(this.game);
  }
  ngOnInit(): void {
    this.activeRoute.params.subscribe(({ id }) => {
      this.gamesService.getGameById(id).subscribe((game) => {
        if (!game) {
          this.route.navigate(['/games']);
          return;
        }
        this.game = game;
        if (game.images && game.images.length > 0) {
          this.mainImage = game.images[1];
        } else {
          this.mainImage = 'default-image-url.jpg'; // URL de una imagen por defecto
        }
      });
      this.gamesService.getSimilarGames(id).subscribe((games) => {
        this.similarGames = games;
      });
      // FIXME: Implementar la lógica para saber si el juego está en la lista de deseos
      this.inWishlist = false;
    });
  }
}
