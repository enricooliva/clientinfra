import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-input-file',
  template: `
    <input  #local type="file" (change)="onFileSelected()" [formControl]="formControl" [formlyAttributes]="field">
  `,
  styles: []
})
export class InputFileComponent extends FieldType {
    
  @ViewChild('local') public inputfile: ElementRef;
  ngOnInit() {
  }
  onFileSelected(){    
    let $img = this.inputfile.nativeElement.files[0];
    this.to.onSelected($img)
  }


}
