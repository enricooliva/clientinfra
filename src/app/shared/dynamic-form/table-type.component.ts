import { Component, OnInit, Input, ViewChild, TemplateRef, KeyValueDiffers } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable/release/types';
import { Router } from '@angular/router';
import { isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-table-type',
  template: `
  <div class="btn-toolbar mb-2" role="toolbar" *ngIf="!to.hidetoolbar">
    <div class="btn-group btn-group-sm">    
        <button class="btn btn-outline-primary border-0 rounded-0" (click)="addFirst()"  >              
            <span class="oi oi-plus"></span>
            <span class="ml-2">Aggiungi</span>
        </button>    
        <button class="btn btn-outline-primary border-0 rounded-0" [disabled]="selected.length == 0" (click)="removeSelected()"  >              
            <span class="oi oi-trash"></span>  
            <span class="ml-2">Rimuovi</span>
        </button>
    </div>
</div>

<ngx-datatable
  #table  class="bootstrap" 
  [rows]="model"
  [columns]="to.columns"
  [columnMode]="to.columnMode"
  [rowHeight]="to.rowHeight"   
  [headerHeight]="to.headerHeight"      
  [footerHeight]="to.footerHeight"
  [limit]="to.limit"  
  [scrollbarH]="to.scrollbarH"      
  [reorderable]="to.reorderable"    
  [externalSorting]="true"
  [selected]="selected"
  [selectionType]="'single'"
  (sort)="onSort($event)"
  (select)='onSelect($event)'
  (activate)='onEvents($event)'>     
  
  <ng-template #defaultcolumn ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row" let-column="column" >
    <formly-field             
      [model]="getModel(model,column,rowIndex)"
      [field]="getFields(field,column, rowIndex)"
      [options]="options"
      [form]="formControl">
    </formly-field>
  </ng-template>  
  
  <ng-template #valuecolumn ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row" let-column="column" >
    {{ value }}
  </ng-template>  


</ngx-datatable>
`
})

// <h1>Model</h1>
// <pre>{{ model | json }}</pre>
export class TableTypeComponent extends FieldArrayType {
  differ: any;

  constructor(builder: FormlyFormBuilder, private differs: KeyValueDiffers) {    
    super(builder);
    
		this.differ = differs.find({}).create();
  }

  
  @ViewChild('defaultcolumn') public defaultColumn: TemplateRef<any>;
  @ViewChild('valuecolumn') public valuecolumn: TemplateRef<any>;
  //descrizione delle colonne della tabella
  columns: TableColumn[];
  selected = [];

  ngOnInit() {    
    
    if (typeof this.to.columns !== 'undefined'){
      //configurazione basata sulla dichiarazione delle colonne nel json 
      // modalità implicità di costruzione delle colonne 
        // columns: [
        //   { name: 'Id', prop: 'id', width: 10},
        //   { name: 'Nome utente', prop: 'name' },
        //   { name: 'Email', prop: 'email' },
        // ],
      this.to.columns.forEach(column =>  { 
        column.cellTemplate = this.defaultColumn; 
        if (('cellTemplate' in column)) 
          column.cellTemplate = this[column.cellTemplate];       
        });

    } else{
      //costruzione dinamica delle colonne partendo dai campi aggiunta eventuali proprietà 
      //di colonna all'interno delle template option dei campi
      //
      this.to.columns =  this.field.fieldArray.fieldGroup.map(el => {      
        
        let c = { 
          name: el.templateOptions.label, 
          prop: el.key,                                  
          cellTemplate: this.defaultColumn                  
        }
        
        if ('column' in el.templateOptions){
          //copio tutte le proprietà relativa alla colonna 
          Object.keys(el.templateOptions.column).forEach(prop => {
            if (prop=='cellTemplate'){
              c.cellTemplate = this[el.templateOptions.column[prop]]
            }else{
              c[prop] = el.templateOptions.column[prop]
            }
          }
          );
        }

        return c;
      });
      
    }

    this.field.fieldArray.fieldGroup.forEach(element => {
      element.wrappers = ['fieldset']
    });
    
  }
 

  getFields( field: FormlyFieldConfig, column: TableColumn, rowIndex: number ) : any {         
    let result = field.fieldGroup[rowIndex].fieldGroup.find(f => f.key === column.prop);
    return result;
  }

  getModel(model, column: TableColumn, rowIndex): any {
    return model[rowIndex];
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.model.sort((a , b) => {   
        if (a[sort.prop] != null && b[sort.prop] != null){             
          if (typeof a[sort.prop] ===  "number"){
              return (a[sort.prop]>(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));  
          }    
          return (a[sort.prop].localeCompare(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));    
        }
    });          

    this.formControl.patchValue(this.model);   
  }

  onSelect({ selected }) {
      //console.log('Select Event', selected, this.selected);
  }

  onEvents(event) {
    if (event.type == "dblclick" && typeof this.to.onDblclickRow !== "undefined"){
      this.to.onDblclickRow(event);    
    }
  }


  addFirst(){
    this.add();    
  }

  removeSelected(){
      let index = this.model.indexOf(this.selected[0])
      this.remove(index);
      this.selected = [];       
  }

  ngDoCheck() {    
    let ma = this.model as Array<any>;    
    this.model = ma.filter(x => Object.keys(x).length !== 0);    
     
	}
}
