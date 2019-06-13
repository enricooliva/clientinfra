import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import { ScadenzaService } from '../../scadenza.service';
import { ApplicationService } from '../../application.service';
import {Location} from '@angular/common';
import { encode, decode } from 'base64-arraybuffer';
import { of, Observable, Subject } from 'rxjs';
import { map, first } from 'rxjs/operators';
@Component({
  selector: 'app-scadenza', 
  templateUrl: '../../../shared/base-component/base-entity.component.html',
})

// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c application/components/classificazione -s true --spec false -t true

export class ScadenzaComponent extends BaseEntityComponent {
  
  taskemission = new Subject<any>();

  isLoading = true;
  fields: FormlyFieldConfig[] = [    
    {
      fieldGroupClassName: 'display-flex',
      fieldGroup: [
        {           
          type: 'button',                              
          templateOptions: {        
            text: 'Richiesta emissione',
            btnType: 'btn btn-primary btn-sm border-0 rounded-0',        
            onClick: ($event) => this.open()
          },
          hideExpression: (model: any) => {
            return !model.id ||
              (model.id && model.state != 'attivo');
          }, 
        },
        {           
          type: 'button',         
          className: 'ml-1 pl-1',     
          templateOptions: {        
            text: 'Invio richiesta pagamento',            
            btnType: 'btn btn-primary btn-sm border-0 rounded-0',        
            onClick: ($event) => this.openInvioRichiestaPagamento()
          },
          hideExpression: (model: any) => {
            return !model.id ||
              (model.id && model.state != 'attivo');
          }, 
        },         
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'id',
          type: 'input',         
          className: "col-md-4",
          templateOptions: {
            label: 'Codice scadenza',
            disabled: true
          },
          hideExpression: (model: any) => {
            //non c'è il model id 
            return !model.id                  
          }, 
        },
        {
          key: 'state',
          type: 'input',          
          className: "col-md-8",
          templateOptions: {
            label: 'Stato',
            disabled: true
          },
          hideExpression: (model: any) => {
            //non c'è il model id 
            return !model.id 
                 
          }, 
        },
      ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [        
        {
          key: 'convenzione',
          type: 'externalobject',
          className: "col-md-12",
          templateOptions: {
            label: 'Convenzione',
            type: 'string',            
            entityName: 'application',
            entityLabel: 'Convenzione',
            entityPath: 'home/convenzioni',
            codeProp: 'id',
            descriptionProp: 'descrizione_titolo',
            isLoading: false,
            //rules: [{ value: this.STATE, field: "current_place", operator: "=" }],
          },
          expressionProperties: {
            'templateOptions.disabled':(model: any, formState: any) => {
              return this.model.id
            },
            'templateOptions.required':(model: any, formState: any) => {
              return !this.model.id
            }
          },
        },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
        {
          key: 'data_tranche',
          type: 'datepicker',
          className: "col-md-6",          
          templateOptions: {
            label: 'Tranche prevista',          
            required: true
          },          
        },
        {
          key: 'dovuto_tranche',
          type: 'number',
          className: "col-md-6",
          templateOptions: {
            label: 'Importo',
            required: true
          },
        }
      ]
    }, 
    {
      className: 'section-label',
      template: '<h5>Documenti di debito</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
      {
        key: 'tipo_emissione',
        type: 'select',
        className: "col-md-6",
        defaultValue: 'FATTURA_ELETTRONICA',
        templateOptions: {
          //todo chiedere lato server 
          options: [
            { codice: 'NOTA_DEBITO', descrizione: 'Emissione nota di debito' },
            { codice: 'FATTURA_ELETTRONICA', descrizione: 'Fattura elettronica' },     
            { codice: 'RICHIESTA_PAGAMENTO', descrizione: 'Richiesta pagamento' },                  
          ],
          valueProp: 'codice',
          labelProp: 'descrizione',
          label: 'Tipo documento da emettere',        
        }      
      },
      {
        key: 'data_emisrichiesta',
        type: 'datepicker',
        className: "col-md-6",
        templateOptions: {
          label: 'Data emissione richiesta',          
        },
        expressionProperties: {
          'templateOptions.label': (model: any, formState: any) => {                        
              return model.tipo_emissione == 'NOTA_DEBITO' ? 'Data richiesta' : 'Data emissione richiesta';
          },
        },        
      },
    ],    
  },
  {
    fieldGroupClassName: 'row',
    fieldGroup: [    
      {
        key: 'data_fattura',
        type: 'datepicker',
        className: "col-md-6",
        templateOptions: {
          label: 'Data fattura',          
        },        
      },
      {
        key: 'num_fattura',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Numero fattura',                    
        },        
      },    
  ],  
  hideExpression: (model, formState) => {
    return model.tipo_emissione !== 'FATTURA_ELETTRONICA';
  },
  },
  //richiesta emissione
  {       
    type: 'template',    
    templateOptions: {      
      template: '',              
    },   
    expressionProperties: {
      'templateOptions.template': this.taskemission.pipe(map(x=>{
          return `<h5 class="panel-title">
            Messaggio richiesta emissione 
          </h5>          
          <div class="mb-1">
            ${x.data ? x.data.description : ''}    
          </div>
        `}))                            
    },
  },                  
  {
    className: 'section-label',
    template: '<h5>Incassi e prelievi</h5>',
  },
  {
    fieldGroupClassName: 'row',
    fieldGroup: [    
      {
        key: 'data_ordincasso',
        type: 'datepicker',
        className: "col-md-6",
        templateOptions: {
          label: 'Data ordinativo incasso',          
        },        
      },
      {
        key: 'num_ordincasso',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Numero ordinativo incasso',                    
        },        
      },    
  ]},
  {
    key: 'prelievo',
    type: 'select',    
    defaultValue: 'PRE_NO',
    templateOptions: {
      options: [
        { label: 'Nessun prelievo', value: 'PRE_NO' },
        { label: 'Prelievo applicabile', value: 'PRE_SI' },       
      ],
      label: 'Prelievo',
      required: true,
    },
  },
  {
    key: 'note',
    type: 'textarea',
    templateOptions: {      
      label: 'Note',
      maxLength: 200,
      rows: 5,     
    },        
  },
  {
    className: 'section-label',
    template: '<h5>Documenti</h5>',
  },
  {
    key: 'attachments',
    type: 'repeat',
    templateOptions: {
      btnHidden: true,
      btnRemoveHidden: true,
      label: '',     
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
              fieldGroupClassName: 'btn-toolbar',   
              className: 'col-md-3 btn-group',
              fieldGroup: [
                {
                  type: 'button',
                  className: "mt-4 pt-2",
                  templateOptions: {
                    btnType: 'primary oi oi-data-transfer-download',
                    title: 'Scarica documento',
                    //icon: 'oi oi-data-transfer-download'
                    onClick: ($event, model) => this.download($event, model),
                  },
                  // hideExpression: (model: any, formState: any) => {
                  //   return model.filetype == 'link';
                  // },                                
                },
                {
                  type: 'button',
                  className: "ml-2 mt-4 pt-2",
                  templateOptions: {
                    btnType: 'primary oi oi-external-link',
                    title: 'Apri pagina esterna',                  
                    onClick: ($event, model) => {                                        
                      let titulus = window.open('', '_blank'); 
                      this.appService.getTitulusDocumentURL(model.id).subscribe(
                        (data)=> titulus.location.href = data.url, 
                        (error) => { 
                          titulus.close(); 
                          console.log(error);
                        }                                            
                      );
                      
                    },
                  },      
                  hideExpression: (model: any, formState: any) => {
                    return !model.num_prot;
                  },          
                },
              ],
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
          ]
        }
      ],
    }
  }



  ];  

  constructor(protected service: ScadenzaService, protected appService: ApplicationService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route,router, location);
    //this.title = 'Tipo pagamento'
    this.activeNew =true;
    this.isRemovable = true;
    this.researchPath = 'home/scadenze';
    this.newPath = this.researchPath+'/new';

    //Il modello vuoto letto lato server
    // this.model = {
    //   'convenzione': { 'id':'', descrizione_titolo:'' }
    // };

  }

  protected postGetById(){
    if (this.model.usertasks){
       const task = (this.model.usertasks as Array<any>).filter(x => x.workflow_place == 'inemissione' && (x.state == 'aperto' || x.state=='completato'))[0];
       if (task)
        this.taskemission.next(task);
    }
    
  }

  open() {
    if(this.model.convenzione){
      this.appService.setRichiestaEmissioneData(this.model);
      this.router.navigate(['home/richiestaemissione', this.model.id]);
    }
  }

  openInvioRichiestaPagamento() {
    if(this.model.convenzione){
      this.appService.setRichiestaEmissioneData(this.model);
      this.router.navigate(['home/inviorichiestapagamento', this.model.id]);
    }
  }

  download(event, model) {
    //console.log(model);
    this.appService.download(model.id).subscribe(file => {
      if (file.filevalue)
        var blob = new Blob([decode(file.filevalue)]);
      saveAs(blob, file.filename);
    },
      e => { console.log(e); }
    );

  }
}
