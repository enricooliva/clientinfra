import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupComponent } from '../lookup/lookup.component';

@Component({
  selector: 'app-externalquery',
  template: `
  <formly-field *ngIf="codeField"  
    [form]="form"
    [field]="codeField"
    [options]="options">      
  </formly-field> 
  `,
  styles: []
})
export class ExternalqueryComponent  extends FieldType implements OnInit {
  codeField: FormlyFieldConfig;
  constructor(private formlyConfig: FormlyConfig,  private modalService: NgbModal, public activeModal: NgbActiveModal) {
    super();
   }

  ngOnInit() {    
    this.field.wrappers = [];   
    if (this.codeField == undefined) {
      let tmpfield = {
        ...this.field,
        wrappers: ['addons'],
        templateOptions: { 
          ...this.field.templateOptions,
          keyup: (field, event: KeyboardEvent ) => { 
            if (event.key == "F4" ){
              this.open();
            }          
          },                                
          addonRight:{
            class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center',      
            onClick: (to, fieldType, $event) => this.open(),
          }
        },        
        type: this.field.templateOptions.type,      
      }
      this.codeField = tmpfield;
    }  
  }

  open() {
    const modalRef = this.modalService.open(LookupComponent, {
      size: 'lg'
    })
    modalRef.result.then((result)=>{      
      this.setcode(result);   
    },(reason) => {      
    });
    modalRef.componentInstance.entityName = this.to.entityName;
    modalRef.componentInstance.rules = this.to.rules ? this.to.rules : null;
  }  

  setcode(data: any){
    if (this.field.templateOptions.codeProp in data)
      this.codeField.formControl.setValue(data[this.field.templateOptions.codeProp]);
  }

}
