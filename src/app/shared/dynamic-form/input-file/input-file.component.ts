import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FieldType, FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-input-file',
  template: `      
    <div *ngIf="inputField" placement="top" ngbTooltip="{{ to.tooltip ? to.tooltip.content : null}}">
    <input *ngIf="type !== 'number' else numberTmp" [type]="type" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
    <ng-template #numberTmp>
      <input type="number" [formControl]="formControl" class="form-control" [formlyAttributes]="inputField" [class.is-invalid]="showError">
    </ng-template>
    </div>
    <input #fileInput type="file" accept="{{to.accept}}" (change)="onFileChanged($event)" style="display: none">    
  `,
  //*ngIf="inputField"
  styles: []
})
export class InputFileComponent extends FieldType implements OnInit{

  inputField: FormlyFieldConfig = null;
    
  @ViewChild('fileInput') public fileInput: ElementRef;  

  constructor(private formlyConfig: FormlyConfig) {
    super();         
  }

  ngOnInit() {        
      if (!this.to.accept) {
        this.to.accept = 'application/pdf';
      }
   
      this.field.templateOptions.addonRight.onClick = (to, fieldType, $event) => this.reset();      
      this.field.templateOptions.addonLeft.onClick = (to, fieldType, $event) => this.fileInput.nativeElement.click()       
    
      this.field.templateOptions.keyup = (field, event: KeyboardEvent) => {
        if (event.key == "F2") {
          this.fileInput.nativeElement.click();
        }
      };          
      this.inputField = this.field;                   
  }

  onFileChanged(event) {
    let selFile = event.target.files[0] as File;
    if (selFile){
      this.inputField.formControl.setValue(selFile.name);      
      //let $img = this.fileInput.nativeElement.files[0];      
      this.to.onSelected(...[selFile, this.field])

    }
  }

  reset() {    
    this.inputField.formControl.markAsTouched();
    this.inputField.formControl.setValue(null);
    this.inputField.formControl.updateValueAndValidity();    

    this.fileInput.nativeElement.value = "";
    this.to.onSelected(null);
           
  }

    
  onPopulate(field: FormlyFieldConfig) {

    if (!field.templateOptions.accept) {
      field.templateOptions.accept = 'application/pdf';
    }

    field.wrappers= ['form-field','addons']; //.concat(this.field.wrappers),    
    field.templateOptions.addonRight = {
      class: 'btn btn-outline-secondary oi oi-delete d-flex align-items-center',
      onClick: (to, fieldType, $event) => this.reset()
    };    

    field.templateOptions.addonLeft= {
      class: 'btn btn-outline-secondary oi oi-folder d-flex align-items-center',
      onClick: (to, fieldType, $event) => this.fileInput.nativeElement.click()
    };      

  }

  
}
