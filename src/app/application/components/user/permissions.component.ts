import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { PermissionService } from '../../permission.service';

@Component({
  selector: 'app-permissions',
  template: `
    
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '4px' }"></ngx-loading>
  <h4>Ricerca Permessi</h4>
  <app-query-builder [metadata]="this.permissionsRow[0].fieldArray.fieldGroup" (find)="onFind($event)" ></app-query-builder>

  <h4>Risultati</h4>
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="resultMetadata" [form]="form">
    
  </formly-form> 
  </form>

  <p>Form value: {{ form.value | json }}</p>
  <p>Form status: {{ form.status | json }}</p>
  
  `  
})

//ng g c submission/components/permissions -s true --spec false -t true


export class PermissionsComponent implements OnInit {
  
  isLoading = false;
  permissionsRow: FormlyFieldConfig[] = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],      
      templateOptions: {
        label: 'Permessi',   
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
            key: 'name',
            type: 'string',
            templateOptions: {
              label: 'Permesso',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'guard_name',
            type: 'string',
            templateOptions: {
              label: 'Guardia',
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
    data: new Array<any>(),
  };

  querymodel = {
    rules: new Array<any>(),    
  };

  resultMetadata: FormlyFieldConfig[] = this.permissionsRow;

  constructor(private service: PermissionService, private router: Router, private route: ActivatedRoute,)  {     
  }

  ngOnInit() {
    
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/permissions', event.row.id]);
    }
  }

  onFind(model){
    this.querymodel.rules = model.rules;  

    this.isLoading = true;    
    //this.service.clearMessage();
    try{      
      this.service.query(this.querymodel).subscribe((data) => {
        const to = this.resultMetadata[0].templateOptions;
        this.isLoading = false;   
        this.model=  {
          data: data.data
        }

        to.page.totalElements = data.total; // data.to;
        to.page.pageNumber = data.current_page-1;
        to.page.size = data.per_page;        
        
      }, err => {
        this.isLoading=false;
        console.error('Oops:', err.message);
      });
    }catch(e){
      this.isLoading = false;
      console.error(e);
    }
  }

  onSetPage(pageInfo){      
    if (pageInfo.limit)
      this.querymodel['limit']= pageInfo.limit;     
    if (this.model.data.length>0){
      this.querymodel['page']=pageInfo.offset + 1;     
      this.onFind(this.querymodel);
    }
  }

}