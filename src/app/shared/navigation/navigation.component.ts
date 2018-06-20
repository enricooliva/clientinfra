import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { AuthService } from '../../core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html' 
})

export class NavigationComponent implements OnInit {

  constructor(public authService: AuthService) {} 

  goHome() {
    //this.router.navigate(['']); 
  }

  goSearch() {
    //this.router.navigate(['search']); 
  }
  
  goLogin(){
    if (!this.authService.isLoggedIn()){
      this.authService.login();
    }
  }


  ngOnInit() {
  }

}
