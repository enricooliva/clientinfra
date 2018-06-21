import { Component, OnInit } from '@angular/core';
import { Router, NavigationCancel } from '@angular/router';
import { AuthService } from '../../core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'  
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
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

   }

  ngOnInit() {
  }
  

  btnClick= function () {
        //this.router.navigateByUrl('/user');
        window.location.replace('http://pcoliva.uniurb.it/api/loginSaml');        
  };



  
}
