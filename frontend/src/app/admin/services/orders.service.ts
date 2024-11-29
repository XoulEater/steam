import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, pipe } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Order } from '../../games/interfaces/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiURL = environment.apiUrl + '/orders';
  private userId = '6748ad65da64e001e1774246';

  constructor(private http: HttpClient) {}

  public getOrders(): Observable<Order[]> {
    const url = `${this.apiURL}/user/${this.userId}`;

    return this.http.get<Order[]>(url).pipe(catchError((err) => of([])));
  }

  public getOrderByUser(): Observable<Order[]> {
    const url = `${this.apiURL}/user/${this.userId}`;

    return this.http.get<Order[]>(url).pipe(catchError((err) => of([])));
  }

  public createOrder(paymentMethod: string, address: string): Observable<any> {
    const url = `${this.apiURL}/${this.userId}`;

    const body = {
      paymentMethod: paymentMethod,
      address: address,
    };

    return this.http.post(url, body).pipe(catchError((err) => of([])));
  }

  public updateOrderStatus(status: string, orderID: string): Observable<any> {
    const url = `${this.apiURL}/${orderID}/status`;

    return this.http.put(url, { status }).pipe(catchError((err) => of([])));
  }
}
