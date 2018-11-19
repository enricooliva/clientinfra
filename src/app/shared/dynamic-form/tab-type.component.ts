import { FieldType, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

// ng g c shared/dynamic-form/tab-type -s true  --spec false --flat true
@Component({
  selector: 'app-tab-type',
  template: `
  <ngb-tabset #tabs="ngbTabset" type="pills" [orientation]="'horizontal'" [justify]="'justified'" (tabChange)="onTabChange($event)">
  <div *ngFor="let f of field.fieldGroup; let index = index;">
    <ngb-tab id="tab-{{index}}" [disabled]="index>0 && !isValid(index-1)">
        <ng-template ngbTabTitle>
         <button class="btn btn-circle mr-2">
            <span *ngIf="!isActive(index)" class="oi oi-pencil iconic" title="reload" aria-hidden="true"></span>
            <span *ngIf="isActive(index)"><b>{{ index }}</b></span>
            </button>
            <span class="h6">{{ f.templateOptions.label }} </span>
        </ng-template>
        <ng-template ngbTabContent>            
            <formly-field 
                [model]="model"
                [field]="f"
                [options]="options"
                [form]="form">
            </formly-field>              
        </ng-template>
    </ngb-tab>
</div>
</ngb-tabset>
<div>
<button *ngIf="selectedTab !== 'tab-0'" class="btn btn-primary mr-2" type="button" (click)="prevStep(activedStep)">Indietro</button>
<button *ngIf="!last" class="btn btn-primary" type="button" [disabled]="nextState" [disabled]="!isValid(activedStep)" (click)="nextStep(activedStep)">Avanti</button>
</div>
  `,
  styleUrls: ['./navstepper-wrapper.component.css']
})

export class TabTypeComponent extends FieldType implements OnInit {

    activedStep = 0;
  
    @ViewChild('tabs') tabs: NgbTabset;
  
    last = false;
  
    _selectedTab = 'tab-0';  
  
    ngOnInit() {
    }
  
    isActive(index): boolean {
      return ('tab-' + index) === this.tabs.activeId;
    }
  
    
    isValid(index): boolean {
      let tab = this.field.fieldGroup[index];
      for (let subfield of tab.fieldGroup) {                
        const fullName = this.field.key ? this.field.key+"."+subfield.key : subfield.key;
        const contrl = this.form.get(fullName);
        if (contrl && !contrl.valid)
          return false;
      }    
      return true;
    }
  
  
    prevStep(step) {
      if (step === 0)
        return;
      this.activedStep = step - 1;
      this.selectActiveStep();
    }
  
    nextStep(step) {
      if (step ===  this.field.fieldGroup.length - 1) {
        return true;
      }
      this.activedStep = step + 1;
      this.selectActiveStep();
    }
  
    selectActiveStep() {
      this.tabs.select('tab-' + this.activedStep);
    }
  
  
    public get lastIndex(): string {
      return 'tab-' + ( this.field.fieldGroup.length - 1);
    }
  
    public get selectedTab(): string {
      return this._selectedTab;
    }
  
  
    public set selectedTab(value: string) {
      this._selectedTab = value;
      this.activedStep = +value.replace('tab-', '');
    }
  
  
    getStepTitle(index) {
      let label = this.to.labels[index];
      if (label) {
        return label;
      }
      return 'Passo ' + index;
    }
  
    onTabChange($event) {
      this.selectedTab = $event.nextId;
      if (this.lastIndex === $event.nextId as string) {
        this.last = true;
      } else {
        this.last = false;
      }
    }
  }