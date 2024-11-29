import { Component, Input } from '@angular/core';
import { GameInfo } from '../../interfaces/games.interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

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
  public cartId = '';

  constructor(
    private cartService: CartService
  ) {}


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
    if (this.game.game.stock != this.game.quantity) {
      console.log(this.game.game.stock)
      this.game.quantity++;
    }
  }

  decrement(): void {
    if (this.game.quantity != 1) {
      // Evitar valores negativos (opcional)
      this.game.quantity--;
    }
  }

  deleteGame(): void{
      this.cartService.removeGameFromCart(this.game.game._id).subscribe(() => {
      console.log("Game " + this.game.game._id + " deleted correctly")
    });
    
  }


  get total(): number {
    return this.game.game.price * this.game.quantity;
  }

  ngOnInit(): void {
    this.mainImage = this.game.game.images[0];
  }
}
