import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, Field } from '@ngx-formly/core';
import { BaseEntityComponent } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { FileDetector } from 'protractor';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import { FormlyFieldConfigCache } from '@ngx-formly/core/lib/components/formly.field.config';
import { FirmaDirettoreComponent } from './firmadirettore.component';

@Component({
  selector: 'app-firmacontroparte',
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
  <button class="btn btn-primary mt-3" type="button" [disabled]="!form.valid" (click)="onSubmit()">Salva</button>
  </div>
  `,
  styles: []
})

export class FirmaControparteComponent extends BaseEntityComponent {

  public STATE = 'da_firmare_controparte2';
  public static WORKFLOW_ACTION: string = 'firma_da_controparte2'; //TRASITION
  public static ABSULTE_PATH: string = 'home/firmacontroparte';


  get workflowAction(): string {
    return FirmaControparteComponent.WORKFLOW_ACTION;
  }

  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5></h5>',
    },
    {
      key: 'convenzione',
      type: 'externalobject',
      templateOptions: {
        label: 'Convenzione',
        type: 'string',
        required: true,
        entityName: 'application',
        entityLabel: 'Convenzione',
        codeProp: 'id',
        descriptionProp: 'descrizione_titolo',
        isLoading: false,
        rules: [{ value: this.STATE, field: "current_place", operator: "=" }],
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
      },
      expressionProperties: {
        'templateOptions.disabled': 'formState.disabled_covenzione_id',
      },   
    },
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
                  defaultValue: 'LTE_FIRM_ENTRAMBI',
                  templateOptions: {
                    //todo chiedere lato server 
                    options: [
                      { stipula_type: 'controparte', codice: 'LTE_FIRM_ENTRAMBI_PROT', descrizione: 'Lettera ricevuta via PEC già protocollata' },
                      { stipula_type: 'controparte', codice: 'LTE_FIRM_ENTRAMBI', descrizione: 'Lettera ricevuta dalla ditta' },
                      { stipula_type: 'controparte', codice: 'NESSUN_DOC', descrizione: 'Nessun documento di accompagnamento' }
                    ],
                    valueProp: 'codice',
                    labelProp: 'descrizione',
                    label: 'Tipo documento',
                    required: true,
                  },
                  hooks: {
                    onInit: (field) => {
                      field.form.parent.get('stipula_format').valueChanges.pipe(
                        takeUntil(this.onDestroy$),
                        startWith(field.form.parent.get('stipula_format').value),
                        tap(type => {
                          field.formControl.setValue(null);
                          if (type == 'digitale') {
                            field.templateOptions.options = [
                              { stipula_type: 'controparte', codice: 'LTE_FIRM_ENTRAMBI_PROT', descrizione: 'Lettera ricevuta via PEC già protocollata' },
                              { stipula_type: 'controparte', codice: 'LTE_FIRM_ENTRAMBI', descrizione: 'Lettera ricevuta dalla ditta' },
                              { stipula_type: 'controparte', codice: 'NESSUN_DOC', descrizione: 'Nessun documento di accompagnamento' }
                            ];
                          } else {
                            field.templateOptions.options = [
                              { stipula_type: 'controparte', codice: 'LTE_FIRM_ENTRAMBI', descrizione: 'Lettera ricevuta dalla ditta' },
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
                  hideExpression: (model, formState) => {
                    return (formState.model.attachment1.attachmenttype_codice !== 'LTE_FIRM_ENTRAMBI');
                  },
                },
                {
                  key: 'filevalue',
                  type: 'textarea',               
                  hide: true,             
                  templateOptions: {                
                    //required: true,                               
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
                    rules: [{ value: "arrivo", field: "doc_tipo", operator: "=" }],
                  },
                  hideExpression: (model, formState) => {
                    return (formState.model.attachment1.attachmenttype_codice !== 'LTE_FIRM_ENTRAMBI_PROT');
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
                  hideExpression: (model: any, formState: any) => {
                    return (formState.model.attachment1.attachmenttype_codice !== 'NESSUN_DOC');
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
              defaultValue: 'CONV_FIRM_ENTRAMBI',
              templateOptions: {
                required: true,                
                options: [{ stipula_type: 'ditta', codice: 'CONV_FIRM_ENTRAMBI', descrizione: 'Convenzione firmata dalla controparte' }],
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
                required: true,  
                label: 'Scegli il documento',
                type: 'input',
                placeholder: 'Scegli file documento',
                accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,            
                onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
              },
            },
            {
              key: 'filevalue',
              type: 'textarea',               
              hide: true,             
              templateOptions: {                
                //required: true,                               
              },
            },

          ],
        },

        {
          key: 'scadenze',
          type: 'repeat',
          templateOptions: {
            label: 'Scadenziario',
          },    
          // hideExpression: (model, formstate) => {
          //   return !(formstate.model.stipula_format === 'digitale');
          // },  
          fieldArray: {
            fieldGroupClassName: 'row',
            fieldGroup:  [
              {
                key: 'data_tranche',
                type: 'datepicker',
                className: "col-md-5",                
                templateOptions: {                  
                  required: true,                    
                  label: 'Tranche prevista',
                },
              },
              {
                key: 'dovuto_tranche',
                type: 'number',
                className: "col-md-5",
                templateOptions: {
                  required: true,  
                  label: 'Importo',                  
                },  
              },
  
            ],                
          } 
        }
    
  ];

  onSelectCurrentFile(currentSelFile, field: FormlyFieldConfig) {
    let currentAttachment = field.formControl.parent.value;
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
      //currentAttachment.filevalue = encode(e.target.result);

      field.formControl.parent.get('filevalue').setValue(encode(e.target.result));
      // if (currentSelFile.name.search('pdf') > 0) {
      //   try {
      //     let result = await ControlUtils.parsePdf(e.target.result);
      //     field.formControl.parent.get('docnumber').setValue(result.docnumber);
      //     field.formControl.parent.get('data_emissione').setValue(result.converted);
      //   } catch (error) {
      //     console.log(error);
      //     this.isLoading = false;
      //   }
      // }

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

  constructor(protected service: ApplicationService, protected route: ActivatedRoute, protected router: Router) {
    super(route, router)
    this.isLoading = false;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.model.convenzione_id = params['id'];         
        this.model.disabled_covenzione_id = true;

        this.isLoading=true;
        //leggere la minimal della convenzione        
        this.service.getMinimal(this.model.convenzione_id).subscribe(
          result => {
            if (result){            
              //this.form.get('convenzione').setValue(result);  
              this.fields.find(x=> x.key == 'convenzione').templateOptions.init(result);              
              this.form.get('stipula_format').setValue(result.stipula_format);              
              this.isLoading=false;
            }
          }
        );

        this.service.getAziende(this.model.convenzione_id).subscribe(
          result => { 
            if (result && result[0]){
              const emails = (result.map(it => it.pec_email)).join(', ');
              if (this.form.get('email'))
                this.form.get('email').setValue(emails);
            }else 
              this.form.get('email').setValue('email non associata');
          }
        );
        
        this.options.formState.disabled_covenzione_id = true;
      };
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { 
        ...this.model, 
        ...this.form.value,         
      };
      tosubmit.attachment1.doc = {...this.model.attachment1.doc, ...this.form.value.attachment1.doc }
      
      tosubmit.transition = this.workflowAction;
      this.service.complSottoscrizioneStep(tosubmit, true).subscribe(
        result => {
          this.isLoading = false;
          this.router.navigate(['home/dashboard/dashboard1']);
        },
        error => {
          this.isLoading = false;
          //this.service.messageService.error(error);          
        });
    }
  }
}
