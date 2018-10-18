
import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm, Validators } from '@angular/forms';
import { ApplicationService } from '../../application.service';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute } from '@angular/router';
import { Convenzione } from '../../convenzione';
import { startWith  } from 'rxjs/operators';
@Component({
  selector: 'app-convenzione',
  templateUrl: './convenzione.component.html',  
})

export class ConvenzioneComponent implements OnInit {        

  isLoading = false;
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
    key: 'user_id',
    type: 'external',     
    wrappers: [], 
    templateOptions: {
      label: 'Utente',                     
      type: 'string',                         
      entityName: 'user',
      entityLabel: 'Utenti',
      codeProp:'id',
      descriptionProp: 'name',                
    },      
    modelOptions: {
      updateOn: 'blur',
    }, //necessario per il corretto evento di decodifica non sono riuscito a spostarlo nel template???

    //richiesta impostazione dall'interno del custom template external
    //al impostandolo dall'interno del template è troppo tardi perchè il componente è
    //già creato
  },
  {
    className: 'section-label',
    template: '<h5>Intestazione</h5>',
  },   
  {
    fieldGroupClassName: 'row',
    fieldGroup:[
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
    fieldGroup:[
    {
      key: 'dipartimemto_cd_dip',
      type: 'select',
      className: "col-md-6",
      templateOptions: {
        options: this.service.getDipartimenti(),
        valueProp: 'cd_dip',
        labelProp: 'nome_breve',
        label: 'Dipartimento',     
        required: true               
      }     
    },  
    {
      key: 'nominativo_docente',
      type: 'input',
      className: "col-md-6",
      templateOptions: {
        label: 'Direttore di dipartimento',     
        required: true               
      }     
    },  
  ]},
  {
    fieldGroupClassName: 'row',
    fieldGroup:[
    {
      key: 'tipoemittenti_codice',
      type: 'select',
      className: "col-md-6",
      templateOptions: {
        options: this.service.getEmittenti(),
        valueProp: 'codice',
        labelProp: 'descrizione',
        label: 'Autorizzato da',     
        required: true               
      }     
    },     
  ]},

]



  private id: number;
 
  defaultColDef = { editable: true };
 
  constructor(private service: ApplicationService, private route: ActivatedRoute) {         
  } 


  ngOnInit() {    
       
    this.route.params.subscribe(params => {
      if (params['id']){
        this.isLoading = true;    
        this.service.clearMessage();
        this.service.getConvenzioneById(params['id']).subscribe((data) => {
          this.isLoading = false;
          this.model = data;
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
 
  onNew(){
    this.model = null;
    this.form.reset();

  }

  onReload(){
    //sono nello stato nuovo
    if(this.model != null && this.model.id !== null){
      this.isLoading=true;
      this.service.getConvenzioneByUserId(this.model.user_id).subscribe((data)=> {          
        
        this.id=data.id;  
        this.model = data;    
        this.isLoading = false;
      }); 
    }
  }

  onSubmit() {
    if (this.form.valid) {
      
      var tosubmit = {...this.model, ...this.form.value};
      this.service.updateConvenzione(tosubmit, this.model.id).subscribe(
        result => console.log(result),
        error => console.log(error)
      );      
    }
  }

  onGenerate(){
    if (this.form.valid) {
        this.service.generatePDF(this.model.id);
    }  
  }


  private temp = [];
  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.role.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    //this.datarows =[...temp];
    //this.assignments.patchValue(temp);
    
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }
}
