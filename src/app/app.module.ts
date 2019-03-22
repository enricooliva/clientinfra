import {NgbModule, NgbDateParserFormatter, NgbDateAdapter, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ApplicationModule } from './application/application.module';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppComponent } from './app.component';
import { ApplicationService } from './application/application.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { NgbDateCustomParserFormatter } from './NgbDateCustomParserFormatter';
import { NotFoundComponent } from './not-found-component/not-found.component';
import { CoreModule, HttpInterceptorProviders, AuthGuard, MessageCacheService, RequestCache, RequestCacheWithMap, GlobalErrorHandlerProviders } from './core';
import { Router } from '@angular/router';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { NgbStringAdapter } from './NgbStringAdapter';
import { TableTypeComponent } from './shared/dynamic-form/table-type.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { UserService } from './application/user.service';
import { AziendaService } from './application/azienda.service';
import { TestTabComponent } from './application/pages/test-tab.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MessageService } from './shared';
import { UploadfileComponent } from './application/components/convenzione/uploadfile.component';
import { environment } from 'src/environments/environment';
import { APP_BASE_HREF } from '@angular/common';
import { RoleService } from './application/role.service';
import { PermissionService } from './application/permission.service';

import { ToastrModule } from 'ngx-toastr';
import { AziendaLocService } from './application/aziendaloc.service';
import { PersonaInternaService } from './application/personainterna.service';
import { StrutturaInternaService } from './application/strutturainterna.service';
import { ClassificazioneService } from './application/classificazione.service';
import { MappingUfficioService } from './application/mappingufficio.service';
import { TipoPagamentoService } from './application/tipopagamento.service';
import { UnitaOrganizzativaService } from './application/unitaorganizzativa.service';


export function tokenGetter() {
  return localStorage.getItem('token');
}



@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    TableTypeComponent,
    TestTabComponent,    
],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, ApplicationModule, ReactiveFormsModule, SharedModule, NgbModule.forRoot(), 
    AppRoutingModule, CoreModule, NgxDatatableModule,  NgxPermissionsModule.forRoot(), PdfViewerModule, ToastrModule.forRoot(), 
    
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.whitelistedDomains, // ['localhost:4200', 'pcoliva.uniurb.it','unidemdev.uniurb.it'],
        blacklistedRoutes: environment.blacklistedRoutes, //['localhost:4200/auth/']
      }
    })   
  ],  
  providers: [
    NgbActiveModal,
    AuthGuard,  
    ApplicationService,
    UserService,
    AziendaService,
    MessageService,
    MessageCacheService,  
    RoleService,
    PermissionService,
    TipoPagamentoService,
    ClassificazioneService,      
    { provide: RequestCache, useClass: RequestCacheWithMap },
    HttpInterceptorProviders,
    GlobalErrorHandlerProviders,        
    {provide: 'userService', useClass: UserService},
    {provide: 'applicationService', useClass: ApplicationService},
    {provide: 'aziendaService', useClass: AziendaService},
    {provide: 'aziendaLocService', useClass: AziendaLocService},
    {provide: 'personainternaService', useClass: PersonaInternaService},
    {provide: 'strutturainternaService', useClass: StrutturaInternaService},
    {provide: 'mapppingufficititulusService', useClass: MappingUfficioService},
    {provide: 'unitaorganizzativaService', useClass: UnitaOrganizzativaService},
    {provide: NgbDateAdapter, useClass: NgbStringAdapter},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
    {provide: APP_BASE_HREF, useValue: environment.baseHref},
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [UploadfileComponent],
})


export class AppModule {
   // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    //console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}

