
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

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',  
})

export class SubmissionComponent implements OnInit {        

  form = new FormGroup({});
  model: Submission;  

  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Dati personali</h5>',
    },
    {
      key: 'id',
      type: 'input',
      hideExpression: true,
      templateOptions: {
        label: 'Id',   
        disabled: true       
      },
    },
    {
      key: 'userId',
      type: 'input',
      hideExpression: true,
      templateOptions: {
        label: 'UserId',     
        hide: true         
      }     
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'name',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Nome',     
          required: true               
        }     
      },
      {
        key: 'surname',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Cognome',     
          required: true               
        }     
      },
    ]},
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'gender',
        type: 'select',    
        className: "col-md-2",  
        templateOptions: {
          label: 'Genere',     
          required: true,
          options: [
            { value: 'm', label: 'Maschio' },
            { value: 'f', label: 'Femmina' },
          ]               
        }     
      },
      {
        key: 'fiscalcode',
        type: 'input',
        className: "col-md-4",
        templateOptions: {
          label: 'Codice fiscale',     
          required: true               
        }     
      },  
      {
        key: 'birthplace',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Luogo di nascita',     
          required: true               
        }     
      },  
    ]},
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'birthprovince',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Provincia di nascita',     
          required: true               
        }     
      },  
      {
        key: 'birthdate',
        type: 'datepicker',      
        className: "col-md-6",
        templateOptions: {
          label: 'Data di nascita',     
          required: true               
        }     
      }
    ]},
    {
      className: 'section-label',
      template: '<h5>Residenza</h5>',
    },          
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'com_res',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Comune di residenza',     
          required: true               
        }     
      },  
      {
        key: 'prov_res',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Provincia di residenza',     
          required: true               
        }     
      }
    ]},
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'via_res',
        type: 'input',      
        className: "col-md-4",
        templateOptions: {
          label: 'Via di residenza',     
          required: true               
        }     
      },  
      {
        key: 'civ_res',
        type: 'input',      
        className: "col-md-2",
        templateOptions: {
          label: 'Civico',     
          required: true               
        }     
      },
      {
        key: 'presso',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Presso',     
          required: true               
        }     
      }
    ]},
    {
      className: 'section-label',
      template: '<h5>Incarichi</h5>',
    },   
    {
      key: 'assigments',    
      type: 'table',        
      fieldArray: {        
        fieldGroup:[
          {
            key: 'id',
            type: 'input',  
            hideExpression: false,                      
            templateOptions: {
              label: 'Id',                   
            }     
          },  
          {
            key: 'role',
            type: 'input',             
            templateOptions: {
              label: 'Ruolo',     
              required: true               
            }     
          },
          {
            key: 'title',
            type: 'input',      
            templateOptions: {
              label: 'Titolo',     
              required: true               
            }     
          },
          {
            key: 'istitute',
            type: 'input',                 
            templateOptions: {
              label: 'Istituto',     
              required: true               
            }     
          },
          {
            key: 'from',
            type: 'datepicker',               
            templateOptions: {
              label: 'Da',     
              required: true               
            }     
          },
          {
            key: 'to',
            type: 'datepicker',                             
            templateOptions: {
              label: 'A',     
              required: true               
            }     
          },
          {
            key: 'document',
            type: 'input',                            
            templateOptions: {
              label: 'Documento',     
              required: true               
            }     
          },
          {
            key: 'path',
            type: 'input',                         
            templateOptions: {
              label: 'Percorso',     
              required: true               
            }     
          },

        ]
      }
    }

  ];

  private id: number;
  private submissionForm: FormGroup;

  submissionFormDynamic: FormGroup;
  submissionControls: {[key: string]: ControlBase<any>};
  assignmetControls: {[key: string]: ControlBase<any>};

  options: object[] = [
    {key:'m', value:'Maschio'},    
    {key:'f', value:'Femmina'}    
  ]

  datarows = [];
  temp = [];
  
  editing = [];
  defaultColDef = { editable: true };
  arrayMetadata:  ControlBase<any>[];
 
  constructor(private submissionService: SubmissionService) {      

    //costruzione dinamica
    let controls = this.submissionService.getSumbissionMetadata();   
    this.submissionControls = ControlUtils.normalizeArray(controls,'key');
    this.submissionFormDynamic = ControlUtils.toFormGroup(controls);    

    this.arrayMetadata = this.submissionService.getAssignmetMetadata();   
    this.assignmetControls = ControlUtils.normalizeArray( this.arrayMetadata , 'key');     
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
      this.model = data;

      data.assigments.forEach(element => {                
        this.assignments.push(ControlUtils.toFormGroup(this.submissionService.getAssignmetMetadata()));                                 
      });      
      
      //this.submissionFormDynamic.get('assignments').value
      this.datarows.push(...data.assigments);
      this.datarows= [...this.datarows];
      this.temp = this.datarows;
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
 
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.role.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.datarows =[...temp];
    this.assignments.patchValue(temp);
    
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }
}
