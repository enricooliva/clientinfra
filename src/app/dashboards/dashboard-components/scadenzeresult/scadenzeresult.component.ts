import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { ApplicationService } from 'src/app/application';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Page } from 'src/app/shared/lookup/page';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ScadenzaService } from 'src/app/application/scadenza.service';

@Component({
  selector: 'app-scadenzeresult',
  templateUrl: './scadenzeresult.component.html', 
  styles: []
})
export class ScadenzeresultComponent implements OnInit {
  isLoading: boolean = false;
  @ViewChild('detailRow') detailRow: TemplateRef<any>;
    
  @Input() 
  querymodel: any;

  form = new FormGroup({});
  model = {
    data: new Array<any>(),
  }; 
  
  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'id',
            type: 'number',                              
            templateOptions: {
              label: 'Codice',
              disabled: true,              
              column: { width: 50, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'data_tranche',
            type: 'date',
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
          // {
          //   key: 'convenzione.id',
          //   type: 'external',
          //   templateOptions: {
          //     label: 'Convenzione',
          //     type: 'string',
          //     required: true,
          //     entityName: 'application',
          //     entityLabel: 'Convenzione',
          //     codeProp: 'id',
          //     descriptionProp: 'descrizione_titolo',
          //     isLoading: false, 
          //     column: { cellTemplate: 'valuecolumn'}
          //   }   
          // },
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
            type: 'select',
            templateOptions: {
              label: 'Stato',         
              options: [
                { label: 'Attiva', value: 'attivo' },
                { label: 'In emissione', value: 'inemissione' },
                //{ label: 'Emessa', value: 'emesso' },
                { label: 'In pagamento ', value: 'inpagamento' },
                { label: 'Pagata ', value: 'pagato' },
              ],
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
        label: 'Risultati',   
        columnMode: 'force',
        scrollbarH: true,        
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
  
  constructor(private service: ScadenzaService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit() { 
  
      if (!this.querymodel){
        const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy')   
        this.querymodel.rules =  [
          { value: today, field: "data_tranche", operator: ">=", type: "date" },
          { value: 'pagato', field: "stato", operator: "!=", type: "string" }
        ];           
      }
      this.onFind(this.querymodel);
      
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/scadenze', event.row.id]);
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
