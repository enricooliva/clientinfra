import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserComponent } from './user.component';
import { Page } from 'src/app/shared/lookup/page';

@Component({
  selector: 'app-users',
  template: `
    
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '4px' }"></ngx-loading>
  <h4>Ricerca Utenti</h4>
  <app-query-builder [metadata]="this.userRow[0].fieldArray.fieldGroup" (find)="onFind($event)" ></app-query-builder>

  <h4>Risultati</h4>
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="resultMetadata" [form]="form">
    
  </formly-form> 
  </form>

  <p>Form value: {{ form.value | json }}</p>
  <p>Form status: {{ form.status | json }}</p>
  
  `  
})

//ng g c submission/components/user -s true --spec false -t true


export class UsersComponent implements OnInit {
  
  isLoading = false;
  userRow: FormlyFieldConfig[] = [
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
        fieldGroup: [
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


  resultMetadata: FormlyFieldConfig[] = this.userRow;

  constructor(private service: UserService, private router: Router, private route: ActivatedRoute,)  {     
  }

  ngOnInit() {
    
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/users', event.row.id]);
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
  //senza paginazione
/*   onFind(model){
    this.isLoading = true;    
    this.userService.clearMessage();
    this.userService.query(model).subscribe((data) => {
      this.isLoading = false;   

      this.model=  {
        data: data.data
      }
    });
  } */
  
  onSetPage(pageInfo){      
    if (pageInfo.limit)
      this.querymodel['limit']= pageInfo.limit;     
    if (this.model.data.length>0){
      this.querymodel['page']=pageInfo.offset + 1;     
      this.onFind(this.querymodel);
    }
  }
}
