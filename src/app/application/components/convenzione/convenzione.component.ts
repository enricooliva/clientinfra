
import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { ApplicationService } from '../../application.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { Convenzione } from '../../convenzione';
import { Subject, of } from 'rxjs';
import { takeUntil, startWith, tap, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormState } from 'src/app/core';

@Component({
  selector: 'app-convenzione',
  templateUrl: './convenzione.component.html',
})

export class ConvenzioneComponent implements OnInit, OnDestroy {

  
  onDestroy$ = new Subject<void>();  
  form = new FormGroup({});
  model: Convenzione;
  fields: FormlyFieldConfig[] =
    [
      {
        className: 'section-label',
        template: '<h5>Dati compilatore</h5>',
      },
      {
        key: 'id',
        type: 'input',
        hideExpression: true,
        templateOptions: {
          label: 'Id',
          disabled: true
        },
      },
      {
        key: 'user',
        type: 'externalobject',
        templateOptions: {
          label: 'Utente',
          type: 'string',
          entityName: 'user',
          entityLabel: 'Utenti',
          codeProp: 'id',
          descriptionProp: 'name',
          isLoading: this.isLoading
        },
      },
      {
        className: 'section-label',
        template: '<h5>Intestazione</h5>',
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'descrizione_titolo',
            type: 'input',
            className: "col-12",
            templateOptions: {
              label: 'Descrizione Titolo',
              required: true,
            }
          }]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'dipartimemto_cd_dip',
            type: 'selectinfra',
            className: "col-md-6",
            templateOptions: {
              options: [],
              valueProp: 'cd_dip',
              labelProp: 'nome_breve',
              label: 'Dipartimento',
              required: true,
              inizialization: () => {
                return this.model.dipartimento
              },
              populateAsync: () => {
                return this.service.getDipartimenti()
              }                    
            }
          },
          {
            key: 'nominativo_docente',
            type: 'input',
            className: "col-md-6",
            templateOptions: {
              label: 'Direttore di dipartimento',
              required: true,
              disabled: true
            },
            lifecycle: {
              onInit: (form, field) => {
                form.get('dipartimemto_cd_dip').valueChanges.pipe(
                  distinctUntilChanged(),
                  takeUntil(this.onDestroy$),
                  filter(() => !this.isLoading),
                  //startWith(form.get('dipartimemto_cd_dip').value),
                  tap(codiceDip => {
                    if (codiceDip) {
                      this.service.getDirettoreDipartimento(codiceDip).subscribe((res) => {
                        field.formControl.setValue(res.nome_esteso);
                      })
                    }
                  }),
                ).subscribe();
              },
            },
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'tipoemittenti_codice',
            type: 'selectinfra',
            className: "col-md-6",
            templateOptions: {
              options: [],
              valueProp: 'codice',
              labelProp: 'descrizione',
              label: 'Autorizzato da',
              required: true,
              inizialization: () => {
                return this.model.tipoemittente
              },
              populateAsync: () => {
                return this.service.getEmittenti()
              }              
            }       
          }]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'azienda',
            type: 'externalobject',
            className: "col-md-12",
            templateOptions: {
              label: 'Azienda',
              type: 'string',
              entityName: 'azienda',
              entityLabel: 'Aziende',
              codeProp: 'id_esterno',
              descriptionProp: 'denominazione',
            },
          },
        ]
    }

    ]
  options: FormlyFormOptions = {
    formState: {
      isLoading: false,
    },
  };


  private id: number;

  defaultColDef = { editable: true };

  private _isLoading:boolean = false;
  get isLoading():boolean {
      return this._isLoading;
  }
  set isLoading(value:boolean) {
      this._isLoading = value;
      this.options.formState.isLoading = value;
  }

  constructor(private service: ApplicationService, private route: ActivatedRoute) {    
  }

  get isNew(): boolean{
    return this.model==null || this.model.id == null 
  }

  ngOnInit() {
    
     //modello vuoto
    this.model = {
      user_id: null,
      id: null,
      descrizione_titolo: '',
      dipartimemto_cd_dip: '',
      nominativo_docente: '',
      emittente: '',
      user: { id: null, name: null},
      dipartimento: { cd_dip: null, nome_breve: ''},
      stato_avanzamento: null,
      tipoemittente: { codice: null, descrizione: '' },
      azienda: { id_esterno: null, denominazione: ''}          
    }
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isLoading = true;
        this.service.clearMessage();
        this.service.getConvenzioneById(params['id']).subscribe((data) => {                    
          try{
            this.options.resetModel(data);          
            this.isLoading = false;                    
          }catch(e){
            console.log(e);
            this.isLoading = false;                    
          }
        });
      }
    });

    //lettura della domanda corrente
    //const personId = this.route.snapshot.params['id'];   
    //this.submission = this.submissionService.getSubmission();
    // this.isLoading = true;
    // this.submissionService.getSubmission().subscribe((data)=> {          

    //   this.id=data.id;  
    //   this.model = data;    
    //   this.isLoading = false;
    // });    
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onNew() {
    this.form.reset();
    //this.model = null;
  
  }

  onReload() {
    //sono nello stato nuovo
    if (this.model != null && this.model.id !== null) {
     this.isLoading = true;                  
      this.service.getConvenzioneById(this.model.id).subscribe((data) => {                          
        this.options.resetModel(data);;            
        this.isLoading = false;
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };            
      this.service.updateConvenzione(tosubmit, tosubmit.id).subscribe(
        result => {                      
          this.options.resetModel(result);                
          this.isLoading = false;          
        },
        error => {
          this.isLoading = false;
          this.service.messageService.error(error);
          console.log(error)
        }

      );
    }
  }

  onGenerate() {
    if (this.form.valid) {
      this.service.generatePDF(this.model.id);
    }
  }


  private temp = [];
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.role.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    //this.datarows =[...temp];
    //this.assignments.patchValue(temp);

    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }
}
