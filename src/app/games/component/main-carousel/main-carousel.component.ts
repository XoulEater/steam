import { Component, Input } from '@angular/core';
import { MainCarouselItemComponent } from '../main-carousel-item/main-carousel-item.component';
import { Game } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-main-carousel',
  standalone: true,
  imports: [MainCarouselItemComponent, CommonModule, CarouselModule],
  templateUrl: './main-carousel.component.html',
  styles: ``,
})
export class MainCarouselComponent {
  @Input()
  public games: Game[] = [];
}
