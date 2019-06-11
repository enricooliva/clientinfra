import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import { UserTaskService } from '../../usertask.service';
import { of } from 'rxjs/internal/observable/of';
import { takeUntil, startWith, filter, tap, map, distinct } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {Location} from '@angular/common';
import { ApplicationService } from '../../application.service';

@Component({
  selector: 'app-task',
  templateUrl: '../../../shared/base-component/base-entity.component.html'
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class TaskComponent extends BaseEntityComponent {

  subject = new Subject<any>();
 
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Dettaglio attività</h5>',
    },
    {
      className: 'section-label',
      template: '<div class="mb-2">Finestra per la gestione di una attivià non per la sua esecuzione</div>',
    },    
    {
      fieldGroupClassName: 'row',
      fieldGroup:
        [
          {
            className: 'col-md-2',
            type: 'number',
            key: 'id',
            templateOptions: {
              label: 'Id',
              disabled: true,
            },
            hideExpression: (model: any, formState: any) => {
              return !model.id;
           },   
          },

          // {
          //   className: 'col-md-5',
          //   type: 'input',
          //   key: 'state',
          //   templateOptions: {
          //     label: 'Stato',
          //     disabled: true,
          //   },    
          // },
          {
            className: 'col-md-5',
            type: 'select',
            key: 'transition',
            defaultValue: 'self_transition',
            templateOptions: {
              label: 'Prossima azione',
              options: this.subject.asObservable(),
            }, 
            hideExpression: (model: any, formState: any) => {
              return !model.id;
            },              
            // expressionProperties: {
            //   'templateOptions.options': (model: any, formState: any) => {
            //     if (model['transitions']) {
            //       return model['transitions'];
            //     }
            //   }
            // }
          },
        ],
    },
    //{
    // fieldGroupClassName: 'row',
    // fieldGroup:
    //   [
    //     {
    //       className: 'col-md-6',
    //       type: 'input',
    //       key: 'workflow_place',
    //       templateOptions: {
    //         label: 'Flusso',
    //         disabled: true,
    //       },
    //     },
    {      
      type: 'select',
      key: 'model_type',     
      templateOptions: {
        label: 'Tipo di entità a cui associare una attività',              
        options: [
          { codice: 'App\\Convenzione', descrizione: 'Convenzione' },
          { codice: 'App\\Scadenza', descrizione: 'Scandenza' },
        ],        
        valueProp: 'codice',
        labelProp: 'descrizione',
      },      
      expressionProperties: {
        'templateOptions.disabled': (model: any, formState: any) => {                        
            return model.id
        },
      },                   
    },
    //se il task è associato ad una convenzione
    {
      key: 'model',
      type: 'externalobject',   
      hide: true,   
      templateOptions: {
        label: 'Convenzione',
        type: 'string',
        entityName: 'application',
        entityLabel: 'Convenzione',
        entityPath: 'home/convenzioni',
        codeProp: 'id',
        descriptionProp: 'descrizione_titolo',
        isLoading: false,        
      },
      hideExpression: (model: any, formState: any) => {
        return formState.model.model_type != 'App\\Convenzione';
      },  
      expressionProperties: {
        'templateOptions.disabled': (model: any, formState: any) => {                        
            return model.id
        },
      },          
    },

    //se il task è associato ad una scadenza
    {
      key: 'model',
      type: 'externalobject',
      hide: true,
      templateOptions: {
        label: 'Scadenza',
        type: 'string',
        entityName: 'scadenza',
        entityLabel: 'Scadenza',
        entityPath: 'home/scadenze',
        codeProp: 'id',
        descriptionProp: 'dovuto_tranche',
        isLoading: false,        
      },
      hideExpression: (model: any, formState: any) => {
        return formState.model.model_type != 'App\\Scadenza';
      },  
      expressionProperties: {
        'templateOptions.disabled': (model: any, formState: any) => {                        
            return model.id
        },
      },          
    },

    //esendo polimorfica le prossime azioni da compiere possono essere verso convenzione o scadenza
    {      
      type: 'select',
      key: 'workflow_transition',
      //defaultValue: 'self_transition',
      templateOptions: {
        label: 'Azione da compiere',      
        options: [],
        disabled: true,
      },
      hideExpression: (model: any, formState: any) => {
        return model.id;
      },                   
      hooks: {        
        onInit: (field) => {
          //va costruita solo se sono nello stato nuovo          
          if (!this.activeNew){
            field.form.get('model').get('id').valueChanges.pipe(
              takeUntil(this.onDestroy$),    
              distinct(),                  
              //startWith(form.get('unitaorganizzativa_uo').value),
              filter(ev => ev !== null),
              tap(id => {                 
                if (id){
                  field.templateOptions.options = this.service.getNextActions(id,this.model.model_type).pipe(
                    map(x => x.filter(y => y.value != 'self_transition')),
                    tap(x => field.templateOptions.disabled = false )
                  );                                  
                  //field.formControl.setValue('self_transition');
                }
              })
            ).subscribe();
          }
        }
      }

    },
    // {
    //   className: 'col-md-6',
    //   type: 'input',
    //   key: 'model_type',
    //   templateOptions: {
    //     label: 'Entità associata',
    //     disabled: true,
    //   },
    // },
    //]
    //},

    {
      key: 'unitaorganizzativa_uo',
      type: 'selectinfra',
      templateOptions: {
        label: 'Ufficio affidatario procedura',
        required: true,
        options: [], //this.service.getValidationOffices(),
        valueProp: 'uo',
        labelProp: 'descr',
        inizialization: () => {
          return this.model['unitaOrganizzativa'];
        },
        populateAsync: () => {          
          return this.service.getValidationOffices();
        }
      },          
      expressionProperties: {
        'templateOptions.disabled': (model: any, formState: any) => { return model.id; },
      },
    },
    {
      key: 'respons_v_ie_ru_personale_id_ab',
      type: 'select',
      templateOptions: {
        label: 'Responsabile ufficio',
        valueProp: 'id',
        labelProp: 'descr',
        required: true,
      },
      expressionProperties: {
        'templateOptions.disabled': (model: any, formState: any) => { return model.id; },
      },
      hooks: {
        onInit: (field) => {
          field.form.get('unitaorganizzativa_uo').valueChanges.pipe(
            takeUntil(this.onDestroy$),
            startWith(field.form.get('unitaorganizzativa_uo').value),
            distinct(),
            filter(ev => ev !== null),
            tap(uo => {
              field.formControl.setValue('');
              field.templateOptions.options = this.service.getPersonaleUfficio(uo).pipe(
                map(items => {
                  return items.filter(x => ApplicationService.isResponsabileUfficio(x.cd_tipo_posizorg) );
                }),
                tap(items => {
                  if (items[0] && !field.model.respons_v_ie_ru_personale_id_ab) {
                    field.formControl.setValue(items[0].id);
                  }
                }),
              );
            }),
          ).subscribe();
        },
      },
    },
    {
      key: 'assignments',
      type: 'repeat',
      templateOptions: {
        label: 'Ulteriori assegnatari',
      },
      validators: {
        unique: {
          expression: (c) => {
            if (c.value) {
              var valueArr = c.value.map(function (item) { return item.v_ie_ru_personale_id_ab }).filter(x => x != null).map(x => x.toString());
              var isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx
              });
              return !isDuplicate;
            }
            return true;
          },
          message: (error, field: FormlyFieldConfig) => `Nome ripetuto`,
        },
      },
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'v_ie_ru_personale_id_ab',
            type: 'select',
            className: "col-md-8",
            templateOptions: {              
              label: 'Assegnamento attività',
              valueProp: 'id',
              labelProp: 'descr',
              required: true,
            },
            hooks: {
              onInit: (field) => {
               
                field.parent.parent.form.get('unitaorganizzativa_uo').valueChanges.pipe(
                  takeUntil(this.onDestroy$),
                  startWith(field.parent.parent.form.get('unitaorganizzativa_uo').value),
                  distinct(),
                  filter(ev => ev !== null),
                  tap(uo => {                    
                    field.templateOptions.options = this.service.getPersonaleUfficio(uo).pipe();
                  }),                  
                ).subscribe();
              
              },
            },
          },
        ],
      },
    },
    {
      type: 'input',
      key: 'subject',
      templateOptions: {
        label: 'Oggetto',
        required: true,
      },
    },
    {
      type: 'textarea',
      key: 'description',
      templateOptions: {
        label: 'Descrizione',
        required: true,
        rows: 5,
      },
    },
  ];

  constructor(protected service: UserTaskService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route, router, location)
    //this.title = 'Permesso IN LAVORAZIONE'
    this.activeNew = true;
    this.researchPath = 'home/tasks'
    this.newPath = 'home/tasks/new'    
    
    this.model.model = { id: null, desctizione_titolo: null };
  }


  //richiamato nel caso di nuovo 
  protected additionalFormInitialize() {
    this.service.create().subscribe((data) => {
      this.isLoading = false;
      this.model = {...this.model, ...JSON.parse(JSON.stringify(data))};
      this.options.formState.model = this.model;
      this.updateTransitions();
    });
  }
  
  protected updateTransitions(){
    if (this.model['transitions']) {       
      this.model['transition']='self_transition';
      this.subject.next([]);
      this.subject.next(this.model['transitions']);        
      //f.templateOptions.options = this.model['transitions'];
    }   
  }

  //richiamato nella init dopo aver caricato il modello
  protected postGetById(){
    this.updateTransitions();  
  }

  //richiamato nella submit dopo l'avvenuto salvataggio
  protected postOnSubmit(){
    this.updateTransitions();
  }
  
}
