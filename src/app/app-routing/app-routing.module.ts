import { NgModule } from '@angular/core';
import { Routes, RouterModule, NavigationExtras } from '@angular/router';
import { AuthGuard }                from '../core/auth.guard';
import { NotFoundComponent } from '../not-found-component/not-found.component';
import { SubmissionComponent } from '../submission/components/submission/submission.component';
import { HomeComponent } from '../shared/home/home.component';

const routes: Routes = [
  { path: '',  component: SubmissionComponent,  canActivate:[AuthGuard]},   
  { path: 'home',  component: HomeComponent},   
  { path: 'submissions',  component: SubmissionComponent,  canActivate:[AuthGuard] },   
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
