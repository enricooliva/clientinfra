import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyFieldInput } from '@ngx-formly/bootstrap';
import { takeUntil, startWith, tap, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ServiceQuery } from '../query-builder/query-builder.interfaces';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupComponent } from '../lookup/lookup.component';
import ControlUtils from './control-utils';

@Component({
  selector: 'app-external-type',
  template: `                
    <div class="form-group form-row" style="position: relative">    
    <ngx-loading [show]="isLoading" [config]="{  fullScreenBackdrop: false, backdropBorderRadius: '4px' }"></ngx-loading>
    <formly-field *ngIf="codeField"
      class="col-md-4" 
      [form]="form"
      [field]="codeField"
      [options]="options">      
    </formly-field> 
    <div class="col-md-8">    
      <Label *ngIf="descriptionField.templateOptions.label">{{ descriptionField.templateOptions.label }} </Label>
      <input type="text" class="form-control" [value]="extDescription"  readonly>    
    </div>    
   </div>   
  `,
  styles: []
})

// <formly-field *ngIf="descriptionField"
//       class="col-md-8" 
//       [form]="form"
//       [field]="descriptionField"
//       [options]="options">
//     </formly-field>      

export class ExternalTypeComponent extends FieldType implements OnInit, OnDestroy {
  codeField: FormlyFieldConfig;
  descriptionField: FormlyFieldConfig;
  extDescription = null;
  onDestroy$ = new Subject<void>();
  service: ServiceQuery;
  public isLoading = false;

  nodecode = false;

  constructor(private formlyConfig: FormlyConfig, private injector: Injector, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    super();           
  }

  ngOnInit() {
    const servicename = ControlUtils.getServiceName(this.to.entityName)
    this.service = this.injector.get(servicename) as ServiceQuery;

    this.field.wrappers = [];   
    if (this.codeField == undefined) {
      let tmpfield = {
        ...this.field,
        wrappers: ['form-field','addons'],//addons
        templateOptions: { 
          ...this.field.templateOptions,
          keyup: (field, event: KeyboardEvent ) => { 
            if (event.key == "F4" ){
              this.open();
            }          
          },                
          //e necessario inserire anche updateon blur nel principale 
          modelOptions: {
            updateOn: 'blur'
          },          
          addonRight:{
             class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center',      
             onClick: (to, fieldType, $event) => this.open(),
          }
        },        
        type: this.field.templateOptions.type,            
        lifecycle: {          
          onInit: (form, field) => {
                                  
            field.formControl.valueChanges.pipe(
              distinctUntilChanged(),             
              takeUntil(this.onDestroy$),              
              startWith(field.formControl.value),
              tap(selectedField => {                
                if (field.formControl.value && !this.nodecode){
                  setTimeout(()=> { this.isLoading = true; }, 0);
                  this.service.getById(field.formControl.value).subscribe((data)=> {
                    setTimeout(()=> { this.isLoading = false; }, 0);
                    if (data == null )
                    {
                      this.extDescription = null;
                      field.formControl.setErrors({ notfound: true});
                      return;
                    }
                    //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
                    if (field.templateOptions.descriptionProp in data)
                      this.extDescription = data[field.templateOptions.descriptionProp];
                  });
                  
                } else{           
                  //codizione di empty
                  this.extDescription = null;                                                  
                }
              }),
            ).subscribe();
          },
        },
      }; 

      
     // this.formlyConfig.getMergedField(tmpfield);
      this.codeField = tmpfield;
    };//fine if
    

      //non è usato formly-field
      this.descriptionField = {
        type: 'string',
        wrappers: ['form-field'],
        templateOptions: {
          disabled: true,
          label: 'Descrizione'
        }
      }

  }

  setDescription(data: any){
      //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
      if (this.field.templateOptions.descriptionProp in data)
        this.extDescription = data[this.field.templateOptions.descriptionProp];
  }

  setcode(data: any){
      if (this.field.templateOptions.codeProp in data)
        this.codeField.formControl.setValue(data[this.field.templateOptions.codeProp]);
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  open(){
    const modalRef = this.modalService.open(LookupComponent, {
      size: 'lg'
    })
    modalRef.result.then((result)=>{
      this.nodecode = true
      this.setcode(result);
      this.setDescription(result);
      this.nodecode = false
    },(reason) => {      
    });
    modalRef.componentInstance.entityName = this.to.entityName;
    modalRef.componentInstance.entityLabel = this.to.entityLabel;
    modalRef.componentInstance.rules = this.to.rules ? this.to.rules : null;

  }
  
}
