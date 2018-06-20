import { Component, OnInit, Input } from '@angular/core';
import { Submission } from '../../models/submission';
import { FormGroup, FormControl, FormArray, NgForm } from '@angular/forms';
import { SubmissionService } from '../../submission.service';
import { Assignment } from '../../models/assignment';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',  
})

export class SubmissionComponent implements OnInit {    
  submission: Submission;
  private assignmentsArray: FormArray = new FormArray([]); 
  private submissionForm: FormGroup;

  options: object[] = [
    {key:'m', value:'Maschio'},    
    {key:'f', value:'Femmina'}    
  ]

  constructor(private submissionService: SubmissionService) {

    this.submissionForm = new FormGroup({
      'name': new FormControl(),
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
    this.submissionService.getSubmission().subscribe((data)=> {
      this.submissionForm.patchValue(data);                 
      data.assigments.forEach(element => {
        this.assignments.push(this.buildAssignmentControls());  
      });      
      this.assignments.patchValue(data.assigments);
    });
    
  }

  printMyForm() {
    console.log(this.submissionForm);
  }
 
  register(myForm: NgForm) {
    console.log('Registration successful.');
    console.log(myForm.value);
  }
}
