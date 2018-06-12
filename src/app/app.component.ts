import { Component } from '@angular/core';
import { NgForm }   from '@angular/forms';
import { SubmissionService } from './submission.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';


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
    //modalità asincrona 
    //this.submissions$ = this.submissionService.getSumbissions();
    this.submissionService.getSumbissions()
    .subscribe((data)=> {
      this.submissions$ = data;
    },
    (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        // client-side error
        this.errorMessage = `An error occured: ${err.error.message}`;
      } else {
        this.errorMessage = `Backend returned code ${err.status}, body was: ${err.message}`;
      }
    });
  }

  onSubmit(form: NgForm){
    console.log('ci sono');
    console.log(form.value);
  }
}
