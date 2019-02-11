import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,   
    LoadingModule, 
    RouterModule.forChild(DashboardRoutes),
    PerfectScrollbarModule,    
    NgxDatatableModule
  ],
  declarations: [
    Dashboard1Component,
    InfocardComponent,
    TaskListComponent,
    NotificationsComponent,
  ],
  providers: [ 
    DashboardService,
  ]
})
export class DashboardModule {}
