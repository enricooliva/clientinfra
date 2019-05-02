import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { takeUntil, startWith, skip, tap, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ServiceQuery } from '../query-builder/query-builder.interfaces';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupComponent } from '../lookup/lookup.component';
import ControlUtils from './control-utils';
import { FileDetector } from 'protractor';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'formly-field-ext',
  template: `
    <div  style="position: relative">    
    <ngx-loading [show]="isLoading" [config]="{  fullScreenBackdrop: false, backdropBorderRadius: '4px' }"></ngx-loading>
    <formly-group 
      [field]="field"
      [options]="options"
      [form]="formControl">  
    </formly-group>     
    </div>
 `,
})
export class ExternalobjTypeComponent extends FieldType implements OnInit, OnDestroy {

  constructor(private formlyConfig: FormlyConfig, private injector: Injector, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    super();
  }

  onDestroy$ = new Subject<void>();
  service: ServiceQuery;
  public isLoading = false;  

  nodecode = false;
  extDescription: FormlyFieldConfig = null;
  codeField: FormlyFieldConfig = null;

  private previusCodeValue: any = null;

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {    
    const servicename = ControlUtils.getServiceName(this.to.entityName)
    this.service = this.injector.get(servicename) as ServiceQuery;
    
    this.extDescription = this.field.fieldGroup.find(x=>x.key == this.to.descriptionProp || x.key =='description')
    this.codeField = this.field.fieldGroup.find(x=>x.key == this.to.codeProp || x.key =='id')

    this.codeField.modelOptions.updateOn = 'blur';

    this.field.fieldGroup[0].templateOptions.keyup = (field, event: KeyboardEvent) => {
          if (event.key == "F4") {
            this.open();
          }
        };

    this.field.fieldGroup[0].templateOptions.addonRight= {
          class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center',
          onClick: (to, fieldType, $event) => {if (!this.codeField.templateOptions.disabled) this.open()},
        };
          
    this.field.fieldGroup[0].hooks = {                    
        onInit: (field) => {          
          this.codeField.formControl.valueChanges.pipe(            
            distinctUntilChanged(),
            takeUntil(this.onDestroy$),
            //filter(() => !this.options.formState.isLoading),            
            tap(selectedField => {
              if (!this.isInitValue()){
                if (field.formControl.value && !this.nodecode) {
                  this.isLoading = true;
                  this.service.getById(field.formControl.value).subscribe((data) => {
                    this.isLoading = false;
                    if (data == null) {
                      this.extDescription.formControl.setValue(null);
                      field.formControl.setErrors({ notfound: true });                    
                      return;
                    }
                    this.setDescription(data);
                  });

                } else {
                  //codizione di empty
                  this.extDescription.formControl.setValue(null);
                  this.codeField.formControl.markAsDirty();
                }
              }
              this.previusCodeValue = selectedField;
            }),
          ).subscribe();
        },
      };      
  }

  isInitValue(){
    //se il valore del codice precedente è nullo 
    //se la descrizione è valorizzata
    //sono in fase di inizializzazione e NON fare la decodifica
    if (this.model && this.previusCodeValue == null && this.model[this.to.descriptionProp]){
      return true;
    }
    return false;
  }

  //ATTENZIONE lo scope di esecuzione della onPopulate è esterno a questa classe.
  onPopulate(field: FormlyFieldConfig) {

    if (field.fieldGroup) {
      return;
    }
    
    if (field.model && !field.model[field.key] ){
      field.model[field.key] = new Object();
    }

    field.templateOptions.init = (result) => {
      this.init(result);
    }

    field.fieldGroupClassName = 'row'        
    field.fieldGroup = [    
      {
        key: field.templateOptions.codeProp || 'id',
        type: 'input',
        className: "col-md-4",                
        templateOptions: {
          label: field.templateOptions.label,
          type: 'input',
          placeholder: 'Inserisci codice',     
          required: field.templateOptions.required == undefined ? false : field.templateOptions.required,
          disabled: field.templateOptions.disabled == undefined ? false : field.templateOptions.disabled,
          addonRight: {
            class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center' 
          }          
        },
        modelOptions: { updateOn: 'blur' },
      },
      {
        key: field.templateOptions.descriptionProp || 'description',
        type: 'input',
        className: "col-md-8",        
        templateOptions: {
          disabled: true,
          label: 'Descrizione'
        },
      }
    ];
  }

  setDescription(data: any) {  
    if (typeof this.field.templateOptions.descriptionFunc === 'function'){
      this.extDescription.formControl.setValue(this.field.templateOptions.descriptionFunc(data))
      this.codeField.formControl.markAsDirty();
    } else if (this.field.templateOptions.descriptionProp in data){                      
      //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
      this.extDescription.formControl.setValue(data[this.field.templateOptions.descriptionProp]);
      this.codeField.formControl.markAsDirty();
    }
  }

  setcode(data: any) {
    if (this.field.templateOptions.codeProp in data){
      this.codeField.formControl.setValue(data[this.field.templateOptions.codeProp]);
      this.codeField.formControl.markAsDirty();
    }
  }

  init(result){    
    this.nodecode = true  
    this.setcode(result);
    this.setDescription(result);
    Object.keys(result).forEach( x=> this.field.model[x] = result[x]);
    this.nodecode = false
  }


  open() {
    const modalRef = this.modalService.open(LookupComponent, {
      size: 'lg'
    })
    modalRef.result.then((result) => {      
      this.init(result);      
    }, (reason) => {
    });
    modalRef.componentInstance.entityName = this.to.entityName;
    modalRef.componentInstance.entityLabel = this.to.entityLabel;
    modalRef.componentInstance.rules = this.to.rules ? this.to.rules : null;
  }

}