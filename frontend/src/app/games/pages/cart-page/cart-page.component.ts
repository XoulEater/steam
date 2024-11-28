import { CartService } from '../../services/cart.service';
import { Component } from '@angular/core';
import { GameInfo, CartRes} from '../../interfaces/games.interfaces';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  // Método para cambiar la imagen principal con una transición

  ngOnInit(): void {
    this.cartService.getCart().subscribe((cart) => {
      if (cart) {
        this.cart = cart;
        this.cartInfo = cart.games
      }
    });
  }
  isChildRouteActive(): boolean {
    return this.router.url.includes('/cart/payment');
  }

  updateCart(): void {
    this.cartService.updateCart(this.cart).subscribe(() => {

    })
  }
}
