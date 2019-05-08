import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import { ScadenzaService } from '../../scadenza.service';
import { ApplicationService } from '../../application.service';

@Component({
  selector: 'app-scadenza', 
  templateUrl: '../../../shared/base-component/base-entity.component.html',
})

// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c application/components/classificazione -s true --spec false -t true

export class ScadenzaComponent extends BaseEntityComponent {
  
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {           
      type: 'button',  
      templateOptions: {        
        text: 'Richiesta emissione',
        btnType: 'btn btn-primary btn-sm border-0 rounded-0',        
        onClick: ($event) => this.open()
      },
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
            label: 'Id',
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
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
        {
          key: 'data_tranche',
          type: 'datepicker',
          className: "col-md-5",          
          templateOptions: {
            label: 'Tranche prevista',          
            required: true
          },          
        },
        {
          key: 'dovuto_tranche',
          type: 'number',
          className: "col-md-5",
          templateOptions: {
            label: 'Importo',
            required: true
          },
        }
      ]
    },    
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
      {
        key: 'data_emisrichiesta',
        type: 'datepicker',
        className: "col-md-5",
        templateOptions: {
          label: 'Data emissione richiesata',          
        },        
      },
      {
        key: 'protnum_emisrichiesta',
        type: 'external',
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
          //rules: [{value: "arrivo", field: "doc_tipo", operator: "="}],                       
        }, 
      }
    ],    
  },
  {
    fieldGroupClassName: 'row',
    fieldGroup: [    
      {
        key: 'data_fattura',
        type: 'datepicker',
        className: "col-md-5",
        templateOptions: {
          label: 'Data fattura',          
        },        
      },
      {
        key: 'num_fattura',
        type: 'input',
        className: "col-md-5",
        templateOptions: {
          label: 'Numero fattura',                    
        },        
      },    
  ]},
  {
    fieldGroupClassName: 'row',
    fieldGroup: [    
      {
        key: 'data_ordincasso',
        type: 'datepicker',
        className: "col-md-5",
        templateOptions: {
          label: 'Data ordinativo incasso',          
        },        
      },
      {
        key: 'num_ordincasso',
        type: 'input',
        className: "col-md-5",
        templateOptions: {
          label: 'Numero ordinativo incasso',                    
        },        
      },    
  ]},
  {
    key: 'prelievo',
    type: 'number',    
    templateOptions: {
      label: 'Prelievo',          
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
  ];  

  constructor(protected service: ScadenzaService, protected appService: ApplicationService, protected route: ActivatedRoute, protected router: Router) {
    super(route,router);
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

  open() {
    if(this.model.convenzione){
      this.appService.setRichiestaEmissioneData(this.model);
      this.router.navigate(['home/richiestaemissione', this.model.id]);
    }
  }
}
