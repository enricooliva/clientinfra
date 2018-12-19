import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  template: `
  <div class="container-fluid">
  
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '14px' }"></ngx-loading>

  <div class="btn-toolbar mb-4" role="toolbar">
  <div class="btn-group btn-group-sm">    
    <button class="btn btn-outline-primary border-0 rounded-0" [disabled]="!form.valid" (click)="onSubmit()" >              
        <span class="oi oi-arrow-top"></span>  
        <span class="ml-2">Aggiorna</span>
    </button>
    <button class="btn btn-outline-primary border-0 rounded-0" [disabled]="!isReloadable">
        <span class="oi oi-reload iconic" title="reload" aria-hidden="true"></span>
        <span class="ml-2">Ricarica</span>
    </button>   
    <button class="btn btn-outline-primary border-0 rounded-0"  [disabled]="!form.valid" (click)="onRemove()">
        <span class="oi oi-trash"></span>
        <span class="ml-2">Rimuovi</span>
      </button>
  </div>
  </div>
  <h4>Utente</h4>
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="fields" [form]="form">
    
  </formly-form> 
  </form>

  </div>
  `
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>



//ng g c submission/components/user -s true --spec false -t true


export class UserComponent implements OnInit {
  isLoading = true;
  userRow: FormlyFieldConfig[] = [
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
            columnMode: 'force',
            scrollbarH: false,
            limit: "50",
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
                  column: { width: 10 }      
                }
              },
              {
                key: 'name',
                type: 'input',
                templateOptions: {
                  label: 'Ruolo',
                  required: true
                }
              },
              {
                key: 'email',
                type: 'input',
                templateOptions: {
                  label: 'Guardia',
                  required: false
                }
              }
            ]
          }
        }
  ];

  form = new FormGroup({});

  model = {
    roles: new Array<any>(),
  };

  fields: FormlyFieldConfig[] = this.userRow;

  constructor(private userService: UserService, private route:ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userService.clearMessage();
      this.userService.getUser(params['id']).subscribe((data) => {
        this.isLoading = false;
        this.model = data;
      });
  
    });
  }

  onRemove() {
    this.userService.remove(this.model['id']).subscribe(
      prop => {
        this.model = null;
      },      
      error => { // error path
        
      }
    );
  }

  onSubmit(){
    console.log("TODO");
  }

  get isReloadable(){
    if (this.model == null)
      return false;

    return this.model['id'] != null;
  }

}
