import { Component, OnInit, Input, ViewChild, TemplateRef, KeyValueDiffers } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable/release/types';
import { Router } from '@angular/router';
import { Page, PagedData } from '../lookup/page';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';

@Component({
  selector: 'app-tablegroup-type',
  template: `  

<ngx-datatable
  #grouptable  class="bootstrap expandable" 
  [rows]="model"
  [groupRowsBy]="to.groupRowsBy"
  [columns]="to.columns"
  [columnMode]="to.columnMode"
  [rowHeight]="to.rowHeight"   
  [headerHeight]="to.headerHeight"      
  [footerHeight]="to.footerHeight"
  [scrollbarH]="to.scrollbarH"    
  [scrollbarV]="to.scrollbarV"  
  [reorderable]="to.reorderable"    
  [selected]="to.selected"
  [selectionType]="'single'"
  [groupExpansionDefault]="to.groupExpansionDefault"
  [summaryRow]="to.enableSummary"
  [summaryPosition]="to.summaryPosition"
  [summaryHeight]="'auto'"
  (activate)='onEvents($event)'
>     
<!-- Group Header Template -->
<ngx-datatable-group-header [rowHeight]="50" #myGroupHeader (toggle)="onDetailToggle($event)">
  <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
    <div style="padding-left:5px;">
      <a    
        [class.datatable-icon-right]="!expanded"
        [class.datatable-icon-down]="expanded"
        title="Expand/Collapse Group"
        (click)="toggleExpandGroup(group)">
        <b>Stato: {{group.value[0].state}}</b>
      </a>                          
    </div>
  </ng-template>
</ngx-datatable-group-header>

</ngx-datatable>

<ng-template #statetemplate ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row" let-column="column" >
<span [ngSwitch]="value">                        
  <span *ngSwitchCase="'attivo'" class="label label-rounded label-primary">{{value}}</span>                        
  <span *ngSwitchCase="'inpagamento'" class="label label-rounded label-warning">{{value}}</span> 
  <span *ngSwitchCase="'inemissione'" class="label label-rounded label-warning">{{value}}</span>   
  <span *ngSwitchCase="'pagato'" class="label label-rounded label-success">{{value}}</span>     
</span>
</ng-template>  

<ng-template #staterow let-row="row" let-value="value">
  <strong>{{ value }}</strong>
  <i class="pb-icon icon-edit"></i>
  <i *ngIf="row.canDelete == true" class="pb-icon icon-garbage"></i>
  <i *ngIf="row.canSend== true" class="pb-icon icon-send"></i>
</ng-template>
`
})

//<h1>Model</h1>
//<pre>{{ model | json }}</pre>

export class TableGroupTypeComponent extends FieldArrayType {  

  @ViewChild('statetemplate') statetemplate: TemplateRef<any>;
  @ViewChild('grouptable') table: any;

  constructor(builder: FormlyFormBuilder, private differs: KeyValueDiffers) {    
    super(builder);        
  
  }
        
  ngOnInit() {      
   
    if (!('selected' in this.to)){
      Object.defineProperty(this.to,'selected',{
        enumerable: true,
        configurable: true,
        writable: true
      });
      this.to.selected= [];
    }
    
    if (typeof this.to.columns == 'undefined'){
      //configurazione basata sulla dichiarazione delle colonne nel json 
      // modalità implicità di costruzione delle colonne 
        // columns: [
        //   { name: 'Id', prop: 'id', width: 10},
        //   { name: 'Nome utente', prop: 'name' },
        //   { name: 'Email', prop: 'email' },
        // ],      
      //costruzione dinamica delle colonne partendo dai campi aggiunta eventuali proprietà 
      //di colonna all'interno delle template option dei campi
      //
      this.to.columns =  this.field.fieldArray.fieldGroup.map(el => {      
        
        let c = { 
          name: el.templateOptions.label, 
          prop: el.key,                                          
        }
        el.templateOptions.label = "";
                       
        return c;
      });
      
    }else{

      (this.to.columns as Array<any>).find(x => x.prop=='state').cellTemplate = this.statetemplate;
    }   
    
  }

 
  onEvents(event) {
    if (event.type == "dblclick" && typeof this.to.onDblclickRow !== "undefined"){
      this.to.onDblclickRow(event);    
    }
  }
  
  ngDoCheck() {    
     
  }
  
  getGroupRowHeight(group, rowHeight) {
    let style = {};

    style = {
      height: (group.length * 40) + 'px',
      width: '100%'
    };

    return style;
  }

  toggleExpandGroup(group) {
    //console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }  

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }


  
 }
