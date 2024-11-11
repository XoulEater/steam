import { GamesService } from './../../services/games.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../interfaces/games.interfaces';

@Component({
  selector: 'app-browse-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-page.component.html',
  styles: ``,
})
export class BrowsePageComponent {
  public selectedCategories: number[] = [];

  public categories: Category[] = [];

  constructor(private gamesService: GamesService) {}

  ngOnInit() {
    this.gamesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  onCheckboxChange(event: any, categoryId: number) {
    if (event.target.checked) {
      this.selectedCategories.push(categoryId);
    } else {
      const index = this.selectedCategories.indexOf(categoryId);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }
  }
}
