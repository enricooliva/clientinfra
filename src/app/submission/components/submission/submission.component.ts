
import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
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
  @ViewChild('textcolumn') public textcolumn: TemplateRef<any>;
  @ViewChild('datecolumn') public datecolumn: TemplateRef<any>;

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

  arrayControl:  ControlBase<any>[];
 
  constructor(private submissionService: SubmissionService) {      

    //costruzione dinamica
    let controls = this.submissionService.getSumbissionMetadata();   
    this.submissionControls = ControlUtils.normalizeArray(controls,'key');
    this.submissionFormDynamic = ControlUtils.toFormGroup(controls);    

    this.arrayControl = this.submissionService.getAssignmetMetadata();   
    this.assignmetControls = ControlUtils.normalizeArray( this.arrayControl , 'key');     
  } 

  getCellClass( rowIndex, column ) : any {     
    let ctrl = this.assignments.at(rowIndex).get(column.prop);
    return {      
      'is-invalid': ctrl.invalid && (ctrl.dirty || ctrl.touched)
    };
  }

  get assignments(): FormArray { return this.submissionFormDynamic.get('assignments') as FormArray; }

  ngOnInit() {    

    this.columns =  this.arrayControl.map(el => {
      return { 
        name: el.label, 
        prop: el.key,
        cellTemplate: this.getTemplateColumn(el)
      }
    });    
    //lettura della domanda corrente
    //const personId = this.route.snapshot.params['id'];   
    //this.submission = this.submissionService.getSubmission();
    this.submissionService.getSubmission().subscribe((data)=> {          
      
      this.id=data.id;
      this.submissionFormDynamic.patchValue(data);     

      data.assigments.forEach(element => {
        this.assignments.push(ControlUtils.toFormGroup(this.submissionService.getAssignmetMetadata()));                                 
      });      
      
      //this.submissionFormDynamic.get('assignments').value
      this.datarows.push(...data.assigments);
      this.datarows= [...this.datarows];

      this.assignments.patchValue(data.assigments);      
    });    
  } 


  private getTemplateColumn(el:ControlBase<any>): TemplateRef<any> {    
    switch (el.controlType) {
      case 'textbox':
        return this.textcolumn;
      case 'datepicker':        
        return this.datecolumn;

      default:
        return this.textcolumn;
    }
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

  onSort(event) {
    const sort = event.sorts[0];
    
    this.assignments.value.sort((a , b) => {      
      //return ((a as FormGroup).controls[sort.prop].value.localeCompare((b as FormGroup).controls[sort.prop].value) * (sort.dir === 'desc' ? -1 : 1));
      return (a[sort.prop].localeCompare(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));
    });

    this.assignments.patchValue(this.assignments.value);    
  }

}
