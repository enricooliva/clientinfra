import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { StepType } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Convenzione, FileAttachment } from '../convenzione';
import { FormGroup, FormControl, ValidationErrors } from '@angular/forms';
import { encode, decode } from 'base64-arraybuffer';
import { AuthService } from 'src/app/core';
import { InfraMessageType } from 'src/app/shared/message/message';
import { takeUntil, startWith, tap, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

//ng g c application/pages/test-tab -s true  --spec false --flat true


//[{"id":1,"codice":"DD","descrizione":"Disposizione direttoriale"},
//{"id":2,"codice":"DCD","descrizione":"Delibera Consiglio di Dipartimento"},
//{"id":3,"codice":"DR","descrizione":"Decreto Rettorale"},
//{"id":4,"codice":"DSA","descrizione":"Delibera Senato Accademico"},
//{"id":5,"codice":"DCA","descrizione":"Delibera Consiglio di Amministrazione"}]

@Component({
  selector: 'app-multistep-schematipo',
  template: `
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '4px' }"></ngx-loading>
  <div class="btn-toolbar mb-4" role="toolbar">
    <div class="btn-group btn-group">    
      <button class="btn btn-outline-primary border-0 rounded-0" >              
          <span class="oi oi-document"></span>
          <span class="ml-2">Nuovo</span>
      </button>    
      <button class="btn btn-outline-primary border-0 rounded-0" [disabled]="!form.valid || !form.dirty" (click)="onSubmit()" >              
      <span class="oi oi-arrow-top"></span>  
      <span class="ml-2">Aggiorna</span>        
      
    </button> 
    </div>
  </div>
  
  <form *ngIf='model' [formGroup]="form" >
    <formly-form  [model]="model" [fields]="fieldtabs" [form]="form" [options]="options">      
    </formly-form> 
  </form>

  <div class='mb-4'></div>
   `,
  styles: []
})

export class MultistepSchematipoComponent implements OnInit, OnDestroy {


  public static DECRETO_DIRETTORIALE = 'DD';
  public static DELIBERA_CONSIGLIO_DIPARTIMENTO = 'DCD';
  public static DECRETO_RETTORALE = 'DR';
  public static DOC_APP = 'DA';
  public static PROSPETTO = 'PR';
  public static CONV_BOZZA = 'CB';
  

  onDestroy$ = new Subject<void>();
  fieldtabs: FormlyFieldConfig[];

  form = new FormGroup({});
  model: Convenzione;

  isLoading: boolean;

  options: FormlyFormOptions;
  
  mapAttachment: Map<string, FileAttachment> = new Map<string, FileAttachment>();

  constructor(private service: ApplicationService, public authService: AuthService, private router: Router) {

    this.model = { 
      schematipotipo:  'schematipo',   
      user_id: authService.userid,
      id: null,
      descrizione_titolo: '',
      dipartimemto_cd_dip: '',
      nominativo_docente: '',
      emittente: '',
      user: { id: authService.userid, name: authService.username },
      dipartimento: { cd_dip: null, nome_breve: '' },
      stato_avanzamento: null,
      convezione_type: 'TO',
      tipopagamento: { codice: null, descrizione: '' },
      azienda: { id_esterno: null, denominazione: '' },
      unitaorganizzativa_uo: '',               
      attachments: [],

    };    

    this.options = {
      formState: {
        isLoading: false,
        model: this.model,
      },
    };
  
    this.fieldtabs = [                  
      {
        fieldGroupClassName:'row',
        fieldGroup: [{
        key: 'schematipotipo',      
        wrappers: ['form-field-horizontal'],  
        className: 'col-md-6',      
        type: 'select',
        templateOptions:{
          label: 'Schema tipo',          
          options: [
            { label: 'Si', value: 'schematipo' },
            { label: 'No', value: 'daapprovare' },
          ],
        },
        lifecycle: {
          onInit: (form, field)=> {            
            const tabs = this.fieldtabs.find(f => f.type === 'tab');
            const tabappr = tabs.fieldGroup[3];        
            //const selectfield = tabappr.fieldGroup.find(x=> x.key == 'ufficioaffidatario')
            field.formControl.valueChanges.subscribe(x=> {
              if (x == 'schematipo'){
                tabappr.templateOptions.hidden = true;                
              }
              else {
                tabappr.templateOptions.hidden = false;                
              }
            });
          }
        }
        }],            
      },
      {
      type: 'tab',
      fieldGroup: [
        {
          fieldGroup: service.getInformazioniDescrittiveFields(this.model).map(x=> { 
            if (x.key == 'user') {
              x.templateOptions.disabled = true;
            }
            return x;
          }),            
          templateOptions: {
            label: 'Informazioni descrittive'
          }
        },
        {
          fieldGroup: [
            {
              key: 'file_PR',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Prospetto ripartizione costi e proventi',
                type: 'input',
                placeholder: 'Scegli documento',
                accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',                
                onSelected: (selFile) => { 
                  this.onSelectCurrentFile(selFile, MultistepSchematipoComponent.PROSPETTO) 
                }
              },
            },
            // {
            //   key: 'file_CB',
            //   type: 'pdfviewerinput',
            //   className: "col-md-5",
            //   templateOptions: {
            //     label: 'Seleziona convenzione',              
            //     filevalue: 'filevalue',
            //     filename: 'filename',
            //     onSelected: (selFile) => { 
            //       this.onSelectCurrentFile(selFile, MultistepSchematipoComponent.CONV_BOZZA) 
            //     }
            //   },
            // }, 
            {
              fieldGroupClassName: 'row',
              fieldGroup: [                                            
                {
                  key: 'file_CD',
                  type: 'fileinput',
                  className: "col-md-5",
                  templateOptions: {
                    label: 'Delibera del consiglio di dipartimento',
                    type: 'input',
                    placeholder: 'Scegli documento',
                    accept: 'application/pdf',
                    required: true,
                    onSelected: (selFile) => { 
                      this.onSelectCurrentFile(selFile, MultistepSchematipoComponent.DELIBERA_CONSIGLIO_DIPARTIMENTO) 
                    }
                  },
                },
              ]              
            },
            // {
            //   key: 'file_DR',
            //   type: 'fileinput',
            //   className: "col-md-5",
            //   templateOptions: {
            //     label: 'Disposizione rettorale',
            //     type: 'input',
            //     placeholder: 'Scegli documento',
            //     accept: 'application/pdf',                
            //     onSelected: (selFile) => { 
            //       this.onSelectCurrentFile(selFile, MultistepSchematipoComponent.DECRETO_RETTORALE) 
            //     }
            //   },
            // },
            {
              key: 'file_DA',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Documento appoggio',
                type: 'input',
                placeholder: 'Scegli documento',
                accept: '.doc,.docx,application/msword',                
                onSelected: (selFile) => { 
                  this.onSelectCurrentFile(selFile,MultistepSchematipoComponent.DOC_APP) 
                }                
              },
            },
            
          ],
          templateOptions: {
            label: 'Allegati'
          }
        },
        {          
          fieldGroup: [
            {
              key: 'unitaorganizzativa_uo',                   
              type: 'select',
              hideExpression: 'formState.model.schematipotipo == "schematipo"',
              templateOptions:{
                label: 'Ufficio affidatario procedura',          
                required: true,
                options: this.service.getValidationOffices(),
                valueProp: 'uo',
                labelProp: 'descr',                           
              },
            },
            {
              key: 'useremail',                   
              type: 'select',
              templateOptions:{
                label: 'Assegnamento attività',   
                valueProp: 'id',
                labelProp: 'descr',                                        
              },
              lifecycle: {
                onInit: (form, field) => {                
                  form.get('unitaorganizzativa_uo').valueChanges.pipe(                    
                    takeUntil(this.onDestroy$),
                    startWith(form.get('unitaorganizzativa_uo').value),
                    filter(ev => ev !== null),
                    tap(uo => {
                      field.formControl.setValue('');
                      field.templateOptions.options = this.service.getValidationOfficesPersonale(uo).pipe();
                    }),
                  ).subscribe();
                },
              },
            },
            {
              key: 'descrizioneattivita',                   
              type: 'textarea',
              templateOptions:{
                label: 'Area messaggi',   
                maxLength: 200,
                rows: 5,                       
              },
              expressionProperties: {
                'templateOptions.disabled': '!model.useremail',
              },
            }
          ],
          templateOptions: {
            label: 'Approvazione',   
            hidden: true,         
          },     
        }
      ]
    }];
  }

  onSelectCurrentFile(currentSelFile: File, typeattachemnt: string){

    if (currentSelFile== null){
      //caso di cancellazione
      this.mapAttachment.delete(typeattachemnt);      
      return;
    }

    this.isLoading=true;
    let currentAttachment: FileAttachment = {      
      model_type: 'convenzione',
      filename: currentSelFile.name,
      attachmenttype_codice: typeattachemnt,
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      currentAttachment.filevalue = encode(e.target.result);      
      
      if (!currentAttachment.filevalue){
        this.form.get('file_'+typeattachemnt).setErrors({'filevalidation': true});
        //this.service.messageService.add(InfraMessageType.Error,'Documento '+ currentAttachment.filename +' vuoto');
      }

      this.mapAttachment.set(currentAttachment.attachmenttype_codice,currentAttachment);
      this.isLoading=false;
    }
    reader.readAsArrayBuffer(currentSelFile); 

  }

  ngOnInit() {    
    //const selectSchemaTipo = this.fieldtabs.find(f => f.key === 'schematipotipo'); 
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onSubmit() {

    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit: Convenzione = { ...this.model, ...this.form.value };
      
      //aggiungo tutti gli allegati      
      tosubmit.attachments = [];
      tosubmit.attachments.push(...Array.from<FileAttachment>(this.mapAttachment.values()));
      
      this.service.createSchemaTipo(tosubmit,true).subscribe(
        result => {          
          //this.options.resetModel(result);
          this.isLoading = false;
          this.router.navigate(['home/convenzioni/' + result.id]);
        },
        error => {
          this.isLoading = false;          
          console.log(error)
        }

      );
    }
  }

}
