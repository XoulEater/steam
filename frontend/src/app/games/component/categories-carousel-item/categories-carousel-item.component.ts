import { Component, Input } from '@angular/core';
import { Category } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-carousel-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-carousel-item.component.html',
  styles: ``,
})
export class CategoriesCarouselItemComponent {
  @Input()
  public category!: Category;

  @Input()
  public index!: number;
}
