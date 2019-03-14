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
import { FullComponent } from '../shared/layouts/full/full.component';
import { BlankComponent } from '../shared/layouts/blank/blank.component';
import { TasksComponent } from '../application/components/task/tasks.component';
import { TaskComponent } from '../application/components/task/task.component';
import { ConvvalidationComponent } from '../application/pages/convvalidation.component';
import { SottoscrizioneComponent } from '../application/pages/sottoscrizione.component';
import { FirmaControparteComponent } from '../application/pages/firmacontroparte.component';
import { FirmaDirettoreComponent } from '../application/pages/firmadirettore.component';
import { AziendaLocComponent } from '../application/components/convenzione/aziendaloc.component';
import { AziendeLocComponent } from '../application/components/convenzione/aziendeloc.component';
import { PersoneinterneTitulus } from '../application/pages/personeinterne-titulus.component';
import { StruttureInterneTitulus } from '../application/pages/struttureinterne-titulus.component';

const routes: Routes = [
  //nota: se si usa il redirect vengono persi i parametri nell'url redirectTo: '/home'
  { path: '', component: BlankComponent }, 
  { path: 'home',  component: FullComponent, children:[
      //{ path:'', redirectTo:'dashboard/dashboard1',  pathMatch: 'full'},      
      {
        path: 'dashboard',
        loadChildren: '../dashboards/dashboard.module#DashboardModule'
      },
      { 
        path: 'convenzione',  component: ConvenzioneComponent,  canActivate:[AuthGuard],        
      }, 
      { 
        path: 'convenzioni/:id',  component: ConvenzioneComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Convenzione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Convenzione' }
          ]
        } 
      },     
      { 
        path: 'convenzioni',  component: ConvenzioniComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Ricerca convenzioni',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca convenzioni' }
          ]
        }
      }, 
      {
        path: 'validazione/:id', component: ConvvalidationComponent, canActivate:[AuthGuard], pathMatch:'full',
        data: {
        title: 'Approvazione convenzione',
        urls: [
          { title: 'Home', url: '/home' },
          { title: 'Approvazione convenzione' }
        ]
        }
      },
      {
        path: 'validazione', component: ConvvalidationComponent, canActivate:[AuthGuard],
        data: {
          title: 'Approvazione convenzione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Approvazione convenzione' }
          ]
        },
      },
      {
        path: 'sottoscrizione/:id', component: SottoscrizioneComponent, canActivate:[AuthGuard], pathMatch:'full',
        data: {
          title: 'Sottoscrizione convenzione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Sottoscrizione convenzione' }
          ]
        },
      },
      {
        path: 'sottoscrizione', component: SottoscrizioneComponent, canActivate:[AuthGuard],
        data: {
          title: 'Sottoscrizione convenzione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Sottoscrizione convenzione' }
          ]
        },
      },

      {
        path: 'firmadirettore/:id', component: FirmaDirettoreComponent, canActivate:[AuthGuard], pathMatch:'full',
        data: {
          title: 'Completamento sottoscrizione firma direttore',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Completamento sottoscrizione firma direttore' }
          ]
        },
      },
      {
        path: 'firmadirettore', component: FirmaDirettoreComponent, canActivate:[AuthGuard],
        data: {
          title: 'Completamento sottoscrizione firma direttore',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Completamento sottoscrizione firma direttore' }
          ]
        },
      },

      {
        path: 'firmacontroparte/:id', component: FirmaControparteComponent, canActivate:[AuthGuard], pathMatch:'full',
        data: {
          title: 'Completamento sottoscrizione firma controparte',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Completamento sottoscrizione firma controparte' }
          ]
        },
      },
      {
        path: 'firmacontroparte', component: FirmaControparteComponent, canActivate:[AuthGuard],
        data: {
          title: 'Completamento sottoscrizione firma controparte',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Completamento sottoscrizione firma controparte' }
          ]
        },
      },

      
      { path: 'allegati',  component: AllegatiComponent,  canActivate:[AuthGuard] }, 
      { path: 'multistep-schematipo',  component: MultistepSchematipoComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Nuova convenzione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova convenzione' }
          ]
        }
      },     
      { 
        path: 'users',  component: UsersComponent, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca utenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Utenti' }
          ]
        }
      },     //canActivate:[AuthGuard]
      { 
        path: 'users/:id',  component: UserComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Utente',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Utente' }
          ]
        } 
      },
      { 
        path: 'roles/new',  component: RoleComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Nuovo ruolo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo ruolo' }
          ]
        }
      }, 
      { 
        path: 'roles/:id',  component: RoleComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Ruolo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ruolo' }
          ]
        }
      }, 
      {
         path: 'roles',  component: RolesComponent, canActivate:[AuthGuard],
         data: {
          title: 'Ricerca ruoli',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca ruoli' }
          ]
        }
      },               
      { 
        path: 'permissions/new',  component: PermissionComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Nuovo permesso',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo permesso' }
          ]
        } 
      }, 
      { 
        path: 'permissions/:id',  component: PermissionComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Permesso',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Permesso' }
          ]
        } 
      }, 
      { 
        path: 'permissions',  component: PermissionsComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca permessi',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca permessi' }
          ]
        }
      }, 
      { 
        path: 'tipopagamenti',  component: TipoPagamentiComponent, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca tipo pagamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca tipo pagamento' }
          ]
        }
      },         
      { 
        path: 'tipopagamenti/:id',  component: TipoPagamentoComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Tipo pagamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Tipo pagamento' }
          ]
        }
      }, 
      { 
        path: 'tasks/new',  component: TaskComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Nuova attività',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova attività' }
          ]
        },
      }, 
      { 
        path: 'tasks',  component: TasksComponent, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca attività',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca attività' }
          ]
        }
      },         
      { 
        path: 'tasks/:id',  component: TaskComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Attività',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Attività' }
          ]
        }
      },      
      { 
        path: 'aziendeloc/new',  component: AziendaLocComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Nuova azienda',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova azienda' }
          ]
        },
      }, 
      { 
        path: 'aziendeloc',  component: AziendeLocComponent, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca aziende',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca aziende' }
          ]
        }
      },
      { 
        path: 'aziendeloc/:id',  component: AziendaLocComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Azienda',
          urls: [
            { title: 'Azienda', url: '/home' },
            { title: 'Attività' }
          ]
        }
      },                   
      { 
        path: 'personeinterne',  component: PersoneinterneTitulus, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca persone interne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca persone interne' }
          ]
        }
      },
      { 
        path: 'struttureinterne',  component: StruttureInterneTitulus, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca strutture interne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca strutture interne' }
          ]
        }
      },

      { path: 'test',  component: TestTabComponent,  canActivate:[AuthGuard] },     
  ]}, 
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
