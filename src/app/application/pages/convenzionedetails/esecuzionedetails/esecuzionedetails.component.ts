import { Component, OnInit, Input } from '@angular/core';
import { Convenzione } from 'src/app/application/convenzione';
import { ConvenzionedetailsComponent } from '../convenzionedetails.component';

@Component({
  selector: 'app-esecuzionedetails',
  templateUrl: './esecuzionedetails.component.html',
  styles: []
})
export class EsecuzionedetailsComponent implements OnInit {

  
  @Input() conv: Convenzione;
  
  constructor() { }

  ngOnInit() {
  }

  executed(){
    return ConvenzionedetailsComponent.executed(this.conv.current_place,'repertoriato');
  }

}
