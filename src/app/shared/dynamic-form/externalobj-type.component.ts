import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { takeUntil, startWith, tap, distinctUntilChanged, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ServiceQuery } from '../query-builder/query-builder.interfaces';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupComponent } from '../lookup/lookup.component';
import ControlUtils from './control-utils';


@Component({
  selector: 'formly-field-ext',
  template: `
    <div  style="position: relative">    
    <ngx-loading [show]="isLoading" [config]="{  fullScreenBackdrop: false, backdropBorderRadius: '4px' }"></ngx-loading>
    <formly-group [model]="model"
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {    
    const servicename = ControlUtils.getServiceName(this.to.entityName)
    this.service = this.injector.get(servicename) as ServiceQuery;
    
    this.extDescription = this.field.fieldGroup.find(x=>x.key == this.to.descriptionProp || x.key =='description')
    this.codeField = this.field.fieldGroup.find(x=>x.key == this.to.codeProp || x.key =='id')

    this.field.fieldGroup[0] = {
      ...this.codeField,
      templateOptions: { 
        ...this.codeField.templateOptions,
        keyup: (field, event: KeyboardEvent) => {
          if (event.key == "F4") {
            this.open();
          }
        },
        addonRight: {
          class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center',
          onClick: (to, fieldType, $event) => {if (!this.codeField.templateOptions.disabled) this.open()},
        }
      },
      lifecycle: {                    
        onInit: (formInit, fieldInit) => {          
          fieldInit.formControl.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntil(this.onDestroy$),
            filter(() => !this.options.formState.isLoading),
            //startWith(field.formControl.value),
            tap(selectedField => {
              if (fieldInit.formControl.value && !this.nodecode) {
                this.isLoading = true;
                this.service.getById(fieldInit.formControl.value).subscribe((data) => {
                  this.isLoading = false;
                  if (data == null) {
                    this.extDescription.formControl.setValue(null);
                    fieldInit.formControl.setErrors({ notfound: true });                    
                    return;
                  }
                  //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
                  if (this.field.templateOptions.descriptionProp in data){                      
                    this.extDescription.formControl.setValue(data[this.field.templateOptions.descriptionProp]);
                    this.codeField.formControl.markAsDirty();
                  }
                });

              } else {
                //codizione di empty
                this.extDescription.formControl.setValue(null);
                this.codeField.formControl.markAsDirty();
              }
            }),
          ).subscribe();
        },
      },      
    } //fine field
  
  }

  //ATTENZIONE lo scope di esecuzione della onPopulate è esterno a questa classe.
  onPopulate(field: FormlyFieldConfig) {
    if (field.fieldGroup) {
      // already initialized
      return;
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
    //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
    if (this.field.templateOptions.descriptionProp in data)
      this.extDescription.formControl.setValue(data[this.field.templateOptions.descriptionProp]);
  }

  setcode(data: any) {
    if (this.field.templateOptions.codeProp in data){
      this.codeField.formControl.setValue(data[this.field.templateOptions.codeProp]);
      this.codeField.formControl.markAsDirty();
    }
  }

  open() {
    const modalRef = this.modalService.open(LookupComponent, {
      size: 'lg'
    })
    modalRef.result.then((result) => {
      this.nodecode = true
      this.setcode(result);
      this.setDescription(result);
      this.nodecode = false
    }, (reason) => {
    });
    modalRef.componentInstance.entityName = this.to.entityName;
    modalRef.componentInstance.entityLabel = this.to.entityLabel;
  }

}