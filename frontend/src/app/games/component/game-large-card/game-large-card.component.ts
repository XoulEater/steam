import { Component, Input } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingBarComponent } from '../rating-bar/rating-bar.component';

@Component({
  selector: 'app-game-large-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingBarComponent],
  templateUrl: './game-large-card.component.html',
  styles: ``,
})
export class GameLargeCardComponent {
  @Input()
  public game!: Game;
  public mainImage!: string;

  // TODO: Implement the wishlist feature
  // TODO: Implement the discount feature
  public discount = false;
  public inWishlist = false;
  public toggleWishlist(): void {
    this.inWishlist = !this.inWishlist;
  }

  ngOnInit(): void {
    this.mainImage = this.game.images[0];
  }
}
