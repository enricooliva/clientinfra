import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DashboardRoutes } from './dashboard.routing';

import { Dashboard1Component } from './dashboard1/dashboard1.component';

import { TaskListComponent } from './dashboard-components/recent-comments/tasklist.component';
import { InfocardComponent } from './dashboard-components/info-card/info-card.component';
import { DashboardService } from './dashboard.service';
import { LoadingModule } from 'ngx-loading';
import { NotificationsComponent } from './dashboard-components/notifications/notifications.component';
import { SharedModule } from '../shared';
import { TableTypeComponent } from '../shared/dynamic-form/table-type.component';
import { ConvenzioniresultComponent } from './dashboard-components/convenzioniresult/convenzioniresult.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';
import { ScadenzeresultComponent } from './dashboard-components/scadenzeresult/scadenzeresult.component';
import { NotificationService } from './notification.service';
import { CollapseWrapperComponent } from './dashboard-components/collapse-wrapper/collapse-wrapper.component';

@NgModule({
  imports: [  
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,   
    LoadingModule, 
    RouterModule.forChild(DashboardRoutes),
    PerfectScrollbarModule,    
    NgxDatatableModule,        
    SharedModule,
  ],
  declarations: [
    Dashboard1Component,
    Dashboard2Component,
    InfocardComponent,
    TaskListComponent,
    NotificationsComponent,
    ConvenzioniresultComponent,
    ScadenzeresultComponent,
    CollapseWrapperComponent,
  ],
  providers: [ 
    DashboardService,
    NotificationService,    
    DatePipe,
  ]
})
export class DashboardModule {}
