import { Component, OnInit, Input } from '@angular/core';
import { Convenzione } from 'src/app/application/convenzione';
import { ConvenzionedetailsComponent } from '../convenzionedetails.component';

interface IInfoSottoscrizione {  
  speditaDitta: IDoc;
  restituita: IDoc;
  arrivata:IDoc;
  rispedita:IDoc;
};

interface IDoc{  
  numero: string;
  data: string;
}

@Component({
  selector: 'app-sottoscrizionedetails',
  templateUrl: './sottoscrizionedetails.component.html',
  styles: []
})
export class SottoscrizionedetailsComponent implements OnInit {

  @Input() conv: Convenzione;

  sottr: IInfoSottoscrizione;
  
  constructor() { }

  ngOnInit() {
    this.sottr = new Object() as IInfoSottoscrizione;
      //LTU_FIRM_UNIURB
      //num_prot
      //emission_date
      if (this.conv.stipula_type=='uniurb'){
        const file = this.conv.attachments.find(x => x.attachmenttype_codice == 'LTU_FIRM_UNIURB')
        if (file) {
          let speditaDitta = {       
            data: file.emission_date.toString(),
            numero: file.num_prot        
          }
          this.sottr.speditaDitta = speditaDitta;                      
        }
        //LTE_FIRM_ENTRAMBI_PROT LTE_FIRM_ENTRAMBI
        const filerest = this.conv.attachments.find(x => x.attachmenttype_codice == 'LTE_FIRM_ENTRAMBI_PROT' ||  x.attachmenttype_codice == 'LTE_FIRM_ENTRAMBI')
        if (filerest) {
          let restituita = {        
            data: filerest.emission_date.toString(),
            numero: filerest.num_prot        
          }
          this.sottr.restituita = restituita;                      
        }
      } 


      if (this.conv.stipula_type=='controparte'){
        const file = this.conv.attachments.find(x => x.attachmenttype_codice == 'LTE_FIRM_CONTR' || x.attachmenttype_codice == 'LTE_FIRM_CONTR_PROT')
        if (file) {
          let arrivata = {       
            data: file.emission_date.toString(),
            numero: file.num_prot        
          }
          this.sottr.arrivata = arrivata;                      
        }
        //LTE_FIRM_ENTRAMBI_PROT LTE_FIRM_ENTRAMBI
        const filerest = this.conv.attachments.find(x => x.attachmenttype_codice == 'LTU_FIRM_ENTRAMBI_PROT' ||  x.attachmenttype_codice == 'LTU_FIRM_ENTRAMBI')
        if (filerest) {
          let rispedita = {        
            data: filerest.emission_date.toString(),
            numero: filerest.num_prot        
          }
          this.sottr.rispedita = rispedita;                      
        }
      } 



  }

  executed(){
    return ConvenzionedetailsComponent.executed(this.conv.current_place,'firmato');
  }

}
