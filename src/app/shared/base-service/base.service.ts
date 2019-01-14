
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Cacheable } from 'ngx-cacheable';
import { ServiceQuery, ServiceEntity } from '../query-builder/query-builder.interfaces';
import { MessageService } from '../message.service';
import { AppConstants } from 'src/app/app-constants';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class BaseService implements ServiceQuery, ServiceEntity {

  _baseURL: string;

  protected basePath: string;
  
  getMetadata(): FormlyFieldConfig[] {
    return [];
  }

  @Cacheable()
  getById(id: any) {
    return this.http
    .get(this._baseURL +  `/${this.basePath}/` + id.toString(), httpOptions).pipe(
      tap(sub => {
        if (sub)
          this.messageService.info('Lettura permesso effettuata con successo')
        else
          this.messageService.info('Permesso non trovato')
      }),
      catchError(this.handleError('getById'))
    );
  }

  constructor(protected http: HttpClient, public messageService: MessageService) {
    this._baseURL = AppConstants.baseApiURL;
  }

  clearMessage() {
    this.messageService.clear();
  }

  query(model): Observable<any> {
    return this.http
      .post<any>(this._baseURL + `/${this.basePath}/query`, model, httpOptions).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        catchError(this.handleError('query'))
      );
  } 

  store(model: any, retrow: boolean = false): Observable<any>{
    //TODO
    return of(true);
  }

  update(model: any, id: number, retrow: boolean = false): Observable<any> {
    if (id) {
      //aggiorna la Convenzione esiste PUT
      const url = `${this._baseURL}/${this.basePath}/${id}`;
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

  remove(id: number) {
    return this.http.delete(this._baseURL + `/${this.basePath}/` + id.toString()).pipe(
      tap(ok => {
        this.messageService.clear();
        this.messageService.info('Eliminazione effettuata con successo')
      }),
      catchError(
        this.handleError("remove", null)
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