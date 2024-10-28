import { GamesService } from './../../services/games.service';
import { Component } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './game-page.component.html',
  styles: ``,
})
export class GamePageComponent {
  public game!: Game;
  public mainImage!: string;

  public inWishlist = false;
  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
  }

  public isChangingImage: boolean = false;

  changeImage(newImageUrl: string) {
    if (newImageUrl === this.mainImage) return;
    this.isChangingImage = true;
    setTimeout(() => {
      this.mainImage = newImageUrl;
    }, 150); // Tiempo para la transición de salida
  }

  onImageLoad() {
    this.isChangingImage = false;
  }

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private gamesService: GamesService
  ) {}

  get positiveRatio(): number {
    const positive = this.game.reviews.filter(
      (review) => review.rating >= 3
    ).length;
    const total = this.game.reviews.length;

    return (positive / total) * 100;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe(({ id }) => {
      this.gamesService.getGameById(id).subscribe((game) => {
        if (!game) {
          this.route.navigate(['/games']);
          return;
        }
        this.game = game;
        this.mainImage = game.images[0].url;
      });
    });
  }
}
