import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DashboardService } from '../../dashboard.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TaskListComponent implements OnInit, AfterViewInit {
 
  public config: PerfectScrollbarConfigInterface = {};

  @Input()
  isLoading: false;

  @Input()
  title: string;

  @Input()
  model: Observable<any>;

  constructor(protected router: Router) {}


  ngOnInit(): void {
   
  }
  
  ngAfterViewInit(): void {  
  }

  onClick(task){
    this.router.navigate(['home/tasks', task.id]);
  }
  
  onCheck(task){
    //TODO usare il tipo di task...
    if (task.workflow_transition == 'store_validazione'){
      this.router.navigate(['home/validazione', task.model_id]);
    }
  }

  // assignments: (2) [{…}, {…}]
  // cd_tipo_posizorg: "RESP_UFF"
  // model_id: 3
  // model_type: "App\UserTask"
  //   personale:
  //   aff_org: "005400"
  //   cd_ruolo: "ND"
  //   cognome: "CAPPELLACCI"
  //   email: "marco.cappellacci@uniurb.it"
  //   id_ab: "5266"
  //   matricola: "010717"
  //   nome: "MARCO"
  // created_at: "2019-01-31 15:56:27"
  // description: "prova apri"
  // id: 3
  // model_id: 14
  // model_type: "App\Convenzione"
  // owner_user_id: 15
  // respons_v_ie_ru_personale_id_ab: 5266
  // state: "aperto"
  // subject: "prova"
  // tasktype: null
  // tasktypes_id: null
  // unitaorganizzativa_uo: "005400"
  // updated_at: "2019-01-31 15:56:27"
  // user: {id: 15, v_ie_ru_personale_id_ab: 39842, name: "Enrico Oliva", email: "enrico.oliva@uniurb.it", created_at: "2019-01-31 15:55:48", …}
  // workflow_place: null
}
