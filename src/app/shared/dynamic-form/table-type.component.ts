import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable/release/types';


@Component({
  selector: 'app-table-type',
  template: `
<ngx-datatable
  #table  class="bootstrap" 
  [rows]="model"
  [columns]="columns"
  [columnMode]="columnMode"
  [rowHeight]="rowHeight"   
  [headerHeight]="headerHeight"      
  [footerHeight]="footerHeight"
  [limit]="limit"  
  [scrollbarH]="scrollbarH"      
  [reorderable]="reorderable"    
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
  
  @Input() columnMode: any = "force";    
  @Input() rowHeight: any = "auto" ;    
  @Input() headerHeight: any ="40" ;  
  @Input() footerHeight: any ="40" ;  
  @Input() limit: any ="10" ;  
  @Input() scrollbarH: any = "true" ;     
  @Input() reorderable: any ="reorderable" ;  

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
    this.formControl.value.sort((a , b) => {                
        if (typeof a[sort.prop] ===  "number"){
            return (a[sort.prop]>(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));  
        }    
        return (a[sort.prop].localeCompare(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));    
    });    
    this.formControl.patchValue(this.formControl.value);   
    this.model = [...this.formControl.value]; 
  }

  onSelect({ selected }) {
      //console.log('Select Event', selected, this.selected);
  }
}
