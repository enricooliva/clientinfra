import { Component, Injectable, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { NgxDatatableModule, DatatableComponent } from '@swimlane/ngx-datatable';
import { TableColumn } from '@swimlane/ngx-datatable/release/types';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { GridModel } from './grid-model'
import { ControlBase } from './control-base';
import { FormArray, FormGroup } from '@angular/forms';

@Injectable()
@Component({
    selector: 'app-grid',
    templateUrl: './dynamic-table.component.html'
})
export class DynamicTableComponent<T> implements OnInit, OnDestroy {
    
    @ViewChild('textcolumn') public textcolumn: TemplateRef<any>;
    @ViewChild('datecolumn') public datecolumn: TemplateRef<any>;
    
    @ViewChild(DatatableComponent) table: DatatableComponent;

    @Input() metadata: ControlBase<any>[];        
    @Input() controls: FormArray;
    @Input() datarows: Array<any>;
    //la form contenitore
    @Input() form: FormGroup;
    
    @Input() columnMode: any = "force";    
    @Input() rowHeight: any = "auto" ;    
    @Input() headerHeight: any ="40" ;  
    @Input() footerHeight: any ="40" ;  
    @Input() limit: any ="10" ;  
    @Input() scrollbarH: any = "true" ;     
    @Input() reorderable: any ="reorderable" ;             
    
    @Output() onFetchDataRequired = new EventEmitter<GridModel<T>>();

    columns: TableColumn[];

    private temp = [];
    private isLoading: boolean = false;
    private currentPageLimit: number = 0;
    private pageLimitOptions = [
        {value: 10},
        {value: 25},
        {value: 50},
        {value: 100},
    ];

    constructor() {
    }

    ngOnInit(): void {

        this.columns =  this.metadata.map(el => {
            return { 
              name: el.label, 
              prop: el.key,        
              cellTemplate: el.key!=='id' ? this.getTemplateColumn(el) : null,
              width: el.key=='id' ? 50 : null
            }
        });  
    }

    //TODO: spostare nel componente 
    private getTemplateColumn(el:ControlBase<any>): TemplateRef<any> {    
        switch (el.controlType) {
        case 'textbox':
            return this.textcolumn;
        case 'datepicker':        
            return this.datecolumn;        

        default:
            return this.textcolumn;
        }
    }

    getCellClass( rowIndex, column ) : any {     
        let ctrl = this.controls.at(rowIndex).get(column.prop);
        return {      
          'is-invalid': ctrl.invalid && (ctrl.dirty || ctrl.touched)
        };
    }

    ngOnDestroy(): void {
        
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.controls.value.sort((a , b) => {                
            if (typeof a[sort.prop] ===  "number"){
                return (a[sort.prop]>(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));  
            }    
            return (a[sort.prop].localeCompare(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));    
        });    
        this.controls.patchValue(this.controls.value);    
    }
        
    updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function(d) {
            return d.role.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.datarows = [...temp];
        this.controls.patchValue(temp);
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }
    
}