import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Cacheable } from 'ngx-cacheable';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class UserService implements ServiceQuery {

  _baseURL: string;

  getMetadata():FormlyFieldConfig[] {
    return  [
      {
        key: 'id',
        type: 'number',
        hideExpression: false,
        templateOptions: {
          label: 'Id',
          disabled: true,
          column: { width: 10, cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'name',
        type: 'string',
        templateOptions: {
          label: 'Nome utente',
          required: true,
          column: { cellTemplate: 'valuecolumn'}
        }        
      },
      {
        key: 'email',
        type: 'string',
        templateOptions: {
          label: 'Email',
          required: true,
          column: { cellTemplate: 'valuecolumn'}
        }
      }
    ];
    
  }

  getById(id: any) {       
    return this.getUser(id);
  }

  constructor(private http: HttpClient, public messageService: MessageService ) {
    this._baseURL = AppConstants.baseApiURL;
  }
  
  clearMessage() {
    this.messageService.clear();
  }

  query(model): Observable<any> {    
    return this.http
      .post<any>(this._baseURL+'/users/query', model, httpOptions ).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        catchError(this.handleError('query'))
      );
  }

  getUsers(model): Observable<any> {
    
    return this.http
      .get<any>(this._baseURL+'/users', { headers: httpOptions.headers, params: model }).pipe(
        tap(sub => this.messageService.info('Lettura utenti effettuata con successo')),
        catchError(this.handleError('getusers'))
      );
  }

  @Cacheable()
  getRoles(): Observable<any> {
    return this.http
      .get<any>(this._baseURL+'/users/roles', { headers: httpOptions.headers}).pipe(
        //tap(sub => this.messageService.info('Lettura utenti effettuata con successo')),
        catchError(this.handleError('getRoles'))
      );
  }

  @Cacheable()
  getPermissions(): Observable<any> {
    return this.http
      .get<any>(this._baseURL+'/users/permissions', { headers: httpOptions.headers}).pipe(
        //tap(sub => this.messageService.info('Lettura utenti effettuata con successo')),
        catchError(this.handleError('getPermissions'))
      );
  }

  getUser(id: number): Observable<any> {
    return this.http
      .get(this._baseURL+'/users', {
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
  
    update(model: any, id: number, retrow: boolean = false): any {
      if (id) {
        //aggiorna la Convenzione esiste PUT
        const url = `${this._baseURL + '/users'}/${id}`;
        let res = this.http.put<any>(url, model, httpOptions)
          .pipe(
            tap(sub => {
              this.messageService.info('Aggiornamento effettuato con successo');
              return sub;
            }),                    
            catchError(this.handleError('update', model, retrow))
          );
        return res;
      }
    }

 
  remove(id: number){
    return this.http.delete(this._baseURL+'/users/'+ id.toString()).pipe(
      tap(ok => {        
          this.messageService.clear();
          this.messageService.info('Eliminazione utente effettuata con successo')                  
      }),
      catchError(  
        this.handleError("remove",null)
      )
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T, retrow: boolean = false) {
    return (error: any): Observable<T> => {
      
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.error(`L'operazione di ${operation} è terminata con errori: ${error.message}`);
      // Let the app keep running by returning an empty result.
      if (!retrow)
        return of(result as T);
      else 
        return throwError(error);
    };
  }
}
