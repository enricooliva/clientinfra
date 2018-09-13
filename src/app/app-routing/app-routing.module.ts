import { NgModule } from '@angular/core';
import { Routes, RouterModule, NavigationExtras } from '@angular/router';
import { AuthGuard }                from '../core/auth.guard';
import { NotFoundComponent } from '../not-found-component/not-found.component';
import { HomeComponent } from '../submission/home/home.component';
import { SubmissionComponent } from '../submission/components/submission/submission.component';
import { UsersComponent } from '../submission/components/user/users.component';
import { UserComponent } from '../submission/components/user/user.component';
import { SubmissionsComponent } from '../submission/components/submission/submissions.component';

const routes: Routes = [
  //nota: se si usa il redirect vengono persi i parametri nell'url
  { path: '', redirectTo: '/home', pathMatch:'full' },
  { path: 'home',  component: HomeComponent, children:[
      { path: 'submission',  component: SubmissionComponent,  canActivate:[AuthGuard] },     
      { path: 'submissions',  component: SubmissionsComponent,  canActivate:[AuthGuard] },     
      { path: 'users',  component: UsersComponent, canActivate:[AuthGuard] },     //canActivate:[AuthGuard]
      { path: 'user/:id',  component: UserComponent,  canActivate:[AuthGuard] },     
  ]}, 
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
