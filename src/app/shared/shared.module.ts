import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { UserLoginComponent } from '../shared/user-login/user-login.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  imports: [
    CommonModule, NgbModule.forRoot(), HttpModule
  ],
  exports: [ NavigationComponent, UserLoginComponent ],
  declarations: [UserLoginComponent, NavigationComponent, UserLoginComponent]
})

export class SharedModule { }
