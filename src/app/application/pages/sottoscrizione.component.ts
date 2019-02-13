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
  <button class="btn btn-primary mt-3" type="button" [disabled]="!form.valid || !form.dirty" (click)="onSubmit()">Salva</button>
  </div>
  `,
  styles: []
})
export class SottoscrizioneComponent extends BaseEntityComponent {


  //azioni possibili 

  //stato di partenza 'approvato'
  //firma_da_controparte1 --> stipula ditta --> ricevuta lettera con convenzione firmata dalla ditta
  //firma_da_direttore1 --> stipula uniurb --> ricevuta la convenzione firmata dal dipartimento
  
  public static STATE = 'approvato';
  public static WORKFLOW_ACTIONS: string[] = ['firma_da_controparte1','firma_da_direttore1']; //TRASITION
  public static ABSULTE_PATH: string = 'home/sottoscrizione';

  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Sottoscrizione</h5>',
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
        codeProp: 'id',
        descriptionProp: 'descrizione_titolo',
        isLoading: false,    
        rules: [{value: "inapprovazione", field: "current_place", operator: "="}],
      },  
      expressionProperties: {
        'templateOptions.disabled': 'formState.disabled_covenzione_id',
      },    
    },
    {
      key: 'stipula_type',
      type: 'select',   
      defaultValue: 'SDIP',   
      templateOptions: {        
        options: [
          { codice: 'SDIP', descrizione: 'Stipula Dipartimento' },
          { codice: 'SDIT', descrizione: 'Stipula Ditta' },          
        ],
        valueProp: 'codice',
        labelProp: 'descrizione',
        label: 'Tipologia di stipula',
        required: true,
      }
    },
    {                         
        fieldGroup: [
          {
            fieldGroupClassName: 'row',
            fieldGroup:[
            {
              key: 'attachmenttype_codice',
              type: 'select',
              className: "col-md-5",
              templateOptions: {
                //todo chiedere lato server 
                options: [
                          
                ],
                valueProp: 'codice',
                labelProp: 'descrizione',
                label: 'Tipo allegato',
                required: true,
            },
            lifecycle: {          
              onInit: (form, field) => {

                const attch_type = [
                  { stipula_type: 'SDIP', codice: 'PU_LT_SPEDITA_DITTA', descrizione: 'Spedita alla ditta (Prot. uscita)' },      
                  { stipula_type: 'SDIT', codice: 'PE_LT_DA_DITTA', descrizione: 'Ricevuta dalla ditta (Prot. entrata)' },                       
                ];
                
                form.get('stipula_type').valueChanges.pipe(
                  takeUntil(this.onDestroy$),
                  startWith(form.get('stipula_type').value),
                  tap(type => {
                    field.formControl.setValue(null);
                    field.templateOptions.options = attch_type.filter(x => x.stipula_type === type);
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
              label: 'Scegli la lettera di trasmissione',
              type: 'input',              
              placeholder: 'Scegli file documento',
              accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
              required: true,
              onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
            },
          },   
        ],
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'docnumber',
              type: 'input',
              className: "col-md-5",
              templateOptions: {
                label: 'Numero',
                //required: true,                               
              },
            },
            {
              key: 'data_emissione',
              type: 'datepicker',
              className: "col-md-5",
              templateOptions: {
                label: 'Data',
                //required: true,                               
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
      ]
    }
  ]

  onSelectCurrentFile(currentSelFile, field: FormlyFieldConfig){
    
  
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
      if (currentSelFile.name.search('pdf')>0){
        try {
          let result = await ControlUtils.parsePdf(e.target.result);     
          field.formControl.parent.get('docnumber').setValue(result.docnumber);
          field.formControl.parent.get('data_emissione').setValue(result.converted);
        } catch (error) {
          console.log(error);
          this.isLoading = false;
        }
      }

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
      if (params['id']){
        this.model.convenzione_id = params['id'];
        this.options.formState.disabled_covenzione_id = true;
      };
    });
  }  

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      this.service.validationStep(tosubmit,true).subscribe(
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
