import { Component, OnInit, Injector, OnChanges, SimpleChanges } from '@angular/core';
import { FormlyFieldConfig, Field } from '@ngx-formly/core';
import { BaseEntityComponent } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import {Location} from '@angular/common';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-sottoscrizione',
  template: `
  <div class="container-fluid">
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '14px' }"></ngx-loading>
  <div class="btn-toolbar mb-4" role="toolbar">
  <div class="btn-group btn-group">        
    <button class="btn btn-outline-primary border-0 rounded-0" [disabled]="!form.valid || !form.dirty" (click)="onSubmit()" >              
      <span class="oi oi-arrow-top"></span>  
      <span class="ml-2">Aggiorna</span>              
    </button> 
    <button class="btn btn-outline-primary border-0 rounded-0" (click)="onValidate()" >              
    <span class="oi oi-flash"></span>  
    <span class="ml-2">Valida</span>              
  </button> 
  </div>
  </div>
  <h4 *ngIf="title">{{title}}</h4>

  <form [formGroup]="form">
      <formly-form [model]="model" [fields]="fields" [form]="form" [options]="options">
      </formly-form>
  </form>


  <button class="btn btn-primary mt-3" type="button" [disabled]="!form.valid" (click)="onSubmit()">{{labelButton}}</button>
  </div>
  `,
  // <p>Form value: {{ form.value | json }}</p> 
  styles: []
})
export class SottoscrizioneComponent extends BaseEntityComponent {  

  //azioni possibili 

  //stato di partenza 'approvato'
  //firma_da_controparte1 --> stipula ditta --> ricevuta lettera con convenzione firmata dalla ditta
  //firma_da_direttore1 --> stipula uniurb --> ricevuta la convenzione firmata dal dipartimento

  labelButton = "Salva";

  public static STATE = 'approvato';
  public static WORKFLOW_ACTIONS: string[] = ['firma_da_controparte1', 'firma_da_direttore1']; //TRASITION
  public static ABSULTE_PATH: string = 'home/sottoscrizione';

  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5></h5>',
    },
    {
      key: 'convenzione_id',
      type: 'external',
      templateOptions: {
        label: 'Convenzione',
        type: 'string',
        required: true,
        entityName: 'application',
        entityLabel: 'Convenzione',
        entityPath: 'home/convenzioni',
        codeProp: 'id',
        descriptionProp: 'descrizione_titolo',
        isLoading: false,
        rules: [{ value: "approvato", field: "current_place", operator: "=" }],
      },
      expressionProperties: {
        'templateOptions.disabled': 'formState.disabled_covenzione_id',
      },
    },
    {
      key: 'stipula_format',
      type: 'select',
      defaultValue: 'cartaceo',
      templateOptions: {
        options: [
          { codice: 'cartaceo', descrizione: 'Stipula cartacea' },
          { codice: 'digitale', descrizione: 'Stipula digitale' },
        ],
        valueProp: 'codice',
        labelProp: 'descrizione',
        label: 'Formato di stipula',
        required: true,
      }      
    },
    {
      key: 'stipula_type',
      type: 'select',
      defaultValue: 'uniurb',
      templateOptions: {
        options: [
          { codice: 'uniurb', descrizione: 'Stipula UniUrb' },
          { codice: 'controparte', descrizione: 'Stipula ditta' },
        ],
        valueProp: 'codice',
        labelProp: 'descrizione',
        label: 'Iter di stipula',
        required: true,
      },
    },
    {
      hideExpression: (model, formstate) => {
        return !((formstate.model.stipula_format == 'cartaceo' && formstate.model.stipula_type == 'uniurb')
          || (formstate.model.stipula_format == 'digitale' && formstate.model.stipula_type == 'uniurb')
          || (formstate.model.stipula_format == 'cartaceo' && formstate.model.stipula_type == 'controparte'));
      },
      key: 'an_dg_uniurb_an_controparte',
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          key: 'attachment1',
          fieldGroup: [
            {
              key: 'attachmenttype_codice',
              type: 'select',
              className: "col-md-5",
              defaultValue: 'LTU_FIRM_UNIURB',
              templateOptions: {
                //todo chiedere lato server 
                options: [],
                valueProp: 'codice',
                labelProp: 'descrizione',
                label: 'Tipo documento',
                required: true,
              },
              hooks: {
                onInit: (field) => {
                  field.form.parent.parent.get('stipula_format').valueChanges.pipe(
                    takeUntil(this.onDestroy$),
                    tap(x => { 
                      this.checkLabelButton(); 
                    })
                  ).subscribe();

                  field.form.parent.parent.get('stipula_type').valueChanges.pipe(
                    takeUntil(this.onDestroy$),
                    startWith(field.form.parent.parent.get('stipula_type').value),
                    tap(type => {
                      field.formControl.setValue(null);
                      this.checkLabelButton();
                      if (type == 'uniurb') {
                        field.templateOptions.options = [{ stipula_type: 'uniurb', codice: 'LTU_FIRM_UNIURB', descrizione: 'Lettera di trasmissione' }];                        
                      } else {
                        field.templateOptions.options = [
                          { stipula_type: 'controparte', codice: 'LTE_FIRM_CONTR', descrizione: 'Lettera ricevuta dalla ditta' },
                          { stipula_type: 'controparte', codice: 'NESSUN_DOC', descrizione: 'Nessun documento di accompagnamento' }
                        ];
                      }
                      field.formControl.setValue(field.templateOptions.options[0].codice);
                    }),
                  ).subscribe();
                }
              }
            },
            {
              key: 'filename',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Scegli il documento',
                type: 'input',
                placeholder: 'Scegli file documento',
                accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                required: true,                
                onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
              },
              hideExpression:(model: any, formState: any) => {               
                  return (formState.model.stipula_format == 'cartaceo' && 
                          formState.model.stipula_type == 'controparte' &&
                          formState.model.an_dg_uniurb_an_controparte.attachment1.attachmenttype_codice == 'NESSUN_DOC');
                },                            
            },
            {
              key: 'data_sottoscrizione',
              type: 'datepicker',
              className: "col-md-5",              
              templateOptions: {
                label: 'Data',
                required: true,
                //required: true,                               
              },
              hideExpression:(model: any, formState: any) => {               
                return (formState.model.an_dg_uniurb_an_controparte.attachment1.attachmenttype_codice !== 'NESSUN_DOC');
              },                            
            },
          ],
        },
        {
          fieldGroupClassName: 'row',
          key: 'attachment2',
          fieldGroup: [
            {
              key: 'attachmenttype_codice',
              type: 'select',
              className: "col-md-5",
              defaultValue: 'CONV_FIRM_UNIURB',
              templateOptions: {
                //todo chiedere lato server 
                options: [],
                valueProp: 'codice',
                labelProp: 'descrizione',
                label: 'Tipo documento',
              },
              hooks: {
                onInit: (field) => {
                  field.form.parent.parent.get('stipula_type').valueChanges.pipe(
                    takeUntil(this.onDestroy$),
                    startWith(field.form.parent.parent.get('stipula_type').value),
                    tap(type => {                      
                      field.formControl.setValue(null);
                      this.checkLabelButton();
                      if (type == 'uniurb') {
                        field.templateOptions.options = [{ stipula_type: 'uniurb', codice: 'CONV_FIRM_UNIURB', descrizione: 'Convenzione firmata dal direttore o rettore' }];
                      } else {
                        field.templateOptions.options = [{ stipula_type: 'controparte', codice: 'CONV_FIRM_CONTR', descrizione: 'Convenzione firmata dalla controparte' }];
                      }
                      field.formControl.setValue(field.templateOptions.options[0].codice);
                    }),
                  ).subscribe();
                }
              }
            },
            {
              key: 'filename',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Scegli il documento',
                type: 'input',
                placeholder: 'Scegli file documento',
                accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,            
                onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
              },
              expressionProperties: {
                'templateOptions.required': 'formState.model.stipula_format == "digitale"'
              },
            },

          ],
        },
      ],
    },

    {
      hideExpression: (model, formstate) => {
        return !(formstate.model.stipula_format == 'digitale' && formstate.model.stipula_type == 'controparte');
      },
      key: 'digitale_controparte',
      fieldGroup: [  
        {
          key: 'attachment1',
          fieldGroup: [
            {
              fieldGroupClassName: 'row',
              fieldGroup: [
                {
                  key: 'attachmenttype_codice',
                  type: 'select',
                  className: "col-md-5",
                  defaultValue: 'LTE_FIRM_CONTR',
                  templateOptions: {
                    //todo chiedere lato server 
                    options: [
                      { stipula_type: 'controparte', codice: 'LTE_FIRM_CONTR_PROT', descrizione: 'Lettera ricevuta via PEC già protocollata' },
                      { stipula_type: 'controparte', codice: 'LTE_FIRM_CONTR', descrizione: 'Lettera ricevuta dalla ditta' },
                      { stipula_type: 'controparte', codice: 'NESSUN_DOC', descrizione: 'Nessun documento di accompagnamento' }
                    ],
                    valueProp: 'codice',
                    labelProp: 'descrizione',
                    label: 'Tipo documento',
                    required: true,
                  },
                },
                {
                  key: 'filename',
                  type: 'fileinput',
                  className: "col-md-5",
                  templateOptions: {
                    label: 'Scegli il documento',
                    type: 'input',
                    placeholder: 'Scegli file documento',
                    accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                    required: true,
                    onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
                  },
                  hideExpression: (model, formState) => {
                    return (formState.model.digitale_controparte.attachment1.attachmenttype_codice !== 'LTE_FIRM_CONTR');
                  },
                },
                {
                  key: 'doc',
                  type: 'externalobject',
                  className: "col-md-7",
                  templateOptions: {
                    label: 'Numero di protocollo',
                    //required: true,      
                    type: 'string',
                    entityName: 'documento',
                    entityLabel: 'Documenti',
                    codeProp: 'num_prot',
                    descriptionProp: 'oggetto',
                    isLoading: false,  
                    rules: [{value: "arrivo", field: "doc_tipo", operator: "="}],                       
                  },      
                  hideExpression: (model, formState) => {
                    return (formState.model.digitale_controparte.attachment1.attachmenttype_codice !== 'LTE_FIRM_CONTR_PROT');
                  },
                },                
                {
                  key: 'data_sottoscrizione',
                  type: 'datepicker',
                  className: "col-md-5",              
                  templateOptions: {
                    label: 'Data',
                    required: true,
                    //required: true,                               
                  },
                  hideExpression:(model: any, formState: any) => {               
                    return (formState.model.digitale_controparte.attachment1.attachmenttype_codice !== 'NESSUN_DOC');
                  },                            
                },
              ],
            },      
          ],
        },
        {
          fieldGroupClassName: 'row',
          key: 'attachment2',
          fieldGroup: [
            {
              key: 'attachmenttype_codice',
              type: 'select',
              className: "col-md-5",
              defaultValue: 'CONV_FIRM_CONTR',
              templateOptions: {
                //todo chiedere lato server 
                options: [{ stipula_type: 'ditta', codice: 'CONV_FIRM_CONTR', descrizione: 'Convenzione firmata dalla controparte' }],
                valueProp: 'codice',
                labelProp: 'descrizione',
                label: 'Tipo documento',
              },
            },
            {
              key: 'filename',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Scegli il documento',
                type: 'input',
                placeholder: 'Scegli file documento',
                accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,            
                onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
              },

            },

          ],
        },
      ],
    },
    {
      hideExpression: (model, formstate) => {
        return !(formstate.model.stipula_format === 'digitale' && formstate.model.stipula_type === 'uniurb');
      },
      fieldGroup: [
        {
          template: '<h5 class="mt-3">PEC destinatario</h5>',
        },
        {
          key: 'email',
          type: 'input',          
          templateOptions: {
            label: 'Email ditta',
            disabled: true,
            //required: true,                               
          },          
        },
      ],
    },
  ]

  onSelectCurrentFile(currentSelFile, field: FormlyFieldConfig) {


    let currentAttachment = field.parent.model; //field.formControl.parent.value;
    if (currentSelFile == null) {
      //caso di cancellazione
      currentAttachment.filevalue = null;
      return;
    }

    this.isLoading = true;
    currentAttachment.model_type = 'convenzione';

    const reader = new FileReader();

    reader.onload = async (e: any) => {
      this.isLoading = true;

      currentAttachment.filevalue = encode(e.target.result);
      //field.formControl.parent.get('filevalue').setValue(encode(e.target.result));

      if (!currentAttachment.filevalue) {
        this.isLoading = false;
        return;
        //this.form.get('file_' + typeattachemnt).setErrors({ 'filevalidation': true });
        //this.service.messageService.add(InfraMessageType.Error,'Documento '+ currentAttachment.filename +' vuoto');
      }
      this.isLoading = false;
    }
    reader.readAsArrayBuffer(currentSelFile);


  }

  constructor(protected service: ApplicationService, protected route: ActivatedRoute, protected router: Router, 
      private injector: Injector, 
      protected location: Location,
      protected confirmationDialogService: ConfirmationDialogService) {

    super(route, router, location)
    this.isLoading = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.model.convenzione_id = params['id'];      
        this.service.getAziende(this.model.convenzione_id).subscribe(
          result => { 
            if (result && result[0]){  
              const emails = (result.map(it => it.pec_email)).join(', ');
              this.model.email = emails;
              if (this.form.get('email'))
                this.form.get('email').setValue(emails);
            }
            else 
              this.model.email = 'email non associata';
          }
        );
        
        this.options.formState.disabled_covenzione_id = true;
      };
    });
  }



  checkLabelButton() {
      if (this.model.stipula_type === 'uniurb' && this.model.stipula_format === 'digitale'){
        this.labelButton = "Salva e invia PEC";
      }else {
        this.labelButton = "Salva";
      }
  }


  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      
      var tosubmit = this.mergeDeep(this.model,this.form.value);

      this.service.sottoscrizioneStep(tosubmit, true).subscribe(
        result => {

          
          this.confirmationDialogService.confirm("Finestra messaggi", result.message, "Chiudi", null, 'lg').then(
            () => this.router.navigate(['home/dashboard/dashboard1']),
            () => this.router.navigate(['home/dashboard/dashboard1']))
          .catch(() => {           
          });

          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          //this.service.messageService.error(error);          
        });
    }
  }

        /**
     * Simple is object check.
     * @param item
     * @returns {boolean}
     */
    isObject(item) {
      return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    }
    
    /**
     * Deep merge two objects.
     * @param target
     * @param source
     */
    mergeDeep(target, source) {
      if (this.isObject(target) && this.isObject(source)) {
        Object.keys(source).forEach(key => {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} });
            this.mergeDeep(target[key], source[key]);
          } else {
            Object.assign(target, { [key]: source[key] });
          }
        });
      }
      return target;
    }

}
