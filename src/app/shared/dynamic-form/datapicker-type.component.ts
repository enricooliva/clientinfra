import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { DatePipe } from '@angular/common';
// placeholder="dd-mm-yyyy"      
@Component({
  selector: 'app-datapicker-type',
  providers: [DatePipe],
  template: `
  <!--Datapicker container='body'-->
  <div class="input-group">    
    <input class="form-control" 
        
          
        [formControl]="formControl"                
        [displayMonths]="displayMonths" 
        [navigation]="navigation"
        [outsideDays]="outsideDays" 
        [showWeekNumbers]="showWeekNumbers"     
        name="d"    
        ngbDatepicker #d="ngbDatepicker"       
        [ngClass]="{'is-invalid': formControl.invalid && (formControl.dirty || formControl.touched)}">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary input-group-text oi oi-calendar" (click)="d.toggle()" type="button">
         
        </button>
    </div>
  </div>
  `,
  styles: []
})
//<img src="assets/img/calendar-icon.svg" style="width: 1.2rem; height: 1rem; cursor: pointer;" />
export class DatepickerTypeComponent extends FieldType {

  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';

  constructor(private datePipe: DatePipe) {
    super();
  }

  ngOnInit() {      
    if (!isNaN(Date.parse(this.formControl.value))) {
      this.formControl.setValue(this.datePipe.transform(this.formControl.value, 'dd-MM-yyyy'));       
    }
  }

}
