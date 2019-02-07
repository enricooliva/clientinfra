import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, Field } from '@ngx-formly/core';
import { BaseEntityComponent } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { FileDetector } from 'protractor';

@Component({
  selector: 'app-convvalidation',
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
export class ConvvalidationComponent extends BaseEntityComponent {

  public static WORKFLOW_ACTION: string = 'store_validazione'; //TRASITION
  public static ABSULTE_PATH: string = 'home/validazione';

  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Inserimento documenti di approvazione</h5>',
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
      },  
      expressionProperties: {
        'templateOptions.disabled': 'formState.disabled_covenzione_id',
      },    
    },
    {
      key: 'attachments',
      type: 'repeat',
      templateOptions: {
        label: 'Documenti di approvazione',
      },
      validators: {
        unique: {
          expression: (c) => {
            if (c.value) {
              var valueArr = c.value.map(function (item) { return item.attachmenttype_codice }).filter(x => x != null).map(x => x.toString());
              var isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx
              });
              return !isDuplicate;
            }
            return true;
          },
          message: (error, field: FormlyFieldConfig) => `Nome ripetuto`,
        },
      },
      fieldArray: {               
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
                { codice: 'DSA', descrizione: 'Delibera Senato Accademico' },
                { codice: 'DCA', descrizione: 'Delibera Consiglio di Amministrazione' },
                { codice: 'DR', descrizione: 'Decreto Rettorale' },
                { codice: 'DRU', descrizione: "Decreto Rettorale d'urgenza" },
              ],
              valueProp: 'codice',
              labelProp: 'descrizione',
              label: 'Tipologia atto di approvazione',
              required: true,
            }
          },
          {
            key: 'filename',
            type: 'fileinput',
            className: "col-md-5",
            templateOptions: {
              label: 'Scegli documento',
              type: 'input',              
              placeholder: 'Scegli file documento',
              accept: 'application/pdf,.p7m', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
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
        ],              
      },     
    },
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
