import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Submission } from './models/submission';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class SubmissionService {

  constructor(private http: HttpClient) { }

  getSumbissions() : Observable<any> {
    return this.http
      .get('http://localhost:8000/api/submissions',httpOptions);
  }

  getSubmission(): Observable<Submission> {    
    return this.http
       .get<Submission>('http://localhost:8000/api/submissions',{         
          params: new HttpParams().set('userId', '2')        
      });

  }
}
