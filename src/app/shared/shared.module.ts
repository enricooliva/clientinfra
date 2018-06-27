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

@NgModule({
  imports: [
    CommonModule, NgbModule.forRoot(), HttpModule, FormsModule, ReactiveFormsModule
  ],
  exports: [ NavigationComponent, UserLoginComponent, HomeComponent, ShowErrorsComponent, DynamicFormComponent ],
  declarations: [UserLoginComponent, NavigationComponent, UserLoginComponent, HomeComponent, ShowErrorsComponent, DynamicFormComponent]
})

export class SharedModule { }
