
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

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
  private loggedIn = new BehaviorSubject<boolean>(false);
  
  _username = '';

  constructor(private http: HttpClient, public jwtHelper: JwtHelperService, private router: Router) {
    this.loggedIn.next(this.isAuthenticated());
  }
 
  login() {
    //il login purtroppo non passa da questo metodo.

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

  loginWithToken(token: any){        
    localStorage.setItem("token",token);
    this.loggedIn.next(this.isAuthenticated());
  }

  /**
   * Log the user out
   */
  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);    
  }

  /**
     * Check if the user is logged in
     */
  get isLoggedIn() {    
    return this.loggedIn.asObservable();
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
