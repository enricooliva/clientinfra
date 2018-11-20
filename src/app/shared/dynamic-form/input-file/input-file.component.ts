import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FieldType, FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-input-file',
  template: `  
    <formly-field *ngIf="inputField"
      [model]="model"
      [field]="inputField"
      [options]="options"
      [form]="form">
    </formly-field>           
    <input #fileInput type="file" accept="{{to.accept}}" (change)="onFileChanged($event)" style="display: none">        
  `,
  styles: []
})
export class InputFileComponent extends FieldType implements OnInit{

  inputField: FormlyFieldConfig;
  @ViewChild('fileInput') public fileInput: ElementRef;

  constructor(private formlyConfig: FormlyConfig) {
    super();         
  }

  ngOnInit() {    
    if (!this.inputField){
      if (!this.to.accept) {
        this.to.accept = 'application/pdf';
      }
      this.inputField = {
        ...this.field,
        wrappers: ['form-field','addons'],
        type: 'input',
        templateOptions: {
          ...this.field.templateOptions,
          keyup: (field, event: KeyboardEvent) => {
            if (event.key == "F2") {
              this.fileInput.nativeElement.click();
            }
          },
          addonLeft: {
            class: 'btn btn-outline-secondary oi oi-folder d-flex align-items-center',
            onClick: (to, fieldType, $event) => this.fileInput.nativeElement.click(),                                    
          },
          addonRight: {
            class: 'btn btn-outline-secondary oi oi-delete d-flex align-items-center',
            onClick: (to, fieldType, $event) => this.reset(),            
          }
        }
      }
      
      this.formlyConfig.getMergedField(this.inputField);
    }
  }

  onFileChanged(event) {
    let selFile = event.target.files[0] as File;
    if (selFile){
      this.inputField.formControl.setValue(selFile.name);      
      //let $img = this.fileInput.nativeElement.files[0];
      this.to.onSelected(selFile)
    }
  }

  reset() {    
    this.inputField.formControl.markAsTouched();
    this.inputField.formControl.setValue(null);
    this.inputField.formControl.updateValueAndValidity();    

    this.fileInput.nativeElement.value = "";
    this.to.onSelected(null);
           
  }
}
