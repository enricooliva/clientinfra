import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UserLoginComponent } from '../shared/user-login/user-login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    CommonModule, NgbModule.forRoot(), HttpModule
  ],
  exports: [ NavigationComponent, UserLoginComponent, HomeComponent ],
  declarations: [UserLoginComponent, NavigationComponent, UserLoginComponent, HomeComponent]
})

export class SharedModule { }
