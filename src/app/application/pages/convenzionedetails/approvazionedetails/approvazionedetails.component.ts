import { Component, OnInit, Input } from '@angular/core';
import { Convenzione } from 'src/app/application/convenzione';

interface IInfoApprovazione {
  richiestaname: string;
  docAppr: IDoc;
  docApprOrgani: IDoc;
};

interface IDoc{
  descrDocumento: string;
  numero: string;
  data: string;
}


@Component({
  selector: 'app-approvazionedetails',
  templateUrl: './approvazionedetails.component.html',
  styles: []
})

//ng g c approvazionedetails  -s true --spec false 
export class ApprovazionedetailsComponent implements OnInit {

  @Input() conv: Convenzione;

  appr: IInfoApprovazione;


  constructor() { }

  ngOnInit() {
    this.appr = new Object() as IInfoApprovazione;
    //se convenzione schema tipo e lo stato è maggiore o uguale ad approvato ... allora    
    //{ value: 'DCD', label: 'Delibera Consiglio di Dipartimento' },
    //{ value: 'DDD', label: 'Disposizione del direttore di dipartimento' },
    const file = this.conv.attachments.find(x => x.attachmenttype_codice == 'DCD' || x.attachmenttype_codice == 'DDD')
    if (file) {
      let docAppr = {
        descrDocumento: file.attachmenttype.descrizione,
        data: file.emission_date.toString(),
        numero: file.docnumber        
      }
      this.appr.docAppr = docAppr;                      
    }

    if (this.conv.schematipotipo != 'schematipo') {   
      //se convenzione schema tipo e lo stato è maggiore o uguale ad approvato ... allora      
        // { codice: 'DSA', descrizione: 'Delibera Senato Accademico' },
        // { codice: 'DCA', descrizione: 'Delibera Consiglio di Amministrazione' },
        // { codice: 'DR', descrizione: 'Decreto Rettorale' },
        // { codice: 'DRU', descrizione: "Decreto Rettorale d'urgenza" },
        const file = this.conv.attachments.find(x => x.attachmenttype_codice == 'DSA' 
                                      || x.attachmenttype_codice == 'DCA'
                                      || x.attachmenttype_codice == 'DR' 
                                      || x.attachmenttype_codice == 'DRU');
        if (file) {          
            let docApprOrgani = {
              descrDocumento: file.attachmenttype.descrizione,
              data: file.emission_date.toString(),
              numero: file.docnumber        
            }
            this.appr.docApprOrgani = docApprOrgani;
        }

        const task = this.conv.usertasks.find(x => x.workflow_place='inapprovazione' && x.state!='annulato');
        if(task){
          this.appr.richiestaname = (task.assignments as Array<any>).reduce((acc, x)=> acc = acc + x.user.name, '');
        }
        //cercare il task di approvazione e la persona a cui si è assegnata l'attività
        //const task = this.conv.usertasks.find(x => x. == 'DSA' 

    }

  }

}
