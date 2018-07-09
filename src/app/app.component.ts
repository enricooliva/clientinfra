import { Component } from '@angular/core';
import { NgForm }   from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, NavigationCancel, Router } from '@angular/router';
import { AuthService } from './core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  
})
export class AppComponent {
  title = 'Unipeo client';
  errorMessage = '';

  submissions$: Observable<any>;
  constructor(public router: Router, route1: ActivatedRoute, private authService: AuthService) {    
    console.log("constructor app-root ");
    let token = null;

    router.events.subscribe(s => {
      if (s instanceof NavigationCancel) {
        let params = new URLSearchParams(s.url.split('/')[1]);
        token = params.get('token');        
        if (token){
            authService.loginWithToken(token);
            this.router.navigate(['submissions']);
          }else{
            console.log("no token");
          }    
      }
    });

    // route1.queryParamMap.subscribe(p => {
    //   token = p.get("token");
    //   if (token){
    //     authService.loginWithToken(token);
    //   }else{
    //     console.log("no token");
    //   }
    // })
  }

  ngOnInit(){
     
    console.log("init app-root")
  }

}
