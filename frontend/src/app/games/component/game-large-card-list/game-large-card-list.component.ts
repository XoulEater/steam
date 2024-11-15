import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Game } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { GameLargeCardComponent } from '../game-large-card/game-large-card.component';

@Component({
  selector: 'app-game-large-card-list',
  standalone: true,
  imports: [CommonModule, GameLargeCardComponent],
  templateUrl: './game-large-card-list.component.html',
  styleUrls: ['./game-large-card-list.component.css'],
})
export class GameLargeCardListComponent implements OnChanges {
  @Input() games: Game[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['games']) {
      console.log('Games updated in GameLargeCardListComponent:', this.games);
    }
  }
}
