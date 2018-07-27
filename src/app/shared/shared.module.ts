import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';


import { UserLoginComponent } from './user-login/user-login.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { MessageComponent } from './message/message.component';
import { ControlGenericListComponent } from './dynamic-form/control-generic-list.component';
import { DynamicTableComponent } from './dynamic-form/dynamic-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatepickerTypeComponent } from './dynamic-form/datapicker-type.component';
import { RepeatTypeComponent } from './dynamic-form/repeat-type.component';
import { TableTypeComponent } from './dynamic-form/table-type.component';
import { PanelWrapperComponent } from './dynamic-form/panel-wrapper.component';
import { AccordionWrapperComponent } from './dynamic-form/accordion-wrapper.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core';



@NgModule({
  imports: [
    CommonModule, 
    NgbModule.forRoot(), 
    HttpModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxDatatableModule,
    RouterModule,
    FormlyModule.forRoot({
      types: [{
        name: 'datepicker',      
        component: DatepickerTypeComponent, 
        wrappers: ['fieldset','label']
      },      
      { name: 'repeat', component: RepeatTypeComponent },
      { name: 'datatable', 
        component: TableTypeComponent, 
        defaultOptions: {
          templateOptions: {
            columnMode: "force",    
            rowHeight: "auto",    
            headerHeight: "30",
            footerHeight: "30",
            limit: "5",
            scrollbarH: "true",
            reorderable: "reorderable"
          },
        }, 
      },
      ],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
        { name: 'accordion', component: AccordionWrapperComponent },
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
    ShowErrorsComponent, 
    DynamicFormComponent, 
    MessageComponent, 
    ControlGenericListComponent, 
    DynamicTableComponent, 
    DatepickerTypeComponent, 
    RepeatTypeComponent,
    FormlyModule,    
  ],
  declarations: [UserLoginComponent, NavigationComponent, UserLoginComponent, ShowErrorsComponent, 
    DynamicFormComponent, MessageComponent, ControlGenericListComponent, DynamicTableComponent, DatepickerTypeComponent, RepeatTypeComponent, PanelWrapperComponent, AccordionWrapperComponent]
})

export class SharedModule { }
