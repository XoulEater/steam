import { GamesService } from '../../services/games.service';
import { Component } from '@angular/core';
import { Game, Review } from '../../interfaces/games.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReviewSectionComponent } from '../../component/review-section/review-section.component';
import { RatingBarComponent } from '../../component/rating-bar/rating-bar.component';
import { GameLargeCardListComponent } from '../../component/game-large-card-list/game-large-card-list.component';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [
    CommonModule,
    ReviewSectionComponent,
    RatingBarComponent,
    GameLargeCardListComponent
  ],
  templateUrl: './wishlist-page.component.html',
  styles: ``,
})
export class WishlistPageComponent {
  public games: Game[] = [];
  public mainImage!: string;
  public similarGames: Game[] = [];
  public discount: boolean = true;
  public inWishlist = false;
  public game!: Game;

  public isChangingImage: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private gamesService: GamesService
  ) {}

  // Método para cambiar la imagen principal con una transición

  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
  }
  ngOnInit(): void {

    this.activeRoute.params.subscribe(({ id }) => {
      this.gamesService.getGameById(id).subscribe((game) => {
        if (!game) {
          this.route.navigate(['/wishlist']);
          return;
        }
        this.game = game;
        if (game.images && game.images.length > 0) {
          this.mainImage = game.images[0];
        } else {
          // TODO: Manejar el caso en que no haya imágenes
          this.mainImage = 'default-image-url.jpg'; // URL de una imagen por defecto
        }
      });
      this.gamesService.getWishlistGames().subscribe((games) => {
        this.games = games;
      });
      // FIXME: Implementar la lógica para saber si el juego está en la lista de deseos
      this.inWishlist = false;
    });
  }
}
