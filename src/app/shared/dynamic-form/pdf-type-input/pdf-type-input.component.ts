import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-pdf-type-input',
  template: `
  <formly-group [model]="model"
    [field]="field"
    [options]="options"
    [form]="formControl">  
  </formly-group>     
  `,
  styles: []
})
export class PdfTypeInputComponent  extends FieldType implements OnInit {

  constructor() {
    super();
  }
 
  fileselection: FormlyFieldConfig = null;
  pdfviewer: FormlyFieldConfig = null;

  ngOnInit() {
    this.fileselection = this.field.fieldGroup.find(x=>x.key == this.to.filename || x.key =='filename');
    this.pdfviewer = this.field.fieldGroup.find(x=>x.key == this.to.filevalue || x.key =='filevalue');

    this.fileselection.templateOptions['onSelected'] = (selFile) => this.onFileChanged(selFile);   
  }

  onFileChanged(event) {        
    let selFile = event; //event.target.files[0] as File;
    if (selFile){      
      //load pdf 
      const reader = new FileReader();
      reader.onload = (e: any) => {    
        //console.log(e.target.result);              
        this.pdfviewer.formControl.setValue(e.target.result);        
      }
      reader.readAsArrayBuffer(selFile); 
    }else{
      this.pdfviewer.formControl.setValue(null);        
    }
  }

  onPopulate(field: FormlyFieldConfig) {
    if (field.fieldGroup) {
      // already initialized
      return;
    }

    field.fieldGroupClassName = 'row'
    field.fieldGroup = [
      {
        key: field.templateOptions.filename || 'filename',
        type: 'fileinput',
        className: "col-md-6",
        templateOptions: {          
          type: 'input',
          placeholder: 'Scegli file tipo pdf',
          accept: 'application/pdf',         
          required: true,
        },
      },
      {
        key: field.templateOptions.filevalue || 'filevalue',
        type: 'pdfviewer',        
        className: "col-md-12",
        templateOptions: {
          required: true
        },
      }
    ];
  }

}
