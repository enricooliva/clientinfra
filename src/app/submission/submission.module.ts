import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//services
import { SubmissionService } from './submission.service';

//components
import { SubmissionComponent } from './components/submission/submission.component';
import { AssignmentComponent } from './components/assignment/assignment.component';
import { AssignmentDetailPageComponent } from './pages/assignment-detail-page/assignment-detail-page.component';
import { SharedModule } from '../shared';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    
    SharedModule,
    NgbModule.forRoot()
  ], 
  exports: [
    SubmissionComponent
  ],
  declarations: [    
    SubmissionComponent,
    AssignmentComponent,
    AssignmentDetailPageComponent
  ],
  providers: [ 
    SubmissionService 
  ], 
})
export class SubmissionModule { }
