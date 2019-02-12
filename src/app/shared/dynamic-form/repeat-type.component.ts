import { Component, ChangeDetectorRef } from '@angular/core';
import { FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'formly-repeat-section',
  template: `  
  <div class="mb-2">  
    <div *ngIf="to.label">{{to.label}} </div> 
    <button *ngIf="!to.btnHidden" type="button" [disabled]="to.disabled" class="btn btn-sm btn-outline-primary border-0 rounded-0" (click)="onAddNew()"  >              
      <span class="oi oi-plus"></span>
      <span class="ml-2">Aggiungi</span>
    </button>  
  </div>   
  <div *ngFor="let subfield of field.fieldGroup; let i = index;">
      <formly-group     
        [model]="model[i]"          
        [field]="subfield"
        [options]="options"
        [form]="formControl">
        <div class="col-md-2 d-flex align-self-center">
        <div class="btn btn-sm btn-outline-primary border-0 rounded-0" (click)="onRemoveRepeat(i)"  >              
          <span class="oi oi-trash"></span>  
          <span class="ml-2">Rimuovi</span>
        </div>
        </div>            
      </formly-group>    
      <div *ngIf="subfield.template" [innerHTML]="subfield.template">                           
      </div>    
  </div>
  <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
  <formly-validation-message [field]="field"></formly-validation-message>
  </div>
  `,
})

export class RepeatTypeComponent extends FieldArrayType {
  constructor(builder: FormlyFormBuilder, private cd: ChangeDetectorRef) {
    super(builder);            
  }

  onAddNew(){
    if (this.to.onAddInitialModel){
      let init = this.to.onAddInitialModel();
      this.add(null,init);
    }else{
      this.add();
      this.cd.detectChanges();     
    }    
  }

  onRemoveRepeat(index){
    if (this.to.onRemove){            
      let id = this.formControl.at(index).get('id').value;   
      (this.to.onRemove(id) as Observable<any>).subscribe(
        data => { this.remove(index); },
        err => {},
      );
    }else{
      this.remove(index);
      this.cd.detectChanges();      
    }
  }

  clearFormArray() {
    while (this.formControl.length !== 0) {
      this.remove(0);
    }
  }


  // callbackRemove(index, context){
  //   context.remove(index); 
  //   context.formControl.removeAt(index);
  // }
}