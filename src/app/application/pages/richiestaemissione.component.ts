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
import { analyzeAndValidateNgModules } from '@angular/compiler';

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
            codeProp: 'id',
            descriptionProp: 'dovuto_tranche',
            descriptionFunc: (data) => {
               return data.dovuto_tranche +' - ' + 'Convenzione n. '+data.convenzione.id+' - '+data.convenzione.descrizione_titolo;
            },
            copymodel: true,
            isLoading: false,          
          },
        },
      ]
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
          options: this.service.getValidationOffices(),
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
                  
                  this.service.getValidationOfficesPersonale(uo).pipe(
                    map(items => {
                      return items.filter(x => x.cd_tipo_posizorg == 'RESP_UFF' || x.cd_tipo_posizorg == 'COOR_PRO_D' || x.cd_tipo_posizorg == 'VIC_RES_PL' || x.cd_tipo_posizorg =='RESP_PLESSO');
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
            label: 'Ulteriori assegnatari',                                                                                        
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
                label: 'Assegnamento attività',
                valueProp: 'id',
                labelProp: 'descr',  
                required: true,                     
              },
              lifecycle: {
                onInit: (form, field, model) => {                                              
                  //field.formControl.setValue('');
                  field.templateOptions.options = this.service.getValidationOfficesPersonale(this.model.unitaorganizzativa_uo).pipe(
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
            maxLength: 200,
            rows: 6,
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
  
  constructor(protected service: ApplicationService, protected scadService: ScadenzaService, protected route: ActivatedRoute, protected router: Router) {
    super(route, router)
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
