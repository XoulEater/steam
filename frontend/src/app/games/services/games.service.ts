import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
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
    const url = this.apiURL + '/categories';
    return this.http.get<Category[]>(url).pipe(catchError((err) => of([])));
  }
}
