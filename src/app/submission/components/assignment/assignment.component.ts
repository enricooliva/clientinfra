import { Component, OnInit, Input } from '@angular/core';
import { Assignment } from '../../models/assignment';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ControlBase } from '../../../shared';
import { SubmissionService } from '../../submission.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',  
})
export class AssignmentComponent implements OnInit {

  //controllo padre che descrive il FormArray
  @Input() control: ControlBase<FormArray>;
  //insieme di controlli che formano l'item dell'array
  @Input() controls: ControlBase<any>;
  //la form contenitore
  @Input() form: FormGroup;


  get assignments(): FormArray { return this.form.get('assignments') as FormArray; }

  constructor(private submissionService: SubmissionService) {
  }

  ngOnInit() {

  }

  addAssignment(){
    this.assignments.push(this.toFormGroup(this.submissionService.getAssignmetMetadata()));  
  }

  toFormGroup(controls: ControlBase<any>[] ) {
    let group: any = {};

    controls.forEach(ctrl => {
      if (ctrl.controlType ===  'array'){
        group[ctrl.key] =  new FormArray([]);                                
      }else{
        group[ctrl.key] =  new FormControl(ctrl.value || '', this.mapValidators(ctrl.validation));
      }      
    });    
    return new FormGroup(group);
  }

  private mapValidators(validators) {
    const formValidators = [];
  
    if(validators) {
      for(const validation of Object.keys(validators)) {
        if(validation === 'required') {
          formValidators.push(Validators.required);
        } else if(validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }  
    return formValidators;
  }

}
