import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { RoleService } from '../../role.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import { SourceMapGenerator } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-role',
  templateUrl: '../../../shared/base-component/base-entity.component.html',
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class RoleComponent extends BaseEntityComponent {
  
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
            label: 'Ruolo',
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
        key: 'permissions',
        type: 'datatable',
        wrappers: ['accordion'],
        templateOptions: {
          label: 'Permessi',
          columnMode: 'force',
          scrollbarH: false,
          limit: "10",
          onDblclickRow: (event) => this.onDblclickRow(event),
        },

        fieldArray: {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'id',
              type: 'input',
              templateOptions: {
                label: 'Id',
                disabled: true,
                column: { width: 3 }
              }
            },
            {
              key: 'name',
              type: 'select',
              templateOptions: {
                options: this.service.getPermissions(),                
                valueProp: 'name',
                labelProp: 'name',
                label: 'Permesso',
                required: true
              }
            },
       /*      {
              key: 'guard_name',
              type: 'input',
              templateOptions: {
                disabled: true,
                label: 'Guardia',
                required: false
              }
            } */
          ]
        }
      
    }
  ];

  constructor(protected service: RoleService, protected route: ActivatedRoute, protected router: Router) {
    super(route, router);
    this.title = "Ruolo";
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/permissions', event.row.id]);
    }
  }

}
