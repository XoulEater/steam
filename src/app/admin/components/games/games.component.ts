import { Game } from '../../../games/interfaces/games.interfaces';
import { GamesService } from './../../../games/services/games.service';
import { Component } from '@angular/core';
import { AdminGameCardComponent } from '../admin-game-card/admin-game-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { RouterModule } from '@angular/router';
import { DiscountDialogComponent } from '../discount-dialog/discount-dialog.component';

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

  currentPage = 1;
  itemsPerPage = 10;
  total!: number;

  ngOnInit() {
    this.gameService
      .getPaginated(this.currentPage, this.itemsPerPage)
      .subscribe((res) => {
        this.total = res.totalPages;
        this.games = res.games;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.gameService
      .getPaginated(this.currentPage, this.itemsPerPage)
      .subscribe((res) => {
        this.games = res.games;
      });
  }

  onDiscount() {
    const dialogRef = this.dialog.open(DiscountDialogComponent, {
      data: null,
      width: '100%',
      maxWidth: '40vw',
      height: '100%',
      maxHeight: '50vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.gameService
          .addDiscountToCategory(result.category, result.data)
          .subscribe((res) => {
            console.log(res);
          });
      }
    });
  }
}
