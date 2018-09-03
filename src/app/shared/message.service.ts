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
 
   
  success(message: string, keepAfterRouteChange = false) {
    this.messages.push({message: message, type:InfraMessageType.Success});
  }

  error(message: string, keepAfterRouteChange = false) {
    this.messages.push({message: message, type:InfraMessageType.Error});
  }

  info(message: string, keepAfterRouteChange = false) {
    this.messages.push({message: message, type:InfraMessageType.Info});
  }

  warn(message: string, keepAfterRouteChange = false) {
    this.messages.push({type: InfraMessageType.Warning, message});
  }
  add(messageType: InfraMessageType, message: string, keepAfterRouteChange = false) {
    this.messages.push( {message: message, type: messageType });
  }
 
  clear() {
    this.messages = [];
  }
}

