import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { not } from '@angular/compiler/src/output/output_ast';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit{
  public config: PerfectScrollbarConfigInterface = {};  

  isLoading: boolean = false;
  model: any = {};

  constructor(private service: DashboardService, private modalService: NgbModal, public activeModal: NgbActiveModal, protected router: Router) {}

  form =  new FormGroup({});
  modelNotification: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'subject',
      type: 'input',
      templateOptions: {
        label: 'Oggetto',        
        disabled: true,        
      },
    },
    {
      key: 'description',
      type: 'textarea',
      templateOptions: {
        label: 'Contenuto',
        disabled: true,  
        rows: 5,      
      }
    }    
  ];
  

  ngOnInit(): void {    
    this.isLoading = true;
    this.model = this.service.getNotifications().pipe(
      tap(x =>    setTimeout(()=> { this.isLoading = false; }, 0) )
    );
  }

  open(content, notification) {
    if (notification.data.subject || notification.data.description){
      this.modelNotification = notification.data;      
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {   
      }, (reason) => {      
      });
    } 
  }

  onOpen(notification){
    //a quale entità è riferito
    //model_type: "App\Convenzione"
    //model_type: "App\Scadenza"
    if (!notification.data)
      return;
      
    if (notification.data.model_type == 'App\\Convenzione'){
      this.router.navigate(['home/convenzioni', notification.data.model_id]);
    }
    if (notification.data.model_type == 'App\\Scadenza'){
      this.router.navigate(['home/scadenze', notification.data.model_id]);
    }

  }

  
}
