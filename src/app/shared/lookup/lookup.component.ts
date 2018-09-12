import { Component, OnInit, Input, Injector } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ServiceQuery } from '..';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styles: []
})

// ng g c shared/lookup -s true  --spec false
export class LookupComponent implements OnInit {

  @Input() entityname;  
  isLoading: boolean = false;
  service: ServiceQuery;

  researchMetadata: FormlyFieldConfig[];
  form = new FormGroup({});

  model = {
    data: new Array<any>(),
  };

  resultMetadata: FormlyFieldConfig[];

  closeResult: string;
  selected: [];

  ngOnInit(): void {    
    this.researchMetadata = this.service.getMetadata();
    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatable',
          wrappers: ['accordion'],      
          templateOptions: {
            label: 'Utenti',   
            columnMode: 'force',
            scrollbarH: false,        
            limit: "50",
            hidetoolbar: true, 
            selected: [],             
            onDblclickRow: (event) => this.onDblclickRow(event)                
          },
          fieldArray: {
            fieldGroupClassName: 'row',   
            fieldGroup: this.researchMetadata
          }
        }
      ];

    this.selected = this.resultMetadata[0].templateOptions.selected;
  }

  

  constructor(public activeModal: NgbActiveModal, private injector: Injector,) {
    this.service = this.injector.get('userService') as ServiceQuery;
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
    this.isLoading = true;        
    this.service.query(model).subscribe((data) => {
      this.isLoading = false;   
      this.model=  {
        data: data.data
      }
    });
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