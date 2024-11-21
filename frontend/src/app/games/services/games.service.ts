import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, pipe } from 'rxjs';
import { Category, Game } from '../interfaces/games.interfaces';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private apiURL = environment.apiUrl;

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

  public createGame(game: Game): Observable<Game | undefined> {
    const url = this.apiURL + '/games';

    return this.http
      .post<Game>(url, game)
      .pipe(catchError((err) => of(undefined)));
  }

  public updateGame(game: Game): Observable<Game | undefined> {
    const url = this.apiURL + '/games/' + game.id;

    return this.http
      .put<Game>(url, game)
      .pipe(catchError((err) => of(undefined)));
  }

  public deleteGame(id: string): Observable<Object> {
    const url = this.apiURL + '/games/' + id;

    // return this.http.delete(url).pipe(catchError((err) => of(false)));
    return of(true);
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
