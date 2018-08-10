import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { fieldsForm } from '../../models/submissionForm'
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserComponent } from './user.component';

@Component({
  selector: 'app-user',
  template: `


  <div class="container-fluid">
    
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '14px' }"></ngx-loading>

  <div class="btn-toolbar mb-4" role="toolbar">
  <div class="btn-group btn-group-sm">    
     
    <button class="btn btn-outline-primary border-0 rounded-0" (click)="onFind()">
        <span class="oi oi-magnifying-glass iconic" title="reload" aria-hidden="true" ></span>
        <span class="ml-2">Cerca</span>
    </button>   

  </div>
  </div>

  <app-query-builder [metadata]="this.userRow[0].fieldArray.fieldGroup" (find)="onFind($event)" ></app-query-builder>

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
  
  isLoading = false;
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
            type: 'number',
            hideExpression: false,
            templateOptions: {
              label: 'Id',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'name',
            type: 'string',
            templateOptions: {
              label: 'Nome utente',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'email',
            type: 'string',
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
    
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/user', event.row.id]);
    }
  }

  onFind(model){
    this.isLoading = true;    
    this.userService.query(model).subscribe((data) => {
      this.isLoading = false;
      this.model = {
        users: data.data
      };

    });
  }

}
