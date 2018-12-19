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
export class UserTaskService implements ServiceQuery {

  _baseURL: string;

  getMetadata():FormlyFieldConfig[] {
    return  [
    ];
    
  }

  @Cacheable()
  getById(id: any) {       
    return this.getUserTask(id);
  }

  constructor(private http: HttpClient, public messageService: MessageService ) {
    this._baseURL = AppConstants.baseApiURL;
  }
  
  clearMessage() {
    this.messageService.clear();
  }

  query(model): Observable<any> {    
    return this.http
      .post<any>(this._baseURL+'/usertask/query', model, httpOptions ).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        catchError(this.handleError('query'))
      );
  }

  getUserTask(id: number): Observable<any> {
    return this.http
      .get(this._baseURL+'/usertask/'+id.toString(),httpOptions).pipe(
        tap(sub => {
          if (sub)
            this.messageService.info('Lettura attività effettuata con successo')
          else 
            this.messageService.info('Attività non trovata')
        }),
        catchError(this.handleError('getUserTask'))
      );
    }
  

    @Cacheable()
    getUserTaskFiltredByUserId(userId: any) {       
      return this.http
      .get(this._baseURL+'/usertask/'+userId.toString()+'/tasks',httpOptions).pipe(
        tap(sub => {
          if (sub)
            this.messageService.info('Lettura attività effettuata con successo')
          else 
            this.messageService.info('Attività non trovata')
        }),
        catchError(this.handleError('getUserTask'))
      );
    }

    @Cacheable()
    getNextPossibleActionsFromTask(taskId: any): Observable<any> {       
      return this.http
      .get(this._baseURL+'/usertask/'+taskId.toString()+'/actions',httpOptions).pipe(        
        catchError(this.handleError('getUserTask'))
      );
    }

    public update(usertask){
    if (usertask.id) {
      //aggiorna la Convenzione esiste PUT
      const url = `${this._baseURL + '/usertask'}`;
      let res = this.http.post<any>(url, usertask, httpOptions)
        .pipe(
          tap(sub => {
            this.messageService.info('Aggiornamento effettuato con successo');
            return sub;
          }),          
          catchError(this.handleError('updateConvenzione', usertask, true))
        );
      return res;
    }
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
