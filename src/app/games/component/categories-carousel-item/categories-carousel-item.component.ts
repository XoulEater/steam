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

  getCategoryColor(): string {
    let hash = 0;
    for (let i = 0; i < this.category.length; i++) {
      hash = this.category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x22ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - color.length) + color;
  }
}
