import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceEntity } from '../query-builder/query-builder.interfaces';
import { Subject } from 'rxjs';

@Component({
  template: `NOT UI`
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class BaseEntityComponent implements OnInit, OnDestroy {

  protected onDestroy$ = new Subject<void>();
  protected isLoading = true;
  
  form = new FormGroup({});

  protected model = {};

  protected options: FormlyFormOptions = {
    formState: {
      mainModel: this.model,
    },
  };

  protected fields: FormlyFieldConfig[];

  protected title = null;

  protected service: ServiceEntity;

  activeNew = false;

  researchPath: string = null;
  
  newPath: string = null;

  constructor(protected route: ActivatedRoute, protected router: Router) {
  }

  ngOnInit() {    
    this.route.params.subscribe(params => {      
      this.service.clearMessage();
      if (params['id']){
        this.service.getById(params['id']).subscribe((data) => {
          this.isLoading = false;
          this.model = JSON.parse(JSON.stringify(data));
        });
      }else{          
        this.additionalFormInitialize();             
        this.isLoading = false;
      }
      
    });
  }  

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  protected additionalFormInitialize() { // hook for child
    
  }

  onNew(){    
    if (this.newPath){
      this.router.navigate([this.newPath]);        
    }else{
      this.model = {};
      this.form.reset();
      this.service.clearMessage();
    }
    
  }

  onRemove() {
    this.service.remove(this.model['id']).subscribe(
      prop => {
        this.model = null;
        //impostare come se fosse in nuovo
      },
      error => { // error path        

      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      this.service.update(tosubmit, tosubmit.id ? tosubmit.id : null , true).subscribe(
        result => {
          
          this.isLoading = false;          
          this.router.navigate([this.researchPath, result.id]);

          this.options.resetModel(result);
          this.options.updateInitialValue();
        },
        error => {
          this.isLoading = false;
          //this.service.messageService.error(error);          
        });
    }
  }

  onReload() {
    if (this.model['id']) {
      this.options.resetModel(); 
      this.form.markAsPristine();     
    }
  }

  get isReloadable() {
    if (this.model == null)
      return false;

    return this.model['id'] != null;
  }

  onResearch(){  
    if (this.researchPath){
      this.router.navigate([this.researchPath]);    
    }
  }

}
