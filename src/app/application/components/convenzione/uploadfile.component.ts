import { Component, OnInit, Injector, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FileAttachment } from '../../convenzione';
import { encode, decode } from 'base64-arraybuffer';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ApplicationService } from '../../application.service';

//https://weasyprint.org/

@Component({
  selector: 'app-uploadfile',
  template: `
  <ngx-loading [show]="isLoading" [config]="{ backdropBorderRadius: '0px' }"></ngx-loading>
  <div class="modal-header">
  <h4 class="modal-title" id="modal-basic-title">Caricamento file</h4>
  <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
    <span aria-hidden="true">&times;</span>
  </button>
</div>
<div class="modal-body">
<form [formGroup]="form">
  <formly-form [model]="modelfile" [fields]="fields" [form]="form">

  </formly-form>
</form>

</div>
<div class="modal-footer">
  <button type="button" class="btn btn-primary col-md-2"  [disabled]="!form.valid"  (click)="addfile()">Carica</button>
  <button type="button" class="btn btn-outline-dark"   (click)="activeModal.dismiss()">Annulla</button>
</div>
  `,
  styles: []
})

export class UploadfileComponent implements OnInit {

  @Input()
  model_id: number;
  
  form = new FormGroup({});
  modelfile: { filename: '', attachmenttype_codice: ''};
  currentSelFile: File;
  isLoading: boolean;

  fields: FormlyFieldConfig[] = [

        {
          key: 'filename',
          type: 'fileinput',
          className: "col-md-5",
          templateOptions: {
            label: 'Scegli documento',
            type: 'input',
            placeholder: 'Scegli file documento',
            accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,.p7m',
            required: true,
            onSelected: (selFile) => { this.onSelectCurrentFile(selFile) }
          },
        },
        {
          key: 'attachmenttype_codice',
          type: 'select',
          className: "col-md-5",
          templateOptions: {
            options: this.service.getAttachemntTypes(), //TODO tipi di allegati
            valueProp: 'codice',
            labelProp: 'descrizione',
            label: 'Tipologia allegato',
            required: true,
          }
        },
        //bottone spostato nell'area in basso
        // {
        //   type: 'button',
        //   className: "col-md-2",
        //   templateOptions: {
        //     text: 'Carica',
        //     btnType: 'primary',            
        //     onClick: ($event) => this.addfile(),
        //   },
        //   expressionProperties: {
        //     'templateOptions.disabled':(model: any, formState: any) => {
        //       // access to the main model can be through `this.model` or `formState` or `model
        //       return !this.form.valid
        //     },
        //   },            
        //},     
  ];


  constructor(public activeModal: NgbActiveModal, private service: ApplicationService) {  
  }  


  close(){    
    this.activeModal.close(null);
  }

  ngOnInit() {
  }

  onSelectCurrentFile(selFile) {
    this.currentSelFile = selFile;
  }
  
  addfile() {
    this.isLoading = true;
    let currentAttachment: FileAttachment = {
      model_id: this.model_id,
      model_type: 'convenzione',
      filename: this.currentSelFile.name,
      attachmenttype_codice: this.form.get('attachmenttype_codice').value,
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      currentAttachment.filevalue = encode(e.target.result);
      this.callUpdate(currentAttachment);
    }
    reader.readAsArrayBuffer(this.currentSelFile); 
  }

  private callUpdate(currentFile: FileAttachment) {
    this.isLoading = true;
    this.service.uploadFile(currentFile).subscribe((data) => {               
      this.isLoading = false;
      this.activeModal.close(data);      
    });
  }


}
