import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import { UserTaskService } from '../../usertask.service';
import { of } from 'rxjs/internal/observable/of';
import { takeUntil, startWith, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  templateUrl: '../../../shared/base-component/base-entity.component.html'
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class TaskComponent extends BaseEntityComponent {
  
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Dettaglio attività</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup:
        [
          {
            className: 'col-md-2',
            type: 'number',
            key: 'id',
            templateOptions: {
              label: 'Id',
              disabled: true,
            },
          },
          // {
          //   className: 'col-md-5',
          //   type: 'input',
          //   key: 'state',
          //   templateOptions: {
          //     label: 'Stato',
          //     disabled: true,
          //   },    
          // },
          {
            className: 'col-md-5',
            type: 'select',
            key: 'transition',        
            defaultValue: 'self_transition',
            templateOptions: {
              label: 'Prossima azione', 
              options:[],                         
            },        
            expressionProperties: {
              'templateOptions.options':(model: any, formState: any) => {
                  if (model['transitions']){
                    return model['transitions'];
                  }
              }
            }           
          },
        ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup:
        [
          {
            className: 'col-md-6',
            type: 'input',
            key: 'workflow_place',
            templateOptions: {
              label: 'Flusso',
              disabled: true,
            },
          },
          {
            className: 'col-md-6',
            type: 'input',
            key: 'model_type',
            templateOptions: {
              label: 'Entità associata',
              disabled: true,
            },
          },
        ]
    },
    {
      fieldGroup:
        [
          {
            key: 'unitaorganizzativa_uo',                   
            type: 'select',           
            templateOptions:{
              label: 'Ufficio affidatario procedura',          
              required: true,
              options: this.service.getValidationOffices(),
              valueProp: 'uo',
              labelProp: 'descr',                           
            },
            expressionProperties: {
              'templateOptions.disabled': (model: any, formState: any) => { return model.id; },
            },
          },
          {
            key: 'email',                   
            type: 'select',
            templateOptions:{
              label: 'Assegnamento attività',   
              valueProp: 'id',
              labelProp: 'descr',                                        
            },         
            lifecycle: {
              onInit: (form, field) => {                
                form.get('unitaorganizzativa_uo').valueChanges.pipe(                    
                  takeUntil(this.onDestroy$),
                  startWith(form.get('unitaorganizzativa_uo').value),
                  filter(ev => ev !== null),
                  tap(uo => {
                    //field.formControl.setValue('');
                    field.templateOptions.options = this.service.getValidationOfficesPersonale(uo);

                  }),
                ).subscribe();
              },
            },
            
          },
          {           
            type: 'input',
            key: 'subject',
            templateOptions: {
              label: 'Oggetto',             
            },
          },
          {           
            type: 'textarea',
            key: 'description',
            templateOptions: {
              label: 'Descrizione',
              rows: 2,
            },
          },
        ]
    }
  ];

  constructor(protected service: UserTaskService, protected route: ActivatedRoute, protected router: Router) {
    super(route,router)
    //this.title = 'Permesso IN LAVORAZIONE'
    this.activeNew =true;
    this.researchPath = 'home/tasks'
    this.newPath = 'home/tasks/new'
  }


  protected additionalFormInitialize() {
    this.service.create().subscribe((data) => {
      this.isLoading = false;
      this.model = JSON.parse(JSON.stringify(data));
    });
  }

}
