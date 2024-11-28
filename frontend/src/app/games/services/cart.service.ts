import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Game, CartRes } from '../interfaces/games.interfaces';
import { environment } from '../../../enviroments/enviroment';

/*

/cart
router.post("/:id/add", cartController.addToCart);
router.post("/:id/remove", cartController.removeFromCart);
router.get("/:id", cartController.getCart);
router.put("/:id", cartController.updateCart);

*/

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiURL = environment.apiUrl + '/cart';
  private userId = '6748ad65da64e001e1774246';

  constructor(private http: HttpClient) {}

  // Add a game to the cart
  public addGameToCart(gameId: string): Observable<any> {
    const url = this.apiURL + '/' + this.userId + '/add/' + gameId;
    return this.http.post(url, {}).pipe(catchError((err) => of(undefined)));
  }

  // Remove a game from the cart
  public removeGameFromCart(gameId: string): Observable<any> {
    const url = this.apiURL + '/' + gameId + '/remove/' + gameId;

    return this.http.post(url, {}).pipe(catchError((err) => of(undefined)));
  }

  // Get the cart
  public getCart(): Observable<CartRes | null> {
    const url = `${this.apiURL}/${this.userId}`;
    return this.http.get<CartRes>(url).pipe(
      catchError(err => {
        console.error('Error fetching cart:', err); // Log del error
        return of(null); // Devuelve null en caso de error
      })
    );
  }

  // Update the cart (e.g., change quantities)
  public updateCart(cartItems: CartRes): Observable<any> {
    const url = this.apiURL + '/' + this.userId;
    return this.http
      .put(url, cartItems)
      .pipe(catchError((err) => of(undefined)));
  }
}
