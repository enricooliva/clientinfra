import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, LOCALE_ID } from '@angular/core';
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

import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { ConvvalidationComponent } from './pages/convvalidation.component';
import { SottoscrizioneComponent } from './pages/sottoscrizione.component';
import { FirmaControparteComponent } from './pages/firmacontroparte.component';
import { FirmaDirettoreComponent } from './pages/firmadirettore.component';
import { AziendaLocComponent } from './components/convenzione/aziendaloc.component';
import { AziendeLocComponent } from './components/convenzione/aziendeloc.component';
import { AziendaLocService } from './aziendaloc.service';
import { PersoneinterneTitulus } from './pages/personeinterne-titulus.component';
import { PersonaInternaService } from './personainterna.service';
import { StruttureInterneTitulus } from './pages/struttureinterne-titulus.component';
import { StrutturaInternaService } from './strutturainterna.service';
import { ClassificazioneComponent } from './components/classif/classificazione.component';
import { ClassificazioniComponent } from './components/classif/classificazioni.component';
import { MappingUfficiTitulus } from './components/mapping/mappinguffici.component';
import { MappingUfficioService } from './mappingufficio.service';
import { MappingUfficioTitulus } from './components/mapping/mappingufficio.component';
import { UnitaOrganizzativaService } from './unitaorganizzativa.service';
import { StruttureEsterneTitulus } from './pages/struttureesterne-titulus.component';
import { StrutturaEsternaService } from './strutturaesterna.service';
import { DocumentoService } from './documento.service';
import { DocumentiTitulus } from './pages/documenti-titulus.component';

registerLocaleData(localeIt);
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
    RoleComponent, PermissionComponent, RolesComponent, PermissionsComponent, TipoPagamentiComponent, TipoPagamentoComponent, TaskComponent,
    TasksComponent, ConvvalidationComponent, SottoscrizioneComponent, FirmaControparteComponent, FirmaDirettoreComponent, AziendaLocComponent, AziendeLocComponent, 
    PersoneinterneTitulus, StruttureInterneTitulus, ClassificazioneComponent, ClassificazioniComponent, MappingUfficiTitulus, MappingUfficioTitulus, StruttureEsterneTitulus,
    DocumentiTitulus
  ],
  declarations: [        
    ConvenzioneComponent,
    ConvenzioniComponent,    
    AssignmentDetailPageComponent,    
    HomeComponent, UsersComponent, UserComponent, MultistepSchematipoComponent, AllegatiComponent, UploadfileComponent, UserTaskDetailComponent, 
    RoleComponent, PermissionComponent, RolesComponent, PermissionsComponent, TipoPagamentiComponent, TipoPagamentoComponent, TaskComponent, TasksComponent,
    ConvvalidationComponent, SottoscrizioneComponent, FirmaControparteComponent, FirmaDirettoreComponent,  AziendaLocComponent, AziendeLocComponent,
    PersoneinterneTitulus, StruttureInterneTitulus, ClassificazioneComponent, ClassificazioniComponent, MappingUfficiTitulus, MappingUfficioTitulus, StruttureEsterneTitulus,
    DocumentiTitulus

  ],
  providers: [ 
    { provide: LOCALE_ID, useValue: 'it' },
    ApplicationService,
    UserTaskService,
    AziendaLocService,
    PersonaInternaService,
    StrutturaInternaService,   
    MappingUfficioService, 
    UnitaOrganizzativaService,
    StrutturaEsternaService,
    DocumentoService
  ], 
})
export class ApplicationModule { }
