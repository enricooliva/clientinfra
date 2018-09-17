import { Component, OnInit, Injector } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { ServiceQuery } from '../../../shared';
import ControlUtils from '../../../shared/dynamic-form/control-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { Page } from '../../../shared/lookup/page';



@Component({
  selector: 'app-submissions',
  template: `

  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '4px' }"></ngx-loading>

  <h4>Ricerca</h4>
  <app-query-builder [metadata]="researchMetadata" (find)="onFind($event)" ></app-query-builder>

  <h4>Risultati</h4>
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="resultMetadata" [form]="form">
    
  </formly-form> 
  </form>

  <p>Form value: {{ form.value | json }}</p>
  <p>Form status: {{ form.status | json }}</p>
  `,
  styles: []
})

//ng g c submission/components/submission/submissions -s true --spec false -t true --flat true

export class SubmissionsComponent implements OnInit {
  isLoading: boolean = false;
  service: ServiceQuery;

  researchMetadata: FormlyFieldConfig[];
  form = new FormGroup({});

  model = {
    data: new Array<any>(),
  };

  resultMetadata: FormlyFieldConfig[];

  
  constructor(private injector: Injector, private router: Router ) { }

  ngOnInit() {

    const servicename = ControlUtils.getServiceName('submission');
    this.service = this.injector.get(servicename) as ServiceQuery;

    this.researchMetadata = this.service.getMetadata();
    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatablelookup',
          wrappers: ['accordion'],      
          templateOptions: {
            label: 'Domande',   
            columnMode: 'force',
            headerHeight: 50,
            footerHeight: 50,
            scrollbarH: true,             
            hidetoolbar: true, 
            selected: [],                        
            page: new Page(2),
            onDblclickRow: (event) => this.onDblclickRow(event),
            onSetPage: (pageInfo) => this.onSetPage(pageInfo)                                     
          },
          fieldArray: {
            fieldGroupClassName: 'row',   
            fieldGroup: this.researchMetadata.map(x => {
              x.templateOptions.column = { cellTemplate: 'valuecolumn'};
              return x;
            })
          }
        }
      ];

  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/submission', event.row.id]);
    }
  }
  
  querymodel = {
    rules: new Array<any>(),    
  };

  onSetPage(pageInfo){      
    if (pageInfo.limit)
      this.querymodel['limit']= pageInfo.limit;     
    if (this.model.data.length>0){
      this.querymodel['page']=pageInfo.offset + 1;     
      this.onFind(this.querymodel);
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

}
