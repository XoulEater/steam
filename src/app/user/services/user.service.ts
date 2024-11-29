import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { User } from '../../games/interfaces/games.interfaces';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = environment.apiUrl + '/users';
  private userId = '6748ad65da64e001e1774246';

  constructor(private http: HttpClient) {}

  // get all users
  public getUsers(): Observable<User[]> {
    const url = this.apiURL;
    return this.http.get<User[]>(url).pipe(catchError((err) => of([])));
  }

  // get user by id
  public getUserById(): Observable<User | null> {
    const url = `${this.apiURL}/${this.userId}`;
    return this.http.get<User>(url).pipe(
      catchError((err) => {
        console.error('Error fetching user:', err); // Log del error
        return of(null); // Devuelve null en caso de error
      })
    );
  }

  // update user
  public updateUser(user: User): Observable<any> {
    const url = this.apiURL + '/' + this.userId;
    return this.http.put(url, user).pipe(catchError((err) => of(undefined)));
  }

  // delete user
  public deleteUser(userId: string): Observable<any> {
    const url = this.apiURL + '/' + userId;
    return this.http.delete(url).pipe(catchError((err) => of(undefined)));
  }

  // create user
  public createUser(user: User): Observable<any> {
    const url = this.apiURL;
    return this.http.post(url, user).pipe(catchError((err) => of(undefined)));
  }
}
