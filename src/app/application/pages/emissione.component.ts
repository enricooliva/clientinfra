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


  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5></h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'id',
          type: 'input',
          hide: true,
          className: "col-md-2",
          templateOptions: {
            label: 'Scadenza id',
            disabled: true
          }
        },
        {
          key: 'convenzione',
          type: 'externalobject',
          className: "col-md-12",
          templateOptions: {
            label: 'Convenzione',
            type: 'string',            
            entityName: 'application',
            entityLabel: 'Convenzione',
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
