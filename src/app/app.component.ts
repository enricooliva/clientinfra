import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, NavigationCancel, Router } from '@angular/router';
import { AuthService } from './core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'UniConv client';
  errorMessage = '';

  constructor(public router: Router, private authService: AuthService, private rolesService: NgxRolesService) {
    console.log("constructor app-root ");
    let token = null;

    // const perm = ["ADMIN", "EDITOR"];
    // this.permissionsService.loadPermissions(perm);

    // rolesService.addRoles({
    //     'USER': ['canReadSubmission'],
    //     'ADMIN': ['canReadSubmission', 'canReadUsers','canEditUsers','canCreatUser'],       
    //   });

    //vengono sosttoscritti tutti gli eventi di navigazione
    
    // router.events.subscribe(s => {
    //   if (s instanceof NavigationCancel) {
    //     let params = new URLSearchParams(s.url.split('/')[1]);
    //     token = params.get('token');
    //     if (token) {
    //       authService.loginWithToken(token);
    //       this.router.navigate(['home']);
    //     } else {
    //       console.log("no token");
    //     }
    //   }
    // });

    authService.reload(); 
  }

  ngOnInit() {

    console.log("init app-root")
  }

}
