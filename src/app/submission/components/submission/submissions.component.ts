import { Component, OnInit, Injector } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { ServiceQuery } from '../../../shared';
import ControlUtils from '../../../shared/dynamic-form/control-utils';



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

  
  constructor(private injector: Injector) { }

  ngOnInit() {

    const servicename = ControlUtils.getServiceName('submission');
    this.service = this.injector.get(servicename) as ServiceQuery;

    this.researchMetadata = this.service.getMetadata();
    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatable',
          wrappers: ['accordion'],      
          templateOptions: {
            label: 'Domande',   
            columnMode: 'force',
            scrollbarH: true,        
            limit: "50",
            hidetoolbar: true, 
            selected: [],                         
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


  onFind(model){
    this.isLoading = true;    
    //this.service.clearMessage();
    try{
      this.service.query(model).subscribe((data) => {
        this.isLoading = false;   
        this.model=  {
          data: data.data
        }
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
