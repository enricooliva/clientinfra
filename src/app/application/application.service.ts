import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, startWith, takeUntil, publishReplay, refCount } from 'rxjs/operators';
import { MessageService, ServiceQuery } from '../shared';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Convenzione, FileAttachment } from './convenzione';
import { saveAs } from 'file-saver';
import { Cacheable } from 'ngx-cacheable';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ApplicationService implements ServiceQuery {

  _baseURL: string;

  constructor(private http: HttpClient, public messageService: MessageService) {
    this._baseURL = AppConstants.baseApiURL;
  }


  getInformazioniDescrittiveFields(comp: Convenzione): FormlyFieldConfig[] {
    return [
      {
        className: 'section-label',
        template: '<h5>Dati compilatore</h5>',
      },
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
        key: 'user',
        type: 'externalobject',
        templateOptions: {
          label: 'Utente',
          type: 'string',
          entityName: 'user',
          entityLabel: 'Utenti',
          codeProp: 'id',
          descriptionProp: 'name',
          isLoading: false,
        },
      },
      {
        className: 'section-label',
        template: '<h5>Intestazione</h5>',
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'descrizione_titolo',
            type: 'input',
            className: "col-12",
            templateOptions: {
              label: 'Descrizione Titolo',
              required: true,
            }
          }]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'dipartimemto_cd_dip',
            type: 'selectinfra',
            className: "col-md-6",
            templateOptions: {
              options: [],
              valueProp: 'cd_dip',
              labelProp: 'nome_breve',
              label: 'Dipartimento',
              required: true,
              inizialization: () => {
                return comp.dipartimento
              },
              populateAsync: () => {
                return this.getDipartimenti()
              }
            }
          },
          {
            key: 'resp_scientifico',
            type: 'input',
            className: "col-md-6",
            templateOptions: {
              label: 'Responsabile scientifico',
              required: true
            },
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'azienda',
            type: 'externalobject',
            className: "col-md-12",
            defaultValue: { id_esterno:null, denominazione:''},
            templateOptions: {
              label: 'Azienda',
              type: 'string',
              entityName: 'azienda',
              entityLabel: 'Aziende',
              codeProp: 'id_esterno',
              //required: true,
              descriptionProp: 'denominazione',              
            },
            // validation: {
            //   show: true,
            // },
            // expressionProperties: {
            //   'templateOptions.required': (model: any, formState: any) => model.convenzione_type == 'TO',
            // },                   
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'ambito',
            type: 'select',
            className: "col-md-6",
            defaultValue: 'istituzionale',
            templateOptions: {
              options: [
                { label: 'Istituzionale', value: 'istituzionale' },
                { label: 'Commerciale', value: 'commerciale' },
              ],
              label: 'Ambito',
              required: true,
            },
          },
          {
            key: 'durata',
            type: 'number',
            className: "col-md-6",
            templateOptions: {
              label: 'Durata in mesi',
              required: true,
            },
          },       
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'convenzione_type',
            type: 'select',
            className: "col-md-4",
            defaultValue: 'TO',
            templateOptions: {
              options: [
                { label: 'Titolo oneroso', value: 'TO' },
                { label: 'Titolo gratuito', value: 'TG' },
              ],
              label: 'Tipo convenzione',
              required: true,
            },
          },
          {
            key: 'tipopagamenti_codice',
            type: 'select',
            className: "col-md-4",
            templateOptions: {
              options: this.getPagamenti(),
              valueProp: 'codice',
              labelProp: 'descrizione',
              label: 'Modalità di pagamento',
              required: true,
              inizialization: () => {
                return comp.tipopagamento
              },
              populateAsync: () => {
                return this.getPagamenti()
              }
            },
            hideExpression: (model: any) => model.convenzione_type == 'TG',
          },
          {
            key: 'corrispettivo',
            type: 'number',
            className: "col-md-4",
            templateOptions: {
              label: 'Corrispettivo iva esclusa se applicabile',
              required: true,
            },
            hideExpression: (model: any) => model.convenzione_type == 'TG',
          },        
        ]
      },
    ];
  }

  //obsoleta
  // getConvenzioneFields(comp: Convenzione): FormlyFieldConfig[] {
  //   return [
  //     {
  //       fieldGroupClassName: 'row',
  //       fieldGroup: [
  //         {
  //           key: 'convenzione_pdf',
  //           type: 'pdfviewerinput',
  //           className: "col-md-12",
  //           templateOptions: {
  //             label: 'Seleziona convenzione',              
  //             filevalue: 'filevalue',
  //             filename: 'filename'
  //           },
  //         }
  //       ]
  //     },
  //   ];
  // }

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
        key: 'resp_scientifico',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Responsabile scientifico',
          required: true
        }
      },
      {
        key: 'azienda',
        type: 'external',
        className: "col-md-6",
        templateOptions: {
          label: 'Azienda',
          type: 'string',
          entityName: 'azienda',
          entityLabel: 'Aziende',
          codeProp: 'id_esterno',
          descriptionProp: 'denominazione',
        },
      },
      {
        key: 'tipopagamento_codice',
        type: 'select',
        className: "col-md-6",
        templateOptions: {
          options: this.getPagamenti(),
          valueProp: 'codice',
          labelProp: 'descrizione',
          label: 'Pagamento',
          required: true
        }
      },
      {
        key: 'ambito',
        type: 'select',
        className: "col-md-4",
        templateOptions: {
          options: [
            { label: 'Istituzionale', value: 'instituzionale' },
            { label: 'Commerciale', value: 'commercicale' },
          ],
          label: 'Ambito',
          required: true,
        },
      },
      {
        key: 'tipopagamenti_codice',
        type: 'select',
        className: "col-md-4",
        templateOptions: {
          options: this.getPagamenti(),
          valueProp: 'codice',
          labelProp: 'descrizione',
          label: 'Modalità di pagamento',
          required: true
        }
      },
      {
        key: 'corrispettivo',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Corrispettivo iva esclusa se applicabile',
          required: true,
        },
      },
      {
        key: 'importo',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Importo iva esclusa ove applicabile',
          required: true,
        },
      },
      {
        key: 'current_place',
        type: 'select',
        className: "col-md-6",
        templateOptions: {
          options: [{value:'proposta', label:'Proposta'},{value:'approvato', label:'Approvato'}, {value:'inapprovazione', label:'In approvazione'}],
          label: 'Stato',
          required: true,
        },
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


  getConvenzioneById(id: number): Observable<any> {
    return this.http
      .get<Convenzione>(this._baseURL + '/convenzioni/' + id.toString()).pipe(
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

  createSchemaTipo(convenzione:Convenzione, retrow: boolean = false):any{
      //crea una nuova Convenzione POST      
      const url = `${this._baseURL + '/convenzioni/createschematipo'}`;
      let res = this.http.post<Convenzione>(url, convenzione, httpOptions)
        .pipe(
          tap(sub =>
            this.messageService.info('Creazione effettuata con successo')
          ),
          catchError(this.handleError('createSchemaTipo', convenzione, retrow))
        );
      return res;
  }


  updateConvenzione(convenzione: Convenzione, id: number, retrow: boolean = false): any {
    if (id) {
      //aggiorna la Convenzione esiste PUT
      const url = `${this._baseURL + '/convenzioni'}/${id}`;
      let res = this.http.put<Convenzione>(url, convenzione, httpOptions)
        .pipe(
          tap(sub => {
            this.messageService.info('Aggiornamento effettuato con successo');
            return sub;
          }),                    
          catchError(this.handleError('updateConvenzione', convenzione, retrow))
        );
      return res;
    } else {
      //crea una nuova Convenzione POST
      convenzione.stato_avanzamento = 'incomp';
      const url = `${this._baseURL + '/convenzioni'}`;
      let res = this.http.post<Convenzione>(url, convenzione, httpOptions)
        .pipe(
          tap(sub =>
            this.messageService.info('Creazione effettuata con successo')
          ),
          catchError(this.handleError('updateConvenzione', convenzione, retrow))
        );
      return res;
    }
  }

  uploadFile(file: FileAttachment): Observable<FileAttachment> {
    const url = `${this._baseURL + '/convenzioni/uploadFile'}`;
      let res = this.http.post<FileAttachment>(url, file, httpOptions)
        .pipe(
          tap(sub =>
            this.messageService.info('Creazione effettuata con successo')
          ),          
          catchError(this.handleError('caricamento documento', null))
        );
      return res;
  }

  deleteFile(id: number): Observable<any> {
      const url = `${this._baseURL + '/convenzioni/uploadFile/'}${id}`;    
      let res = this.http.delete<any>(url, httpOptions)
        .pipe(
          tap(sub =>
            this.messageService.info('Eliminazione documento effettuata con successo')
          ),
          catchError(this.handleError('cancellazione documento', null))
        );
      return res;
  }
    

  @Cacheable()
  getDipartimenti(): Observable<any> {    
    return this.http.get(this._baseURL + '/dipartimenti', httpOptions);
  }

  @Cacheable()
  getDirettoreDipartimento(codiceDip): Observable<any> {
    return this.http.get(this._baseURL + '/dipartimenti/direttore/' + codiceDip.toString(), httpOptions);
  }

  @Cacheable()
  getPagamenti(): Observable<any> {
    return this.http.get(this._baseURL + '/convenzioni/pagamenti', httpOptions);
  }

  @Cacheable()
  getAttachemntTypes(): Observable<any> {
    return this.http.get(this._baseURL + '/convenzioni/attachmenttypes/', httpOptions);
  }
  
  @Cacheable()
  getValidationOffices(): Observable<any> {
    return this.http.get(this._baseURL + '/convenzioni/validationoffices/', httpOptions);
  }

  @Cacheable()
  getValidationOfficesPersonale(id): Observable<any> {
    if (id){
      return this.http.get(this._baseURL + '/convenzioni/validationoffices/' + id.toString(), httpOptions);
    } 
    return of([]);
  }


  generatePDF(id: number) {
    this.http.get(this._baseURL + '/convenzioni/generapdf/' + id.toString(), { responseType: 'blob' }).subscribe(
      (response) => {
        var blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, 'convenzionePreview.pdf');
      },
      e => { console.log(e); }
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
