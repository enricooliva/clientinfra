import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { fieldsForm } from '../../models/submissionForm'
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { _appIdRandomProviderFactory } from '../../../../../node_modules/@angular/core/src/application_tokens';

@Component({
  selector: 'app-user',
  template: `
  <div class="container-fluid">
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="fields" [form]="form">
    
  </formly-form> 
  </form>

  <p>Form value: {{ form.value | json }}</p>
  <p>Form status: {{ form.status | json }}</p>

  </div>
  `  
})

//ng g c submission/components/user -s true --spec false -t true


export class UserComponent implements OnInit {

  userRow: FormlyFieldConfig[] = [
    {
      key: 'users',
      type: 'datatable',
      wrappers: ['accordion'],      
      templateOptions: {
        label: 'Utenti',   
        columnMode: 'force',
        scrollbarH: false,        
        limit: "50",           
      },
      fieldArray: {
        fieldGroupClassName: 'row',
        templateOptions: {
          btnText: 'Aggiungi',
        },
        fieldGroup: [
          {
            key: 'id',
            type: 'input',
            hideExpression: false,
            templateOptions: {
              label: 'Id',
              disabled: true
            }
          },
          {
            key: 'name',
            type: 'input',
            templateOptions: {
              label: 'Nome utente',
              required: true
            }
          },
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              label: 'Email',
              required: true
            }
          }
        ]
      }
    }
  ];

  form = new FormGroup({});

  model = {
    users: new Array<any>(),
  };

  fields: FormlyFieldConfig[] = this.userRow;

  constructor(private userService: UserService) {     
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.model = {
        users: data
      };

    });
  }

}
