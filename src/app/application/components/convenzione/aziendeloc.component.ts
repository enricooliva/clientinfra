import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared/base-component/base-research.component';
import { AziendaLocService } from '../../aziendaloc.service';

@Component({
  selector: 'app-aziendeloc', 
  templateUrl: '../../../shared/base-component/base-research.component.html',
})

//ng g c submission/components/permissions -s true --spec false -t true
export class AziendeLocComponent extends BaseResearchComponent {
  
  isLoading = false;
  
  fieldsRow: FormlyFieldConfig[] = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],      
      templateOptions: {
        label: 'Aziende',   
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
            key: 'nome',
            type: 'input',
            templateOptions: {
              label: 'Nome',
              required: true,
              column: { cellTemplate: 'valuecolumn' }
            }
          },
          {
            key: 'cognome',
            type: 'string',
            templateOptions: {
              label: 'Cognome',
              required: true,
              column: { cellTemplate: 'valuecolumn' }
            }
          },
          {
            key: 'denominazione',
            type: 'string',
            templateOptions: {
              label: 'Denominazione',
              required: true,
              column: { cellTemplate: 'valuecolumn' }
            }
          },
          {
            key: 'pec_email',
            type: 'string',
            templateOptions: {
              label: 'Email',
              required: true,
              column: { cellTemplate: 'valuecolumn' }
            }
          },
        ],
      }
    }
  ];
 
  resultMetadata = this.fieldsRow;

  constructor(protected service: AziendaLocService, router: Router, route: ActivatedRoute,)  {    
    super(router,route);    
    this.routeAbsolutePath = 'home/aziendeloc'          
  }
 

}
