import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery, BaseService } from '../shared';
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
export class UserTaskService extends BaseService {

  _baseURL: string;

  getMetadata(): FormlyFieldConfig[] {
    return [
    ];

  }


  constructor(protected http: HttpClient, public messageService: MessageService) {
    super(http, messageService);
    this.basePath = 'usertask';
  }

  @Cacheable()
  create(): Observable<any> {
    return this.http
      .get(this._baseURL + `/${this.basePath}/create`, httpOptions).pipe(
        tap(sub => {
          if (sub)
            this.messageService.info('Inizializzazione effettuata con successo')
          else
            this.messageService.info('Permesso non trovato')
        }),
        catchError(this.handleError('create'))
      );
  }

  @Cacheable()
  getValidationOffices(): Observable<any> {
    return this.http.get(this._baseURL + '/convenzioni/validationoffices/', httpOptions).pipe(
      catchError(this.handleError('getValidationOfficesPersonale', []))
    );
  }

  @Cacheable()
  getValidationOfficesPersonale(id): Observable<any> {
    if (id){
      return this.http.get(this._baseURL + '/convenzioni/validationoffices/' + id.toString(), httpOptions).pipe(
        catchError(this.handleError('getValidationOfficesPersonale', []))
      );
    } 
    return of([]);
  }

  @Cacheable()
  getUserTaskFiltredByUserId(userId: any) {
    return this.http
      .get(this._baseURL + '/usertask/' + userId.toString() + '/tasks', httpOptions).pipe(
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
      .get(this._baseURL + '/usertask/' + taskId.toString() + '/actions', httpOptions).pipe(
        catchError(this.handleError('getUserTask'))
      );
  }


  getNextActions(id): Observable<any> {
    const url = `${this._baseURL}/convenzioni/${id}/actions`
    return this.http.get(url, httpOptions);
  }


}
