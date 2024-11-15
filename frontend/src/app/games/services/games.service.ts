import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, pipe } from 'rxjs';
import { Category, Game } from '../interfaces/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private apiURL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  public getGames(): Observable<Game[]> {
    const url = this.apiURL + '/games';

    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }

  public getOffers(): Observable<Game[]> {
    const url = this.apiURL + '/games';

    // TODO: Filter in backend
    return this.http.get<Game[]>(url).pipe(
      map((games: Game[]) =>
        games.filter((game) => game.discount && game.discount.type !== 'none')
      ),
      catchError((err) => of([]))
    );
  }

  public getWishlistGames(): Observable<Game[]> {
    const url = this.apiURL + '/wishlist';

    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }

  public getGameById(id: string): Observable<Game | undefined> {
    const url = this.apiURL + '/games/' + id;

    return this.http.get<Game>(url).pipe(catchError((err) => of(undefined)));
  }

  public addReview(gameId: string, review: any): Observable<any> {
    // const url = this.apiURL + '/games/' + gameId + '/reviews';
    // return this.http.post(url, review).pipe(catchError((err) => of(undefined)));
    return of(true);
  }

  public getCategories(): Observable<Category[]> {
    return of([
      'Action',
      'Adventure',
      'Animation & Modeling',
      'Casual',
      'Design & Illustration',
      'Early Access',
      'Free to Play',
      'Indie',
      'Massively Multiplayer',
      'RPG',
      'Racing',
      'Simulation',
      'Sports',
      'Strategy',
      'Utilities',
    ] as Category[]);
  }
}
