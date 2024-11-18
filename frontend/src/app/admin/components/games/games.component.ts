import { Game } from '../../../games/interfaces/games.interfaces';
import { GamesService } from './../../../games/services/games.service';
import { Component } from '@angular/core';
import { AdminGameCardComponent } from '../admin-game-card/admin-game-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    AdminGameCardComponent,
    PaginationComponent,
    MatDialogModule,
    RouterModule,
  ],
  templateUrl: './games.component.html',
  styles: ``,
})
export class GamesComponent {
  public games: Game[] = [];

  constructor(private gameService: GamesService, private dialog: MatDialog) {}

  ngOnInit() {
    this.gameService.getGames().subscribe((games) => {
      this.games = games;
    });
  }

  currentPage = 1;
  itemsPerPage = 10;

  // TODO: Pagination in backend
  get paginatedGames() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.games.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
