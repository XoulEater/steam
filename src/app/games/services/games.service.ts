import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Game } from '../interfaces/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private apiURL = 'http://localhost:3000/games';

  constructor(private http: HttpClient) {}

  public getGames(): Observable<Game[]> {
    const url = this.apiURL;

    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }
}
