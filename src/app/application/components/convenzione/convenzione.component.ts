
import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild, Sanitizer } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { ApplicationService } from '../../application.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { Convenzione } from '../../convenzione';
import { Subject, of } from 'rxjs';
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
  // 'prestazioni','corrispettivo','azienda_id_esterno','importo','stato_avanzamento','tipopagamenti_codice','path_convezione',

  @ViewChild('tabs')
  private tabs: NgbTabset;

  onDestroy$ = new Subject<void>();
  form = new FormGroup({});
  formattachment = new FormGroup({});
  formusertask = new FormGroup({});
  formtask = new FormGroup({});

  model: Convenzione;
  modelUserTaskDetail: any;

  fields: FormlyFieldConfig[];
  fieldsattachment: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Lista allegati</h5>',
    },
    {
      type: 'button',
      className: "col-md-4",
      templateOptions: {
        text: 'Inserisci allegato',
        btnType: 'primary',
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
        onSelected: (obj) => {
            //leggi dettagli 
            //crea la form
            if(obj.selected){
              this.modelUserTaskDetail = obj.selected[0];
            }
        },
        columns: [
          { name: 'Oggetto', prop: 'subject', wrapper: 'value' },
          { name: 'Stato', prop: 'state', wrapper: 'value' },
          { name: 'Assegnata', prop: 'email', wrapper: 'value' },
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
          key: 'email',
          templateOptions: {
            label: "Assegnata",
            disabled: true,
          },
        },
        ]
      }
    }

  ];

  fieldstask:FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Storia eventi</h5>',
    },
    {
      key: 'tasks',
      type: 'datatable', //'repeat',      
      templateOptions: {
        btnHidden: true,
        label: 'Storia eventi',
        hidetoolbar: true,
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

  options: FormlyFormOptions = {
    formState: {
      isLoading: false,
    },
  };

  private id: number;

  defaultColDef = { editable: true };

  private _isLoading: boolean = false;

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
    this.options.formState.isLoading = value;
  }

  constructor(private service: ApplicationService, private route: ActivatedRoute, private modalService: NgbModal, public activeModal: NgbActiveModal) {

    //modello vuoto
    this.model = {
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
      tipopagamento: { codice: null, descrizione: '' },
      azienda: { id_esterno: null, denominazione: '' },
      convenzione_pdf: { filename: '', filetype: '', filevalue: null },
      nome_originale_file_convenzione: '',
      unitaorganizzativa_uo: '',
    }

    this.fields = service.getInformazioniDescrittiveFields(this.model).concat(service.getConvenzioneFields(this.model));    
  }

  get isNew(): boolean {
    return this.model == null || this.model.id == null
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isLoading = true;
        this.service.clearMessage();
        this.service.getConvenzioneById(params['id']).subscribe((data) => {
          try {            
            if (!data.azienda)
              data.azienda = { id_esterno: null, denominazione: '' };

            this.options.resetModel(data);
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
        this.options.resetModel(data);
        this.isLoading = false;
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      this.service.updateConvenzione(tosubmit, tosubmit.id).subscribe(
        result => {       
          this.options.resetModel(result);
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.service.messageService.error(error);
          console.log(error)
        });
    }
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

  // public innerHtml: SafeHtml;
  // public setInnerHtml(pdfurl: string) {
  //   this.innerHtml = this._sanitizer.bypassSecurityTrustHtml(
  //     "<object data='" + pdfurl + "' type='application/pdf' class='embed-responsive-item'>" +
  //     "Object " + pdfurl + " failed" +
  //     "</object>");
  // }

}
