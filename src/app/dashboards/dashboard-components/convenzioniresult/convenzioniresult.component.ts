import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ApplicationService } from 'src/app/application';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Page } from 'src/app/shared/lookup/page';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-convenzioniresult',
  templateUrl: './convenzioniresult.component.html', 
  styles: []
})
export class ConvenzioniresultComponent implements OnInit {
  isLoading: boolean = false;
  @ViewChild('detailRow') detailRow: TemplateRef<any>;
  
  researchMetadata: FormlyFieldConfig[];
  form = new FormGroup({});

  model = {
    data: new Array<any>(),
  };
  resultMetadata: FormlyFieldConfig[];
  
  constructor(private service: ApplicationService, private router: Router, private datePipe: DatePipe) { }

  ngOnInit() {

    this.researchMetadata = this.service.getMetadata();
    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatablelookup',
          wrappers: ['accordion'],      
          templateOptions: {
            label: 'Risultati',   
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

      const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy')   
      this.querymodel.rules =  [
        { value: today, field: "data_inizio_conv", operator: ">=", type: "date" },
        { value: today, field: "data_fine_conv", operator: "<=", type: "date" }
      ],     
      this.onFind(this.querymodel);
      
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/convenzioni', event.row.id]);
    }
  }
  
  querymodel = {
    rules: Array<any>()
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
