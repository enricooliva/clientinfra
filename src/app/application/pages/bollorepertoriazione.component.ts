import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, Field } from '@ngx-formly/core';
import { BaseEntityComponent } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import {Location} from '@angular/common';
import { FormlyGroup } from '@ngx-formly/core/lib/components/formly.group';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { PDFJSStatic } from "pdfjs-dist";

const PDFJS: PDFJSStatic = require('pdfjs-dist');

@Component({
  selector: 'app-bollorepertoriazione',
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
  <button class="btn btn-primary mt-3" type="button" [disabled]="!form.valid" (click)="onSubmit()">Salva e repertoria</button>
  </div>
  `,
  styles: []
})

export class BolloRepertoriazioneComponent extends BaseEntityComponent {
  
  public STATE = 'firmato';
  public static WORKFLOW_ACTION: string = 'repertorio'; //TRASITION
  public static ABSULTE_PATH: string = 'home/bollorepertoriazione';

  public numPages: number;
  public numLines: number;


  get workflowAction(): string{
    return BolloRepertoriazioneComponent.WORKFLOW_ACTION;
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
        entityPath: 'home/convenzioni',
        codeProp: 'id',
        descriptionProp: 'descrizione_titolo',
        descriptionFunc: (data) => {
          if (data && data.descrizione_titolo){
            this.updateStipula(data.stipula_format); 
            return data.descrizione_titolo;
          }
          return '';
        },
        isLoading: false,    
        rules: [{value: this.STATE, field: "current_place", operator: "="}],
      },  
      expressionProperties: {
        'templateOptions.disabled': 'formState.disabled_covenzione_id',
      },    
    },   
    {
      key:'stipula_format',
      type: 'select',
      templateOptions:{
        options: [
          { codice: 'cartaceo', descrizione: 'Stipula cartacea' },
          { codice: 'digitale', descrizione: 'Stipula digitale' },
        ],
        valueProp: 'codice',
        labelProp: 'descrizione',
        label: 'Formato di stipula',
        disabled: true,
        required: true,  
      }

    },
    // {  
    //   key: 'bollo_virtuale', 
    //   type: 'checkbox',                  
    //   className: 'inline pr-1',
    //   templateOptions: {
    //      label: 'Bollo virtuale',     
    //      indeterminate: false,                              
    //   },
    //   hideExpression: (model: any, formState: any) => {
    //     //se non è valorizzato lo stipula_format o 
    //     return !model.stipula_format || (model.stipula_format && model.stipula_format == 'cartaceo')
    //   },
    // },
    {  
      fieldGroupClassName: 'row',
      fieldGroup: [
      {
        key: 'bollo_virtuale', 
        type: 'select',         
        defaultValue: false,  
        className: 'col-md-2',             
        templateOptions: {
          label: 'Bollo virtuale',     
          options: [
            { label: 'Si', value: true },
            { label: 'No', value: false },
          ],
        },
        //hideExpression: (model: any, formState: any) => {
          //se non è valorizzato lo stipula_format o 
          //return !model.stipula_format || (model.stipula_format && model.stipula_format == 'cartaceo')
        //},
      },
      {
        key: 'num_bolli',
        type: 'number',
        className: 'col-md-4',        
        templateOptions: {
          label: 'Numero bolli applicati',
          description: 'Calcolare un bollo ogni 100 righe di convenzione',       
        },
        hideExpression: (model, formstate) => {
          return (formstate.model.bollo_virtuale == false);
        },
      },
      {
        type: 'template',
        className: 'col-md-6 mt-4 pt-3',       
        templateOptions: {          
          template: '',
        },
        hideExpression: (model, formstate) => {
          return !(this.model.bollo_virtuale &&  this.numPages != undefined);
        },
        expressionProperties: {
          'templateOptions.template': () => `           
            <h6 class="panel-title">
             Numero di pagine ${this.numPages} e numero linee calcolate ${this.numLines}
            </h6>
          `
        }
      },
    ]
    },             
    {
      key: 'attachment1',
      // hideExpression: (model, formstate) => {
      //   return (formstate.model.bollo_virtuale == true && model.stipula_format == 'digitale');
      // },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'attachmenttype_codice',
              type: 'select',
              className: "col-md-5",
              defaultValue: 'DOC_BOLLATO_FIRMATO',
              templateOptions: {
                //todo chiedere lato server 
                options:  [
                  { codice: 'DOC_BOLLATO_FIRMATO', descrizione: 'Convenzione firmata e bollata' },                  
                ],
                valueProp: 'codice',
                labelProp: 'descrizione',
                label: 'Tipo documento',               
              },
              expressionProperties: {
                'templateOptions.required': (model: any, formState: any) => 
                { 
                  return !(formState.model.bollo_virtuale == true && formState.model.stipula_format == 'digitale') 
                },
              },              
            },
            {
              key: 'filename',
              type: 'fileinput',
              className: "col-md-7",
              templateOptions: {
                label: 'Scegli il documento',
                type: 'input',
                placeholder: 'Scegli file documento',
                accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,                
                onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
              },    
              expressionProperties: {
                'templateOptions.required': (model: any, formState: any) => { return !(formState.model.bollo_virtuale == true && formState.model.stipula_format == 'digitale') },
              },            
            },
      
          ],
        },
      ],  
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
      currentAttachment.filevalue = encode(e.target.result);
      
      this.numLines = await this.lineNumber(e.target.result);
      //console.log('numero righe '+this.numLines);

      // this.model.num_bolli = this.bolliCount(this.numLines);
      // if (this.form.get('num_bolli'))
      //   this.form.get('num_bolli').setValue(this.model.num_bolli);      
      
      if (!currentAttachment.filevalue) {
        this.isLoading = false;
        return;        
      }    
      this.isLoading = false;
    }
    reader.readAsArrayBuffer(currentSelFile);
  }
  
  async lineNumber(data): Promise<number> {
    let text = '';
    return await PDFJS.getDocument({ data: data }).then(async (doc) => {
      let counter: number = 100;
      
      this.numPages = doc.numPages;

      counter = counter > doc.numPages ? doc.numPages : counter;

      let linecount: number = 0;
      for (var i = 1; i <= counter; i++) {
        let pageText = await doc.getPage(i).then(pageData => ControlUtils.render_page(pageData)) as string;

        linecount += pageText.split('\n').length;
       
      }    
            
      return linecount;

    });
  }

  bolliCount(num_lines: number): number{  
    if (num_lines>0){      
      let arround = 0;
      if (num_lines % 100 > 0)
        arround = 1;

      return Math.floor(num_lines / 100) + arround;
    }
      
    return 0;
  }


  constructor(protected service: ApplicationService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route, router, location)
    this.isLoading = false;
  }

  ngOnInit() {    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.model.convenzione_id = params['id'];         
        this.isLoading=true;
        //leggere la minimal della convenzione        
        this.service.getMinimal(this.model.convenzione_id).subscribe(
          result => {
            if (result){                          
              setTimeout(
                ()=> {
                    this.fields.find(x=> x.key == 'convenzione').templateOptions.init(result);                                            
                });
            this.isLoading=false;
            }
          }
        );
        this.options.formState.disabled_covenzione_id = true;
      };
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      tosubmit.transition = this.workflowAction;
      this.service.bolloRepertoriazioneStep(tosubmit,true).subscribe(
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

  updateStipula(value){
    if (value){
      this.form.get('stipula_format').setValue(value);
    }
  }
}
