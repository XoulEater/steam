import { Component, Input } from '@angular/core';
import { Game } from '../../../games/interfaces/games.interfaces';
import { RatingBarComponent } from '../../../games/component/rating-bar/rating-bar.component';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../../games/services/games.service';
import { MatDialog } from '@angular/material/dialog';
import { DiscountDialogComponent } from '../discount-dialog/discount-dialog.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-game-card',
  standalone: true,
  imports: [RatingBarComponent, CommonModule, RouterModule],
  templateUrl: './admin-game-card.component.html',
  styles: ``,
})
export class AdminGameCardComponent {
  @Input()
  public game!: Game;

  constructor(private gameService: GamesService, private dialog: MatDialog) {}

  get discountValue(): number {
    if (!this.game.discount || !this.game.discount.value) {
      return 0;
    }
    if (this.game.discount.type === 'fixed') {
      return this.game.discount.value;
    }
    return this.game.price * (this.game.discount.value / 100);
  }

  onDiscount(game: Game) {
    const dialogRef = this.dialog.open(DiscountDialogComponent, {
      data: game.discount,
      width: '100%',
      maxWidth: '40vw',
      height: '100%',
      maxHeight: '50vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.game.discount = result.data;
        this.gameService.addDiscount(game._id, result.data).subscribe();
      }
    });
  }
}
