import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import { AziendaLocService } from '../../aziendaloc.service';


@Component({
  selector: 'app-aziendaloc', 
  templateUrl: '../../../shared/base-component/base-entity.component.html',
})

// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class AziendaLocComponent extends BaseEntityComponent {
  
  isLoading = true;
  fields: FormlyFieldConfig[] = [  
    {        
      fieldGroupClassName: 'row',
      fieldGroup: [ 
      {
        key: 'id',
        type: 'input',
        className: "col-md-2",           
        templateOptions: {
          label: 'Codice',
          disabled: true                        
        },
        hideExpression: (model: any) => !model.id
      },    
    ],
    },
    {
      template: '<div><strong>Riferimento azienda sistema gestionale di ateneo:</strong></div>',
    },
    {
      key: 'azienda_id_esterno',
      type: 'external',          
      templateOptions: {
        label: 'Riferimento azienda',
        type: 'string',
        entityName: 'azienda',
        entityLabel: 'Aziende',
        codeProp: 'id_esterno',        
        descriptionProp: 'denominazione',
        description: 'Riferimento azienda sistema gestionale di ateneo'
      },      
    },
    {
      template: '<div><strong>Titolare o legale rappresentante:</strong></div>',
    },
    {        
      fieldGroupClassName: 'row',
      fieldGroup: [         
       
        {
          key: 'nome',
          type: 'input',
          className: "col-md-6",
          templateOptions: {
            label: 'Nome',            
            required: true
          }
        },
        {
          key: 'cognome',
          type: 'input',
          className: "col-md-6",
          templateOptions: {
            label: 'Cognome',
            required: true
          },
        }
      ],      
    },    
    {
      key: 'denominazione',
      type: 'input',      
      templateOptions: {
        label: 'Denominazione',
        description: 'Denominazione della società',
        required: true
      },
    },    
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
          {      
          key: 'cod_fisc',
          type: 'input',  
          className: "col-md-6",    
          templateOptions: {
            label: 'Codice fiscale',                
          },
        },
        {
          key: 'indirizzo1',
          type: 'input',      
          className: "col-md-6",    
          templateOptions: {
            label: 'Indirizzo',                
            description: 'Via e località'
          },
        }]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'cap',
          type: 'input',    
          className: "col-md-6",   
          templateOptions: {
            label: 'Cap',                
          },
        },
        {
          key: 'comune',
          className: "col-md-6", 
          type: 'input',      
          templateOptions: {
            label: 'Comune',                
          },
        }
      ]
    },    
    {
      key: 'pec_email',
      type: 'input',      
      templateOptions: {
        label: 'Email di contatto (PEC)',                
        required: true,
      },
    },
  ];  

  constructor(protected service: AziendaLocService, protected route: ActivatedRoute, protected router: Router) {
    super(route,router);
    //this.title = 'Tipo pagamento'
    this.activeNew =true;
    this.researchPath = 'home/aziendeloc'
    this.newPath = this.researchPath+'/new';
  }

 

  
}
