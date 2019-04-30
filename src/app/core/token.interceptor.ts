import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { error } from 'util';
import { AppConstants } from '../app-constants';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, public auth: AuthService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //    return next.handle(req);

    return next.handle(req).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          console.log('processing response', ev);
        }      
      }),    
      catchError( error => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 401:
                //const router = this.injector.get(Router);
                this.auth.logout();
                window.location.href = AppConstants.baseURL + '/loginSaml'; 
                //router.navigateByUrl(); 
                break;            
              case 500:
                if (error.message){
                    this.toastr.error(error.message);                    
                    const router = this.injector.get(Router);
                    router.navigateByUrl("/unauthorized");                              
                }
                break;
            }
          }
          return throwError(error);
        })
      );
  }
}