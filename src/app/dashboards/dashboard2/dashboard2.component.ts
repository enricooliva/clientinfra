import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit, AfterViewInit {

  public queryinscadenza: any = {};
  public queryscadute: any = {};

  constructor(public service: DashboardService, private datePipe: DatePipe) {}

  ngAfterViewInit() {
  
  }

  ngOnInit(): void {
    
      const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy');   
      this.queryinscadenza.rules =  [
        { value: today, field: "data_tranche", operator: ">=", type: "date" },
        { value: 'pagato', field: "state", operator: "!=", type: "string" }
      ];     
            
      this.queryscadute.rules =  [
        { value: today, field: "data_tranche", operator: "<=", type: "date" },
        { value: 'pagato', field: "state", operator: "!=", type: "string" }
      ];     
      
    
  }

  // x.namelist = x.assignments.reduce(function(acc, el){
  //   return acc + ', ' + el.personale.nome + ' ' + el.personale.cognome;
  // },'')
}
