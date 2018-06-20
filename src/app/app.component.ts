import { Component } from '@angular/core';
import { NgForm }   from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubmissionService } from './submission';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Unipeo client';
  errorMessage = '';

  submissions$: Observable<any>;
  constructor(route: ActivatedRoute) {    
    console.log("constructor app-root ");
    let token = null;
    route.queryParamMap.subscribe(p => {
      token = p.get("token");
      if (token){
        localStorage.setItem("token",token);
      }else{
        console.log("no token");
      }
    })
  }

  ngOnInit(){
     
    console.log("init app-root")
  }

}
