import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, Field } from '@ngx-formly/core';
import { BaseEntityComponent } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { FileDetector } from 'protractor';
import { FormlyFieldConfigCache } from '@ngx-formly/core/lib/components/formly.field.config';
import { takeUntil, startWith, tap, filter, map, distinct } from 'rxjs/operators';
import { ScadenzaService } from '../scadenza.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-richiestaemissione',
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

export class RichiestaEmissioneComponent extends BaseEntityComponent {
  
  public STATE = 'attivo';
  public static WORKFLOW_ACTION: string = 'inemissione'; //TRASITION
  public static ABSULTE_PATH: string = 'home/richiestaemissione';

  get workflowAction(): string{
    return RichiestaEmissioneComponent.WORKFLOW_ACTION;
  }


  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5></h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // {
        //   key: 'id',
        //   type: 'input',
        //   hide: true,
        //   className: "col-md-2",
        //   templateOptions: {
        //     label: 'Scadenza id',
        //     disabled: true
        //   }
        // },
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
                if (data && data.convenzione){
                  return data.dovuto_tranche +' - ' + 'Convenzione n. '+data.convenzione.id+' - '+data.convenzione.descrizione_titolo;
                }
                return '';
            },
            rules: [{value: this.STATE, field: "state", operator: "="}],
            copymodel: true,
            isLoading: false,          
          },
        },
      ]
    },    
    {
      key: 'tipo_emissione',
      type: 'select',
      className: "col-md-5",
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
        required: true,
      }
    },

  //   {
  //     fieldGroupClassName: 'row',
  //     fieldGroup: [
  //     {
  //       key: 'data_tranche',
  //       type: 'datepicker',
  //       className: "col-md-5",          
  //       templateOptions: {
  //         label: 'Tranche prevista',          
  //         required: true
  //       },          
  //     },
  //     {
  //       key: 'dovuto_tranche',
  //       type: 'number',
  //       className: "col-md-5",
  //       templateOptions: {
  //         label: 'Importo',
  //         required: true
  //       },
  //     }
  //   ]
  // }, 
    {
      fieldGroup: [
      {
        key: 'unitaorganizzativa_uo',
        type: 'select',               
        templateOptions: {
          label: 'Ufficio affidatario procedura',
          required: true,                 
          options: this.service.getUfficiFiscali(),          
          valueProp: 'uo',
          labelProp: 'descr',
        },
      },              
      {
          key: 'respons_v_ie_ru_personale_id_ab',
          type: 'select',                
          templateOptions: {
            label: 'Responsabile ufficio',
            valueProp: 'id',
            labelProp: 'descr',   
            required: true,                    
          },
          hooks: {
            onInit: (field) => {
              field.form.get('unitaorganizzativa_uo').valueChanges.pipe(
                takeUntil(this.onDestroy$),    
                distinct(),                  
                //startWith(form.get('unitaorganizzativa_uo').value),
                filter(ev => ev !== null),
                tap(uo => {                                                                   
                  field.formControl.setValue('');
                  
                  this.service.getPersonaleUfficio(uo).pipe(
                    map(items => {
                      return items.filter(x => ApplicationService.isResponsabileUfficio(x.cd_tipo_posizorg));
                    }),                                                                                
                  ).subscribe(opt=> {

                    setTimeout(() => {
                      field.templateOptions.options = opt;
                      if (opt[0]){
                        field.formControl.setValue(opt[0].id); 
                      }
                    }, 0);
  
                  });

                  
                }),
              ).subscribe();
            },
          },
        },
        {
          key: 'assignments',
          type: 'repeat',                                        
          templateOptions: {                  
            label: 'Operatori',                                                                                        
          },   
          validators: {
            unique: {
              expression: (c) => {           
                if (c.value)  {                              
                  var valueArr = c.value.map(function(item){ return item.v_ie_ru_personale_id_ab }).filter(x => x != null );
                  var isDuplicate = valueArr.some(function(item, idx){ 
                      return valueArr.indexOf(item) != idx 
                  });              
                  return !isDuplicate;
                }
                return true;
              },
              message: (error, field: FormlyFieldConfig) => `Nome ripetuto`,
            },
          },
          expressionProperties: {
            'templateOptions.disabled': (model: any, formState: any) => {
              // access to the main model can be through `this.model` or `formState` or `model
              return formState.model.respons_v_ie_ru_personale_id_ab == null || formState.model.respons_v_ie_ru_personale_id_ab == '';
            },
          },            
          fieldArray: {                  
            fieldGroupClassName: 'row',
            fieldGroup: [
            {
              key: 'v_ie_ru_personale_id_ab',
              type: 'select',
              className: "col-md-8",
              templateOptions: {
                label: 'Operatore attività',
                valueProp: 'id',
                labelProp: 'descr',  
                required: true,                     
              },
              lifecycle: {
                onInit: (form, field, model) => {                                              
                  //field.formControl.setValue('');
                  field.templateOptions.options = this.service.getPersonaleUfficio(this.model.unitaorganizzativa_uo).pipe(
                    // map(items => {
                    //   return items.filter(x => x.cd_tipo_posizorg !== 'RESP_UFF' &&  x.cd_tipo_posizorg !== 'COOR_PRO_D');
                    // }),                         
                  );                      
                },
              },
            },
            ],   
          },
        },
        {
          key: 'description',
          type: 'textarea',  
          templateOptions: {
            label: 'Note',           
            rows: 10,
            required: true,
          },         
        }
      ],
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
        this.model = this.service.getRichiestaEmissioneData();
        if (this.model){
          this.options.formState.model = this.model;
          this.options.formState.disabled_covenzione_id = true;
        }else{
          this.isLoading=true;
          this.model = { convenzione: {}};
          //leggere la minimal della convenzione        
          this.scadService.getById(params['id']).subscribe(
            result => {
              if (result){            
                  this.model = result;   
                  this.options.formState.model = this.model;         
              }
              this.isLoading=false;
            }
          );
        }        
      };
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      
      this.service.richiestaEmissioneStep(tosubmit,true).subscribe(
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
