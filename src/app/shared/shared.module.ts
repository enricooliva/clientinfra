import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserLoginComponent } from '../shared/user-login/user-login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { MessageComponent } from './message/message.component';
import { ControlGenericListComponent } from './dynamic-form/control-generic-list.component';

@NgModule({
  imports: [
    CommonModule, NgbModule.forRoot(), HttpModule, FormsModule, ReactiveFormsModule
  ],
  exports: [ NavigationComponent, UserLoginComponent, HomeComponent, ShowErrorsComponent, DynamicFormComponent, MessageComponent, ControlGenericListComponent ],
  declarations: [UserLoginComponent, NavigationComponent, UserLoginComponent, HomeComponent, ShowErrorsComponent, DynamicFormComponent, MessageComponent, ControlGenericListComponent]
})

export class SharedModule { }
