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
      });

    return res;
  }

  updateSubmission(submission: Submission, id: number): any {
    const url = `${'http://pcoliva.uniurb.it/api/submissions'}/${id}`;
    let res = this.http.put<Submission>(url, submission, httpOptions)
      .pipe(
        catchError(this.handleError('updateSubmission', submission))
      );
    return res;
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
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
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getSumbissionMetadata() {
    let submissionControls: ControlBase<any>[] = [
      new TextboxControl({
        key: 'id',
        label: 'Id',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'userId',
        label: 'UserId',
        value: null,
        validation: {         
        }
      }),
      new TextboxControl({
        key: 'name',
        label: 'Nome',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'surname',
        label: 'Cognome',
        value: null,
        validation: {
          required: true
        }
      }),
      new DropdownControl({
        key: 'gender',
        label: 'Genere',
        options: [
          { key: 'm', value: 'Maschio' },
          { key: 'f', value: 'Femmina' },
        ],
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'fiscalcode',
        label: 'Codice fiscale',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'birthplace',
        label: 'Luogo di nascita',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'birthprovince',
        label: 'Provincia di nascita',
        value: null,
        validation: {
          required: true
        }
      }),
      new DateControl({
        key: 'birthdate',
        label: 'Data di nascita',
        value: null, //{ "year": 2017, "month": 2, "day": 25 },
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'com_res',
        label: 'Comune di residenza',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'prov_res',
        label: 'Provincia di residenza',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'via_res',
        label: 'Via di residenza',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'civ_res',
        label: 'Civico',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'presso',
        label: 'Presso',
        value: null,
        validation: {
          required: true
        }
      }),
      new ArrayControl({
        key: 'assignments',
        label: 'Lista incarichi',
        value:  null
      })
    ]

    return submissionControls;
  }

  getAssignmetMetadata() {
    let metadata: ControlBase<any>[] = [
      new TextboxControl({
        key: 'id',
        label: 'Id',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'role',
        label: 'Ruolo',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'title',
        label: 'Titolo',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'istitute',
        label: 'Istituto',
        value: null,
        validation: {
          required: true
        }
      }),
      new DateControl({
        key: 'from',
        label: 'Da',
        value: null,
        validation: {
          required: true
        }
      }),
      new DateControl({
        key: 'to',
        label: 'A',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'document',
        label: 'Documento',
        value: null,
        validation: {
          required: true
        }
      }),
      new TextboxControl({
        key: 'path',
        label: 'Percorso',
        value: null,
        validation: {          
        }
      })
    ]
    return metadata;
  }

}
