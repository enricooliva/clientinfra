import { Component, OnInit, Input } from '@angular/core';
import { Assignment } from '../../models/assignment';
import { FormGroup } from '@angular/forms';
import { ControlBase } from '../../../shared';


@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',  
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
