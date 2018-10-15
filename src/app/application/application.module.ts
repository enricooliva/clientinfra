import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

//services
import { ApplicationService } from './application.service';

//components
import { ConvenzioneComponent } from './components/convenzione/convenzione.component';
import { AssignmentDetailPageComponent } from './pages/assignment-detail-page/assignment-detail-page.component';
import { SharedModule } from '../shared';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../core';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './components/user/users.component';
import { UserComponent } from './components/user/user.component';
import { LoadingModule } from 'ngx-loading';
import { ConvenzioniComponent } from './components/convenzione/convenzioni.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,    
    SharedModule,
    NgbModule.forRoot(),
    NgxDatatableModule,      
    RouterModule,
    LoadingModule   
  ], 
  exports: [
    ConvenzioneComponent,
    HomeComponent, UserComponent, ConvenzioniComponent   
  ],
  declarations: [        
    ConvenzioneComponent,
    ConvenzioniComponent,    
    AssignmentDetailPageComponent,    
    HomeComponent, UsersComponent, UserComponent
  ],
  providers: [ 
    ApplicationService 
  ], 
})
export class ApplicationModule { }
