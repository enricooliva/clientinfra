import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../../core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html' 
})

export class NavigationComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;  
  
  constructor(public authService: AuthService, private router: Router) {} 

  goHome() {
    //this.router.navigate(['']); 
  }

  goSearch() {
    //this.router.navigate(['search']); 
  }
  
  goLogin(){
    if (!this.authService.isLoggedIn){
      this.authService.login();
    }
  }  

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn; // {2}
  }

  onLogout(){
    this.authService.logout(); 
    this.router.navigate(['home']);                     // {3}
  }
}
