
import { Component, OnInit, Input } from '@angular/core';
import { Submission } from '../../models/submission';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { SubmissionService } from '../../submission.service';
import { Assignment } from '../../models/assignment';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomValidators } from './custom.validators';
import { ControlBase } from '../../../shared/dynamic-form/control-base';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',  
})

export class SubmissionComponent implements OnInit {    
  submission: Observable<Submission>;

  private submissionForm: FormGroup;

  submissionFormDynamic: FormGroup;
  submissionControls: {[key: string]: ControlBase<any>};


  options: object[] = [
    {key:'m', value:'Maschio'},    
    {key:'f', value:'Femmina'}    
  ]

  constructor(private submissionService: SubmissionService) {

    this.submissionForm = new FormGroup({
      'name': new FormControl('', Validators.required),
      'surname': new FormControl(),          
      'gender': new FormControl(),          
      'fiscalcode': new FormControl(),          
      'birthplace': new FormControl(),
      'birthprovince': new FormControl(),
      'birthdate': new FormControl(),        
      'com_res': new FormControl(),        
      'prov_res': new FormControl(),        
      'via_res': new FormControl(),         
      'civ_res': new FormControl(),          
      'presso': new FormControl(), 
      'assignments': new FormArray([])
    });

    this.submissionForm.controls['gender'].valueChanges.subscribe(g => 
    {
        //this.gender = g;  
    });   

    //costruzione dinamica
    let controls = this.submissionService.getSumbissionControls();   
    this.submissionControls = this.normalizeArray(controls,'key');
    this.submissionFormDynamic =this.toFormGroup(controls);
    
  }

  private buildAssignmentControls(): FormGroup {
    return new FormGroup({
      'role': new FormControl(),
      'title': new FormControl(),          
      'institute': new FormControl(),                      
      'from': new FormControl(),
      'to': new FormControl(),
      'document': new FormControl(),        
      'path': new FormControl(),        
    });    
  }

  get assignments(): FormArray { return this.submissionForm.get('assignments') as FormArray; }

  ngOnInit() {
    
    //lettura della domanda corrente
    //const personId = this.route.snapshot.params['id'];
   
   this.submission = this.submissionService.getSubmission();

    this.submissionService.getSubmission().subscribe((data)=> {          
      
      this.submissionForm.patchValue(data);     
      this.submissionFormDynamic.patchValue(data);     

      data.assigments.forEach(element => {
        this.assignments.push(this.buildAssignmentControls());  
      });      
      this.assignments.patchValue(data.assigments);      
    });
    
  }

  toFormGroup(controls: ControlBase<any>[] ) {
    let group: any = {};

    controls.forEach(ctrl => {
      group[ctrl.key] =  new FormControl(ctrl.value || '', this.mapValidators(ctrl.validation));
    });
    this.submissionFormDynamic = new FormGroup(group);
    return this.submissionFormDynamic;
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


  printMyForm() {
    console.log(this.submissionForm);
  }
 
  register(myForm: NgForm) {
    console.log('Registration successful.');
    console.log(myForm.value);
  }
}
