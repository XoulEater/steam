import { Category, Game } from './../../interfaces/games.interfaces';
import { Component } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { MainCarouselComponent } from '../../component/main-carousel/main-carousel.component';
import { OffersCarouselComponent } from '../../component/offers-carousel/offers-carousel.component';
import { CategoriesCarouselComponent } from '../../component/categories-carousel/categories-carousel.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MainCarouselComponent,
    OffersCarouselComponent,
    CategoriesCarouselComponent,
  ],
  templateUrl: './home-page.component.html',
  styles: ``,
})
export class HomePageComponent {
  public games: Game[] = [];
  public categories: Category[] = [];

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    this.gamesService.getGames().subscribe((games) => {
      this.games = games;
    });
    this.gamesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }
}
