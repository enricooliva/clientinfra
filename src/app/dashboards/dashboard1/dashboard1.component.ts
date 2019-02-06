import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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
    this.mytasks = this.service.getUserTaskByCurrentUser().pipe(
      tap(data =>{ 
        data.forEach(x => {
          x.namelist = x.assignments.map(el => el.personale.nome + ' ' + el.personale.cognome)
          x.namelist = x.namelist.join(', ');     
        })}
    )
    );
    this.myofficetasks = this.service.getUserTaskByCurrentUserOffice().pipe(
      tap(data =>{ 
        data.forEach(x => {
          x.namelist = x.assignments.map(el => el.personale.nome + ' ' + el.personale.cognome)
          x.namelist = x.namelist.join(', ');     
        })}
    )
    );
  }

  // x.namelist = x.assignments.reduce(function(acc, el){
  //   return acc + ', ' + el.personale.nome + ' ' + el.personale.cognome;
  // },'')
}
