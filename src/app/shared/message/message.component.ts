import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { InfraMessageType, InfraMessage } from './message';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styles: [
        `
      .dark-modal .modal-content {
        background-color: #009efb;
        color: white;
      }
      .dark-modal .close {
        color: white;
      }
    `
    ]
})
export class MessageComponent implements OnInit {
    isCollapsed = false;

    form = new FormGroup({});

    protected model = {};

    protected fields: FormlyFieldConfig[] = [
        {
            type: 'input',
            key: 'name',
            templateOptions: {
                label: 'Tipo',
                disabled: true,
            },
        },
        {
            type: 'input',
            key: 'message',
            templateOptions: {
                label: 'Messaggio',
                disabled: true,
            },
        },
        
        {
            type: 'input',
            key: 'error.message',
            templateOptions: {
                label: 'Descrizione',
                disabled: true,
            },
        },
        {
            type: 'textarea',
            key: 'errors',
            templateOptions: {
                disabled: true,
                label: 'Contenuto',
                rows: 2,
            },
        },

    ];

    constructor(public messageService: MessageService, private modalService: NgbModal, public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

    cssClass(msg: InfraMessage) {
        if (!msg) {
            return;
        }

        // return css class based on alert type
        switch (msg.type) {
            case InfraMessageType.Success:
                return '';
            case InfraMessageType.Error:
                return 'bg-danger text-white';
            case InfraMessageType.Info:
                return 'bg-light text-dark';
            case InfraMessageType.Warning:
                return 'bg-warning text-dark';
        }

    }

    onSelect(msg: InfraMessage, content) {
        if (msg.error) {            
            this.model = msg.error;
            
            if (msg.error.error){
                let errors = msg.error.error.errors;
                let msgErrors: string = '';                
                Object.keys(errors).forEach(key => msgErrors += errors[key].toString());                    
                this.model['errors'] = msgErrors;
            }
            const modalRef = this.modalService.open(content, {
                size: 'lg'
            }).result.then(() => this.model = {});
        }
    }

}
