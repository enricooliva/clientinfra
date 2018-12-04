import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { StepType } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute } from '@angular/router';
import { Convenzione, FileAttachment } from '../convenzione';
import { FormGroup } from '@angular/forms';
import { encode, decode } from 'base64-arraybuffer';
import { AuthService } from 'src/app/core';

//ng g c application/pages/test-tab -s true  --spec false --flat true

@Component({
  selector: 'app-multistep-schematipo',
  template: `
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '4px' }"></ngx-loading>
  <h4 class="mb-2">Inserimento convenzione schema tipo</h4>
  <div class="sticky-top btn-toolbar mb-4" role="toolbar">
    <div class="btn-group btn-group">    
      <button class="btn btn-outline-primary border-0 rounded-0" (click)="onNew()" >              
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

export class MultistepSchematipoComponent implements OnInit {

  fieldtabs: FormlyFieldConfig[];

  form = new FormGroup({});
  model: Convenzione;

  isLoading: boolean;

  options: FormlyFormOptions = {
    formState: {
      isLoading: false,
    },
  };

  mapAttachment: Map<string, FileAttachment> = new Map<string, FileAttachment>();

  constructor(private service: ApplicationService, private route: ActivatedRoute, public authService: AuthService) {

    this.model = {
      user_id: authService.userid,
      id: null,
      descrizione_titolo: '',
      dipartimemto_cd_dip: '',
      nominativo_docente: '',
      emittente: '',
      user: { id: authService.userid, name: authService.username },
      dipartimento: { cd_dip: null, nome_breve: '' },
      stato_avanzamento: null,
      tipopagamento: { codice: null, descrizione: '' },
      azienda: { id_esterno: null, denominazione: '' },
      convenzione_pdf: { filename: '', filetype: '', filevalue: null },
      nome_originale_file_convenzione: '',
    }

    this.fieldtabs = [{
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
          fieldGroup: service.getConvenzioneFields(this.model),            
          templateOptions: {
            label: 'Convenzione bozza'
          }
        },
        {
          fieldGroup: [
            {
              key: 'file_CD',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Consiglio di dipartimento',
                type: 'input',
                placeholder: 'Scegli documento',
                accept: 'application/pdf',
                required: true,
                onSelected: (selFile) => { 
                  this.onSelectCurrentFile(selFile, 'CD') 
                }
              },
            },
            {
              key: 'file_DR',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Disposizione rettorale',
                type: 'input',
                placeholder: 'Scegli documento',
                accept: 'application/pdf',                
                onSelected: (selFile) => { 
                  this.onSelectCurrentFile(selFile, 'DR') 
                }
              },
            },
            {
              key: 'file_appoggio_word',
              type: 'fileinput',
              className: "col-md-5",
              templateOptions: {
                label: 'Documento appoggio',
                type: 'input',
                placeholder: 'Scegli documento',
                accept: '.doc,.docx,application/msword',                
                onSelected: (selFile) => { 
                  this.onSelectCurrentFile(selFile,'CDWORD') 
                }
              },
            },
            
          ],
          templateOptions: {
            label: 'Allegati'
          }
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

    let currentAttachment: FileAttachment = {      
      model_type: 'convenzione',
      filename: currentSelFile.name,
      attachmenttype_codice: typeattachemnt,
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      currentAttachment.filevalue = encode(e.target.result);      
      this.mapAttachment.set(currentAttachment.attachmenttype_codice,currentAttachment);
    }
    reader.readAsArrayBuffer(currentSelFile); 

  }

  ngOnInit() {
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

}
