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
  isLoadingTask: boolean = false;
  isLoadingOfficeTask: boolean;

  ngAfterViewInit() {
   
  }

  ngOnInit(): void {
    this.isLoadingTask = true;
    this.mytasks = this.service.getUserTaskByCurrentUser(null).pipe(
      map (x => x.data),
      tap(data =>{ 
        data.forEach(x => {
          x.namelist = x.assignments.map(el => el.personale.nome + ' ' + el.personale.cognome)
          x.namelist = x.namelist.join(', ');               
        })
        setTimeout(()=> {
          this.isLoadingTask = false;
        }, 0);
        
      })
    );

    this.isLoadingOfficeTask = true;
    this.myofficetasks = this.service.getUserTaskByCurrentUserOffice(null).pipe(      
      tap(data =>{         
        data.forEach(x => {
          x.namelist = x.assignments.map(el => el.personale.nome + ' ' + el.personale.cognome)
          x.namelist = x.namelist.join(', ');     
        });
        setTimeout(()=> {
          this.isLoadingOfficeTask = false;
        }, 0);
      }
    )
    );
  }

  // x.namelist = x.assignments.reduce(function(acc, el){
  //   return acc + ', ' + el.personale.nome + ' ' + el.personale.cognome;
  // },'')
}
