import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { OffersCarouselItemComponent } from '../offers-carousel-item/offers-carousel-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers-carousel',
  standalone: true,
  imports: [OffersCarouselItemComponent, CommonModule],
  templateUrl: './offers-carousel.component.html',
})
export class OffersCarouselComponent {
  public groupedGames: Game[][] = [];

  @Input()
  set games(value: Game[]) {
    this.groupGames(value);
  }

  groupGames(games: Game[]): void {
    this.groupedGames = [];
    for (let i = 0; i < games.length; i += 3) {
      this.groupedGames.push(games.slice(i, i + 3));
    }
    console.log(this.groupedGames);
  }
}
