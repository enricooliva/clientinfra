import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';


import { UserLoginComponent } from './user-login/user-login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { MessageComponent } from './message/message.component';
import { ControlGenericListComponent } from './dynamic-form/control-generic-list.component';
import { DynamicTableComponent } from './dynamic-form/dynamic-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatepickerTypeComponent } from './dynamic-form/datapicker-type.component';
import { RepeatTypeComponent } from './dynamic-form/repeat-type.component';
import { TableTypeComponent } from './dynamic-form/table-type.component';


@NgModule({
  imports: [
    CommonModule, 
    NgbModule.forRoot(), 
    HttpModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxDatatableModule,
    FormlyModule.forRoot({
      types: [{
        name: 'datepicker',      
        component: DatepickerTypeComponent, 
        wrappers: ['fieldset','label']
      },
      { name: 'repeat', component: RepeatTypeComponent },
      { name: 'table', component: TableTypeComponent },
      ],
      validationMessages: [
        { name: 'required', message: 'Campo richiesto' },
      ]
    }),
    FormlyBootstrapModule
  ],
  exports: [ 
    NavigationComponent, 
    UserLoginComponent, 
    HomeComponent, 
    ShowErrorsComponent, 
    DynamicFormComponent, 
    MessageComponent, 
    ControlGenericListComponent, 
    DynamicTableComponent, 
    DatepickerTypeComponent, 
    RepeatTypeComponent,
    FormlyModule
  ],
  declarations: [UserLoginComponent, NavigationComponent, UserLoginComponent, HomeComponent, ShowErrorsComponent, 
    DynamicFormComponent, MessageComponent, ControlGenericListComponent, DynamicTableComponent, DatepickerTypeComponent, RepeatTypeComponent]
})

export class SharedModule { }
