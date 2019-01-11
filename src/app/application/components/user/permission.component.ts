import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-permission',
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
  <h4>Permesso</h4>
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="fields" [form]="form" [options]="options">
    
  </formly-form> 
  </form>

  </div>
  `
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class PermissionComponent implements OnInit {
  
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

  options: FormlyFormOptions = {};
  
  form = new FormGroup({});

  model = { };

  fields: FormlyFieldConfig[] = this.userRow;

  constructor(private service: PermissionService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.clearMessage();
      this.service.getPermission(params['id']).subscribe((data) => {
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

  
}
