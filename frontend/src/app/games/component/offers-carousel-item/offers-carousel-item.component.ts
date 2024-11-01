import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers-carousel-item',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './offers-carousel-item.component.html',
  styles: ``,
})
export class OffersCarouselItemComponent {
  @Input()
  public game!: Game;
  @Input()
  public discount: boolean = true;
}
