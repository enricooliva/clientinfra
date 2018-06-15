import { Component } from '@angular/core';
import { NgForm }   from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionService } from './submission';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Unipeo client';
  errorMessage = '';

  submissions$: Observable<any>;
  constructor(private submissionService: SubmissionService) {}

  ngOnInit(){ 
  }

}
