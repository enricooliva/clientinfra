import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-panel',
  template: `  
    <div class="card">
      <h5 class="card-header">
        {{ to.label }}
        <button class="btn btn-sm btn-link float-right" type="button" (click)="isCollapsed = !isCollapsed" [attr.aria-expanded]="!isCollapsed" aria-controls="collapseExample">         
          <span *ngIf="isCollapsed" class="oi oi-chevron-top"></span>
          <span *ngIf="!isCollapsed" class="oi oi-chevron-bottom"></span>
        </button>              
      </h5>
      <div id="collapseExample" [ngbCollapse]="isCollapsed">
          <div class="card-body">
            <ng-container #fieldComponent></ng-container>
          </div>
      </div>
    </div>  
  `,
})
export class AccordionWrapperComponent extends FieldWrapper {
  public isCollapsed = false;
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}