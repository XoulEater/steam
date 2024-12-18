import { CartService } from '../../services/cart.service';
import { Component } from '@angular/core';
import { GameInfo, CartRes } from '../../interfaces/games.interfaces';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameLargeCardCartComponent } from '../../component/game-large-card-cart/game-large-card-cart.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, GameLargeCardCartComponent, RouterModule],
  templateUrl: './cart-page.component.html',
  styles: ``,
})
export class CartPageComponent {
  public cartInfo: GameInfo[] = [];
  public cart!: CartRes;

  constructor(private cartService: CartService) {}

  // Método para cambiar la imagen principal con una transición

  ngOnInit(): void {
    this.cartService.getCart().subscribe((cart) => {
      if (cart) {
        this.cart = cart;
        this.cartInfo = cart.games;
      }
    });
  }

  updateCart(): void {
    this.cartService.updateCart(this.cart).subscribe(() => {
      window.location.reload();
    });
  }

  // TODO: Save the cart before going to the checkout page
}
