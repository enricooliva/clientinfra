import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html' 
})

export class NavigationComponent implements OnInit {

  constructor() {} 

  goHome() {
    //this.router.navigate(['']); 
  }

  goSearch() {
    //this.router.navigate(['search']); 
  }
  
  ngOnInit() {
  }

}
