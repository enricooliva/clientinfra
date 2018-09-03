import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { InfraMessageType, InfraMessage } from './message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'  
})
export class MessageComponent implements OnInit {
  isCollapsed = false;
  constructor(public messageService: MessageService) { }

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

}
