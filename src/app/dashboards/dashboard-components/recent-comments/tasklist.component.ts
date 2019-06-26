import { Component, Input, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { DashboardService } from '../../dashboard.service';
import { tap, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FirmaControparteComponent } from 'src/app/application/pages/firmacontroparte.component';
import { FirmaDirettoreComponent } from 'src/app/application/pages/firmadirettore.component';
import { BolloRepertoriazioneComponent } from 'src/app/application/pages/bollorepertoriazione.component';
import { EmissioneComponent } from 'src/app/application/pages/emissione.component';
import { PagamentoComponent } from 'src/app/application/pages/pagamento.component';


@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TaskListComponent implements OnInit, AfterViewInit, OnDestroy {
 
  public config: PerfectScrollbarConfigInterface = {};

  isLoading: boolean = false;

  @Input()
  title: string;
  
  @Input() 
  typeresearch: string;

  model: any;

  page: {
    size: number;
    totalElements: any;
    pageNumber: any;
    previousPage: any;
  };
  
  protected onDestroy$ = new Subject<void>();
  
  constructor(protected service: DashboardService, protected router: Router) {}

  ngOnInit(): void {         
    this.loadData();        
  }
  
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
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

    if (task.workflow_transition == PagamentoComponent.WORKFLOW_ACTION){
      this.router.navigate([PagamentoComponent.ABSULTE_PATH, task.model_id]);
    }
  }

  onOpen(task){
    //a quale entità è riferito
    //model_type: "App\Convenzione"
    //model_type: "App\Scadenza"
    if (task.model_type == 'App\\Convenzione'){
      this.router.navigate(['home/convenzioni', task.model_id]);
    }
    if (task.model_type == 'App\\Scadenza'){
      this.router.navigate(['home/scadenze', task.model_id]);
    }

  }

  loadPage(pageNumber: number) {    
    if (this.page && this.page.pageNumber !== this.page.previousPage) {
      this.page.previousPage = pageNumber;
      this.loadData();
    }
  }


  loadData() {        
    this.isLoading = true;
    const pageParam = this.page ? this.page.pageNumber : null;
    let obs: Observable<any>;
    if (this.typeresearch == 'mytasks'){
      obs = this.service.getUserTaskByCurrentUser(pageParam);
    }else if (this.typeresearch == 'myofficetasks') {
      obs = this.service.getUserTaskByCurrentUserOffice(pageParam)
    }

    obs.pipe(      
      takeUntil(this.onDestroy$),
      tap(res =>{         
        res.data.forEach(x => {
          x.namelist = x.assignments.map(el => el.personale.nome + ' ' + el.personale.cognome)
          x.namelist = x.namelist.join(', ');     
        });
        setTimeout(()=> {
          this.isLoading = false;
        }, 0);
      })
    ).subscribe(
      (res) => {        
        this.model = res.data;

        this.page = {
          totalElements: res.total,
          pageNumber: res.current_page,
          size: res.per_page,
          previousPage:  res.current_page,
        }        
      }
    );
  }

}
