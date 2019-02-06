import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app-constants';
import { ToastrService, Toast } from 'ngx-toastr';


@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

    static readonly DEFAULT_ERROR_TITLE: string = "Qualcosa è andato storto";

    constructor(private injector: Injector, private toastr: ToastrService){

    };
    
    handleError(error: any) {
     const router = this.injector.get(Router);
      if (error instanceof HttpErrorResponse) {
        //Backend returns unsuccessful response codes such as 404, 500 etc.				  
        console.error('Backend returned status code: ', error.status);
        console.error('Response body:', error.message);          	  

        let httpErrorCode = error.error.httpErrorCode;
        switch (httpErrorCode) {
            case 401: //UNAUTHORIZED:
                this.toastr.error('Richiesta autenticazione', 'Oops!');
                router.navigateByUrl(AppConstants.baseApiURL+'/loginSaml');
                break;
            case 403: //FORBIDDEN:
                this.toastr.error('Richiesta non permessa', 'Oops!');
                router.navigateByUrl("/unauthorized");
                break;
            case 400: //BAD_REQUEST:
                //this.showError(error.message);
                this.toastr.error('Richiesta errata', 'Oops!');
                break;            
            default:
                //this.toastr.error(GlobalErrorHandlerService.DEFAULT_ERROR_TITLE, 'Oops!');
        }
        
      } else {
          //A client-side or network error occurred.	          
          console.error('An error occurred:', error.message);     
          throw error;     
      }     
    }

    // private showError(message:string){
    //     this.toastr.error(message, GlobalErrorHandlerService.DEFAULT_ERROR_TITLE, { dismiss: 'controlled'}).then((toast:Toast)=>{
    //             let currentToastId:number = toast.id;
    //             this.toastr..onClickToast().subscribe(clickedToast => {
    //                 if (clickedToast.id === currentToastId) {
    //                     this.toastManager.dismissToast(toast);
    //                     window.location.reload();
    //                 }
    //             });
    //         });
    //   }
} 