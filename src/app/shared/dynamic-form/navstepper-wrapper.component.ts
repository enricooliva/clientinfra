import { Component, OnInit, Input } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';

//ng g c shared/dynamic-form/navstepperWrapper -s true --spec false -t true


export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];
}

@Component({
  selector: 'app-navstepper-wrapper',
  template: `

  <ngb-tabset type="pills" class="nav-justified" [justify]="fill"  >
  <div *ngFor="let step of steps; let index = index; let last = last;">
  <ngb-tab [disabled]="index !== 0 && !form.at(index - 1)?.valid">
  <ng-template ngbTabTitle><b>Fancy</b> {{ index }}</ng-template>
  <ng-template ngbTabContent>
  <formly-form [form]="form.at(index)" [model]="model" [fields]="steps[index].fields" [options]="options[index]">
  </formly-form>
  </ng-template>
  </ngb-tab>
  </div>
  </ngb-tabset>

  <div>
  <div class="board-inner" id="status-buttons">
      <ul class="nav nav-pills nav-fill" id="myTab">
          <div class="liner"></div>
          <div *ngFor="let step of steps; let index = index; let last = last;">
              <!-- circular user icon -->
              <li class="nav-item">
                  <a routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" data-toggle="tab">
                      <span class="round-tabs one">
                          {{ index }}
                      </span>
                  </a>
              </li>
          </div>
      </ul>
      <div class="clearfix"></div>
  </div>

 
      <formly-form [form]="form.at(activedStep)" [model]="model" [fields]="steps[activedStep].fields" [options]="options[activedStep]">
      </formly-form>
 

  <div>
      <button *ngIf="activedStep !== 0" class="btn btn-primary" type="button" (click)="prevStep(activedStep)">Back</button>
      <button *ngIf="!last" class="btn btn-primary" type="button" [disabled]="!form.at(activedStep).valid" (click)="nextStep(activedStep)">Next</button>
      <button *ngIf="last" class="btn btn-primary" [disabled]="!form.valid" type="submit">Submit</button>
  </div>
</div>
  `,
  styles: []
})


//<i class="glyphicon glyphicon-user"></i>
export class NavstepperWrapperComponent implements OnInit {

  @Input()
  steps: StepType[];

  model={};
  form: FormArray;
  options: FormlyFormOptions[];

  activedStep = 0;  

  last = false;

  constructor() { }

  ngOnInit() {
    this.form = new FormArray(this.steps.map(() => new FormGroup({})));
    this.options = this.steps.map(() => <FormlyFormOptions> {});
  }

  prevStep(step) {
    this.activedStep = step - 1;
  }

  nextStep(step) {
    this.activedStep = step + 1;
  }

}
