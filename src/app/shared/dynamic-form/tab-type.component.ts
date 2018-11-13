import { FieldType, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

// ng g c shared/dynamic-form/tab-type -s true  --spec false --flat true
@Component({
  selector: 'app-tab-type',
  template: `
<ngb-tabset  #tabs="ngbTabset" type="pills" [justify]="'justified'" (tabChange)="onTabChange($event)">
     <div *ngFor="let f of field.fieldGroup; let index = index;">            
        <ngb-tab id="tab-{{index}}" [disabled]="index>0 && !isValid(index-1)" >
            <ng-template ngbTabTitle >                
                <button class="btn btn-circle mr-2" >
                <span *ngIf="!isActive(index)" class="oi oi-pencil iconic" title="reload" aria-hidden="true"></span>
                <span *ngIf="isActive(index)"><b>{{ index }}</b></span>
                </button>
                <span class="h6">{{ getStepTitle(index) }}</span>                
            </ng-template>
            <ng-template ngbTabContent>
                <formly-form       
                  [model]="model"
                  [fields]="f.fieldGroup"
                  [options]="options"
                  [form]="formControl">                        
              </formly-form>  
            </ng-template>
        </ngb-tab>
    </div>
</ngb-tabset>
<div>
    <button *ngIf="selectedTab !== 'tab-0'" class="btn btn-primary mr-2" type="button" (click)="prevStep(activedStep)">Indietro</button>
    <button *ngIf="!last" class="btn btn-primary" type="button" [disabled]="nextState" [disabled]="!isValid(activedStep)" 
        (click)="nextStep(activedStep)">Avanti</button>     
</div>
  `,
  styleUrls: ['./navstepper-wrapper.component.css']
})

export class TabTypeComponent extends FieldType {
  constructor(builder: FormlyFormBuilder) {
    super();
  }

  activedStep = 0;  

  @ViewChild('tabs') tabs:NgbTabset;    

  last = false;
  
  _selectedTab = 'tab-0';

  steps= [];

  ngOnInit() {           
    this.steps = this.field.fieldGroup;
  }

  isActive(index): boolean{
    return ('tab-'+index) == this.tabs.activeId
  }

  isValid(index): boolean {      
      let tab = this.steps[index];
      for(let subfield of tab.fieldGroup){        
        const contrl =this.form.get(this.field.key+"."+ subfield.key );        
        if (contrl && !contrl.valid)
          return false;
      }      
      return true;
  }


  prevStep(step) {
    if (step==0)
        return;
    this.activedStep = step - 1;
    this.selectActiveStep();
  }

  nextStep(step) {
    if (step == this.steps.length-1){
        return true;
    }        
    this.activedStep = step + 1;
    this.selectActiveStep();
  }

  selectActiveStep(){
    this.tabs.select('tab-'+ this.activedStep);
  }

  
  public get lastIndex() : string {
    return 'tab-'+ (this.steps.length-1);
  }

  public get selectedTab() : string {
    return this._selectedTab;
  }

  
  public set selectedTab(value : string) {
      this._selectedTab = value;
      this.activedStep = +value.replace('tab-','');
  }
  

  getStepTitle(index){
      let step = this.steps[index];
      if (step && step.label){
          return step.label
      }
      return "Passo "+index;
  }

  onTabChange($event){
    this.selectedTab = $event.nextId        
    if (this.lastIndex == $event.nextId as string){
        this.last=true;
    }else{
        this.last=false;
    }
 }


}