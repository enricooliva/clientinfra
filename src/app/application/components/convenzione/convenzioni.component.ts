import { Component, OnInit, Injector, ViewChild, TemplateRef } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { ServiceQuery } from '../../../shared';
import ControlUtils from '../../../shared/dynamic-form/control-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { Page } from '../../../shared/lookup/page';




@Component({
  selector: 'app-convenzionis',
  template: `

  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '4px' }"></ngx-loading>
  
  <app-query-builder [metadata]="researchMetadata" (find)="onFind($event)" ></app-query-builder>

  <h4>Risultati</h4>  
  <form [formGroup]="form" >
  <formly-form [model]="model" [fields]="resultMetadata" [form]="form">
    
  </formly-form> 
  </form>

  <ng-template #detailRow
    let-row="row"
    let-expanded="expanded"
    ngx-datatable-row-detail-template>

    <!-- Esempio di uso tabella di riga di dettaglio
    <ngx-datatable #mydatatable class="bootstrap" [headerHeight]="20" [limit]="5" [columnMode]="'standard'" [footerHeight]="0" [rowHeight]="'auto'" [rows]="row.aziende">
      <ngx-datatable-column name="Codice azienda" [width]="200" prop="id"></ngx-datatable-column>
      <ngx-datatable-column name="Denominazione" [width]="400" prop="denominazione"></ngx-datatable-column>
    </ngx-datatable> -->

  <div *ngFor="let azienda of row.aziende" style="padding-left: 35px" class="m-t-5">
    <div><strong>Azienda</strong></div>        
    <div class="container-fluid">
      <div class="row">
          <label class="control-label mr-1">Codice:</label>
          <div class="mr-2">{{ azienda.id }} </div>
          <label class="control-label mr-1">Denominazione:</label>
          <div class=" mr-1">{{ azienda.denominazione }} </div>
      </div>
    </div>
    <!--<div>{{ azienda.id }}, {{ azienda.denominazione }}</div>-->
  </div>

  </ng-template>


  `,
  styles: []
})

//ng g c submission/components/submission/submissions -s true --spec false -t true --flat true

export class ConvenzioniComponent implements OnInit {
  isLoading: boolean = false;
  service: ServiceQuery;

  @ViewChild('detailRow') detailRow: TemplateRef<any>;
  
  researchMetadata: FormlyFieldConfig[];
  form = new FormGroup({});

  model = {
    data: new Array<any>(),
  };
  resultMetadata: FormlyFieldConfig[];

  testgrid = [
    {
      key: 'data',
      type: 'gridtable',
      className: 'ag-theme-balham',
      templateOptions: {
        //height: '200px',        
        gridOptions: {  
          defaultColDef: { resizable: true, sortable: true, filter: true},        // width: 100,
          rowSelection: 'single',          
          columnDefs: [
            {
              headerName: 'Id',
              field: 'id',                            
            },
            {
              headerName: 'Codice utente',
              field: 'user_id',
                        
            },
            {
              headerName: 'Descrizione titolo',
              field: 'descrizione_titolo',              
            },
            {
              headerName: 'Dipartimento',
              field: 'dipartimemto_cd_dip',              
            },
            {
              headerName: 'Responsabile scientifico',
              field: 'resp_scientifico',              
            },
            {
              headerName: 'Azienda',
              field: 'azienda',              
            },
            {
              headerName: 'Tipo convenzione',
              field: 'convenzione_type',              
            },
            {
              headerName: 'Ambito',
              field: 'ambito',              
            },
            {
              headerName: 'Modalità di pagamento',
              field: 'tipopagamenti_codice',              
            },
            {
              headerName: 'Corrispettivo',
              field: 'corrispettivo',              
            },
            {
              headerName: 'Stato',
              field: 'current_place',              
            },
          ],
        },
      },
    },
  ];
  
  constructor(private injector: Injector, private router: Router) { }

  ngOnInit() {

    const servicename = ControlUtils.getServiceName('application');
    this.service = this.injector.get(servicename) as ServiceQuery;

    this.researchMetadata = this.service.getMetadata();
    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatablelookup',
          wrappers: ['accordion'],      
          templateOptions: {
            label: 'Convenzioni',   
            columnMode: 'force',
            headerHeight: 50,
            footerHeight: 50,            
            scrollbarH: true,             
            hidetoolbar: true, 
            detailRow: this.detailRow,
            selected: [],                        
            page: new Page(25),       
            onDblclickRow: (event) => this.onDblclickRow(event),
            onSetPage: (pageInfo) => this.onSetPage(pageInfo)                                     
          },
          fieldArray: {
            fieldGroupClassName: 'row',   
            fieldGroup: Array<any>(
              {                                                                               
                templateOptions: {                    
                  column: {  
                    minWidth: 50,
                    resizable: false,
                    canAutoResize: false,              
                    cellTemplate: 'expaderdetailcolumn',
                  }
                },
              }              
            ).concat(this.researchMetadata.filter(x=>x.key != 'aziende.id').map(x => {
              x.templateOptions.column = { 
                cellTemplate: 'valuecolumn',
                //minWidth: 200
              };
              return x;
            }))
          }
        }
      ];

  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/convenzioni', event.row.id]);
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
