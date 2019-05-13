import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { PermissionService } from '../../permission.service';
import { BaseResearchComponent } from 'src/app/shared/base-component/base-research.component';
import { ScadenzaService } from '../../scadenza.service';

@Component({
  selector: 'app-scadenze', 
  templateUrl: '../../../shared/base-component/base-research.component.html',
})

//ng g c application/components/classificazioni -s true --spec false -t true
export class ScadenzeComponent extends BaseResearchComponent {
  
  isLoading = false;
  
  fieldsRow: FormlyFieldConfig[] = [
          // {
          //   key: 'id',
          //   type: 'number',
          //   hide: true,                        
          //   templateOptions: {
          //     label: 'Id',
          //     disabled: true,
          //     hidden: true,
          //     column: { width: 10, cellTemplate: 'valuecolumn'}
          //   }
          // },
          {
            key: 'data_tranche',
            type: 'string',
            templateOptions: {
              label: 'Tranche prevista',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'dovuto_tranche',
            type: 'number',
            templateOptions: {
              label: 'Importo',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'convenzione.id',
            type: 'external',
            templateOptions: {
              label: 'Convenzione',
              type: 'string',
              required: true,
              entityName: 'application',
              entityLabel: 'Convenzione',
              codeProp: 'id',
              descriptionProp: 'descrizione_titolo',
              isLoading: false, 
              column: { cellTemplate: 'valuecolumn'}
            }   
          },
          // {
          //   key: 'convenzione.id',
          //   type: 'external',
          //   templateOptions: {
          //     label: 'Codice convenzione',
          //     required: true,
          //     column: { cellTemplate: 'valuecolumn'}
          //   }
          // },
          {
            key: 'convenzione.descrizione_titolo',
            type: 'string',
            templateOptions: {
              label: 'Titolo convenzione',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'state',
            type: 'string',
            templateOptions: {
              label: 'Stato',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          }

        ];

 
  resultMetadata = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],      
      templateOptions: {
        label: 'Scadenziario',   
        columnMode: 'force',
        scrollbarH: false,        
        page: new Page(25),
        hidetoolbar: true,      
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPage(pageInfo),      
      },
      fieldArray: {
        fieldGroupClassName: 'row',   
        fieldGroup: this.fieldsRow,
      }
    }
  ];

  constructor(protected service: ScadenzaService, router: Router, route: ActivatedRoute,)  {    
    super(router,route);    
    this.routeAbsolutePath = 'home/scadenze'     
    //this.title = 'Tipo pagamenti'
   
  }
 

}
