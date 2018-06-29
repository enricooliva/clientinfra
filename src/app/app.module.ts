import {NgbModule, NgbDateParserFormatter, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { SubmissionModule } from './submission/submission.module';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { SubmissionService } from './submission/submission.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { NgbDateCustomParserFormatter } from 'src/app/NgbDateCustomParserFormatter';
import { NotFoundComponent } from './not-found-component/not-found.component';
import { CoreModule, HttpInterceptorProviders, AuthGuard } from './core';
import { Router } from '@angular/router';
import { NgbDateISOParserFormatter } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-parser-formatter';
import { NgbStringAdapter } from './NgbStringAdapter';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,    
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, SubmissionModule, ReactiveFormsModule, SharedModule, NgbModule.forRoot(), 
    AppRoutingModule, CoreModule, 
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200', 'pcoliva.uniurb.it',],
        blacklistedRoutes: ['localhost:4200/auth/']
      }
    })   
  ],  
  providers: [
    AuthGuard,  
    SubmissionService,
    {provide: NgbDateAdapter, useClass: NgbStringAdapter},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
   // Diagnostic only: inspect router configuration
   constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}

