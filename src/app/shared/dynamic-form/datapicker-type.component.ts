import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-datapicker-type',
  template: `
  <!--Datapicker-->
  <div class="input-group">    
    <input class="form-control" 
        container='body'
        placeholder="dd-mm-yyyy"         
        [formControl]="formControl"                
        [displayMonths]="displayMonths" 
        [navigation]="navigation"
        [outsideDays]="outsideDays" 
        [showWeekNumbers]="showWeekNumbers"         
        ngbDatepicker="" #d="ngbDatepicker" 
        [ngClass]="{'is-invalid': formControl.invalid && (formControl.dirty || formControl.touched)}">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" (click)="d.toggle()" type="button">
          <img src="assets/img/calendar-icon.svg" style="width: 1.2rem; height: 1rem; cursor: pointer;" />
        </button>
    </div>
  </div>
  `,
  styles: []
})
export class DatepickerTypeComponent extends FieldType {

  ngOnInit() {
  }

}