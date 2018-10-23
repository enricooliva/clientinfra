import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, startWith, takeUntil  } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';
import { InfraMessageType } from '../shared/message/message';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Convenzione } from './convenzione';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ApplicationService implements ServiceQuery {

  _baseURL: string;

  getById(id: any): Observable<any> {
    return this.getConvenzioneById(id);
  }

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'id',
        type: 'input',
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
          entityLabel: 'Utenti',
          codeProp: 'id',
          descriptionProp: 'name',
        },
        modelOptions: {
          updateOn: 'blur',
        }, //necessario per il corretto evento di decodifica non sono riuscito a spostarlo nel template???

        //richiesta impostazione dall'interno del custom template external
        //al impostandolo dall'interno del template è troppo tardi perchè il componente è
        //già creato
      },


      {
        key: 'descrizione_titolo',
        type: 'input',
        className: "col-12",
        templateOptions: {
          label: 'Descrizione Titolo',
          required: true,
        },
      },      
      {
        key: 'dipartimemto_cd_dip',
        type: 'select',
        className: "col-md-6",
        templateOptions: {
          options: this.getDipartimenti(),
          valueProp: 'cd_dip',
          labelProp: 'nome_breve',
          label: 'Dipartimento',     
          required: true               
        },         
      },
      {
        key: 'nominativo_docente',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Nominativo docente',
          required: true
        }
      },
      {
        key: 'tipoemittenti_codice',
        type: 'select',
        className: "col-md-6",
        templateOptions: {
          options: this.getEmittenti(),
          valueProp: 'codice',
          labelProp: 'descrizione',
          label: 'Autorizzato da',     
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
      .post<any>(this._baseURL + '/convenzioni/query', model, httpOptions).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        catchError(this.handleError('query'))
      );
  }

  constructor(private http: HttpClient, public messageService: MessageService) {
    this._baseURL = AppConstants.baseApiURL;
  }

  getConvenzioneById(id: number): Observable<any> {
    return this.http
      .get(this._baseURL + '/convenzioni/'+id.toString()).pipe(
        tap(sub => {
          if (sub)
            this.messageService.info('Lettura effettuata con successo')
          else
            this.messageService.info('Domanda non trovata')
        }),
        catchError(this.handleError('getConvenzioneById'))
      );
  }



  getConvenzioni(): Observable<any> {
    return this.http
      .get(this._baseURL + '/convenzioni', httpOptions);
  }

  getConvenzioneByUserId(userId: number): Observable<Convenzione> {

    if (userId > 0) {
      let res = this.http
        .get<Convenzione>(this._baseURL + '/convenzioni', {
          params: new HttpParams().set('userId', userId.toString())
        }).pipe(
          tap(sub => this.messageService.info('Lettura domanda effetuata con successo')),
          catchError(this.handleError('getConvenzioneByUserId', null))
        );

      return res;
    }
  }



  updateConvenzione(convenzione: Convenzione, id: number): any {
    if (id) {
      //aggiorna la Convenzione esiste PUT
      const url = `${this._baseURL + '/convenzioni'}/${id}`;
      let res = this.http.put<Convenzione>(url, convenzione, httpOptions)
        .pipe(
          tap(sub => this.messageService.info('Aggiornamento effettuato con successo')),
          catchError(this.handleError('updateConvenzione', convenzione))
        );
      return res;
    } else {
      //crea una nuova Convenzione POST
      const url = `${this._baseURL + '/convenzioni'}`;
      let res = this.http.post<Convenzione>(url, convenzione, httpOptions)
        .pipe(
          tap(sub => this.messageService.info('Creazione effettuata con successo')),
          catchError(this.handleError('updateConvenzione', convenzione))
        );
      return res;
    }
  }


  getDipartimenti(): Observable<any> {        
    return this.http.get(this._baseURL + '/dipartimenti', httpOptions);
  }

  getDirettoreDipartimento(codiceDip): Observable<any> {
    return this.http.get(this._baseURL + '/dipartimenti/direttore/'+codiceDip.toString(), httpOptions);  
  }

  getEmittenti(): any {
    return this.http.get(this._baseURL + '/convenzioni/emittenti', httpOptions);    
  }

  generatePDF(id: number) {      
    this.http.get(this._baseURL + '/convenzioni/generapdf/'+id.toString(), { responseType: 'blob' }).subscribe(
      (response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, 'convenzionePreview.pdf');
    },
    e => {  console.log(e); }  
    );    
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
      this.messageService.error(`${operation} failed: ${error.message} details: ${error.error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }




}