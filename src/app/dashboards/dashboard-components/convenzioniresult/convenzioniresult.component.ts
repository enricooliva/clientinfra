import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
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

  @Input() 
  querymodel: any;

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
            onSetPage: (pageInfo) => this.onSetPage(pageInfo),
            columns:[              
              {name: "Id", prop: "id"},
              {name: "Codice utente", prop: "user_id"},
              {name: "Descrizione Titolo", prop: "descrizione_titolo"},
              {name: "Dipartimento", prop: "dipartimemto_cd_dip"},
              {name: "Responsabile scientifico", prop: "resp_scientifico"},
              {name: "Tipo convenzione", prop: "convenzione_type"},
              {name: "Ambito", prop: "ambito"},
              {name: "Modalità di pagamento", prop: "tipopagamenti_codice"},
              {name: "Corrispettivo iva esclusa se applicabile", prop: "corrispettivo"},
              {name: "Data inizio", prop: "data_inizio_conv"},
              {name: "Data fine", prop: "data_fine_conv"},
              {name: "Stato", prop: "current_place"},
            ]                                     
          },
        }
      ];

      this.onFind(this.querymodel);
      
  }

  onDblclickRow(event) {
    //, {relativeTo: this.route}
    if (event.type === 'dblclick') {          
      this.router.navigate(['home/convenzioni', event.row.id]);
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
