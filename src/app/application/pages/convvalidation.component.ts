import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
import { BaseEntityComponent } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RowHeightCache } from '@swimlane/ngx-datatable/release/utils';

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
      key: 'attachment',
      type: 'repeat',
      templateOptions: {
        label: 'Documenti di approvazione',
      },
      validators: {
        unique: {
          expression: (c) => {
            if (c.value) {
              var valueArr = c.value.map(function (item) { return item.filename }).filter(x => x != null).map(x => x.toString());
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
              onSelected: (selFile) => { this.onSelectCurrentFile(selFile) }
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
          ],
        },        
        ],              
      },     
    },
  ]

  onSelectCurrentFile(selFile){

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

  onSubmit(){

  }
}
