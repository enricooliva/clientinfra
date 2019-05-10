import { Component, Input, AfterViewInit, OnInit } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DashboardService } from '../../dashboard.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FirmaControparteComponent } from 'src/app/application/pages/firmacontroparte.component';
import { FirmaDirettoreComponent } from 'src/app/application/pages/firmadirettore.component';
import { BolloRepertoriazioneComponent } from 'src/app/application/pages/bollorepertoriazione.component';
import { EmissioneComponent } from 'src/app/application/pages/emissione.component';

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
    if (task.state !== 'aperto'){
      return;
    }

    if (task.workflow_transition == 'store_validazione'){
      this.router.navigate(['home/validazione', task.model_id]);
    }

    if (!task.workflow_transition  && task.workflow_place == 'approvato'){
      this.router.navigate(['home/sottoscrizione', task.model_id]);
    }

    if (task.workflow_transition == FirmaControparteComponent.WORKFLOW_ACTION){
      this.router.navigate([FirmaControparteComponent.ABSULTE_PATH, task.model_id]);
    }

    if (task.workflow_transition == FirmaDirettoreComponent.WORKFLOW_ACTION){
      this.router.navigate([FirmaDirettoreComponent.ABSULTE_PATH, task.model_id]);
    }

    if (task.workflow_transition == BolloRepertoriazioneComponent.WORKFLOW_ACTION){
      this.router.navigate([BolloRepertoriazioneComponent.ABSULTE_PATH, task.model_id]);
    }

    if (task.workflow_transition == EmissioneComponent.WORKFLOW_ACTION){
      this.router.navigate([EmissioneComponent.ABSULTE_PATH, task.model_id]);
    }
  }

}
