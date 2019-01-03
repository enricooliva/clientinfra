import { Component, OnInit } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core';
import { AppConstants } from 'src/app/app-constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',    
  styleUrls: ['./home.component.scss'],  
})
export class HomeComponent implements OnInit {
  sidebarCollapsed = true;  
  _baseURL : string;

  //configurazione menu
  navs = [
    {title: 'Gestione', links: [
      { href: 'users', text: 'Utenti', permissions: ['ADMIN'] },
    ]},    
    {title: 'Funzionali', links: [
      { href: 'convenzione', text: 'Convenzione', permissions: ['ADMIN', 'USER'] },
      { href: 'convenzioni', text: 'Lista convenzioni', permissions: ['ADMIN'] },
      { href: 'allegati', text: 'Lista allegati', permissions: ['ADMIN'] },
      { href: 'multistep-schematipo', text: 'Inserimento convenzione', permissions: ['ADMIN'] },
      { href: 'test', text: 'Multi step form', permissions: ['ADMIN'] },
    ]}    
  ];


  constructor(private authService: AuthService, private router: Router) {
    this._baseURL = AppConstants.baseApiURL;
    let token = null;

    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        let params: URLSearchParams;
        if (s.url.includes('/home'))
          params = new URLSearchParams(s.url.split('/home')[1]);
        else{
          params = new URLSearchParams(s.url.split('/')[1]);
        }
        token = params.get('token');        
        if (token){
            console.log("keep token");
            authService.loginWithToken(token);
            this.router.navigate(['home/convenzioni']);
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
        window.location.replace(this._baseURL+'loginSaml');        
  };



  
}
