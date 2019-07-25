import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fase-wrapper',
  template: `
  <div class="card border-0 m-t-30">
    <div class="card-body" [ngClass]="{      
      'bg-light-warning': options.executed != null ? options.executed == -1 :  options.type == 'warning',
      'bg-light-info': options.executed != null ? options.executed >= 0 : options.type == 'info',      
      'bg-light-success': options.type ? options.type == 'success' : false,
      'bg-light': options.type ? options.type == 'gray' : false
    }">
      <h3 class="card-title">{{options.title}}</h3>    
    </div>
    <div id="collapseComp" [ngbCollapse]="isCollapsed">
      <ng-content></ng-content>
    </div>  
  </div>         
  `,
  //'bg-light-success':  options.executed != null ? options.executed == 0 : options.type == 'primary'
  styles: []
})
export class FaseWrapperComponent implements OnInit {

  public isCollapsed = false;

  @Input() options: {
    title?: string,       
    executed?: number,
    type?: string, 
  }  

  constructor() {  
  }

  ngOnInit() {
  }


}
