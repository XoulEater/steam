import { Game } from './../../interfaces/games.interfaces';
import { Component } from '@angular/core';
import { GamesService } from '../../services/games.service';
import { MainCarouselComponent } from '../../component/main-carousel/main-carousel.component';
import { OffersCarouselComponent } from '../../component/offers-carousel/offers-carousel.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MainCarouselComponent, OffersCarouselComponent],
  templateUrl: './home-page.component.html',
  styles: ``,
})
export class HomePageComponent {
  public games: Game[] = [];

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    this.gamesService.getGames().subscribe((games) => {
      this.games = games;
    });
  }
}
