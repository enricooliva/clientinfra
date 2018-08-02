import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Submission } from './models/submission';
import { map, catchError } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class UserService {

  constructor(private http: HttpClient, public messageService: MessageService ) { }

  getUsers(): Observable<any> {
    return this.http
      .get('http://pcoliva.uniurb.it/api/users', httpOptions).pipe(
        catchError(this.handleError('getusers'))
      );
  }

  getUser(id: number): Observable<any> {
    return this.http
      .get('http://pcoliva.uniurb.it/api/users', {
        params: new HttpParams().set('userId', id.toString())
      }).pipe(
        catchError(this.handleError('getuser'))
      );
    }
  

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('UserService: ' + message);
  }
 
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
