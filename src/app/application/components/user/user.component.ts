import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';

@Component({
  selector: 'app-user',
  templateUrl: '../../../shared/base-component/base-entity.component.html',
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>



//ng g c application/components/user -s true --spec false -t true

export class UserComponent extends BaseEntityComponent {
  
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
            label: 'Nome utente',
            required: true
          }
        },
        {
          key: 'email',
          type: 'input',
          className: "col-md-5",
          templateOptions: {
            label: 'Email',
            required: true
          },
        }
      ]
    },
    {
      key: 'roles',
      type: 'datatable',
      wrappers: ['accordion'],
      templateOptions: {
        label: 'Ruoli',
        columnMode: 'flex',
        scrollbarH: false,
        limit: "50",
        onDblclickRow: (event) => this.onDblclickRow(event),
      },
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: [
          // {
          //   key: 'id',
          //   type: 'number',
          //   templateOptions: {
          //     label: 'Id',
          //     disabled: true,
          //     hidden: true,
          //     column: { width: 3 }
          //   }
          // },
          {
            key: 'name',
            type: 'select',
            templateOptions: {
              options: this.service.getRoles(),
              valueProp: 'name',
              labelProp: 'name',
              label: 'Ruolo',
              required: true,
              column: { flexGrow: 3 },              
            }
          },
          // {
          //   type: 'button',
          //   //className: "col-md-4",
          //   templateOptions: {
          //     icon: 'oi oi-external-link',
          //     btnType: 'btn-outline-primary',
          //     onClick: ($event) => {},
          //     column: { flexGrow: 1 },   
          //   },
          // },
        ]
      },
    },
    {      
      template: '<div class="mt-2"></div>',
    },
    {
        key: 'permissions',
        type: 'datatable',
        wrappers: ['accordion'],
        templateOptions: {
          label: 'Permessi',
          columnMode: 'force',
          scrollbarH: false,
          limit: "50",
        },

        fieldArray: {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // {
            //   key: 'id',
            //   type: 'input',
            //   templateOptions: {
            //     label: 'Id',
            //     disabled: true,                
            //     column: { width: 5 }
            //   }
            // },
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
            // {
            //   key: 'guard_name',
            //   type: 'input',
            //   templateOptions: {
            //     label: 'Guardia',
            //     disabled: true,
            //     required: false
            //   }
            // }
          ]
        }
      
    }
  ];

  constructor(protected service: UserService, protected route: ActivatedRoute, protected router: Router) {
    super(route,router);
    this.title = "Utente";
    this.researchPath = "home/users";
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      if (event.row.id){
        this.router.navigate(['home/roles', event.row.id]);
      }
    }
  }
  
  onReload() {    
    if (this.model['id']) {
      this.isLoading = true;      
      this.service.getById(this.model['id']).subscribe((data) => {                
        this.model = JSON.parse(JSON.stringify(data));
        this.options.updateInitialValue();
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        //this.service.messageService.error(error);          
      });    
    }
  }
}
