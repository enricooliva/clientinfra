import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { RoleService } from '../../role.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-role',
  template: `
  <div class="container-fluid">
  
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '14px' }"></ngx-loading>

  <div class="sticky-top btn-toolbar mb-4" role="toolbar">
  <div class="btn-group">       
    <button class="btn btn-outline-primary border-0 rounded-0" [disabled]="!form.valid || !form.dirty" (click)="onSubmit()" >              
        <span class="oi oi-arrow-top"></span>  
        <span class="ml-2">Aggiorna</span>        
    </button>
    <button class="btn btn-outline-primary border-0 rounded-0" (click)="onReload()"  [disabled]="!form.dirty">
        <span class="oi oi-reload iconic" title="reload" aria-hidden="true" ></span>
        <span class="ml-2">Ricarica</span>
    </button>   
    <button class="btn btn-outline-primary border-0 rounded-0">
        <span class="oi oi-magnifying-glass"></span>
        <span class="ml-2">Ricerca</span>
    </button>
  </div>
  </div>
  <h4>Ruolo</h4>
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="fields" [form]="form"  [options]="options">
    
  </formly-form> 
  </form>

  </div>
  <div class='mt-2'></div>
  `
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class RoleComponent implements OnInit {
  
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

  options: FormlyFormOptions = {};
  
  form = new FormGroup({});

  model = {
    roles: new Array<any>(),
  };

  fields: FormlyFieldConfig[] = this.userRow;

  constructor(private service: RoleService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.clearMessage();
      this.service.getRole(params['id']).subscribe((data) => {
        this.isLoading = false;
        this.model = data;
      });

    });
  }

  onRemove() {
    this.service.remove(this.model['id']).subscribe(
      prop => {
        this.model = null;
      },
      error => { // error path

      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      this.service.update(tosubmit, tosubmit.id).subscribe(
        result => {
          //this.options.resetModel(result);
          this.options.resetModel(result);               
          this.isLoading = false;
        },
        error => {
          this.isLoading = false;
          this.service.messageService.error(error);
          console.log(error)
        });
    }
  }

  onReload() {
    //TODO
  }

  get isReloadable() {
    if (this.model == null)
      return false;

    return this.model['id'] != null;
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/permissions', event.row.id]);
    }
  }

}
