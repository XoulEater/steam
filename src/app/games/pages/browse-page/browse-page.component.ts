import { GamesService } from './../../services/games.service';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Filters, Game } from '../../interfaces/games.interfaces';
import { FilterOptionsComponent } from '../../component/filter-options/filter-options.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { GameLargeCardComponent } from '../../component/game-large-card/game-large-card.component';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-browse-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterOptionsComponent,
    PaginationComponent,
    GameLargeCardComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './browse-page.component.html',
  styles: ``,
})
export class BrowsePageComponent {
  public categories: string[] = [];
  public games: Game[] = [];
  public developers: string[] = [];

  public searchGames: Game[] = [];
  searchInput = new FormControl('');

  constructor(private gamesService: GamesService) {}

  currentPage = 1;
  itemsPerPage = 5;
  total!: number;
  filter: Filters | null = null;

  ngOnInit() {
    this.gamesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this.gamesService
      .getPaginated(this.currentPage, this.itemsPerPage)
      .subscribe((res) => {
        this.total = res.totalPages;
        this.games = res.games;
      });

    this.gamesService.getDevelopers().subscribe((developers) => {
      this.developers = developers;
    });
  }

  onFiltersChanged(filters: any) {
    this.filter = filters;
    this.onPageChange(1);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.filter) {
      this.gamesService
        .getPaginated(this.currentPage, this.itemsPerPage, this.filter)
        .subscribe((res) => {
          this.games = res.games;
        });
      return;
    }
    this.gamesService
      .getPaginated(this.currentPage, this.itemsPerPage)
      .subscribe((res) => {
        this.games = res.games;
      });
  }

  onSearch() {
    const query = this.searchInput.value;
    if (query && query.trim().length > 0) {
      this.gamesService.searchGames(query).subscribe((games) => {
        this.searchGames = games;
        console.log(this.searchGames);
      });
    } else {
      this.searchGames = [];
    }
  }
}
