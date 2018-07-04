
import { Component, OnInit, Input } from '@angular/core';
import { Submission } from '../../models/submission';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { SubmissionService } from '../../submission.service';
import { Assignment } from '../../models/assignment';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomValidators } from './custom.validators';
import { ControlBase } from '../../../shared/';
import { ResourceLoader } from '@angular/compiler';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',  
})

export class SubmissionComponent implements OnInit {    
  //submission: Observable<Submission>;

  private id: number;
  private submissionForm: FormGroup;

  submissionFormDynamic: FormGroup;
  submissionControls: {[key: string]: ControlBase<any>};
  assignmetControls: {[key: string]: ControlBase<any>};

  options: object[] = [
    {key:'m', value:'Maschio'},    
    {key:'f', value:'Femmina'}    
  ]

  constructor(private submissionService: SubmissionService) {    
    //costruzione dinamica
    let controls = this.submissionService.getSumbissionMetadata();   
    this.submissionControls = this.normalizeArray(controls,'key');
    this.submissionFormDynamic =this.toFormGroup(controls);    

    controls = this.submissionService.getAssignmetMetadata();   
    this.assignmetControls = this.normalizeArray(controls, 'key');    
  } 

  get assignments(): FormArray { return this.submissionFormDynamic.get('assignments') as FormArray; }

  ngOnInit() {    
    //lettura della domanda corrente
    //const personId = this.route.snapshot.params['id'];   
    //this.submission = this.submissionService.getSubmission();
    this.submissionService.getSubmission().subscribe((data)=> {          
      
      this.id=data.id;
      this.submissionFormDynamic.patchValue(data);     

      data.assigments.forEach(element => {
        this.assignments.push(this.toFormGroup(this.submissionService.getAssignmetMetadata()));         
      });      
      this.assignments.patchValue(data.assigments);      
    });    
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

  normalizeArray<T>(array: Array<T>, indexKey: keyof T) {
    const normalizedObject: any = {}
    for (let i = 0; i < array.length; i++) {
         const key = array[i][indexKey]
         normalizedObject[key] = array[i]
    }
    return normalizedObject as { [key: string]: T }
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

  onNew(){
    this.submissionForm.reset();
  }

  onSubmit() {
    if (this.submissionFormDynamic.valid) {
      this.submissionService.updateSubmission(this.submissionFormDynamic.value, this.id).subscribe(
        result => console.log(result),
        error => console.log(error)
      );      
    }
  }

  addAssignment(){
    this.assignments.push(this.toFormGroup(this.submissionService.getAssignmetMetadata()));  
  }

  printMyForm() {
    console.log(this.submissionForm);
  }
 
  register(myForm: NgForm) {
    console.log('Registration successful.');
    console.log(myForm.value);
  }
}
