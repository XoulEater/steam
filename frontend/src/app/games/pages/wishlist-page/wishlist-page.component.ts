import { WishlistService } from './../../services/wishlist.service';
import { GamesService } from '../../services/games.service';
import { Component } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameLargeCardComponent } from '../../component/game-large-card/game-large-card.component';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, GameLargeCardComponent],
  templateUrl: './wishlist-page.component.html',
  styles: ``,
})
export class WishlistPageComponent {
  public games: Game[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private wishlistService: WishlistService
  ) {}

  // Método para cambiar la imagen principal con una transición

  ngOnInit(): void {
    this.wishlistService.getWishlist().subscribe((games) => {
      this.games = games;
    });
  }
}
