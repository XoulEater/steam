import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, pipe } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Game } from '../interfaces/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private apiURL = environment.apiUrl + '/wishlist';
  private userId = '6748ad65da64e001e1774246';

  private gamesID: string[] = [];

  constructor(private http: HttpClient) {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    this.getWishlist().subscribe((games) => {
      this.gamesID = games.map((game) => game._id);
    });
  }

  public getWishlist(): Observable<Game[]> {
    const url = this.apiURL + '/' + this.userId;
    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }

  public addGameToWishlist(gameId: string): Observable<any> {
    const url = this.apiURL + '/' + this.userId + '/add/' + gameId;
    return this.http.post(url, {}).pipe(
      map(() => {
        this.gamesID.push(gameId);
      }),
      catchError((err) => of(undefined))
    );
  }

  public removeGameFromWishlist(gameId: string): Observable<any> {
    const url = this.apiURL + '/' + this.userId + '/remove/' + gameId;
    return this.http.post(url, {}).pipe(
      map(() => {
        this.gamesID = this.gamesID.filter((id) => id !== gameId);
      }),
      catchError((err) => of(undefined))
    );
  }

  public isInWishlist(gameId: string): boolean {
    return this.gamesID.some((id) => id === gameId);
  }
}
