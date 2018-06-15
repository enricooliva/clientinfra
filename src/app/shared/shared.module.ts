import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserLoginComponent } from '../shared/user-login/user-login.component';
import { NavigationComponent } from './navigation/navigation.component';

@NgModule({
  imports: [
    CommonModule, NgbModule.forRoot()
  ],
  exports: [ NavigationComponent ],
  declarations: [UserLoginComponent, NavigationComponent]
})

export class SharedModule { }
