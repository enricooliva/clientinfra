import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

//services
import { SubmissionService } from './submission.service';

//components
import { SubmissionComponent } from './components/submission/submission.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule    
  ], 
  exports: [
    SubmissionComponent
  ],
  declarations: [
    SubmissionComponent
  ],
  providers: [ 
    SubmissionService 
  ], 
})
export class SubmissionModule { }
