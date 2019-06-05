import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserComponent } from './user.component';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared';

@Component({
  selector: 'app-users',
  templateUrl: '../../../shared/base-component/base-research.component.html',
})

//ng g c submission/components/user -s true --spec false -t true


export class UsersComponent extends BaseResearchComponent {
  
  isLoading = false;
  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'id',
            type: 'number',            
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
        ];


  resultMetadata: FormlyFieldConfig[] = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],      
      templateOptions: {
        label: 'Utenti',   
        columnMode: 'force',
        scrollbarH: false,        
        page: new Page(25),
        hidetoolbar: true,      
        // modalità implicità di costruzione delle colonne 
        // columns: [
        //   { name: 'Id', prop: 'id', width: 10},
        //   { name: 'Nome utente', prop: 'name' },
        //   { name: 'Email', prop: 'email' },
        // ],
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPage(pageInfo),       
      },
      fieldArray: {
        fieldGroupClassName: 'row',   
        fieldGroup: this.fieldsRow,
      }
    }];

  constructor(protected service: UserService, protected router: Router, protected route: ActivatedRoute) {
    super(router,route);
    this.routeAbsolutePath = 'home/users'
    //this.title = "utenti"
  }

}
