import { NgModule } from '@angular/core';
import { Routes, RouterModule, NavigationExtras } from '@angular/router';
import { AuthGuard }                from '../core/auth.guard';
import { NotFoundComponent } from '../not-found-component/not-found.component';
import { HomeComponent } from '../application/home/home.component';
import { ConvenzioneComponent } from '../application/components/convenzione/convenzione.component';
import { UsersComponent } from '../application/components/user/users.component';
import { UserComponent } from '../application/components/user/user.component';
import { ConvenzioniComponent } from '../application/components/convenzione/convenzioni.component';
import { TestTabComponent } from '../application/pages/test-tab.component';

const routes: Routes = [
  //nota: se si usa il redirect vengono persi i parametri nell'url
  { path: '', redirectTo: '/home', pathMatch:'full' },
  { path: 'home',  component: HomeComponent, children:[
      { path: 'convenzione',  component: ConvenzioneComponent,  canActivate:[AuthGuard] }, 
      { path: 'convenzioni/:id',  component: ConvenzioneComponent,  canActivate:[AuthGuard] },     
      { path: 'convenzioni',  component: ConvenzioniComponent,  canActivate:[AuthGuard] },     
      { path: 'users',  component: UsersComponent, canActivate:[AuthGuard] },     //canActivate:[AuthGuard]
      { path: 'user/:id',  component: UserComponent,  canActivate:[AuthGuard] }, 
      { path: 'test',  component: TestTabComponent,  canActivate:[AuthGuard] },     
  ]}, 
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
