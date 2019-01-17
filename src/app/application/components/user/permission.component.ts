import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';

@Component({
  selector: 'app-permission',
  templateUrl: '../../../shared/base-component/base-entity.component.html'
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class PermissionComponent extends BaseEntityComponent {
  
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
            label: 'Id',
            disabled: true
          }
        },
        {
          key: 'name',
          type: 'input',
          className: "col-md-5",
          templateOptions: {
            label: 'Permesso',
            required: true
          }
        },
        {
          key: 'guard_name',
          type: 'input',
          className: "col-md-5",
          templateOptions: {
            label: 'Guardia',
            required: true
          },
        }
      ]
    },    
    {        
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'created_at',
          type: 'input',
          className: "col-md-5",
          templateOptions: {
            label: 'Data creazione',
            disabled: true,            
          }
        },           
      ]                
    }
  ];


  constructor(protected service: PermissionService, protected route: ActivatedRoute, protected router: Router) {
    super(route,router)
    //this.title = 'Permesso'
    this.activeNew =true;
    this.researchPath = 'home/permissions'
    this.newPath = 'home/permissions/new'
  }

}
