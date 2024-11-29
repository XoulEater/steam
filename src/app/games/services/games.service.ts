import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, pipe } from 'rxjs';
import {
  Filters,
  Game,
  PaginatedGames,
  Review,
} from '../interfaces/games.interfaces';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private apiURL = environment.apiUrl + '/games';

  constructor(private http: HttpClient) {}

  // CRUD DE JUEGOS

  public getPaginated(
    page: number,
    pageSize: number,
    filter?: Filters
  ): Observable<PaginatedGames> {
    const url = this.apiURL + '/filter';
    return this.http
      .get<PaginatedGames>(url, {
        params: {
          page: page.toString(),
          limit: pageSize.toString(),
          categories: filter?.categories ? filter.categories.join(',') : '',
          price: filter?.price ? filter.price.toString() : '', // FIXME: price 0 is falsy
          developer: filter?.developer ? filter.developer : '',
          popularity: filter?.popularity ? filter.popularity.toString() : '',
        },
      })
      .pipe(
        catchError((err) => of({ games: [], totalPages: 0, currentPage: 0 }))
      );
  }

  public getPopularGames(): Observable<Game[]> {
    const url = this.apiURL + '/popular';
    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }

  public getSimilarGames(gameId: string): Observable<Game[]> {
    const url = this.apiURL + '/' + gameId + '/related';
    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }

  public createGame(game: Game): Observable<any> {
    const url = this.apiURL;
    return this.http.post(url, game).pipe(catchError((err) => of(undefined)));
  }

  public updateGame(game: Game): Observable<any> {
    const url = this.apiURL + '/' + game._id;

    return this.http.put(url, game).pipe(catchError((err) => of(undefined)));
  }

  public deleteGame(id: string): Observable<any> {
    const url = this.apiURL + '/' + id;

    return this.http.delete(url).pipe(catchError((err) => of(undefined)));
  }

  public getGameById(id: string): Observable<Game | undefined> {
    const url = this.apiURL + '/' + id;

    return this.http.get<Game>(url).pipe(catchError((err) => of(undefined)));
  }

  public addReview(gameId: string, review: Review): Observable<any> {
    const url = this.apiURL + '/' + gameId + '/review';

    return this.http.post(url, review).pipe(catchError((err) => of(undefined)));
  }

  // GETS DE CATEGORIAS Y DESARROLLADORES

  public getCategories(): Observable<string[]> {
    const url = this.apiURL + '/categories';
    return this.http.get<string[]>(url).pipe(catchError((err) => of([])));
  }

  public getDevelopers(): Observable<string[]> {
    const url = this.apiURL + '/developers';
    return this.http.get<string[]>(url).pipe(catchError((err) => of([])));
  }

  // OFERTAS
  public getOffers(): Observable<Game[]> {
    const url = this.apiURL + '/discounts';

    return this.http.get<Game[]>(url).pipe(catchError((err) => of([])));
  }

  public addDiscount(gameId: string, discount: number): Observable<any> {
    const url = this.apiURL + '/' + gameId + '/discount';
    const body = {
      discount,
    };
    return this.http.post(url, body).pipe(catchError((err) => of(undefined)));
  }

  public removeDiscount(gameId: string): Observable<any> {
    const url = this.apiURL + '/' + gameId + '/discount';

    return this.http.delete(url).pipe(catchError((err) => of(undefined)));
  }

  public addDiscountToCategory(
    categoryId: string,
    discount: number
  ): Observable<any> {
    const url = this.apiURL + '/category/' + categoryId + '/discount';
    const body = {
      discount,
    };
    return this.http.post(url, body).pipe(catchError((err) => of(undefined)));
  }

  public searchGames(search: string): Observable<Game[]> {
    const url = this.apiURL + '/search';
    // req.query.keyword
    return this.http
      .get<Game[]>(url, {
        params: {
          keyword: search,
        },
      })
      .pipe(catchError((err) => of([])));
  }

  public filterGames(filters: Filters): Observable<PaginatedGames> {
    const url = this.apiURL + '/filter';
    return this.http
      .get<PaginatedGames>(url, {
        params: {
          categories: filters.categories.join(','),
          price: filters.price ? filters.price.toString() : '',
          developer: filters.developer ? filters.developer : '',
          popularity: filters.popularity ? filters.popularity.toString() : '',
        },
      })
      .pipe(
        catchError((err) => of({ games: [], totalPages: 0, currentPage: 0 }))
      );
  }
}
