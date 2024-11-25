import { Component, Input } from '@angular/core';
import { CategoriesCarouselItemComponent } from '../categories-carousel-item/categories-carousel-item.component';
import { CommonModule } from '@angular/common';

import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-categories-carousel',
  standalone: true,
  imports: [CategoriesCarouselItemComponent, CommonModule, CarouselModule],
  templateUrl: './categories-carousel.component.html',
  styles: ``,
})
export class CategoriesCarouselComponent {
  @Input()
  public categories!: string[];
}
