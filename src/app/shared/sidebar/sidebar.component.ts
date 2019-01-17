import { Component, AfterViewInit, OnInit, Input } from '@angular/core';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute, ROUTER_CONFIGURATION } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from 'src/app/application/menu-items';
import { AuthService } from 'src/app/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  @Input()
  routes:  RouteInfo[] = ROUTES;

  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }
  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
  ) {}

  // End open close
  ngOnInit() {
    this.sidebarnavItems = this.routes.filter(sidebarnavItem => sidebarnavItem);
  }

  getName(){
    if (this.authService.isLoggedIn){
      return this.authService.username;
    }
  }
  
  onLogout(){
    this.authService.logout(); 
    this.router.navigate(['home']);                     // {3}
  }
}
