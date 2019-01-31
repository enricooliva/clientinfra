import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DashboardService } from '../../dashboard.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TaskListComponent implements OnInit, AfterViewInit {
 
  public config: PerfectScrollbarConfigInterface = {};

  @Input()
  title: string;

  @Input()
  model: Observable<any>;

  constructor() {}


  ngOnInit(): void {
   
  }
  
  ngAfterViewInit(): void {
  
  }

//   created_at: "2019-01-31 15:56:27"
//   description: "prova apri"
//   id: 3
//   model_id: 14
//   model_type: "App\Convenzione"
//   owner_user_id: 15
//   respons_v_ie_ru_personale_id_ab: 5266
//   state: "aperto"
//   subject: "prova"
//   tasktype: null
//   tasktypes_id: null
//   unitaorganizzativa_uo: "005400"
//   updated_at: "2019-01-31 15:56:27"
//   workflow_place: null
}
