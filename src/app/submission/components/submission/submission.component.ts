import { Component, OnInit, Input, NgModule } from '@angular/core';
import { Submission } from '../../models/submission';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { SubmissionService } from '../../submission.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',  
})

export class SubmissionComponent implements OnInit {  
  submission: Submission;
  
  constructor(private submissionService: SubmissionService) {}

  ngOnInit() {
    this.submissionService.getSubmission()
    .subscribe((data)=> {
        this.submission = data;
    });
  }

}
