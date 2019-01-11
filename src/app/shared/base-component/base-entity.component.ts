import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceEntity } from '../query-builder/query-builder.interfaces';

@Component({  
  template: `NOT UI`
})
// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class BaseEntityComponent implements OnInit {
  
  protected isLoading = true;

  options: FormlyFormOptions = {};
  
  form = new FormGroup({});

  model = { };

  protected fields: FormlyFieldConfig[];

  title = 'completare campto title';

  protected service: ServiceEntity;

  constructor(protected route: ActivatedRoute, protected router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.service.clearMessage();
      this.service.getById(params['id']).subscribe((data) => {
        this.isLoading = false;
        this.model = data;
      });

    });
  }

  onRemove() {
    this.service.remove(this.model['id']).subscribe(
      prop => {
        this.model = null;
      },
      error => { // error path

      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      var tosubmit = { ...this.model, ...this.form.value };
      this.service.update(tosubmit, tosubmit.id, false).subscribe(
        result => {
          //this.options.resetModel(result);
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

  onReload() {
    //TODO
  }

  get isReloadable() {
    if (this.model == null)
      return false;

    return this.model['id'] != null;
  }

  
}
