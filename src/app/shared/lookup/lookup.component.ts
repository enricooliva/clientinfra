import { Component, OnInit, Input, Injector } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ServiceQuery } from '..';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import ControlUtils from '../dynamic-form/control-utils';
import { Page } from './page';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styles: []
})

// ng g c shared/lookup -s true  --spec false
export class LookupComponent implements OnInit {

  @Input() entityName; 
  @Input() entityLabel;

  isLoading: boolean = false;
  service: ServiceQuery;

  researchMetadata: FormlyFieldConfig[];
  form = new FormGroup({});

  model = {
    data: new Array<any>(),
  };

  resultMetadata: FormlyFieldConfig[];

  closeResult: string;
  selected: null;

  ngOnInit(): void {    
    const servicename = ControlUtils.getServiceName(this.entityName)
    this.service = this.injector.get(servicename) as ServiceQuery;

    this.researchMetadata = this.service.getMetadata();
    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatablelookup',
          wrappers: ['accordion'],      
          templateOptions: {
            label: this.entityLabel,   
            columnMode: 'force',
            scrollbarH: true,                
            hidetoolbar: true,        
            rowHeight: 50,             
            selected: [],             
            page: new Page(20),
            onDblclickRow: (event) => this.onDblclickRow(event),
            onSetPage: (pageInfo) => this.onSetPage(pageInfo)                                             
          },
          fieldArray: {
            fieldGroupClassName: 'row',   
            fieldGroup: this.researchMetadata
          }
        }
      ];

    this.selected = this.resultMetadata[0].templateOptions.selected;
  }

  

  constructor(public activeModal: NgbActiveModal, private injector: Injector) {
  
  }  


  close(){
    if (this.resultMetadata[0].templateOptions.selected.length>0)
      this.activeModal.close(this.resultMetadata[0].templateOptions.selected[0]);
  }

  onDblclickRow(event) {    
    if (event.type === 'dblclick') {          
      this.activeModal.close(event.row);
    }
  }
  
  onFind(model){
    this.querymodel.rules = model.rules;  
    this.isLoading = true;        
    try{
    this.service.query(this.querymodel).subscribe((data) => {
      const to = this.resultMetadata[0].templateOptions;
      this.isLoading = false;   
      this.model=  {
        data: data.data
      }
      to.page.totalElements = data.total; 
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



  // private getDismissReason(reason: any): string {
  //   if (reason === ModalDismissReasons.ESC) {
  //     return 'by pressing ESC';
  //   } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //     return 'by clicking on a backdrop';
  //   } else {
  //     return  `with: ${reason}`;
  //   }
  // }
}