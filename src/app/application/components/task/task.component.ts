import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import { UserTaskService } from '../../usertask.service';

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
          {
            className: 'col-md-6',
            type: 'select',
            key: 'transition',
            defaultValue: 'self_transition',
            templateOptions: {
              label: 'Stato',
              placeholder: '',
              options: []
            },
            lifecycle: {
              onInit: (form, fieldInit) => {
                //fieldInit.templateOptions.options = this.service.getNextPossibleActionsFromTask(form.get('id').value);
              },
            },
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
            key: 'model',
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
            type: 'input',
            key: 'email',
            templateOptions: {
              label: "Assegnata",
              disabled: true,
            },
          },
          {           
            type: 'input',
            key: 'subject',
            templateOptions: {
              label: 'Oggetto',
              disabled: true,
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
    this.title = 'Permesso IN LAVORAZIONE'
    this.activeNew =true;
    this.researchPath = 'home/tasks'
    this.newPath = 'home/tasks/new'
  }

}
