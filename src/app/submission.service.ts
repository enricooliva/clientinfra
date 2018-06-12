import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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


}
