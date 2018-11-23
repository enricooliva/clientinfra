import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { StepType } from 'src/app/shared';
import { ApplicationService } from '../application.service';
import { ActivatedRoute } from '@angular/router';
import { Convenzione } from '../convenzione';
import { FormGroup } from '@angular/forms';

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

  constructor(private service: ApplicationService, private route: ActivatedRoute) {

    this.model = {
      user_id: null,
      id: null,
      descrizione_titolo: '',
      dipartimemto_cd_dip: '',
      nominativo_docente: '',
      emittente: '',
      user: { id: null, name: null },
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
          fieldGroup: service.getInformazioniDescrittiveFields(this.model),            
          templateOptions: {
            label: 'Informazioni descrittive'
          }
        },
        {
          fieldGroup: service.getConvenzioneFields(this.model),            
          templateOptions: {
            label: 'Convenzione'
          }
        }
      ]
    }];

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
