import { Observable } from "rxjs";

export interface ServiceQuery {
    getById(id: any):  Observable<any>;
}

export interface RuleSet {
    condition: string;
    rules: Array<RuleSet | Rule>;
  }
  
  export interface Rule {
    field: string;
    value?: any;
    operator?: string;
    entity?: string;
  }

  export interface Option {
    name: string;
    value: any;
  }

  export interface Field {
    name: string;
    value?: string;
    type: string;
    nullable?: boolean;
    options?: Option[];
    operators?: string[];
    defaultValue?: any;
    defaultOperator?: any;
    entity?: string;
    validator?: (rule: Rule, parent: RuleSet) => any | null;
  }

  export interface FieldMap {
    [key: string]: Field;
  }

  export interface EntityMap {
    [key: string]: Entity;
  }

  export interface Entity {
    name: string;
    value?: string;
    defaultField?: any;
  }


export interface QueryBuilderConfig {
    fields: FieldMap;
    entities?: EntityMap;
    allowEmptyRulesets?: boolean;
    getOperators?: (fieldName: string, field: Field) => string[];
    getInputType?: (field: string, operator: string) => string;
    getOptions?: (field: string) => Option[];
    addRuleSet?: (parent: RuleSet) => void;
    addRule?: (parent: RuleSet) => void;
    removeRuleSet?: (ruleset: RuleSet, parent: RuleSet) => void;
    removeRule?: (rule: Rule, parent: RuleSet) => void;
  }
  
//Esempio di configurazione
//   public entityConfig: QueryBuilderConfig = {
//     entities: {
//       physical: {name: 'Physical Attributes'},
//       nonphysical: {name: 'Nonphysical Attributes'}
//     },
//     fields: {
//       age: {name: 'Age', type: 'number', entity: 'physical'},
//       gender: {
//         name: 'Gender',
//         entity: 'physical',
//         type: 'category',
//         options: [
//           {name: 'Male', value: 'm'},
//           {name: 'Female', value: 'f'}
//         ]
//       },
//       name: {name: 'Name', type: 'string', entity: 'nonphysical'},
//       notes: {name: 'Notes', type: 'textarea', operators: ['=', '!='], entity: 'nonphysical'},
//       educated: {name: 'College Degree?', type: 'boolean', entity: 'nonphysical'},
//       birthday: {name: 'Birthday', type: 'date', operators: ['=', '<=', '>'],
//         defaultValue: (() => new Date()), entity: 'nonphysical'
//       },
//       school: {name: 'School', type: 'string', nullable: true, entity: 'nonphysical'},
//       occupation: {
//         name: 'Occupation',
//         entity: 'nonphysical',
//         type: 'category',
//         options: [
//           {name: 'Student', value: 'student'},
//           {name: 'Teacher', value: 'teacher'},
//           {name: 'Unemployed', value: 'unemployed'},
//           {name: 'Scientist', value: 'scientist'}
//         ]
//       }
//     }
//   };
