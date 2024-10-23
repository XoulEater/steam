import { Component, Input } from '@angular/core';
import { CategoriesCarouselItemComponent } from '../categories-carousel-item/categories-carousel-item.component';
import { CommonModule } from '@angular/common';
import { Category } from '../../interfaces/games.interfaces';

@Component({
  selector: 'app-categories-carousel',
  standalone: true,
  imports: [CategoriesCarouselItemComponent, CommonModule],
  templateUrl: './categories-carousel.component.html',
  styles: ``,
})
export class CategoriesCarouselComponent {
  private readonly groupedBy: number = 5;

  public groupedCategories: Category[][] = [];

  @Input()
  set categories(value: Category[]) {
    this.groupCategories(value);
  }

  groupCategories(Categories: Category[]): void {
    this.groupedCategories = [];
    for (let i = 0; i < Categories.length; i += this.groupedBy) {
      this.groupedCategories.push(Categories.slice(i, i + this.groupedBy));
    }
    console.log(this.groupedCategories);
  }
}
