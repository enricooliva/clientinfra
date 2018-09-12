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
import { NgxPermissionsModule } from 'ngx-permissions';
import { SideNavComponent } from './side-nav/side-nav.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { GenericTypeComponent } from './dynamic-form/generic-type.component';
import { ExternalTypeComponent } from './dynamic-form/external-type.component';
import { LoadingModule } from 'ngx-loading';
import { LookupComponent } from './lookup/lookup.component';

@NgModule({
  imports: [
    CommonModule, 
    NgbModule.forRoot(), 
    HttpModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxDatatableModule,
    RouterModule,
    NgxPermissionsModule,
    LoadingModule,
    FormlyModule.forRoot({
      types: [
      { name: 'generic', component: GenericTypeComponent, wrappers: ['form-field'] },
      { name: 'external', component: ExternalTypeComponent },
      { name: 'string', extends: 'input' },
      {
        name: 'number',
        extends: 'input',
        defaultOptions: {
          templateOptions: {
            type: 'number',
          },
        },
      },
      {
        name: 'integer',
        extends: 'input',
        defaultOptions: {
          templateOptions: {
            type: 'number',
          },
        },
      },
      { name: 'object', extends: 'formly-group' },
      { name: 'boolean', extends: 'checkbox' },
      { name: 'enum', extends: 'select' },
      { name: 'datepicker', component: DatepickerTypeComponent, wrappers: ['form-field'] },      
      { name: 'date', extends: 'datepicker'},
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
        { name: 'notfound', message: 'Non trovato' },        
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
    NgxPermissionsModule,
    SideNavComponent,
    QueryBuilderComponent,
    NgbModule,
    GenericTypeComponent,
    ExternalTypeComponent,
    LookupComponent
  ],
  declarations: [
    UserLoginComponent, NavigationComponent, UserLoginComponent, ShowErrorsComponent, 
    DynamicFormComponent, MessageComponent, ControlGenericListComponent, DynamicTableComponent,
    DatepickerTypeComponent, RepeatTypeComponent, PanelWrapperComponent, AccordionWrapperComponent, 
    SideNavComponent, QueryBuilderComponent, GenericTypeComponent, ExternalTypeComponent, LookupComponent 
  ],
  entryComponents: [LookupComponent]
})

export class SharedModule { }
