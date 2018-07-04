import { Component, OnInit, Input } from '@angular/core';
import { Assignment } from '../../models/assignment';
import { FormGroup } from '@angular/forms';
import { ControlBase } from '../../../shared';


@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',  
  template: `
    <td>
      <app-dynamic-form class="col-md-4 mb-3" [control]="controls.role" [form]="item"></app-dynamic-form>          
    </td>
    <td>
      <app-dynamic-form class="col-md-4 mb-3" [control]="controls.title" [form]="item"></app-dynamic-form>             
    </td>
    <td>
      <app-dynamic-form class="col-md-4 mb-3" [control]="controls.istitute" [form]="item"></app-dynamic-form>                 
    </td>
    <td>
      <app-dynamic-form class="col-md-4 mb-3" [control]="controls.from" [form]="item"></app-dynamic-form>               
    </td>
    <td>
      <app-dynamic-form class="col-md-4 mb-3" [control]="controls.to" [form]="item"></app-dynamic-form>           
    </td>
    <td>
      <app-dynamic-form class="col-md-4 mb-3" [control]="controls.document" [form]="item"></app-dynamic-form> 
    </td>
    <td>
      <app-dynamic-form class="col-md-4 mb-3" [control]="controls.path" [form]="item"></app-dynamic-form>               
    </td>   
`
})
export class AssignmentComponent implements OnInit {

  //insieme di controlli che formano l'item dell'array
  @Input() controls: ControlBase<any>;
  //la form contenitore
  @Input() item: FormGroup;
  
  constructor() {
  }
  ngOnInit() {
  }  

}
