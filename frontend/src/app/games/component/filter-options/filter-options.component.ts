import { Component, Input } from '@angular/core';
import { Category } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-options.component.html',
  styles: ``,
})
export class FilterOptionsComponent {
  public selectedCategories: number[] = [];
  public selectedPrice: number = -1;
  public selectedDeveloper: string = '';
  public selectedPopularity: number = -1;

  @Input() public categories: Category[] = [];
  @Input() public developers: string[] = [];

  clearFilters() {
    this.selectedCategories = [];
    this.selectedPrice = -1;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
    });
    const radioboxes = document.querySelectorAll('input[type="radio"]');
    radioboxes.forEach((radiobox) => {
      (radiobox as HTMLInputElement).checked
        ? ((radiobox as HTMLInputElement).checked = false)
        : null;
    });
  }

  onGenresChange(event: any, categoryId: number) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }

  onDeveloperChange(value: string) {
    this.selectedDeveloper = value;
  }

  onPriceChange(value: number) {
    this.selectedPrice = value;
  }

  onPopularityChange(value: number) {
    this.selectedPopularity = value;
  }
}
