import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CommonModule } from '@angular/common';
import { GamesService } from '../../services/games.service';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-options.component.html',
  styles: ``,
})
export class FilterOptionsComponent {
  public selectedCategories: string[] = [];
  public selectedPrice: number = -1;
  public selectedDeveloper: string = '';
  public selectedPopularity: number = -1;

  @Input() public categories: string[] = [];
  @Input() public developers: string[] = [];

  @Output() filtersChanged = new EventEmitter<any>();

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
    this.applyFilters();
  }

  onGenresChange(event: any, category: string) {
    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
    this.applyFilters();
  }

  onDeveloperChange(value: string) {
    this.selectedDeveloper = value;
    this.applyFilters();
  }

  onPriceChange(value: number) {
    this.selectedPrice = value;
    this.applyFilters();
  }

  onPopularityChange(value: number) {
    this.selectedPopularity = value;
    this.applyFilters();
  }

  applyFilters() {
    const filters = {
      categories: this.selectedCategories,
      price: this.selectedPrice === -1 ? null : this.selectedPrice,
      developer: this.selectedDeveloper === '' ? null : this.selectedDeveloper,
      popularity:
        this.selectedPopularity === -1 ? null : this.selectedPopularity,
    };
    console.log(filters);
    this.filtersChanged.emit(filters);
  }
}
