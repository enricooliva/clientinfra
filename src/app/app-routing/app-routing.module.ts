import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard }                from '../core/auth.guard';
import { NotFoundComponent } from '../not-found-component/not-found.component';
import { SubmissionComponent } from '../submission/components/submission/submission.component';
import { AppComponent } from '../app.component';

const routes: Routes = [
  { path: 'submissions',  component: SubmissionComponent},
  { path: '', component: AppComponent, canActivate:[AuthGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
