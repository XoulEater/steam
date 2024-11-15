import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Order } from '../../games/interfaces/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getOrders(): Observable<Order[]> {
    const url = this.apiURL + '/orders';

    return this.http.get<Order[]>(url).pipe(
      catchError((err) => {
        console.error(err);
        return [];
      })
    );
  }
}
