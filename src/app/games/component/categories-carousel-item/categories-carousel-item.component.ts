import { Component, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories-carousel-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-carousel-item.component.html',
  styles: ``,
})
export class CategoriesCarouselItemComponent {
  @Input()
  public category!: string;

  @Input()
  public index!: number;
}
