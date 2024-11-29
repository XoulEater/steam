import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { OffersCarouselItemComponent } from '../offers-carousel-item/offers-carousel-item.component';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-offers-carousel',
  standalone: true,
  imports: [OffersCarouselItemComponent, CommonModule, CarouselModule],
  templateUrl: './offers-carousel.component.html',
})
export class OffersCarouselComponent {
  @Input()
  public games!: Game[];
}
