import {NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { SubmissionModule } from './submission/submission.module';
import { AppComponent } from './app.component';
import { SubmissionService } from './submission/submission.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { NgbDateCustomParserFormatter } from 'src/app/NgbDateCustomParserFormatter';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, SubmissionModule, ReactiveFormsModule, SharedModule, NgbModule.forRoot()
  ],  
  providers: [
    SubmissionService,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}

  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
