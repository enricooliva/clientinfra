import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//services
import { ApplicationService } from './application.service';

//components
import { ConvenzioneComponent } from './components/convenzione/convenzione.component';
import { AssignmentDetailPageComponent } from './pages/assignment-detail-page/assignment-detail-page.component';
import { SharedModule } from '../shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';
import { AuthGuard, CoreModule } from '../core';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './components/user/users.component';
import { UserComponent } from './components/user/user.component';
import { LoadingModule } from 'ngx-loading';
import { ConvenzioniComponent } from './components/convenzione/convenzioni.component';
import { MultistepSchematipoComponent } from './pages/multistep-schematipo.component';
import { AllegatiComponent } from './components/convenzione/allegati.component';
import { UploadfileComponent } from './components/convenzione/uploadfile.component';
import { UserTaskDetailComponent } from './components/convenzione/user-task-detail.component';
import { UserTaskService } from './usertask.service';
import { RoleComponent } from './components/user/role.component';
import { PermissionComponent } from './components/user/permission.component';
import { RolesComponent } from './components/user/roles.component';
import { PermissionsComponent } from './components/user/permissions.component';
import { TipoPagamentiComponent } from './components/convenzione/tipopagamenti.component';
import { TipoPagamentoComponent } from './components/convenzione/tipopagamento.component';
import { TaskComponent } from './components/task/task.component';
import { TasksComponent } from './components/task/tasks.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    
    SharedModule,
    NgbModule.forRoot(),
    NgxDatatableModule,      
    RouterModule,
    LoadingModule,
    CoreModule,  
  ], 
  exports: [
    ConvenzioneComponent,
    HomeComponent, UserComponent, ConvenzioniComponent, MultistepSchematipoComponent, AllegatiComponent, UploadfileComponent, UserTaskDetailComponent, 
    RoleComponent, PermissionComponent, RolesComponent, PermissionsComponent, TipoPagamentiComponent, TipoPagamentoComponent, TaskComponent, TasksComponent
  ],
  declarations: [        
    ConvenzioneComponent,
    ConvenzioniComponent,    
    AssignmentDetailPageComponent,    
    HomeComponent, UsersComponent, UserComponent, MultistepSchematipoComponent, AllegatiComponent, UploadfileComponent, UserTaskDetailComponent, 
    RoleComponent, PermissionComponent, RolesComponent, PermissionsComponent, TipoPagamentiComponent, TipoPagamentoComponent, TaskComponent, TasksComponent
  ],
  providers: [ 
    ApplicationService,
    UserTaskService,
  ], 
})
export class ApplicationModule { }
