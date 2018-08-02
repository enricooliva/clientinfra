import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { fieldsForm } from '../../models/submissionForm'
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user',
  template: `
  
  <div class="container-fluid">
  <div class="btn-toolbar mb-4" role="toolbar">
  <div class="btn-group btn-group-sm">    
     
    <button class="btn btn-outline-primary border-0 rounded-0">
        <span class="oi oi-reload iconic" title="reload" aria-hidden="true"></span>
        <span class="ml-2">Ricarica</span>
    </button>   

  </div>
  </div>

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


export class UsersComponent implements OnInit {
  
 
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
        hidetoolbar: true,      
        // modalità implicità di costruzione delle colonne 
        // columns: [
        //   { name: 'Id', prop: 'id', width: 10},
        //   { name: 'Nome utente', prop: 'name' },
        //   { name: 'Email', prop: 'email' },
        // ],
        onDblclickRow: (event) => this.onDblclickRow(event)    
      },
      fieldArray: {
        fieldGroupClassName: 'row',   
        fieldGroup: [
          {
            key: 'id',
            type: 'input',
            hideExpression: false,
            templateOptions: {
              label: 'Id',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'name',
            type: 'input',
            templateOptions: {
              label: 'Nome utente',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'email',
            type: 'input',
            templateOptions: {
              label: 'Email',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
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

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,)  {     
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((data) => {
      this.model = {
        users: data
      };

    });
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/user', event.row.id]);
    }
  }


}
