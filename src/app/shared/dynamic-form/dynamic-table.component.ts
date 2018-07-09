import { Component, Injectable, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { NgxDatatableModule, DatatableComponent } from '@swimlane/ngx-datatable';
import { TableColumn } from '@swimlane/ngx-datatable/release/types';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { GridModel } from './grid-model'

@Injectable()
@Component({
    selector: 'grid',
    templateUrl: './dynamic-table.component.html'
})
export class DynamicTableComponent<T> implements OnInit, OnDestroy {
    @Input()
    columns: TableColumn[];

    private _gridModelInput = new BehaviorSubject<GridModel<T>>(undefined);

    @ViewChild('emptyTemplate') 
    public emptyTemplate: TemplateRef<any>;

    @ViewChild('idAnchorEditTemplate') 
    public idAnchorEditTemplate: TemplateRef<any>;

    @ViewChild('dateTemplate') 
    public dateTemplate: TemplateRef<any>;

    @ViewChild('dateTimeTemplate') 
    public dateTimeTemplate: TemplateRef<any>;

    // change data to use getter and setter
    @Input()
    set gridModelInput(value) {
        // set the latest value for _data BehaviorSubject
        if (value !== undefined) {
            this._gridModelInput.next(value);
        }
    };

    get gridModelInput() {
        // get the latest value from _data BehaviorSubject
        return this._gridModelInput.getValue();
    }

    @Output()
    onFetchDataRequired = new EventEmitter<GridModel<T>>();

    private gridModel: GridModel<T>;
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
        this.gridModel = new GridModel<T>();

        this._gridModelInput.subscribe(gridModel => {
            this.gridModel = gridModel;
            this.isLoading = false;
        }, err => console.log(err));

        this.loadPage();
    }

    protected loadPage(pageEvent = {offset: 0}){
        this.gridModel.CurrentPageNumber = pageEvent.offset;
        this.onFetchDataRequired.emit(this.gridModel);
        this.isLoading = true;
    }

    protected onSort(event) {
        if (this.gridModel.SortBy != event.sorts[0].prop) {
            //this means we are sorting on a new column
            //so we need to return the paging to the first page
            this.gridModel.CurrentPageNumber = 0;            
        }

        this.gridModel.SortBy = event.sorts[0].prop;
        this.gridModel.SortDir = event.sorts[0].dir;

        this.loadPage();
    }

    public onLimitChange(limit: any): void {
        this.gridModel.PageSize = this.currentPageLimit = parseInt(limit, 10);
        this.gridModel.CurrentPageNumber = 0;
        this.loadPage();
    }

    ngOnDestroy(): void {
        this._gridModelInput.unsubscribe();
    }
}