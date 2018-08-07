import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styles: []
})
export class QueryBuilderComponent implements OnInit, OnChanges {
  onDestroy$ = new Subject<void>();

  public defaultOperatorMap: {[key: string]: string[]} = {
    string: ['=', '!=', 'contains', 'like'],
    textarea: ['=', '!=', 'contains', 'like'],
    number: ['=', '!=', '>', '>=', '<', '<='],
    time: ['=', '!=', '>', '>=', '<', '<='],
    date: ['=', '!=', '>', '>=', '<', '<='],
    enum: ['=', '!=', 'in', 'not in'],
    boolean: ['=']
  };

  private rules: FormlyFieldConfig[] = [
    {
      key: 'rules',
      type: 'repeat',
      wrappers: ['accordion'],      
      templateOptions: {
        label: 'Condizioni',   
        columnMode: 'force',       
      },
      fieldArray: {
        fieldGroupClassName: 'row',   
        fieldGroup: [
          {
            key: 'field',
            type: 'select',   
            className: "col-md-3",         
            templateOptions: {
              label: 'Campo',                   
            }
          },        
          {
            key: 'operator',
            type: 'select',
            className: "col-md-2",
            templateOptions: {
              label: 'Operatore',              
            },
            lifecycle: {
              onInit: (form, field) => {                
              
                form.get('field').valueChanges.pipe(
                  takeUntil(this.onDestroy$),
                  startWith(form.get('field').value),
                  tap(selectedField => {                                     
                    field.formControl.setValue('');
                    if (this.keymetadata[selectedField] )                     
                      field.templateOptions.options = this.getOptions(this.getOperators(selectedField));                                                        
                  }),
                ).subscribe();
              },
            },
          },
          {
            key: 'valueInput',
            type: 'generic',
            className: "col-md-4",
            hideExpression: true,
            templateOptions: {
              label: 'Valore',
              required: true,              
            },       
            lifecycle: {
              onInit: (form, field) => {                      
                form.get('field').valueChanges.pipe(
                  takeUntil(this.onDestroy$),
                  startWith(form.get('field').value),
                  tap(selectedField => {                   
                    if (this.keymetadata[selectedField] ){          
                                           
                      field.formControl.reset();
                      field.hideExpression = false;
                      field.type = this.keymetadata[selectedField].type
      
                      if (this.keymetadata[selectedField].type == 'number'){
                        field.templateOptions.type = 'number';
                      } else{
                        field.templateOptions.type = null;
                      }                    
                    }
                  }),
                ).subscribe();
              },
            }
          }
        ]
      }
    }
  ];


  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = {
    rules: new Array<any>(),
  };

  private fields: FormlyFieldConfig[] = this.rules;    
 
  //elenco dei metadati dell'entità di ingresso
  @Input() metadata: FormlyFieldConfig[] = []
  private keymetadata: { [index: string]: FormlyFieldConfig } = {}
  private operatorsCache: {[key: string]: string[]};
  private defaultEmptyList: any[] = [];
  // private defaultTemplateTypes: string[] = [
  //  'string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];

  constructor() { }

  // ----------OnInit Implementation----------

  ngOnInit() {   
    let field = this.rules[0].fieldArray.fieldGroup[0]; 
    let options = new Array();
    this.metadata.forEach(element => {
      this.keymetadata[element.key] = element;
      //generare la select dei campi // array di options
      options.push({value: element.key, label: element.templateOptions.label});          
    });
    field.templateOptions.options = options;
    
  }

   // ----------OnChanges Implementation----------

   ngOnChanges() {
     this.operatorsCache={};
   }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getOptions(operators: string[]) : {label:string, value:string }[] {
    return operators.map(el=> {                         
      return  {                          
        label: el,
        value: el
      };                  
    });
  }

  getOperators(field: string): string[] {
    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
    let operators = this.defaultEmptyList;
    const fieldObject = this.keymetadata[field];    
    let type = fieldObject.type;

    if (type) {
      if (type === 'input')
        type = (fieldObject.templateOptions.type || 'string');

      operators = (this.defaultOperatorMap[type] || this.defaultEmptyList);
      if (operators.length === 0) {
        console.warn(
          `No operators found for field '${field}' with type ${fieldObject.type}. ` +
          `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
      }
      //TODO sistemare i tipi nullable da dove lo si vede? se non è required 
      if (!fieldObject.templateOptions.required) {
        operators = operators.concat(['is null', 'is not null']);
      }
    } else {
      console.warn(`No 'type' property found on field: '${field}'`);
    }

    // Cache reference to array object, so it won't be computed next time and trigger a rerender.
    this.operatorsCache[field] = operators;
    return operators;
  }

}
