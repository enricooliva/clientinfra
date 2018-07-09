
import { Component, OnInit, Input } from '@angular/core';
import { Submission } from '../../models/submission';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { SubmissionService } from '../../submission.service';
import { Assignment } from '../../models/assignment';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomValidators } from './custom.validators';
import { ControlBase,  } from '../../../shared/';
import { ResourceLoader } from '@angular/compiler';
import ControlUtils from '../../../shared/dynamic-form/control-utils';

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

  datarows = new Array<any>();
  columns = [];
  editing = [];

  constructor(private submissionService: SubmissionService) {    
    //costruzione dinamica
    let controls = this.submissionService.getSumbissionMetadata();   
    this.submissionControls = ControlUtils.normalizeArray(controls,'key');
    this.submissionFormDynamic = ControlUtils.toFormGroup(controls);    

    controls = this.submissionService.getAssignmetMetadata();   
    this.assignmetControls = ControlUtils.normalizeArray(controls, 'key');    

    this.columns = controls.map(el => {return { name: el.label, prop: el.key}});    

  } 

  getCellClass( rowIndex, column ) : any {     
    let ctrl = this.assignments.at(rowIndex).get(column.prop);
    return {      
      'is-invalid': ctrl.invalid && (ctrl.dirty || ctrl.touched)
    };
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
        this.assignments.push(ControlUtils.toFormGroup(this.submissionService.getAssignmetMetadata()));                                 
      });      
      
      this.datarows.push(...data.assigments);
      this.datarows= [...this.datarows];
      this.assignments.patchValue(data.assigments);      
    });    
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
    this.assignments.push(ControlUtils.toFormGroup(this.submissionService.getAssignmetMetadata()));  
  }

  printMyForm() {
    console.log(this.submissionForm);
  }
 
  register(myForm: NgForm) {
    console.log('Registration successful.');
    console.log(myForm.value);
  }

  openControl(cell, rowIndex){
    this.editing = [];
    this.editing[rowIndex + '-' + cell] = true;
  }

  // updateValue(event, cell, rowIndex) {
  //   console.log('inline editing rowIndex', rowIndex)
  //   this.editing[rowIndex + '-' + cell] = false;
  //   this.rows[rowIndex][cell] = event.target.value;
  //   this.rows = [...this.rows];
  //   console.log('UPDATED!', this.rows[rowIndex][cell]);
  // }

}
