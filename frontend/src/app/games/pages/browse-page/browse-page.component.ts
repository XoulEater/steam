import { GamesService } from './../../services/games.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Category, Game } from '../../interfaces/games.interfaces';
import { FilterOptionsComponent } from '../../component/filter-options/filter-options.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-browse-page',
  standalone: true,
  imports: [CommonModule, FilterOptionsComponent, PaginationComponent],
  templateUrl: './browse-page.component.html',
  styles: ``,
})
export class BrowsePageComponent {
  public categories: Category[] = [];
  public games: Game[] = [];
  public developers: string[] = ['Developer 1', 'Developer 2', 'Developer 3'];

  constructor(private gamesService: GamesService) {}

  ngOnInit() {
    this.gamesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.gamesService.getGames().subscribe((games) => {
      this.games = games;
    });

    // TODO: Get developers from the service
  }

  currentPage = 1;
  itemsPerPage = 5;

  get paginatedGames() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.games.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
