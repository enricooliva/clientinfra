import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import { ClassificazioneService } from '../../classificazione.service';
import { MappingUfficioService } from '../../mappingufficio.service';
import {Location} from '@angular/common';
@Component({
  selector: 'app-classificazione', 
  templateUrl: '../../../shared/base-component/base-entity.component.html',
})

// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c application/components/MappingUfficioComponent -s true --spec false -t true

export class MappingUfficioTitulus extends BaseEntityComponent {
  
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'unitaorganizzativa_uo',
          className: "col-md-12",
          type: 'external',          
          templateOptions: {
            label: 'Riferimento unità organizzativa',
            type: 'string',
            entityName: 'unitaorganizzativa',
            entityLabel: 'Unità organizzativa',
            codeProp: 'uo',        
            descriptionProp: 'descr',
            initdescription: 'descrizione_uo',
            description: 'Descrizione'
          },      
        },    
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'strutturainterna_cod_uff',
          className: "col-md-12",
          type: 'external',          
          templateOptions: {
            label: 'Riferimento struttura interna',
            type: 'string',
            entityName: 'strutturainterna',
            entityLabel: 'Struttura interna',
            codeProp: 'cod_uff',        
            descriptionProp: 'nome',
            initdescription: 'descrizione_uff',
            description: 'Descrizione'
          },      
        },    
      ]
    }     
  ];  

  constructor(protected service: MappingUfficioService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route,router,location);    
    this.activeNew =true;
    this.isRemovable = true;
    this.researchPath = 'home/mappinguffici';
    this.newPath = this.researchPath+'/new';
  }

 

  
}
