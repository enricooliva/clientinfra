import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, startWith, takeUntil, publishReplay, refCount } from 'rxjs/operators';
import { MessageService, ServiceQuery, ServiceEntity } from '../shared';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Convenzione, FileAttachment } from './convenzione';
import { saveAs } from 'file-saver';
import { Cacheable } from 'ngx-cacheable';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class ApplicationService implements ServiceQuery, ServiceEntity {


  _baseURL: string;

  constructor(private http: HttpClient, public messageService: MessageService, public confirmationDialogService: ConfirmationDialogService) {
    this._baseURL = AppConstants.baseApiURL;
  }

  getInformazioniDescrittiveFields(comp: Convenzione): any[] {
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
          entityPath: 'home/users',
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
              options:[],
              valueProp: 'cd_dip',
              labelProp: 'nome_breve',
              label: 'Dipartimento',
              required: true,
              inizialization: () => {
                return comp.dipartimento
              },
              populateAsync: () => {
                return this.getDipartimenti();
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
            expressionProperties: {
              'templateOptions.disabled': 'model.convenzione_type == "TG"',
            },
            // hideExpression: (model: any, formState: any) => {
            //   return formState.model.convenzione_type == 'TG';
            // }
          },
          {
            key: 'corrispettivo',
            type: 'number',
            className: "col-md-4",
            templateOptions: {
              label: 'Corrispettivo iva esclusa se applicabile',
              required: true,
            },
            expressionProperties: {
              'templateOptions.disabled': 'model.convenzione_type == "TG"',
            },
            // hideExpression: (model: any, formState: any) => {
            //   return formState.model.convenzione_type == 'TG';
            // }
          },
        ]
      },
      {
        className: 'section-label',
        template: '<h5>Aziende</h5>',
      },
      {
        key: 'aziende',
        type: 'repeat',
        templateOptions: {
          min: 1,
          //label: 'Aziende',
        },                 
        fieldArray: {
          fieldGroupClassName: 'row',
          fieldGroup:  [      
          {
            //key: 'azienda',
            type: 'externalobject',
            className: "col-md-12",
            defaultValue: { id: null, denominazione: '' },
            templateOptions: {             
              label: 'Azienda',
              type: 'string',
              entityName: 'aziendaLoc',
              entityLabel: 'Aziende',
              entityPath: 'home/aziendeloc',
              codeProp: 'id',
              enableNew: true,
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
        ],
        },
      },
      {
        className: 'section-label',
        template: '<h5>Fascicolo</h5>',
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'titolario_classificazione',
            type: 'select',
            className: "col-md-4",            
            templateOptions: {
              options: this.getClassificazioni(),
              // [
              //   { label: 'III/13 - Progetti e finanziamenti', value: '03/13' },
              //   { label: 'III/14 - Accordi per la didattica e per la ricerca', value: '03/14' },
              //   { label: 'III/19 - Attività per conto terzi', value: '03/19' },
              // ],
              labelProp: 'descrizione',
              valueProp: 'codice',
              label: 'Classificazione',
              required: true,
            },
            expressionProperties: {
              'templateOptions.disabled': (model: any, formState: any) => {                        
                  return model.id;
              },
            },
          },
          {
            key: 'oggetto_fascicolo',
            type: 'string',
            className: "col-md-8",
            templateOptions: {
              label: 'Oggetto del fascicolo',
              required: true,
            },
            expressionProperties: {
              'templateOptions.disabled': (model: any, formState: any) => {                        
                  return model.id;
              },
            },            
          },
        ],
          
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'numero',
            type: 'string',            
            className: "col-md-6",                   
            templateOptions: {              
              label: 'Numero protocollo',              
              disabled: true,     
            },
            hideExpression: (model: any, formState: any) => {
              return !model.id;
            }            
          }
        ]
      }      
      // {
      // fieldGroupClassName: 'row',
      //   fieldGroup: [          
      //     {
      //       key: 'rpa',
      //       type: 'typeahead',           
      //       className: "col-md-12",
      //       templateOptions: {
      //         label: 'RPA',
      //         placeholder: 'Ricerca del personale interno per nome e/o cognome',
      //         field: 'persint_nomcogn',
      //         entityName: 'personainterna',
      //       }
      //     },
      // ]},
      // {
      //   fieldGroupClassName: 'row',
      //   fieldGroup: [
      //     {
      //       key: 'rpa',
      //       type: 'externalobject',
      //       className: "col-md-12",
      //       defaultValue: { },
      //       templateOptions: {
      //         label: 'RPA',
      //         type: 'string',
      //         entityName: 'personainterna',
      //         entityLabel: 'Persona interna',
      //         codeProp: 'matricola',              
      //         descriptionFunc: (data) => {
      //           return data['nome'] + ' ' + data['cognome'];
      //         },
      //       },                        
      //     },
      //   ]
      // }
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
          codeProp: 'id',
          descriptionProp: 'denominazione',
        },
      },
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
        key: 'current_place',
        type: 'select',
        className: "col-md-6",
        templateOptions: {
          options: [
            { value: 'proposta', label: 'Proposta' }, 
            { value: 'approvato', label: 'Approvato' }, 
            { value: 'inapprovazione', label: 'In approvazione' },            
            { value: 'da_firmare_direttore2', label: 'Da controfirmare direttore' },
            { value: 'da_firmare_cotroparte2', label: 'Da controfirmare controparte' },            
          ],
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

  createSchemaTipo(convenzione: Convenzione, retrow: boolean = false): any {
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

  store(convenzione: any, retrow: boolean): Observable<any> {
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
 
  remove(id: any): Observable<any> {
    throw new Error("Method not implemented.");
  }

  update(convenzione: Convenzione, id: number, retrow: boolean = false): any {
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
      return this.store(convenzione, retrow);
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

  validationStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/validationstep'}`;
    let res = this.http.post<FileAttachment>(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Validazione effettuata con successo')
        ),
        catchError(this.handleError('validationStep', null, retrow))
      );
    return res;
  }

  
  sottoscrizioneStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/sottoscrizionestep'}`;
    let res = this.http.post(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Sottoscrizione effettuata con successo')
        ),
        catchError(this.handleError('sottoscrizioneStep', null, retrow))
      );
    return res;
  }

  complSottoscrizioneStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/complsottoscrizionestep'}`;
    let res = this.http.post(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Completamento sottoscrizione effettuata con successo')
        ),
        catchError(this.handleError('complSottoscrizioneStep', null, retrow))
      );
    return res;
  }

  bolloRepertoriazioneStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/bollorepertoriazionestep'}`;
    let res = this.http.post(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Repertoriazione sottoscrizione effettuata con successo')
        ),
        catchError(this.handleError('bolloRepertoriazioneStep', null, retrow))
      );
    return res;
  }


  richiestaEmissioneStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/richiestaemissionestep'}`;
    let res = this.http.post(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Richiesta emissione effettuata con successo')
        ),
        catchError(this.handleError('richiestaEmissioneStep', null, retrow))
      );
    return res;
  }

  invioRichiestaPagamentoStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/inviorichiestapagamentostep'}`;
    let res = this.http.post(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Richiesta di pagamento effettuata con successo')
        ),
        catchError(this.handleError('invioRichiestaPagamentoStep', null, retrow))
      );
    return res;
  }
  

  emissioneStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/emissionestep'}`;
    let res = this.http.post(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Emissione effettuata con successo')
        ),
        catchError(this.handleError('emissioneStep', null, retrow))
      );
    return res;
  }

  pagamentoStep(data: any, retrow: boolean = false): Observable<any>{
    const url = `${this._baseURL + '/convenzioni/pagamentostep'}`;
    let res = this.http.post(url, data, httpOptions)
      .pipe(
        tap(sub =>
          this.messageService.info('Registrazione effettuata con successo')
        ),
        catchError(this.handleError('pagamentostep', null, retrow))
      );
    return res;
  }
  
  //@Cacheable()
  getNextActions(id): Observable<any> {
    const url = `${this._baseURL}/convenzioni/${id}/actions`
    return this.http.get(url, httpOptions);
  }

  @Cacheable()
  getDipartimenti(): Observable<any> {
    return this.http.get<any>(this._baseURL + '/dipartimenti', httpOptions).pipe(      
        map(x => {
         return x.map(el => {return { cd_dip: parseInt(el.cd_dip), nome_breve: el.nome_breve }})
        }
      )
    );          
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
  getClassificazioni(): Observable<any> {
    return this.http.get(this._baseURL + '/convenzioni/classificazioni', httpOptions);
  }

  @Cacheable()
  getValidationOffices(): Observable<any> {
    return this.http.get(this._baseURL + '/convenzioni/uffici/'+'validazione', httpOptions);
  }

  @Cacheable()
  getUfficiFiscali(): Observable<any> {
    return this.http.get(this._baseURL + '/convenzioni/uffici/'+'inemissione', httpOptions);
  }

  @Cacheable()
  getPersonaleUfficio(id): Observable<any> {
    if (id) {
      return this.http.get(this._baseURL + '/convenzioni/personaleufficio/' + id.toString(), httpOptions);
    }
    return of([]);
  }

  static isResponsabileUfficio(posizorg: string): boolean {
    return posizorg == 'RESP_UFF' || posizorg == 'COOR_PRO_D' || posizorg == 'VIC_RES_PL' || posizorg =='RESP_PLESSO' || posizorg == 'DIRIGENTE';
  }


  @Cacheable()
  getAziende(id): Observable<any> {
    if (id) {
      return this.http.get(this._baseURL + '/convenzioni/'+ id.toString() +'/aziende/', httpOptions);
    }
    return of([]);
  }

  @Cacheable()
  getMinimal(id): Observable<any> {
    if (id) {
      return this.http.get(this._baseURL + '/convenzioni/getminimal/'+ id.toString(), httpOptions);
    }
    return of([]);
  }


  download(id): Observable<any>{
    if (id) {
      return this.http.get(this._baseURL + '/attachments/download/' + id.toString(), httpOptions);
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
  protected handleError<T>(operation = 'operation', result?: T, retrow: boolean = false) {
    return (error: any): Observable<T> => {
      
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.messageService.error(`L'operazione di ${operation} è terminata con errori: ${error.message}`, true, false, error);
      // Let the app keep running by returning an empty result.
      if (!retrow)
        return of(result as T);
      else 
        return throwError(error);
    };
  }

  data:any;
  getRichiestaEmissioneData(){ 
     return this.data; 
  } 
  setRichiestaEmissioneData(data:any){
      this.data = data;
  }
  


}
