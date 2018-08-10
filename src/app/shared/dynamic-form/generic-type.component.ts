import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-generic-type',
  template: `
  <!--Generic-->
  <formly-field *ngIf="genericField"
    [form]="form"
    [field]="genericField"
    [options]="options">
  </formly-field>
  `,
  styles: []
})
export class GenericTypeComponent extends FieldType implements OnInit {
  genericField: FormlyFieldConfig;  

  constructor(private formlyConfig: FormlyConfig){
    super();   
  }

  ngOnInit() {
    Object.defineProperty(this.field.templateOptions, 'field', {
      set: (field) => {
        field = {
          ...this.field,
          wrappers: [],
          ...field,
        };
        this.formlyConfig.getMergedField(field);
        this.genericField = field;
      },
      configurable: true,
    });
  }

}
