
import { Component, OnInit, OnDestroy, Input, TemplateRef, ViewChild, Sanitizer } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { ApplicationService } from '../../application.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { Convenzione } from '../../convenzione';
import { Subject, of } from 'rxjs';
import { encode, decode } from 'base64-arraybuffer';

import { takeUntil, startWith, tap, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormState } from 'src/app/core';
import { StepType } from 'src/app/shared';
import { read } from 'fs';
import { SafeHtml } from '@angular/platform-browser';
import { $ } from 'protractor';


@Component({
  selector: 'app-convenzione',
  templateUrl: './convenzione.component.html',
})

export class ConvenzioneComponent implements OnInit, OnDestroy {

  // 'descrizione_titolo',
  // 'dipartimemto_cd_dip',
  // 'resp_scientifico',
  // 'ambito',
  // 'durata',
  // 'prestazioni','corrispettivo','azienda_id_esterno','importo','stato_avanzamento','tipopagamenti_codice','path_convezione',

  onDestroy$ = new Subject<void>();
  form = new FormGroup({});
  model: Convenzione;
  
  fields: FormlyFieldConfig[]; 

  options: FormlyFormOptions = {
    formState: {
      isLoading: false,
    },
  };


  private id: number;

  defaultColDef = { editable: true };

  private _isLoading: boolean = false;
  
  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
    this.options.formState.isLoading = value;
  }

  constructor(private service: ApplicationService, private route: ActivatedRoute) {


    //modello vuoto
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
      convenzione_pdf: { filename:'', filetype:'', filevalue: null},
      nome_originale_file_convenzione: '',
    }

    this.fields = service.getInformazioniDescrittiveFields(this.model).concat(service.getConvenzioneFields(this.model));
  }

  get isNew(): boolean {
    return this.model == null || this.model.id == null
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isLoading = true;
        this.service.clearMessage();
        this.service.getConvenzioneById(params['id']).subscribe((data) => {
          try {
            this.options.resetModel(data);          
            this.isLoading = false;
          } catch (e) {
            console.log(e);
            this.isLoading = false;
          }
        });
      }
    });
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
        this.options.resetModel(data);
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
        });
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
  
  }


  // public innerHtml: SafeHtml;
  // public setInnerHtml(pdfurl: string) {
  //   this.innerHtml = this._sanitizer.bypassSecurityTrustHtml(
  //     "<object data='" + pdfurl + "' type='application/pdf' class='embed-responsive-item'>" +
  //     "Object " + pdfurl + " failed" +
  //     "</object>");
  // }

}
