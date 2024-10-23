import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';

@Component({
  selector: 'app-offers-carousel-item',
  standalone: true,
  imports: [],
  templateUrl: './offers-carousel-item.component.html',
  styles: ``,
})
export class OffersCarouselItemComponent {
  @Input()
  public game!: Game;
}
