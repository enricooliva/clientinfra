import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Submission } from './models/submission';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class UserService implements ServiceQuery {

  getById(id: any) {       
    return this.getUser(id);
  }

  constructor(private http: HttpClient, public messageService: MessageService ) { }
  
  clearMessage() {
    this.messageService.clear();
  }

  query(model): Observable<any> {    
    return this.http
      .post<any>('http://pcoliva.uniurb.it/api/users/query', model, httpOptions ).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        catchError(this.handleError('query'))
      );
  }

  getUsers(model): Observable<any> {
    
    return this.http
      .get<any>('http://pcoliva.uniurb.it/api/users', { headers: httpOptions.headers, params: model }).pipe(
        tap(sub => this.messageService.info('Lettura utenti effettuata con successo')),
        catchError(this.handleError('getusers'))
      );
  }

  getUser(id: number): Observable<any> {
    return this.http
      .get('http://pcoliva.uniurb.it/api/users', {
        params: new HttpParams().set('userId', id.toString())
      }).pipe(
        tap(sub => {
          if (sub)
            this.messageService.info('Lettura utente effettuata con successo')
          else 
            this.messageService.info('Utente non trovato')
        }),
        catchError(this.handleError('getuser'))
      );
    }
  
 
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.error(`L'operazione di ${operation} è terminata con errori: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
