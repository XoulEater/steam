import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, pipe } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Game } from '../../games/interfaces/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiURL = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) {}

  public getTopSales(): Observable<Game[]> {
    const url = this.apiURL + '/most-sold-games';

    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }

  public getOrdersPerDay(): Observable<any> {
    const url = this.apiURL + '/orders-per-day';

    return this.http.get<any>(url).pipe(catchError((err) => of([])));
  }
}
