import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Submission } from './models/submission';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';
import { InfraMessageType } from '../shared/message/message';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SubmissionService {

  constructor(private http: HttpClient, public messageService: MessageService ) { }

  getSumbissions(): Observable<any> {
    return this.http
      .get('http://pcoliva.uniurb.it/api/submissions', httpOptions);
  }

  getSubmission(): Observable<Submission> {

    let res = this.http
      .get<Submission>('http://pcoliva.uniurb.it/api/submissions', {
        params: new HttpParams().set('userId', '2')
      }).pipe(
        tap(sub => this.messageService.info('Lettura domanda effetuata con successo')),
        catchError(this.handleError('getSubmission', null))
      );

    return res;
  }

  updateSubmission(submission: Submission, id: number): any {
    const url = `${'http://pcoliva.uniurb.it/api/submissions'}/${id}`;
    let res = this.http.put<Submission>(url, submission, httpOptions)
      .pipe(
        tap(sub => this.messageService.info('Aggiornamento effettuato con successo')),
        catchError(this.handleError('updateSubmission', submission))
      );
    return res;
  }  
  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
