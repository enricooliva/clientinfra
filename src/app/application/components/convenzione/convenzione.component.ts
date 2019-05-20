
import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild, Sanitizer } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { ApplicationService } from '../../application.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Convenzione } from '../../convenzione';
import { Subject, of, onErrorResumeNext } from 'rxjs';
import { encode, decode } from 'base64-arraybuffer';
import { takeUntil, startWith, tap, distinctUntilChanged, filter, map, finalize } from 'rxjs/operators';
import { UploadfileComponent } from './uploadfile.component';
import { NgbModal, NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-convenzione',
  templateUrl: './convenzione.component.html',
})

export class ConvenzioneComponent implements OnInit, OnDestroy {

  // 'descrizione_titolo',
  // 'dipartimemto_cd_dip',
  // 'resp_scientifico',
  // 'ambito',
  // 'durata',
  // 'prestazioni','corrispettivo','azienda_id_esterno','importo','stato_avanzamento','tipopagamenti_codice','path_convenzione',

  @ViewChild('tabs')
  private tabs: NgbTabset;

  onDestroy$ = new Subject<void>();
  form = new FormArray([0, 1, 2, 3, 4].map(() => new FormGroup({})));

  model: Convenzione;
  modelUserTaskDetail: any;

  transitions = new Subject<any>();

  //caricati dal service
  fields: FormlyFieldConfig[] = [
    {
      key: 'id',
      type: 'input',       
      className: 'col-md-4', 
      templateOptions: {
        label: 'Codice convenzione',
        disabled: true
      },
      hideExpression(model,formState){
        return !model.id;
      }
    },
    {
      className: 'section-label',
      template: '<h5>Fase processo</h5>',
    },
    {
      type: 'select',
      key: 'transition',
      defaultValue: 'self_transition',
      templateOptions: {
        label: 'Stato',
        options: [],
      },
      // expressionProperties: {
      //   'templateOptions.disabled': (model: any, formState: any) => {                        
      //       return !model.id
      //   },
      // },
      lifecycle: {
        onInit: (form, field) => {
          this.transitions.subscribe(d => {
            field.templateOptions.options = d;
            field.templateOptions.disabled = false;
            field.formControl.setValue('self_transition');
          }
          );
        }
      }

    },
  ];
  fieldsattachment: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Lista allegati</h5>',
    },
    {
      type: 'button',
      templateOptions: {
        text: 'Nuovo',
        btnType: 'btn btn-outline-primary btn-sm border-0 rounded-0',
        icon: 'oi oi-document',
        onClick: ($event) => this.open()
      },
    },
    {
      key: 'attachments',
      type: 'repeat',
      templateOptions: {
        btnHidden: true,
        label: 'Gestione allegati',
        onRemove: (id) => {
          this.isLoading = true;
          return this.service.deleteFile(id).pipe(
            finalize(() => {
              this.tabs.select('tab-selectbyconvenzione');
              this.isLoading = false;
              //this.tabs.select('tab-selectbyallegati');
            }
            ))
        },
        //(index, callback, context) => this.onRemoveFile(index, callback, context),
        //onAddInitialModel: (event) => this.onAddInitialModel(event),
      },
      hideExpression: (model: any, formState: any) => {
        return this.model.attachments == null || this.model.attachments.length == 0
      },
      fieldArray: {
        template: '<hr />',       
        fieldGroup: [
          //nome allegato, tipo allegato, data ora creazione
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                className: 'col-md-1',
                type: 'input',
                key: 'id',
                hide: true,
                templateOptions: {
                  label: "Id",
                  hidden: true,
                  disabled: true,
                },
              },
              {
                className: 'col-md-3',
                type: 'input',
                key: 'filename',
                templateOptions: {
                  label: "Nome dell'allegato",
                  disabled: true,
                },
              },
              {
                type: 'input',
                key: 'attachmenttype.descrizione',
                className: 'col-md-3',
                templateOptions: {
                  label: 'Tipologia',
                  disabled: true,
                },
              },
              {
                type: 'input',
                key: 'created_at',
                className: 'col-md-3',
                templateOptions: {
                  label: 'Data e ora di creazione',
                  disabled: true,
                },
              },
              {
                type: 'button',
                className: "col-md-2 d-flex align-items-start mt-4 pt-2",
                templateOptions: {
                  btnType: 'primary oi oi-data-transfer-download',
                  //icon: 'oi oi-data-transfer-download'
                  onClick: ($event, model) => this.download($event, model),
                },
                expressionProperties: {
                  'templateOptions.disabled': (model: any, formState: any) => {                        
                    return model.filetype == 'link';
                  },
                }
              },
            ],
          },
          //numero protocolollo e data protocollo
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                className: 'col-md-3',
                type: 'input',
                key: 'num_prot',
                templateOptions: {
                  label: "Numero protocollo",
                  disabled: true,
                },
                hideExpression(model,formState){
                  return !model.num_prot;
                }
              },
              {
                className: 'col-md-3',
                type: 'input',
                key: 'emission_date',
                templateOptions: {
                  label: "Data protocollo",
                  disabled: true,
                },
                hideExpression(model,formState){
                  return !model.emission_date;
                }
              },
              {
                className: 'col-md-3',
                type: 'input',
                key: 'num_rep',
                templateOptions: {
                  label: "Numero repertorio",
                  disabled: true,
                },
                hideExpression(model,formState){
                  return !model.num_rep;
                }
              },
            ]
          }
        ],
      }
    }
  ]
  fieldsusertask: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Attività associate</h5>',
    },
    {
      key: 'usertasks',
      type: 'datatable', //'repeat',      
      templateOptions: {
        btnHidden: true,
        label: 'Attività associate',
        hidetoolbar: true,
        limit: "20",
        onDblclickRow: (event) => {
          //leggi dettagli 
          //crea la form
          if (event.row.id) {
            this.router.navigate(['home/tasks/', event.row.id]);
          }
        },
        columns: [
          { name: 'Oggetto', prop: 'subject', wrapper: 'value' },
          { name: 'Stato', prop: 'state', wrapper: 'value' },
          { name: 'Ufficio', prop: 'unitaorganizzativa_uo', wrapper: 'value' },
        ],
      },
      fieldArray: {
        template: '<hr />',
        fieldGroupClassName: 'row',
        fieldGroup: [{
          className: 'col-md-3',
          type: 'input',
          key: 'subject',
          templateOptions: {
            disabled: true,
          },
        },
        {
          className: 'col-md-3',
          type: 'input',
          key: 'state',
          templateOptions: {
            disabled: true,
          },
        },
        {
          className: 'col-md-3',
          type: 'input',
          key: 'unitaorganizzativa_uo',
          templateOptions: {
            label: "Ufficio",
            disabled: true,
          },
        },
        ]
      }
    }

  ];
  fieldstask: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Storia eventi</h5>',
    },
    {
      key: 'logtransitions',
      type: 'datatable', //'repeat',      
      templateOptions: {
        btnHidden: true,
        label: 'Storia eventi',
        hidetoolbar: true,
        limit: "20",
        columns: [
          { name: 'Utente', prop: 'user_id', wrapper: 'value' },
          { name: 'Transizione', prop: 'transition_leave', wrapper: 'value' },
          { name: 'Creata', prop: 'created_at', wrapper: 'value' },
        ],
      },
      fieldArray: {
        template: '<hr />',
        fieldGroupClassName: 'row',
        fieldGroup: [{
          className: 'col-md-3',
          type: 'input',
          key: 'user_id',
          templateOptions: {
            disabled: true,
          },
        },
        {
          className: 'col-md-3',
          type: 'input',
          key: 'transition_leave',
          templateOptions: {
            disabled: true,
          },
        },
        {
          className: 'col-md-3',
          type: 'input',
          key: 'created_at',
          templateOptions: {
            label: "Assegnata",
            disabled: true,
          },
        },
        ]
      }
    }

  ];
  fieldscadenze: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Scadenze</h5>',
    },
    {
      type: 'button',
      templateOptions: {
        text: 'Nuova',
        btnType: 'btn btn-outline-primary btn-sm border-0 rounded-0',
        icon: 'oi oi-document',
        onClick: ($event) => {
          this.router.navigate(['home/scadenze/new'], {
            queryParams: {
              returnUrl: this.router.url,
              initObj: JSON.stringify({ convenzione: { id: this.model.id, descrizione_titolo: this.model.descrizione_titolo } })
            }
          });
        }
      },
    },
    {
      key: 'scadenze',
      type: 'datatable', //'repeat',      
      templateOptions: {
        btnHidden: true,
        label: 'Scadenze',
        hidetoolbar: true,
        limit: "20",
        columns: [
          { name: 'Id', prop: 'id', wrapper: 'value' },
          { name: 'Tranche prevista', prop: 'data_tranche', wrapper: 'value' },
          { name: 'Importo', prop: 'dovuto_tranche', wrapper: 'value' },
          { name: 'Stato', prop: 'state', wrapper: 'value' },
          //{ name: 'Azione', prop: 'action_button' },
        ],
        onDblclickRow: (event) => {
          //leggi dettagli 
          //crea la form
          if (event.row.id) {
            this.router.navigate(['home/scadenze', event.row.id], {
              queryParams: {
                returnUrl: this.router.url,
              }
            });
          }
        },
      },
      fieldArray: {
        fieldGroup: [
          {
            type: 'button',
            key: 'action_button',
            templateOptions: {
              btnType: 'primary oi oi-data-transfer-download',
              onClick: ($event) => this.open()
            },
          },
        ]
      }
    }

  ];

  options: Array<FormlyFormOptions> = [0, 1, 2, 3, 4].map(() => ({
    formState: {
      isLoading: false,
    },
  }));

  // options: FormlyFormOptions = {
  //   formState: {
  //     isLoading: false,
  //   },
  // }

  private id: number;

  defaultColDef = { editable: true };

  private _isLoading: boolean = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
    //this.options.formState.isLoading = value;
    this.options.forEach(tabOptions => tabOptions.formState.isLoading = value);
  }

  constructor(private service: ApplicationService, private route: ActivatedRoute, protected router: Router, private modalService: NgbModal, public activeModal: NgbActiveModal) {

    //modello vuoto
    this.model = {
      transition: 'self_transition',
      schematipotipo: 'schematipo',
      user_id: null,
      id: null,
      descrizione_titolo: '',
      dipartimemto_cd_dip: '',
      nominativo_docente: '',
      emittente: '',
      user: { id: null, name: null },
      dipartimento: { cd_dip: null, nome_breve: '' },
      stato_avanzamento: null,
      convenzione_type: 'TO',
      tipopagamento: { codice: null, descrizione: '' },
      azienda: { id: null, denominazione: '' },
      unitaorganizzativa_uo: '',
      aziende: [],
    }

    this.fields = this.fields.concat(service.getInformazioniDescrittiveFields(this.model)); //.concat(service.getConvenzioneFields(this.model));
  }

  get isNew(): boolean {
    return this.model == null || this.model.id == null
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.onDestroy$)).subscribe(params => {
      if (params['id']) {
        this.isLoading = true;
        this.service.clearMessage();
        this.service.getConvenzioneById(params['id']).subscribe((data) => {
          try {
            if (!data.azienda) {
              data.azienda = { id: null, denominazione: '' };
            }

            this.updateTransition(data.id);

            //this.options.every(tabOptions => { if (tabOptions.resetModel) return false; else return true; } )

            //Nota viene creata solo l'option del ng-tab attivo. Evito di fare il ciclo sulle tab.
            if (this.options[0].resetModel) {
              //la resetmodel imposta tutti i valori del modello.
              this.options[0].resetModel(data)
            } else {
              this.model = data;
            }


            this.isLoading = false;
          } catch (e) {
            console.log(e);
            this.isLoading = false;
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onNew() {
    this.form.reset();
    //this.model = null;
  }

  onReload() {
    //sono nello stato nuovo
    if (this.model != null && this.model.id !== null) {
      this.isLoading = true;
      this.service.getConvenzioneById(this.model.id).subscribe((data) => {
        //this.options.resetModel(data);
        if (!data.azienda) {
          data.azienda = { id: null, descrizione: null };
        }
        this.options.forEach(tabOptions => tabOptions.resetModel(data));
        this.isLoading = false;
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      this.service.update(tosubmit, tosubmit.id).subscribe(
        result => {
          //this.options.resetModel(result);
          try {
            if (!result.azienda) {
              result.azienda = { id: null, descrizione: null };
            }

            this.options.forEach(tabOptions => { if (tabOptions.resetModel) tabOptions.resetModel(result) });
            this.updateTransition(result.id);

            this.isLoading = false;
          } catch (error) {
            this.onError(error);
          }
        },
        error => this.onError(error),
      );
    }
  }

  protected updateTransition(id) {
    //caricamento transisioni successive
    this.service.getNextActions(id).subscribe((data) => {
      this.transitions.next([]);
      this.transitions.next(data);
    });
  }

  private onError(error) {
    this.isLoading = false;
    this.service.messageService.error(error);
    console.log(error)
  }

  onGenerate() {
    if (this.form.valid) {
      this.service.generatePDF(this.model.id);
    }
  }


  private temp = [];
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.role.toLowerCase().indexOf(val) !== -1 || !val;
    });

  }

  open() {
    const modalRef = this.modalService.open(UploadfileComponent, {
      size: 'lg'
    })
    modalRef.result.then((result) => {
      if (result) {
        this.model = {
          ...this.model,
          attachments: this.model.attachments.concat(result),
        }
      }
    }, (reason) => {
    });
    modalRef.componentInstance.model_id = this.model.id;
  }

  onRemoveFile(index: number, callback, context) {
    this.isLoading = true;
    let id = context.formControl.at(index).get('id');
    this.service.deleteFile(id.value).subscribe(
      result => {
        callback(index, context); this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  download(event, model) {
    //console.log(model);
    this.service.download(model.id).subscribe(file => {
      if (file.filevalue)
        var blob = new Blob([decode(file.filevalue)]);
      saveAs(blob, file.filename);
    },
      e => { console.log(e); }
    );

  }

  // public innerHtml: SafeHtml;
  // public setInnerHtml(pdfurl: string) {
  //   this.innerHtml = this._sanitizer.bypassSecurityTrustHtml(
  //     "<object data='" + pdfurl + "' type='application/pdf' class='embed-responsive-item'>" +
  //     "Object " + pdfurl + " failed" +
  //     "</object>");
  // }

}
