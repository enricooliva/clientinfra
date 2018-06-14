import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _username = '';

  constructor() { }
  
  login() {
    this._username = 'Juri';
  }

  logout() {
    this._username = '';
  }

  public get isLoggedIn(): boolean {
    return this._username !== '';
  }

  public get username(): string {
    return this._username;
  }

}
