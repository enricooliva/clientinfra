import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, Field } from '@ngx-formly/core';
import { BaseEntityComponent } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import { ScadenzaService } from '../scadenza.service';
import {Location} from '@angular/common';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-emissione',
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

export class EmissioneComponent extends BaseEntityComponent {
  
  public STATE = 'inemissione';
  public static WORKFLOW_ACTION: string = 'emissione'; //TRASITION
  public static ABSULTE_PATH: string = 'home/emissione';

  get workflowAction(): string{
    return EmissioneComponent.WORKFLOW_ACTION;
  }

  taskemission = new Subject<any>();
  attachid = null;

  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5></h5>',
    },
    {
      fieldGroupClassName: 'display-flex',      
      fieldGroup: [
        {
          type: 'button',         
          className: 'ml-1 pl-1',     
          templateOptions: {        
            text: 'Scarica convenzione repertoriata',            
            btnType: 'btn btn-primary btn-sm border-0 rounded-0',       
            title: 'Scarica convenzione',
            //icon: 'oi oi-data-transfer-download'
            onClick: ($event, model) => this.download($event, model),
          },
          hideExpression: (model: any, formState: any) => {
            return !this.attachid;
          },                                     
        },
        // {                    
        //     type: 'button',         
        //     className: 'ml-1 pl-1',     
        //     templateOptions: {        
        //       text: 'Apri pagina di archiviazione',            
        //       btnType: 'btn btn-primary btn-sm border-0 rounded-0',  
        //        title: 'Apri pagina esterna',                  
        //         onClick: ($event, model) => {                                        
        //         let titulus = window.open('', '_blank'); 
        //         this.service.getTitulusDocumentURL(this.attachid.id).subscribe(
        //           (data)=> titulus.location.href = data.url, 
        //           (error) => { 
        //             titulus.close(); 
        //             console.log(error);
        //           }                                            
        //         );
              
        //     },
        //   },      
        //   hideExpression: (model: any, formState: any) => {
        //     return this.attachid;
        //   },          
        // },
      ],
    },

    {
      key: 'id',
      type: 'external',
      className: "col-md-12",
      templateOptions: {
        label: 'Scadenza',
        type: 'string',            
        entityName: 'scadenza',
        entityLabel: 'Scadenza',
        entityPath: 'home/scadenze',
        codeProp: 'id',
        descriptionProp: 'dovuto_tranche',
        descriptionFunc: (data) => {
            if (data && data.dovuto_tranche){
              if (data.convenzione && data.convenzione.attachments && data.convenzione.attachments.length > 0){
                this.attachid = data.convenzione.attachments.find(x => x.attachmenttype_codice == 'DOC_BOLLATO_FIRMATO');
              }
              this.model.attachment1.attachmenttype_codice = data.tipo_emissione;
              return data.dovuto_tranche +' - ' + 'Convenzione n. '+data.convenzione.id+' - '+data.convenzione.descrizione_titolo;
            }
            return '';
        },
        copymodel: true,
        isLoading: false,          
      },
      expressionProperties: {
        'templateOptions.disabled': (model: any, formState: any) => { return model.id; },
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
              templateOptions: {
                //todo chiedere lato server 
                options: [
                  { codice: 'NOTA_DEBITO', descrizione: 'Emissione nota di debito' },
                  { codice: 'FATTURA_ELETTRONICA', descrizione: 'Fattura elettronica' },     
                  { codice: 'RICHIESTA_PAGAMENTO', descrizione: 'Richiesta pagamento' },                  
                ],
                valueProp: 'codice',
                labelProp: 'descrizione',
                label: 'Tipo documento',
                disabled: true,
                required: true,
              }
            },
            {
              key: 'filename',
              type: 'fileinput',
              className: "col-md-5",
              hide: true,
              templateOptions: {
                label: 'Scegli il documento',
                type: 'input',
                placeholder: 'Scegli file documento',
                accept: 'application/pdf', //.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                required: true,
                onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
              },
              hideExpression: (model, formState) => {
               return model.attachmenttype_codice !== 'RICHIESTA_PAGAMENTO';
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
                required: true,
                descriptionProp: 'oggetto',
                isLoading: false,
                rules: [{ value: "partenza", field: "doc_tipo", operator: "=" }],
              },
              hideExpression: (model, formState) => {
                return formState.model.attachment1 != null && formState.model.attachment1.attachmenttype_codice == 'RICHIESTA_PAGAMENTO';
              },
            },           
          ],
        },
      ],
    },
    //data e numero fattura ???
    {
      fieldGroupClassName: 'row',      
      fieldGroup: [    
        {
          key: 'data_fattura',
          type: 'datepicker',          
          className: "col-md-6",          
          templateOptions: {
            required: true,
            label: 'Data',          
          },        
        },
        {
          key: 'num_fattura',
          type: 'input',
          className: "col-md-6",          
          templateOptions: {
            required: true,
            label: 'Numero',                    
          },        
        },     
    ],
    hideExpression: (model, formState) => {
      return formState.model.attachment1 != null && formState.model.attachment1.attachmenttype_codice == 'RICHIESTA_PAGAMENTO';
    },

    },
    {       
      type: 'template',    
      templateOptions: {      
        template: '',              
      },   
      expressionProperties: {
        'templateOptions.template': this.taskemission.pipe(map(x=>{
            return `<h5 class="panel-title">
              Messaggio
            </h5>          
            <div class="mb-1">
              ${x.data ? x.data.description : ''}    
            </div>
          `}))                            
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
    currentAttachment.model_type = 'scadenza';
    
    const reader = new FileReader();   

    reader.onload = async (e: any) => {
      this.isLoading = true;
      //currentAttachment.filevalue = encode(e.target.result);
      //currentAttachment.filevalue = encode(e.target.result);
      field.formControl.parent.get('filevalue').setValue(encode(e.target.result));
      
      if (!currentAttachment.filevalue) {
        this.isLoading = false;
        return;
      }    
      this.isLoading = false;
    }
    reader.readAsArrayBuffer(currentSelFile);
  }
  


  constructor(protected service: ApplicationService, protected scadService: ScadenzaService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route, router, location)
    this.isLoading = false;
  }

  ngOnInit() {
    
    this.route.params.subscribe(params => {
      if (params['id']) {                  
        //leggere la minimal della convenzione        
          this.isLoading=true;
          this.model = { convenzione: {}};
          //leggere la minimal della convenzione        
          this.scadService.getById(params['id']).subscribe(
            result => {
              if (result){            
                setTimeout(() => {                  
                  this.model = {...this.model, ...result};   
                  this.options.formState.model = this.model; 

                  if (this.model.usertasks){
                    //prendo l'ultimo attivo //TODO valutare che il messaggio richiesta emissione vada nella scadenza...
                    const task = (this.model.usertasks as Array<any>).filter(x => x.workflow_place == 'inemissione' && (x.state == 'aperto'))[0];
                    if (task)
                     this.taskemission.next(task);
                  }
                  
                },0);
              }
              this.isLoading=false;
            }
          );
        }        
      });    
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };  
      tosubmit.convenzione = undefined;
      tosubmit.attachment1 = {...this.model.attachment1, ...this.form.value.attachment1 }
      tosubmit.attachment1.doc = {...this.model.attachment1.doc, ...this.form.value.attachment1.doc }

      this.service.emissioneStep(tosubmit,true).subscribe(
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

  download(event, model) {
    //console.log(model);
    if (!this.attachid)
      return;

    this.service.download(this.attachid.id).subscribe(file => {
      if (file.filevalue)
        var blob = new Blob([decode(file.filevalue)]);
      saveAs(blob, file.filename);
    },
      e => { console.log(e); }
    );

  }
}
