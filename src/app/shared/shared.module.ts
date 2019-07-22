import {NgbModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { UserLoginComponent } from './user-login/user-login.component';
import { ShowErrorsComponent } from './show-errors/show-errors.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { MessageComponent } from './message/message.component';
import { ControlGenericListComponent } from './dynamic-form/control-generic-list.component';
import { DynamicTableComponent } from './dynamic-form/dynamic-table.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatepickerTypeComponent } from './dynamic-form/datapicker-type.component';
import { RepeatTypeComponent } from './dynamic-form/repeat-type.component';
import { TableTypeComponent } from './dynamic-form/table-type.component';
import { PanelWrapperComponent } from './dynamic-form/wrapper/panel-wrapper.component';
import { AccordionWrapperComponent } from './dynamic-form/wrapper/accordion-wrapper.component';
import { RouterModule } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { GenericTypeComponent } from './dynamic-form/generic-type.component';
import { ExternalTypeComponent } from './dynamic-form/external-type.component';
import { LoadingModule } from 'ngx-loading';
import { LookupComponent } from './lookup/lookup.component';
import { ExternalqueryComponent } from './query-builder/externalquery.component';
import { TableLookupTypeComponent } from './dynamic-form/tablelookup-type.component';
import { ExternalobjTypeComponent } from './dynamic-form/externalobj-type.component';
import { SelectTypeComponent } from './dynamic-form/select-type.component';
import { NavstepperWrapperComponent } from './dynamic-form/wrapper/navstepper-wrapper.component';
import { TabTypeComponent } from './dynamic-form/tab-type.component';
import { FormInfraComponent } from './dynamic-form/form-infra.component';
import { InputFileComponent } from './dynamic-form/input-file/input-file.component';
import { PdfInfraComponent } from './dynamic-form/pdf-infra/pdf-infra.component';
import { PdfTypeComponent } from './dynamic-form/pdf-type/pdf-type.component';
import { PdfTypeInputComponent } from './dynamic-form/pdf-type-input/pdf-type-input.component';
import { FormlyFieldButton } from './dynamic-form/button-type.component';
import { FormlyHorizontalWrapper } from './dynamic-form/wrapper/horizontal-wrapper';
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
import { TooltipWrapperComponent } from './dynamic-form/wrapper/tooltip-wrapper.component';
import { AccordionInfoWrapperComponent } from './dynamic-form/wrapper/accordioninfo-wrapper.component';
import { FormlyFieldTypeahead } from './dynamic-form/typehead-type.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RightaddonsWrapperComponent } from './dynamic-form/wrapper/rightaddons-wrapper.component';
import { GridFormlyCellComponent } from './dynamic-form/ag-grid/grid-formly-cell.component';
import { GridTypeComponent } from './dynamic-form/ag-grid/grid.type';
import { AgGridModule } from 'ag-grid-angular';
import { TableGroupTypeComponent } from './dynamic-form/tablegroup-type.component';
import { MycurrencyPipe } from './pipe/custom.currencypipe';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FormlyFieldTemplate } from './dynamic-form/template.type.component';
import { SystemErrorComponent } from './system-error-component/system-error.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

export function minlengthValidationMessage(err, field) {
  return `Inserire almeno ${field.templateOptions.minLength} caratteri`;
}

export function maxlengthValidationMessage(err, field) {
  return `Inserire un valore inferiore a ${field.templateOptions.maxLength} caratteri`;
}

export function minValidationMessage(err, field) {
  return `Inserire un valore maggiore di ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `Inserire un valore minore di ${field.templateOptions.max}`;
}


@NgModule({
  imports: [
    CommonModule, 
    NgbModule.forRoot(), 
    NgbTooltipModule,
    HttpModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NgxDatatableModule,
    RouterModule,
    NgxPermissionsModule,
    LoadingModule,
    PerfectScrollbarModule,
    NgSelectModule, 
    AgGridModule.withComponents([GridFormlyCellComponent]),   
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
      { name: 'template', component: FormlyFieldTemplate },
      { name: 'pdfviewerinput', component: PdfTypeInputComponent, wrappers: ['form-field']},
      { name: 'pdfviewer', component: PdfTypeComponent, wrappers: ['form-field']},
      { name: 'fileinput', component: InputFileComponent },
      { name: 'generic', component: GenericTypeComponent, wrappers: ['form-field'] },
      { name: 'external', component: ExternalTypeComponent },
      { name: 'externalquery', component: ExternalqueryComponent },
      { name: 'externalobject', component: ExternalobjTypeComponent },
      { name: 'selectinfra', component: SelectTypeComponent },
      { name: 'tabinfra', component: TabTypeComponent },
      { name: 'string', extends: 'input' },
      { name: 'typeahead', component: FormlyFieldTypeahead },
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
      { 
        name: 'datatablelookup', 
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
      { 
        name: 'datatablegroup', 
        component: TableGroupTypeComponent, 
        defaultOptions: {
          templateOptions: {
            columnMode: "force",    
            rowHeight: "auto",    
            headerHeight: "30",
            footerHeight: "30",
            limit: "100",
            scrollbarH: "true",
            reorderable: false,
          },
        }, 
      },
      {
        name: 'gridtable',
        component: GridTypeComponent,
        defaultOptions: {
          className: "ag-theme-bootstrap",
          //className: 'ag-theme-balham',
          templateOptions: {
            width: '100%',
            height: '400px',
          },
        },
      },
      ],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
        { name: 'accordion', component: AccordionWrapperComponent },
        { name: 'accordioninfo', component: AccordionInfoWrapperComponent },
        { name: 'form-field-horizontal', component: FormlyHorizontalWrapper },
        { name: 'tooltip', component: TooltipWrapperComponent },
        { name: 'addonRights', component: RightaddonsWrapperComponent },
      ],
      validationMessages: [
        { name: 'required', message: 'Campo richiesto' },
        { name: 'notfound', message: 'Non trovato' },     
        { name: 'filevalidation', message: 'Documento non valido' },   
        { name: 'pattern', message: 'Formato non valido' },   
        { name: 'minlength', message: minlengthValidationMessage },
        { name: 'maxlength', message: maxlengthValidationMessage },
        { name: 'min', message: minValidationMessage },
        { name: 'max', message: maxValidationMessage },
      ]
    }),
    FormlyBootstrapModule,
    PdfViewerModule,
  ],
  providers: [
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
  ],
  exports: [     
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
    TableTypeComponent,
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
    SidebarComponent,
    TooltipWrapperComponent,    
    FormlyFieldTypeahead,
    RightaddonsWrapperComponent,
    GridTypeComponent,
    GridFormlyCellComponent,
    TableGroupTypeComponent,
    MycurrencyPipe,
    ConfirmationDialogComponent,
    FormlyFieldTemplate,  
    SystemErrorComponent,
  ],
  declarations: [
    UserLoginComponent, UserLoginComponent, ShowErrorsComponent, 
    DynamicFormComponent, MessageComponent, ControlGenericListComponent, DynamicTableComponent,
    DatepickerTypeComponent, RepeatTypeComponent, PanelWrapperComponent, AccordionWrapperComponent, 
    QueryBuilderComponent, GenericTypeComponent, ExternalTypeComponent, LookupComponent, ExternalqueryComponent, 
    TableLookupTypeComponent, ExternalobjTypeComponent, SelectTypeComponent, NavstepperWrapperComponent, TabTypeComponent,
    TableTypeComponent,
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
    TooltipWrapperComponent,
    AccordionInfoWrapperComponent,
    FormlyFieldTypeahead,
    RightaddonsWrapperComponent,
    GridTypeComponent,
    GridFormlyCellComponent,
    TableGroupTypeComponent,
    MycurrencyPipe,
    ConfirmationDialogComponent,
    FormlyFieldTemplate,
    SystemErrorComponent,
  ],
  entryComponents: [LookupComponent]
})

export class SharedModule { }
