import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import { AziendaLocService } from '../../aziendaloc.service';
import {Location} from '@angular/common';

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
        descriptionFunc: (data) => {
          if (data && data.denominazione){            
            this.updateAzienda(data);
            return data.denominazione;
          } 
          else if(data && (data.nome || data.cognome))
          {
            data.denominazione = data.nome+' '+data.cognome;
            this.updateAzienda(data);

            return data.denominazione;
          }
          
          return '';
        },
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
          key: 'part_iva',
          type: 'input',      
          className: "col-md-6",    
          templateOptions: {
            label: 'Partita IVA',                
          },
        }]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'indirizzo1',
          type: 'input',      
          className: "col-md-5",    
          templateOptions: {
            label: 'Indirizzo',                
            description: 'Via e località'
          },
        },
        {
          key: 'cap',
          type: 'input',    
          className: "col-md-3",   
          templateOptions: {
            label: 'Cap',                
          },
        },
        {
          key: 'comune',
          className: "col-md-4", 
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
        pattern: /(\w+(\s|)@(\s|)[a-zA-Z_]+?\.[a-zA-Z]{2,3})$/,
      },
    },
  ];  

  constructor(protected service: AziendaLocService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route,router,location);
    //this.title = 'Tipo pagamento'
    this.activeNew =true;
    this.researchPath = 'home/aziendeloc'
    this.newPath = this.researchPath+'/new';
  }


  updateAzienda(data){
    //'nome','cognome', 'denominazione', 'cod_fis', 'part_iva', 'rappresentante_legale'
    this.form.get('denominazione').setValue(data.denominazione);
    this.form.get('nome').setValue(data.nome);
    this.form.get('cognome').setValue(data.cognome);
    this.form.get('cod_fisc').setValue(data.cod_fis);
    this.form.get('part_iva').setValue(data.part_iva);

    if (data.rappresentante_legale){
      this.form.get('nome').setValue(data.rappresentante_legale.split(' ').slice(0, -1).join(' '));
      this.form.get('cognome').setValue(data.rappresentante_legale.split(' ').slice(-1).join(' '));
    }

  }
  
}
