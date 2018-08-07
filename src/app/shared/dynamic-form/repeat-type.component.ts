import { Component } from '@angular/core';
import { FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-section',
  template: `
  <div>  
    <button class="btn btn-sm btn-outline-primary border-0 rounded-0" (click)="add()"  >              
      <span class="oi oi-plus"></span>
      <span class="ml-2">Aggiungi</span>
    </button>  
  </div>
  <div class="table-responsive-md">
  <table class="table">
  <tbody>
    <tr *ngFor="let field of field.fieldGroup; let i = index;">
      <formly-group       
        [model]="model[i]"
        [field]="field"
        [options]="options"
        [form]="formControl">
        <div class="col-md-2 align-self-center">
        <button class="btn btn-sm btn-outline-primary border-0 rounded-0" (click)="remove(i)"  >              
          <span class="oi oi-trash"></span>  
          <span class="ml-2">Rimuovi</span>
        </button>
        </div>        
      </formly-group>
    </tr>
  </tbody>
  </table>
  </div>

  `,
})

export class RepeatTypeComponent extends FieldArrayType {
  constructor(builder: FormlyFormBuilder) {
    super(builder);
  }
}