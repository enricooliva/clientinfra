import { Component, OnInit, OnDestroy } from '@angular/core';
import {  FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { distinctUntilChanged, takeUntil, filter, tap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-select-type',
  template: `
  <formly-field [form]="form" [field]="field" [options]="options" [model]="model">
  </formly-field> 
  `,
  styles: []
})
export class SelectTypeComponent extends FieldType implements OnInit, OnDestroy {

  onDestroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.field = {
      ...this.field,
      type: 'select',
      wrappers: ['form-field'],
      templateOptions: {
        ...this.to,                
      },
      lifecycle: {              
        onInit: (form, field) => {
          field.formControl.valueChanges.pipe(
            distinctUntilChanged(),
            takeUntil(this.onDestroy$),
            filter(() => this.options.formState.isLoading && (this.to.options as Array<any>).length == 0),
            tap(cod => { 
              this.to.options = [this.to.inizialization()];
            })
          ).subscribe();
  
          (this.to.populateAsync() as Observable<any[]>).subscribe((data)=>{
              this.to.options = data;
          });
        }
      }
    }    
  }
  
}
