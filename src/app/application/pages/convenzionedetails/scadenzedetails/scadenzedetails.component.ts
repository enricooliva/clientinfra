import { Component, OnInit, Input } from '@angular/core';
import { Convenzione } from 'src/app/application/convenzione';
import { ConvenzionedetailsComponent } from '../convenzionedetails.component';

enum prelievoType{
  PRE_NO = 'No',
  PRE_SI = 'Si',  
}


@Component({
  selector: 'app-scadenzedetails',
  templateUrl: './scadenzedetails.component.html',
  styles: []
})

export class ScadenzedetailsComponent implements OnInit {
  @Input() conv: Convenzione;

  constructor() { }

  ngOnInit() {
  }

  executed(){
    return ConvenzionedetailsComponent.executed(this.conv.current_place,'repertoriato');
  }

  executedtype() {
    //se la conv è in stato repertoriato 
    const delta = this.executed()
    if (delta >= 0){
      if (this.conv.scadenze.every(x => x.state == 'pagato')){
        //tutte le scadenze sono in stato pagato 
        return 'info';    
      }
      return 'warning';
    }
      
    return 'normal'
  }

}
