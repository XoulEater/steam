import { GamesService } from './../../services/games.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category } from '../../interfaces/games.interfaces';
import { FilterOptionsComponent } from '../../component/filter-options/filter-options.component';

@Component({
  selector: 'app-browse-page',
  standalone: true,
  imports: [CommonModule, FilterOptionsComponent],
  templateUrl: './browse-page.component.html',
  styles: ``,
})
export class BrowsePageComponent {
  public categories: Category[] = [];
  public developers: string[] = ['Developer 1', 'Developer 2', 'Developer 3'];

  constructor(private gamesService: GamesService) {}

  ngOnInit() {
    this.gamesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    // TODO: Get developers from the service
  }
}
