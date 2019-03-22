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
import { initDomAdapter } from '@angular/platform-browser/src/browser';

@Component({
  selector: 'app-external-type',
  template: `                

  <div  style="position: relative">
  <ngx-loading [show]="isLoading" [config]="{  fullScreenBackdrop: false, backdropBorderRadius: '4px' }"></ngx-loading>    
    <div *ngIf="codeField" class="row" [class.has-error]="showError">               
      <div class="col-md-4" > 
      <div class="form-group"> 
        <label [attr.for]="id" class="form-control-label control-label" *ngIf="to.label">
          {{ to.label }}
          <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
        </label>
        <div class="input-group"> 
          <input *ngIf="field.templateOptions.type !== 'number' else numberTmp" [type]="field.templateOptions.type" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
          <ng-template #numberTmp>
            <input type="number" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
          </ng-template>          
          <div class="input-group-addon input-group-append"
            *ngIf="to.addonRight"
            [ngStyle]="{cursor: to.addonRight.onClick ? 'pointer' : 'inherit'}"
            (click)="addonRightClick($event)">
            <i class="input-group-text" [ngClass]="to.addonRight.class" *ngIf="to.addonRight.class"></i>
            <span *ngIf="to.addonRight.text" class="input-group-text">{{ to.addonRight.text }}</span>
          </div>     
        </div>
        <div *ngIf="showError">
        <small class="text-danger invalid-feedback" [style.display]="'block'" role="alert" [id]="validationId">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>
        </div>
        </div>
      </div>    

      <div class="col-md-8">    
        <Label *ngIf="descriptionField.templateOptions.label">{{ descriptionField.templateOptions.label }} </Label>
        <input type="text" class="form-control" [value]="extDescription"  readonly>    
      </div>    
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
    this.field.templateOptions.
      keyup = (field, event: KeyboardEvent) => {
        if (event.key == "F4") {
          this.open();
        }
      };

    this.field.templateOptions.addonRight = {
      class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center',
      onClick: (to, fieldType, $event) => this.open(),
    }

    this.init();

    this.field.formControl.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.onDestroy$),
      //perchè occorre lo startwith
      //startWith(this.field.formControl.value),
      tap(selectedField => {        
        if (!this.initdesc)
          return this.init();

        if (this.formControl.value && !this.nodecode) {          
          setTimeout(() => { this.isLoading = true; }, 0);
          this.service.getById(this.formControl.value).subscribe((data) => {
            setTimeout(() => { this.isLoading = false; }, 0);
            if (data == null) {
              this.extDescription = null;
              this.formControl.setErrors({ notfound: true });
              return;
            }
            //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
            if (this.field.templateOptions.descriptionProp in data){
              this.extDescription = data[this.field.templateOptions.descriptionProp];
              if (this.field.templateOptions.initdescription in this.model)
                this.model[this.field.templateOptions.initdescription] = data[this.field.templateOptions.descriptionProp];
              //this.field.formControl.markAsDirty();
            }
          });

        } else {
          //codizione di empty
          this.extDescription = null;
          //this.field.formControl.markAsDirty();
        }
      }),
    ).subscribe();

    // this.formlyConfig.getMergedField(tmpfield);
    this.codeField = this.field;

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

  private initdesc = false;
  init(){   
    //verifico in caso di cache e non se il modello è inizializzato
    if (this.field.key in this.model)    
      this.initdesc = true;

    if (this.field.templateOptions.initdescription in this.model){      
      this.extDescription = this.model[this.field.templateOptions.initdescription];        
    }
    return this.initdesc;
  }

  setDescription(data: any) {
    //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
    if (this.field.templateOptions.descriptionProp in data){
      this.extDescription = data[this.field.templateOptions.descriptionProp];
      if (this.field.templateOptions.initdescription in this.model)
        this.model[this.field.templateOptions.initdescription] = data[this.field.templateOptions.descriptionProp];
    }          
  }

  setcode(data: any) {
    if (this.field.templateOptions.codeProp in data){
      this.codeField.formControl.setValue(data[this.field.templateOptions.codeProp]);
      this.field.formControl.markAsDirty();
    }
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
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
    modalRef.componentInstance.rules = this.to.rules ? this.to.rules : null;

  }


  addonRightClick($event: any) {
    if (this.to.addonRight.onClick) {
      this.to.addonRight.onClick(this.to, this, $event);
    }
  }

  onPopulate(field: FormlyFieldConfig) {
    field.modelOptions.updateOn = 'blur';
  }

}
