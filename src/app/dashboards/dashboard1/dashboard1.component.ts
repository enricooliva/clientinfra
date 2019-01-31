import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './dashboard1.component.html',
  styleUrls: ['./dashboard1.component.css']
})
export class Dashboard1Component implements OnInit, AfterViewInit {
  
  constructor(public service: DashboardService) {}

  mytasks: Observable<any>;
  myofficetasks: Observable<any>;

  ngAfterViewInit() {
   
  }

  ngOnInit(): void {
    this.mytasks = this.service.getUserTaskByCurrentUser();
    this.myofficetasks = this.service.getUserTaskByCurrentUserOffice();
  }
}
