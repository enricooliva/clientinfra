import { Component, OnInit } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',    
  styleUrls: ['./home.component.css'],  
})
export class HomeComponent implements OnInit {
  
  //configurazione menu
  navs = [
    {title: 'Gestione', links: [
      { href: 'submissions', text: 'Utente', permissions: ['ADMIN'] },
    ]},    
    {title: 'Funzionali', links: [
      { href: 'submissions', text: 'Domanda', permissions: ['ADMIN', 'USER'] },
      { href: 'submissions', text: 'Lista domande', permissions: ['ADMIN'] },
    ]}    
  ];


  constructor(private authService: AuthService, private router: Router) {
    let token = null;
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        let params = new URLSearchParams(s.url.split('/home')[1]);
        token = params.get('token');        
        if (token){
            authService.loginWithToken(token);
            this.router.navigate(['home/submissions']);
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
