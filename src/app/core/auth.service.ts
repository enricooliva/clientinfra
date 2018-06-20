
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

interface LoginResponse {
  accessToken: string;
  accessExpiration: number;
}

const httpOptions = {
  headers: new HttpHeaders({
    //'observe': 'response',    
    'Content-Type': 'text'
    //'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Authorization, X-Requested-With'
    //'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = 'http://pcoliva.uniurb.it/api';
  private loggedIn: boolean = false;
  _username = '';

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
    // look at localStorage to check if the user is logged in
    this.loggedIn = localStorage.getItem('auth_token') != null;
  }

  login() {

    //Effetuando la chimamata da una sorgente diversa da quello del server 
    //otteniamo un errore CORS        
    return this.http.get(`${this.authUrl}/loginSaml`,httpOptions)
      .subscribe(res => {
        // if (res.headers.get('token')) {
        //   localStorage.setItem('auth_token', res.headers.get('token'));
        //   this.loggedIn = true;
        // }
        // console.log(res.accessToken, res.accessExpiration);
        // localStorage.setItem('auth_token', res.accessToken);
        console.log(res);
      })
  }

  /**
   * Log the user out
   */
  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  /**
     * Check if the user is logged in
     */
  isLoggedIn() {
    return this.loggedIn;
  }

  public get username(): string {
    return this._username;
  }

  // ...
  public isAuthenticated(): boolean {

    const token = localStorage.getItem('token');

    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }





  /**
   * Handle any errors from the API
   */
  private handleError(err) {
    let errMessage: string;

    // if (err instanceof Response) {
    //   let body = err.json() || '';
    //   let error = body.error || JSON.stringify(body);
    //   errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
    // } else {
    //   errMessage = err.message ? err.message : err.toString();
    // }

    return Observable.throw(errMessage);
  }
}
