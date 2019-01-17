import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { UserLoginComponent } from './user-login/user-login.component';
//import { NavigationComponent } from './navigation/navigation.component';
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
import { ExternalqueryComponent } from './query-builder/externalquery.component';
import { TableLookupTypeComponent } from './dynamic-form/tablelookup-type.component';
import { ExternalobjTypeComponent } from './dynamic-form/externalobj-type.component';
import { SelectTypeComponent } from './dynamic-form/select-type.component';
import { NavstepperWrapperComponent } from './dynamic-form/navstepper-wrapper.component';
import { TabTypeComponent } from './dynamic-form/tab-type.component';
import { FormInfraComponent } from './dynamic-form/form-infra.component';
import { InputFileComponent } from './dynamic-form/input-file/input-file.component';
import { PdfInfraComponent } from './dynamic-form/pdf-infra/pdf-infra.component';
import { PdfTypeComponent } from './dynamic-form/pdf-type/pdf-type.component';
import { PdfTypeInputComponent } from './dynamic-form/pdf-type-input/pdf-type-input.component';
import { FormlyFieldButton } from './dynamic-form/button-type.component';
import { FormlyHorizontalWrapper } from './dynamic-form/horizontal-wrapper';
import { BaseEntityComponent } from './base-component/base-entity.component';
import { BaseResearchComponent } from './base-component/base-research.component';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { NavigationComponent } from './header-navigation/navigation.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};
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
    PerfectScrollbarModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'button',
          component: FormlyFieldButton,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              btnType: 'default',
              type: 'button',
            },
          },
        },
      { name: 'pdfviewerinput', component: PdfTypeInputComponent, wrappers: ['form-field']},
      { name: 'pdfviewer', component: PdfTypeComponent, wrappers: ['form-field']},
      { name: 'fileinput', component: InputFileComponent },
      { name: 'generic', component: GenericTypeComponent, wrappers: ['form-field'] },
      { name: 'external', component: ExternalTypeComponent },
      { name: 'externalquery', component: ExternalqueryComponent },
      { name: 'externalobject', component: ExternalobjTypeComponent },
      { name: 'selectinfra', component: SelectTypeComponent },
      { name: 'tab', component: TabTypeComponent },
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
      { name: 'datatablelookup', 
        component: TableLookupTypeComponent, 
        defaultOptions: {
          templateOptions: {
            columnMode: "force",    
            rowHeight: "auto",    
            headerHeight: "30",
            footerHeight: "30",
            limit: "100",
            scrollbarH: "true",
            reorderable: "reorderable"
          },
        }, 
      },
      ],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
        { name: 'accordion', component: AccordionWrapperComponent },
        { name: 'form-field-horizontal', component: FormlyHorizontalWrapper },
      ],
      validationMessages: [
        { name: 'required', message: 'Campo richiesto' },
        { name: 'notfound', message: 'Non trovato' },     
        { name: 'filevalidation', message: 'Documento non valido' },   
      ]
    }),
    FormlyBootstrapModule,
    PdfViewerModule,
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
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
    LookupComponent,
    ExternalqueryComponent,
    TableLookupTypeComponent,
    ExternalobjTypeComponent,
    SelectTypeComponent,
    NavstepperWrapperComponent,
    TabTypeComponent,    
    FormInfraComponent,
    InputFileComponent,
    PdfInfraComponent,
    PdfTypeComponent,
    FormlyFieldButton,
    FormlyHorizontalWrapper,
    BaseEntityComponent,
    BaseResearchComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent
  ],
  declarations: [
    UserLoginComponent, NavigationComponent, UserLoginComponent, ShowErrorsComponent, 
    DynamicFormComponent, MessageComponent, ControlGenericListComponent, DynamicTableComponent,
    DatepickerTypeComponent, RepeatTypeComponent, PanelWrapperComponent, AccordionWrapperComponent, 
    SideNavComponent, QueryBuilderComponent, GenericTypeComponent, ExternalTypeComponent, LookupComponent, ExternalqueryComponent, 
    TableLookupTypeComponent, ExternalobjTypeComponent, ExternalobjTypeComponent, SelectTypeComponent, NavstepperWrapperComponent, TabTypeComponent,
    FormInfraComponent,
    InputFileComponent,
    PdfInfraComponent,
    PdfTypeComponent,
    PdfTypeInputComponent,
    FormlyFieldButton,
    FormlyHorizontalWrapper,
    BaseEntityComponent,
    BaseResearchComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
  ],
  entryComponents: [LookupComponent]
})

export class SharedModule { }
