import { FormlyFieldConfig } from '@ngx-formly/core';
export const fieldsForm: FormlyFieldConfig[] = [
    {
      className: 'section-label',
      template: '<h5>Dati personali</h5>',
    },
    {
      key: 'id',
      type: 'input',
      hideExpression: true,
      templateOptions: {
        label: 'Id',   
        disabled: true       
      },
    },
    {
      key: 'userId',
      type: 'input',
      hideExpression: true,
      templateOptions: {
        label: 'UserId',     
        hide: true         
      }     
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'name',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Nome',     
          required: true               
        }     
      },
      {
        key: 'surname',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Cognome',     
          required: true               
        }     
      },
    ]},
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'gender',
        type: 'select',    
        className: "col-md-2",  
        templateOptions: {
          label: 'Genere',     
          required: true,
          options: [
            { value: 'm', label: 'Maschio' },
            { value: 'f', label: 'Femmina' },
          ]               
        }     
      },
      {
        key: 'fiscalcode',
        type: 'input',
        className: "col-md-4",
        templateOptions: {
          label: 'Codice fiscale',     
          required: true               
        }     
      },  
      {
        key: 'birthplace',
        type: 'input',
        className: "col-md-6",
        templateOptions: {
          label: 'Luogo di nascita',     
          required: true               
        }     
      },  
    ]},
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'birthprovince',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Provincia di nascita',     
          required: true               
        }     
      },  
      {
        key: 'birthdate',
        type: 'datepicker',      
        className: "col-md-6",
        templateOptions: {
          label: 'Data di nascita',     
          required: true               
        }     
      }
    ]},
    {
      className: 'section-label',
      template: '<h5>Residenza</h5>',
    },          
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'com_res',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Comune di residenza',     
          required: true               
        }     
      },  
      {
        key: 'prov_res',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Provincia di residenza',     
          required: true               
        }     
      }
    ]},
    {
      fieldGroupClassName: 'row',
      fieldGroup:[
      {
        key: 'via_res',
        type: 'input',      
        className: "col-md-4",
        templateOptions: {
          label: 'Via di residenza',     
          required: true               
        }     
      },  
      {
        key: 'civ_res',
        type: 'input',      
        className: "col-md-2",
        templateOptions: {
          label: 'Civico',     
          required: true               
        }     
      },
      {
        key: 'presso',
        type: 'input',      
        className: "col-md-6",
        templateOptions: {
          label: 'Presso',     
          required: true               
        }     
      }
    ]},
    {
      className: 'section-label',
      template: '<h5>Incarichi</h5>',
    },   
    {
      key: 'assigments',    
      type: 'datatable',        
      fieldArray: {        
        fieldGroup:[
          {
            key: 'id',
            type: 'input',  
            hideExpression: false,             
            templateOptions: {
              label: 'Id',     
              disabled: true              
            }     
          },  
          {
            key: 'role',
            type: 'input',                           
            templateOptions: {
              label: 'Ruolo',     
              required: true               
            }     
          },
          {
            key: 'title',
            type: 'input',      
            templateOptions: {
              label: 'Titolo',     
              required: true               
            }     
          },
          {
            key: 'istitute',
            type: 'input',                 
            templateOptions: {
              label: 'Istituto',     
              required: true               
            }     
          },
          {
            key: 'from',
            type: 'datepicker',               
            templateOptions: {
              label: 'Da',     
              required: true               
            }     
          },
          {
            key: 'to',
            type: 'datepicker',                             
            templateOptions: {
              label: 'A',     
              required: true               
            }     
          },
          {
            key: 'document',
            type: 'input',                            
            templateOptions: {
              label: 'Documento',     
              required: true               
            }     
          },
          {
            key: 'path',
            type: 'input',                         
            templateOptions: {
              label: 'Percorso',     
              required: true               
            }     
          },
        ]
      }
    }
  ];