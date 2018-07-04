import { Component, OnInit, Input, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { ControlBase } from './control-base';

@Component({
  selector: 'app-control-generic-list',
  templateUrl: './control-generic-list.component.html',
  styles: []
})
export class ControlGenericListComponent implements OnInit {

  //controllo padre che descrive il FormArray
  @Input() control: ControlBase<FormArray>;
  //insieme di controlli che formano l'item dell'array
  @Input() controls: ControlBase<any>;
  //la form contenitore
  @Input() form: FormGroup;
    
  //@ContentChild(TemplateRef) public itemTmpl: TemplateRef<Element>;
  @Input() itemTemplate: TemplateRef<any>
 
  constructor() { }

  ngOnInit() {
  }

}
