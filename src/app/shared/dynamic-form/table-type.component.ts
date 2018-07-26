import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable/release/types';


@Component({
  selector: 'app-table-type',
  template: `
  <div class="btn-toolbar mb-4" role="toolbar">
    <div class="btn-group btn-group-sm">    
        <button class="btn btn-outline-primary" (click)="addFirst()"  >              
            <span class="oi oi-plus"></span>
            <span class="ml-2">Aggiungi</span>
        </button>    
        <button class="btn btn-outline-primary" [disabled]="selected.length == 0" (click)="removeSelected()"  >              
            <span class="oi oi-trash"></span>  
            <span class="ml-2">Rimuovi</span>
        </button>
    </div>
</div>

<ngx-datatable
  #table  class="bootstrap" 
  [rows]="model"
  [columns]="columns"
  [columnMode]="columnMode"
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
  (select)='onSelect($event)'>     
  
  <ng-template #genericcolumn ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row" let-column="column">
    <formly-field             
      [model]="getModel(model,column,rowIndex)"
      [field]="getFields(field,column, rowIndex)"
      [options]="options"
      [form]="formControl">
    </formly-field>
  </ng-template>  
  
</ngx-datatable>
`
})

// <h1>Model</h1>
// <pre>{{ model | json }}</pre>
export class TableTypeComponent extends FieldArrayType {
  constructor(builder: FormlyFormBuilder) {    
    super(builder);
  }

  @ViewChild('genericcolumn') public genericcolumn: TemplateRef<any>;

  //descrizione delle colonne della tabella
  columns: TableColumn[];
  selected = [];

  ngOnInit() {
    this.columns =  this.field.fieldArray.fieldGroup.map(el => {      
      return { 
        name: el.templateOptions.label, 
        prop: el.key,                        
        sortable: true,      
        cellTemplate: this.genericcolumn,             
      }
    });
    
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
  addFirst(){
    this.add();    
  }

  removeSelected(){
      let index = this.model.indexOf(this.selected[0])
      this.remove(index);
      this.selected = [];       
  }
}
