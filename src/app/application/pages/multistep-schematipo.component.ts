import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { StepType } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Convenzione, FileAttachment, Owner } from '../convenzione';
import { FormGroup, FormControl, ValidationErrors, FormArray } from '@angular/forms';
import { encode, decode } from 'base64-arraybuffer';
import { AuthService } from 'src/app/core';
import { InfraMessageType } from 'src/app/shared/message/message';
import { takeUntil, startWith, tap, filter, map, distinct } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { PDFJSStatic } from 'pdfjs-dist';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';
const PDFJS: PDFJSStatic = require('pdfjs-dist');


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
      <button class="btn btn-outline-primary border-0 rounded-0" (click)="onValidate()" >              
      <span class="oi oi-arrow-top"></span>  
      <span class="ml-2">Valida</span>              
    </button> 
    </div>
  </div>
  
  <form *ngIf='model' [formGroup]="form" >
    <formly-form  [model]="model" [fields]="fieldtabs" [form]="form" [options]="options">      
    </formly-form> 
  </form>
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

    PDFJS.disableWorker = true;

    this.model = {
      schematipotipo: 'schematipo',
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
        fieldGroupClassName: 'row',
        fieldGroup: [{
          key: 'schematipotipo',
          wrappers: ['form-field-horizontal'],
          className: 'col-md-6',
          type: 'select',
          templateOptions: {
            label: 'Schema tipo',
            options: [
              { label: 'Si', value: 'schematipo' },
              { label: 'No', value: 'daapprovare' },
            ],
          },
          lifecycle: {
            onInit: (form, field) => {
              const tabs = this.fieldtabs.find(f => f.type === 'tabinfra');
              const tabappr = tabs.fieldGroup[2];
              //const selectfield = tabappr.fieldGroup.find(x=> x.key == 'ufficioaffidatario')
              field.formControl.valueChanges.subscribe(x => {
                if (x == 'schematipo') {
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
        type: 'tabinfra',
        templateOptions:{
          onSubmit: () => this.onSubmit(),
        },
        fieldGroup: [
          {
            fieldGroup: service.getInformazioniDescrittiveFields(this.model).map(x => {
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
                    key: 'file_CD_type',
                    type: 'select',
                    defaultValue: 'DCD',
                    className: "col-md-6",
                    templateOptions: {
                      label: 'Tipo documento di approvazione',
                      required: true,
                      options: [
                        { value: 'DCD', label: 'Delibera Consiglio di Dipartimento' },
                        { value: 'DDD', label: 'Disposizione del direttore di dipartimento' },
                      ]
                    },
                  },
                  {
                    key: 'file_CD',
                    type: 'fileinput',
                    className: "col-md-6",                    
                    templateOptions: {
                      label: 'Documento di approvazione (formato pdf)',
                      description: 'Allegare in formato pdf la versione della delibera o della disposizione',                      
                      type: 'input',
                      placeholder: 'Scegli documento',
                      accept: 'application/pdf',                      
                      required: true,                                                                  
                      onSelected: (selFile) => {
                        this.onSelectCurrentFile(selFile, MultistepSchematipoComponent.DELIBERA_CONSIGLIO_DIPARTIMENTO)
                      },                                            
                    },
                    validators: {                        
                      formatpdf: {
                        expression: (c) => {
                         return /.+\.([pP][dD][fF])/.test(c.value);
                        },
                        message: (error, field: FormlyFieldConfig) =>  `Formato non consentito`,
                      }
                    }
                  },
                ],
              },
              {
                fieldGroupClassName: 'row', 
                //hideExpression: (model: any) => !model.file_CD,               
                fieldGroup: [
                  {
                    key: 'docnumber',
                    type: 'input',
                    className: "col-md-4",
                    templateOptions: {
                      label: 'Numero',
                      //required: true,                               
                    },
                  },
                  {
                    key: 'data_emissione',
                    type: 'datepicker',
                    className: "col-md-8",
                    templateOptions: {
                      label: 'Data',
                      //required: true,                               
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
                templateOptions: {
                  label: 'Documento appoggio (formato word)',
                  type: 'input',
                  description: 'Versione editabile (file word) della delibera o della disposizione',
                  placeholder: 'Scegli documento',
                  tooltip: {
                    content: 'Versione editabile (file word) della delibera o della disposizione'
                  },
                  accept: '.doc,.docx ,application/msword',
                  onSelected: (selFile) => {
                    this.onSelectCurrentFile(selFile, MultistepSchematipoComponent.DOC_APP)
                  }
                },
              },
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
                templateOptions: {
                  label: 'Ufficio affidatario procedura',
                  required: true,                 
                  options: this.service.getValidationOffices(),
                  valueProp: 'uo',
                  labelProp: 'descr',
                },
              },              
              {
                key: 'respons_v_ie_ru_personale_id_ab',
                type: 'select',
                hideExpression: 'formState.model.schematipotipo == "schematipo"',                
                templateOptions: {
                  label: 'Responsabile ufficio',
                  valueProp: 'id',
                  labelProp: 'descr',   
                  required: true,                    
                },
                lifecycle: {
                  onInit: (form, field, model, options) => {
                    form.get('unitaorganizzativa_uo').valueChanges.pipe(
                      takeUntil(this.onDestroy$),    
                      distinct(),                  
                      //startWith(form.get('unitaorganizzativa_uo').value),
                      filter(ev => ev !== null),
                      tap(uo => {                                                                   
                        field.formControl.setValue('');
                        field.templateOptions.options = this.service.getValidationOfficesPersonale(uo).pipe(
                          map(items => {
                            return items.filter(x => x.cd_tipo_posizorg == 'RESP_UFF');
                          }),  
                          tap(items => {
                            if (items[0]){
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
                hideExpression: 'formState.model.schematipotipo == "schematipo"',                         
                templateOptions: {                  
                  label: 'Ulteriori assegnatari',                                                                                        
                },   
                validators: {
                  unique: {
                    expression: (c) => {           
                      if (c.value)  {                              
                        var valueArr = c.value.map(function(item){ return item.v_ie_ru_personale_id_ab }).filter(x => x != null );
                        var isDuplicate = valueArr.some(function(item, idx){ 
                            return valueArr.indexOf(item) != idx 
                        });              
                        return !isDuplicate;
                      }
                      return true;
                    },
                    message: (error, field: FormlyFieldConfig) => `Nome ripetuto`,
                  },
                },
                expressionProperties: {
                  'templateOptions.disabled': (model: any, formState: any) => {
                    // access to the main model can be through `this.model` or `formState` or `model
                    return formState.model.respons_v_ie_ru_personale_id_ab == null || formState.model.respons_v_ie_ru_personale_id_ab == '';
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
                    lifecycle: {
                      onInit: (form, field, model) => {                                              
                        //field.formControl.setValue('');
                        field.templateOptions.options = this.service.getValidationOfficesPersonale(this.model.unitaorganizzativa_uo).pipe(
                          map(items => {
                            return items.filter(x => x.cd_tipo_posizorg !== 'RESP_UFF');
                          }),                         
                        );                      
                      },
                    },
                  },
                  ],   
                },
              },
              {
                key: 'descrizioneattivita',
                type: 'textarea',
                hideExpression: 'formState.model.schematipotipo == "schematipo"',    
                templateOptions: {
                  label: 'Area messaggi',
                  maxLength: 200,
                  rows: 5,
                  required: true,
                },
                expressionProperties: {
                  'templateOptions.disabled': '!model.respons_v_ie_ru_personale_id_ab',
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


  public onValidate() {
    const invalid = [];
    const controls = this.form.controls;
    this.service.clearMessage();
    for (const name in controls) {        
        if (controls[name].invalid) {
            for (const error in controls[name].errors){
              this.service.messageService.add(InfraMessageType.Error, name + " " + error, false);
              invalid.push(name +" " + controls[name].getError(error));
            }          
        }
    }
    console.log(invalid);    
  }

  render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    //ret.text = ret.text ? ret.text : "";

    let render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: false,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
      .then(function (textContent) {
        let lastY, text = '';
        //https://github.com/mozilla/pdf.js/issues/8963
        //https://github.com/mozilla/pdf.js/issues/2140
        //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
        //https://gist.github.com/hubgit/600ec0c224481e910d2a0f883a7b98e3
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          }
          else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        //let strings = textContent.items.map(item => item.str);
        //let text = strings.join("\n");
        //text = text.replace(/[ ]+/ig," ");
        //ret.text = `${ret.text} ${text} \n\n`;
        return text;
      });
  }

  async parsePdf(data){
    let text = '';
    PDFJS.getDocument({ data: data }).then(async (doc) => {
      let counter: number = 1;
      counter = counter > doc.numPages ? doc.numPages : counter;

      for (var i = 1; i <= counter; i++) {
        let pageText = await doc.getPage(i).then(pageData => this.render_page(pageData));
        text = `${text}\n\n${pageText}`;      
        //ret.text = `${ret.text}\n\n${pageText}`;
      }    
            
      let number = text.match(/[d|D]elibera n.?\s?([A-Za-z0-9\/]*)\s*\n/);
      if (number && number[1]){
        this.form.get('docnumber').setValue(number[1]);
      
      }
      let data_emissione = text.match(/[r|R]iunione del giorno\s([0-9]{2}\/[0-9]{2}\/[0-9]{4})\s?/);
      if (data_emissione && data_emissione[1]){
        let converted = data_emissione[1].replace(/\//g,'-');
        this.form.get('data_emissione').setValue(converted);
      }      
      this.isLoading = false;
    });
  }


  onSelectCurrentFile(currentSelFile: File, typeattachemnt: string) {

    if (currentSelFile == null) {
      //caso di cancellazione
      this.mapAttachment.delete(typeattachemnt);
      return;
    }
    
    this.isLoading = true;
    let currentAttachment: FileAttachment = {
      model_type: 'convenzione',
      filename: currentSelFile.name,
      attachmenttype_codice: typeattachemnt,
    } 
    
    const reader = new FileReader();   

    reader.onload = async (e: any) => {
      this.isLoading = true;
      currentAttachment.filevalue = encode(e.target.result);
      
      if (currentSelFile.name.search('pdf')>0){
        try {
          await this.parsePdf(e.target.result);     
        } catch (error) {
          this.isLoading = false;
        }
      }

      if (!currentAttachment.filevalue) {
        this.isLoading = false;
        return;
        //this.form.get('file_' + typeattachemnt).setErrors({ 'filevalidation': true });
        //this.service.messageService.add(InfraMessageType.Error,'Documento '+ currentAttachment.filename +' vuoto');
      }

      this.mapAttachment.set(currentAttachment.attachmenttype_codice, currentAttachment);
      this.isLoading = false;
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

      var file = this.mapAttachment.get(MultistepSchematipoComponent.DELIBERA_CONSIGLIO_DIPARTIMENTO);
      file.number = this.model['docnumber'];
      file.emission_date = this.model['emission_date'];

      //aggiungo tutti gli allegati      
      tosubmit.attachments = [];
      tosubmit.attachments.push(...Array.from<FileAttachment>(this.mapAttachment.values()));     

      this.service.createSchemaTipo(tosubmit, true).subscribe(
        result => {
          //this.options.resetModel(result);
          this.isLoading = false;
          this.router.navigate(['home/convenzioni/' + result.id]);
        },
        error => {
          this.isLoading = false;
          console.log(error);
        }

      );
    }
  }

}
