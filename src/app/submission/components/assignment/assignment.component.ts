import { Component, OnInit, Input } from '@angular/core';
import { Assignment } from '../../models/assignment';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',  
})
export class AssignmentComponent implements OnInit {

  
  @Input() 
  assignment: Assignment;

  @Input('group') 
  assignmentForm: FormGroup;

  constructor() {
    // new FormGroup({
    //   'role': new FormControl(),
    //   'title': new FormControl(),          
    //   'institute': new FormControl(),                   
    //   'from': new FormControl(),
    //   'to': new FormControl(),
    //   'document': new FormControl(),        
    //   'path': new FormControl(),                    
    // });
  }

  ngOnInit() {

  }

}
