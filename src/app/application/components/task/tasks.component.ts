import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { PermissionService } from '../../permission.service';
import { BaseResearchComponent } from 'src/app/shared';
import { UserTaskService } from '../../usertask.service';

@Component({
  selector: 'app-tasks',
  templateUrl: '../../../shared/base-component/base-research.component.html',
})

//ng g c submission/components/permissions -s true --spec false -t true


export class TasksComponent extends BaseResearchComponent {
  
  isLoading = false;
  fieldsRow: FormlyFieldConfig[] = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],      
      templateOptions: {
        label: 'Attività',   
        columnMode: 'force',
        scrollbarH: false,        
        page: new Page(25),
        hidetoolbar: true,      
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPage(pageInfo),      
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
            key: 'email',
            type: 'string',
            templateOptions: {
              label: 'Assegnata',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'subject',
            type: 'string',
            templateOptions: {
              label: 'Oggetto',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'tasktype.descrizione',
            type: 'string',
            templateOptions: {
              label: 'Tipo',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          }

        ]
      }
    }
  ];

  resultMetadata = this.fieldsRow;

  constructor(protected service: UserTaskService, protected router: Router, protected route: ActivatedRoute,)  {    
    super(router,route)
    this.routeAbsolutePath = 'home/tasks';    
    //this.title = "IN LAVORAZIONE"
  }

}
