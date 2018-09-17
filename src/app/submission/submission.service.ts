import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Submission } from './models/submission';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';
import { InfraMessageType } from '../shared/message/message';
import { fieldsForm } from './models/submissionForm';
import { FormlyFieldConfig } from '@ngx-formly/core';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class SubmissionService implements ServiceQuery {

  getById(id: any): Observable<any> {
    return this.getSubmissionById(id);
  }

  getMetadata(): FormlyFieldConfig[] {    
    return [
      {
        key: 'id',
        type: 'number',
        hideExpression: true,
        templateOptions: {
          label: 'Id',   
          disabled: true      
        },
      },
      {
        key: 'user_id',
        type: 'external',     
        wrappers: [], 
        templateOptions: {
          label: 'UserId',                     
          type: 'string',                         
          entityName: 'user',
          codeProp:'id',
          descriptionProp: 'name',                
        },      
        modelOptions: {
          updateOn: 'blur',
        }, //necessario per il corretto evento di decodifica non sono riuscito a spostarlo nel template???  
      },
      {
        key: 'name',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Nome',     
          required: true               
        }     
      },
      {
        key: 'surname',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Cognome',     
          required: true               
        }     
      },
      {
        key: 'gender',
        type: 'select',    
        className: "col-md-2",  
        templateOptions: {
          label: 'Genere',     
          required: true,
          options: [
            { value: 'm', label: 'Maschio' },
            { value: 'f', label: 'Femmina' },
          ]               
        }     
      },
      {
        key: 'fiscalcode',
        type: 'input',
        className: "col-md-4",
        templateOptions: {
          label: 'Codice fiscale',     
          required: true               
        }     
      },  
      {
        key: 'birthplace',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Luogo di nascita',     
          required: true               
        }     
      },  
      {
        key: 'birthprovince',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Provincia di nascita',     
          required: true               
        }     
      },  
      {
        key: 'birthdate',
        type: 'date',      
        className: "col-md-6",
        templateOptions: {
          label: 'Data di nascita',     
          required: true               
        }     
      },
      {
        key: 'com_res',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Comune di residenza',     
          required: true               
        }     
      },  
      {
        key: 'prov_res',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Provincia di residenza',     
          required: true               
        }     
      },
      {
        key: 'via_res',
        type: 'input',      
        className: "col-md-4",
        templateOptions: {
          label: 'Via di residenza',     
          required: true               
        }     
      },  
      {
        key: 'civ_res',
        type: 'input',      
        className: "col-md-2",
        templateOptions: {
          label: 'Civico',     
          required: true               
        }     
      },
      {
        key: 'presso',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Presso',     
          required: true               
        }     
      }
    ];
  }

  clearMessage() {
    this.messageService.clear();
  }

  query(model): Observable<any> {    
    return this.http
      .post<any>('http://pcoliva.uniurb.it/api/submissions/query', model, httpOptions ).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        catchError(this.handleError('query'))
      );
  }

  constructor(private http: HttpClient, public messageService: MessageService ) { }

  getSubmissionById(id: number): Observable<any> {
    return this.http
      .get('http://pcoliva.uniurb.it/api/submissions', {
        params: new HttpParams().set('id', id.toString())
      }).pipe(
        tap(sub => {
          if (sub)
            this.messageService.info('Lettura effettuata con successo')
          else 
            this.messageService.info('Domanda non trovata')
        }),
        catchError(this.handleError('getuser'))
      );
    }
  
 
  
  getSumbissions(): Observable<any> {
    return this.http
      .get('http://pcoliva.uniurb.it/api/submissions', httpOptions);
  }

  //per debug
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

  getSubmissionByUserId(userId: number): Observable<Submission> {

    if (userId>0){
    let res = this.http
      .get<Submission>('http://pcoliva.uniurb.it/api/submissions', {
        params: new HttpParams().set('userId', userId.toString())
      }).pipe(
        tap(sub => this.messageService.info('Lettura domanda effetuata con successo')),
        catchError(this.handleError('getSubmissionByUserId', null))
      );

    return res;
    }
  }



  updateSubmission(submission: Submission, id: number): any {
    if (id){
      //aggiorna la submission esiste PUT
      const url = `${'http://pcoliva.uniurb.it/api/submissions'}/${id}`;
      let res = this.http.put<Submission>(url, submission, httpOptions)
        .pipe(
          tap(sub => this.messageService.info('Aggiornamento effettuato con successo')),
          catchError(this.handleError('updateSubmission', submission))
        );
      return res;
    }else{
      //crea una nuova submission POST
      const url = `${'http://pcoliva.uniurb.it/api/submissions'}`;
      let res = this.http.post<Submission>(url, submission, httpOptions)
        .pipe(
          tap(sub => this.messageService.info('Creazione effettuata con successo')),
          catchError(this.handleError('updateSubmission', submission))
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
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.error(`${operation} failed: ${error.message} details: ${error.error.message}`  );

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  

  
}
