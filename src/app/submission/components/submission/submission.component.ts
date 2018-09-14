
import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { Submission } from '../../models/submission';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { SubmissionService } from '../../submission.service';
import { Assignment } from '../../models/assignment';
import { Observable, BehaviorSubject } from 'rxjs';
import { CustomValidators } from './custom.validators';
import { ControlBase,  } from '../../../shared';
import { ResourceLoader } from '@angular/compiler';
import ControlUtils from '../../../shared/dynamic-form/control-utils';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { fieldsForm } from '../../models/submissionForm'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',  
})

export class SubmissionComponent implements OnInit {        

  isLoading = false;
  form = new FormGroup({});
  model: Submission;  
  fields: FormlyFieldConfig[] = fieldsForm;

  private id: number;
 
  defaultColDef = { editable: true };
 
  constructor(private submissionService: SubmissionService, private route: ActivatedRoute) {         
  } 


  ngOnInit() {    
       
    this.route.params.subscribe(params => {
      if (params['id']){
        this.isLoading = true;    
        this.submissionService.clearMessage();
        this.submissionService.getSubmissionById(params['id']).subscribe((data) => {
          this.isLoading = false;
          this.model = data;
        });
      }
    });

    //lettura della domanda corrente
    //const personId = this.route.snapshot.params['id'];   
    //this.submission = this.submissionService.getSubmission();
    // this.isLoading = true;
    // this.submissionService.getSubmission().subscribe((data)=> {          
      
    //   this.id=data.id;  
    //   this.model = data;    
    //   this.isLoading = false;
    // });    
  } 
 
  onNew(){
    this.model = null;
    this.form.reset();

  }

  onReload(){
    //sono nello stato nuovo
    if(this.model != null && this.model.id !== null){
      this.isLoading=true;
      this.submissionService.getSubmissionByUserId(this.model.user_id).subscribe((data)=> {          
        
        this.id=data.id;  
        this.model = data;    
        this.isLoading = false;
      }); 
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.submissionService.updateSubmission(this.form.value, this.id).subscribe(
        result => console.log(result),
        error => console.log(error)
      );      
    }
  }


  private temp = [];
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.role.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    //this.datarows =[...temp];
    //this.assignments.patchValue(temp);
    
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }
}
