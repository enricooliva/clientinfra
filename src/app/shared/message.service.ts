import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { InfraMessage, InfraMessageType } from './message/message';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private keepAfterRouteChange = false;
  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
            if (this.keepAfterRouteChange) {
                // only keep for a single route change
                this.keepAfterRouteChange = false;
            } else {
                // clear alert messages
                this.clear();
            }
        }
    });
  }

  messages: InfraMessage[] = [];
 
   
  success(message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this.messages.push({message: message, type:InfraMessageType.Success});
  }

  error(message: string, deletePreviusMessage = true, keepAfterRouteChange = false, error: any = null) {
    this.post(deletePreviusMessage);
    this.messages.push({message: message, type:InfraMessageType.Error, error: error});
  }

  info(message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this.messages.push({message: message, type:InfraMessageType.Info});
  }

  warn(message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this.messages.push({type: InfraMessageType.Warning, message});
  }
  add(messageType: InfraMessageType, message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this.messages.push( {message: message, type: messageType });
  }
 
  private post(deletePreviusMessage){
    if (deletePreviusMessage)
      this.clear();
  }

  clear() {
    this.messages = [];
  }

}

