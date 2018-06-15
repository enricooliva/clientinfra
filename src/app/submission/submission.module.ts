import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//services
import { SubmissionService } from './submission.service';

//components
import { SubmissionComponent } from './components/submission/submission.component';
import { AssignmentComponent } from './components/assignment/assignment.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule    
  ], 
  exports: [
    SubmissionComponent
  ],
  declarations: [
    SubmissionComponent,
    AssignmentComponent
  ],
  providers: [ 
    SubmissionService 
  ], 
})
export class SubmissionModule { }
