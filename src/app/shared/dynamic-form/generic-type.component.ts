import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-generic-type',
  template: `
  <!--Generic-->
  <ng-container [ngSwitch]="field.type">  
    <ng-container *ngFor="let type of types">  
    <formly-field *ngSwitchCase="type"
      [model]="field.model"
      [form]="form"
      [field]="field"
      [options]="options">
    </formly-field>   
    </ng-container>  
  </ng-container>
  `,
  styles: []
})
export class GenericTypeComponent extends FieldType implements OnInit {

  types: string[];

  constructor(private formlyConfig: FormlyConfig){
    super();
    this.types = Object.keys(this.formlyConfig.types).filter(x => x != 'generic');
  }

  ngOnInit() {
    this.field.wrappers = [];        
  }

}
