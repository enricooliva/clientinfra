import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styles: []
})

//ng g c shared/sideNav -s true  --spec false

export class SideNavComponent implements OnInit {
  
  @Input() entries = [];

  constructor(private router: Router) {}

  ngOnInit(): void {    
  }

  isActive(currentRoute: any[], exact = true): boolean {
    return this.router.isActive(this.router.createUrlTree(currentRoute), exact);
  }

}
