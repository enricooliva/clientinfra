import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import { TipoPagamentoService } from '../../tipopagamento.service';


@Component({
  selector: 'app-tipopagamento', 
  templateUrl: '../../../shared/base-component/base-entity.component.html',
})

// <p>Form value: {{ form.value | json }}</p>
//   <p>Form status: {{ form.status | json }}</p>
//   <p>Model: {{ model | json }}</p>

//ng g c submission/components/user -s true --spec false -t true

export class TipoPagamentoComponent extends BaseEntityComponent {
  
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'id',
          type: 'input',
          className: "col-md-2",
          templateOptions: {
            label: 'Id',
            disabled: true
          }
        },
        {
          key: 'codice',
          type: 'input',
          className: "col-md-5",
          templateOptions: {
            label: 'Codice',
            disabled: true,
            required: true
          }
        },
        {
          key: 'descrizione',
          type: 'input',
          className: "col-md-5",
          templateOptions: {
            label: 'Descrizione',
            required: true
          },
        }
      ]
    },    
    // {        
    //   fieldGroupClassName: 'row',
    //   fieldGroup: [
    //     {
    //       key: 'created_at',
    //       type: 'input',
    //       className: "col-md-5",
    //       templateOptions: {
    //         label: 'Data creazione',
    //         disabled: true,            
    //       }
    //     },           
    //   ]                
    // }
  ];  

  constructor(protected service: TipoPagamentoService, protected route: ActivatedRoute, protected router: Router) {
    super(route,router);
    //this.title = 'Tipo pagamento'
    this.activeNew =true;
    this.researchPath = 'home/tipopagamenti'
    this.newPath = this.researchPath+'/new';
  }

 

  
}
