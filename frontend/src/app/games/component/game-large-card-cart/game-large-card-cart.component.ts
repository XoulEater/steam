import { Component, Input } from '@angular/core';
import { GameInfo } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-large-card-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-large-card-cart.component.html',
  styles: ``,
})
export class GameLargeCardCartComponent {
  @Input()
  public game!: GameInfo;
  public mainImage!: string;

  get discountValue(): number {
    if (!this.game.game.discount || !this.game.game.discount.value) {
      return 0;
    }
    if (this.game.game.discount.type === 'fixed') {
      return this.game.game.discount.value;
    }
    return this.game.game.price * (this.game.game.discount.value / 100);
  }

  increment(): void {
    this.game.quantity++;
  }

  decrement(): void {
    if (this.game.quantity != 1) {
      // Evitar valores negativos (opcional)
      this.game.quantity--;
    }
  }

  get total(): number {
    return this.game.game.price * this.game.quantity;
  }

  ngOnInit(): void {
    this.mainImage = this.game.game.images[0];
  }
}
