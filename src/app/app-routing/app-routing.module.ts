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
import { MultistepSchematipoComponent } from '../application/pages/multistep-schematipo.component';
import { AllegatiComponent } from '../application/components/convenzione/allegati.component';
import { RoleComponent } from '../application/components/user/role.component';
import { PermissionComponent } from '../application/components/user/permission.component';
import { RolesComponent } from '../application/components/user/roles.component';
import { PermissionsComponent } from '../application/components/user/permissions.component';
import { TipoPagamentiComponent } from '../application/components/convenzione/tipopagamenti.component';
import { TipoPagamentoComponent } from '../application/components/convenzione/tipopagamento.component';

const routes: Routes = [
  //nota: se si usa il redirect vengono persi i parametri nell'url redirectTo: '/home'
  { path: '', component: HomeComponent, pathMatch:'full' },
  { path: 'home',  component: HomeComponent, children:[
      { path: 'convenzione',  component: ConvenzioneComponent,  canActivate:[AuthGuard] }, 
      { path: 'convenzioni/:id',  component: ConvenzioneComponent,  canActivate:[AuthGuard] },     
      { path: 'convenzioni',  component: ConvenzioniComponent,  canActivate:[AuthGuard] }, 
      { path: 'allegati',  component: AllegatiComponent,  canActivate:[AuthGuard] }, 
      { path: 'multistep-schematipo',  component: MultistepSchematipoComponent,  canActivate:[AuthGuard] },     
      { path: 'users',  component: UsersComponent, canActivate:[AuthGuard] },     //canActivate:[AuthGuard]
      { path: 'users/:id',  component: UserComponent,  canActivate:[AuthGuard] },
      { path: 'roles/new',  component: RoleComponent,  canActivate:[AuthGuard] }, 
      { path: 'roles/:id',  component: RoleComponent,  canActivate:[AuthGuard] }, 
      { path: 'roles',  component: RolesComponent, canActivate:[AuthGuard] },               
      { path: 'permissions/new',  component: PermissionComponent,  canActivate:[AuthGuard] }, 
      { path: 'permissions/:id',  component: PermissionComponent,  canActivate:[AuthGuard] }, 
      { path: 'permissions',  component: PermissionsComponent,  canActivate:[AuthGuard] }, 
      { path: 'tipopagamenti',  component: TipoPagamentiComponent, canActivate:[AuthGuard] },         
      { path: 'tipopagamenti/:id',  component: TipoPagamentoComponent,  canActivate:[AuthGuard] }, 
      { path: 'test',  component: TestTabComponent,  canActivate:[AuthGuard] },     
  ]}, 
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
