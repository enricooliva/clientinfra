import { NgModule, InjectionToken } from '@angular/core';
import { Routes, RouterModule, NavigationExtras, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
import { ClassificazioneComponent } from '../application/components/classif/classificazione.component';
import { ClassificazioniComponent } from '../application/components/classif/classificazioni.component';
import { MappingUfficiTitulus } from '../application/components/mapping/mappinguffici.component';
import { MappingUfficioTitulus } from '../application/components/mapping/mappingufficio.component';
import { StruttureEsterneTitulus } from '../application/pages/struttureesterne-titulus.component';
import { DocumentiTitulus } from '../application/pages/documenti-titulus.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { environment } from 'src/environments/environment';
import { AuthService } from '../core';
import { LoginActivate } from '../core/login.activate';
import { ScadenzaService } from '../application/scadenza.service';
import { ScadenzeComponent } from '../application/components/scadenza/scadenze.component';
import { ScadenzaComponent } from '../application/components/scadenza/scadenza.component';
import { BolloRepertoriazioneComponent } from '../application/pages/bollorepertoriazione.component';
import { RichiestaEmissioneComponent } from '../application/pages/richiestaemissione.component';
import { EmissioneComponent } from '../application/pages/emissione.component';
import { PagamentoComponent } from '../application/pages/pagamento.component';
import { InvioRichiestaPagamentoComponent } from '../application/pages/inviorichiestapagamento.component';

const externalLoginUrlProvider = new InjectionToken('externalUrlRedirectResolver');

const routes: Routes = [
  //nota: se si usa il redirect vengono persi i parametri nell'url redirectTo: '/home'
  { path: '', component: BlankComponent }, 
  { path: 'externallogin', 
    resolve: {
      url: externalLoginUrlProvider,
    },
    canActivate: [externalLoginUrlProvider],
    component: NotFoundComponent,
  },
  { path: 'home',  component: FullComponent, 
    canActivate: [LoginActivate],      
    children:[
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
        path: 'convenzioni',  component: ConvenzioniComponent,  canActivate:[NgxPermissionsGuard],
        data: {
          title: 'Ricerca convenzioni',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca convenzioni' }
          ],
          //permessi 
          // permissions: {
          //   only: ['user'],          
          //   redirectTo: ['home/dashboard/dashboard1'],
          // }
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
          title: 'Completamento sottoscrizione controfirma UniUrb',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Completamento sottoscrizione controfirma UniUrb' }
          ]
        },
      },
      {
        path: 'firmadirettore', component: FirmaDirettoreComponent, canActivate:[AuthGuard],
        data: {
          title: 'Completamento sottoscrizione controfirma UniUrb',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Completamento sottoscrizione controfirma UniUrb' }
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

      {
        path: 'bollorepertoriazione/:id', component: BolloRepertoriazioneComponent, canActivate:[AuthGuard], pathMatch:'full',
        data: {
          title: 'Repertoriare convenzione firmata e bollatta',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Repertoriare convenzione firmata e bollatta' }
          ]
        },
      },
      {
        path: 'bollorepertoriazione', component: BolloRepertoriazioneComponent, canActivate:[AuthGuard],
        data: {
          title: 'Repertoriare convenzione firmata e bollatta',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Repertoriare convenzione firmata e bollatta' }
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
      { 
        path: 'struttureesterne',  component: StruttureEsterneTitulus, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca strutture esterne',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca strutture esterne' }
          ]
        }
      },
      { 
        path: 'documenti',  component: DocumentiTitulus, canActivate:[AuthGuard], 
        data: {
          title: 'Ricerca documenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca documenti' }
          ]
        }
      },
      { 
        path: 'classificazioni/new',  component: ClassificazioneComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Nuovo codice di classificazione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuovo codice di classificazione' }
          ]
        } 
      }, 
      { 
        path: 'classificazioni/:id',  component: ClassificazioneComponent,  canActivate:[AuthGuard],
        data: {
          title: 'Classificazione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Classificazione' }
          ]
        } 
      }, 
      { 
        path: 'classificazioni',  component: ClassificazioniComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Classificazione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca classificazione' }
          ]
        }
      }, 
      { 
        path: 'mappinguffici',  component: MappingUfficiTitulus,  canActivate:[AuthGuard], 
        data: {
          title: 'Mapping uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca associazione uffici' }
          ]
        }
      }, 
      { 
        path: 'mappinguffici/:id',  component: MappingUfficioTitulus,  canActivate:[AuthGuard], 
        data: {
          title: 'Mapping uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca mapping uffici' }
          ]
        }
      }, 
      { 
        path: 'mappinguffici/new',  component: MappingUfficioTitulus,  canActivate:[AuthGuard], 
        data: {
          title: 'Nuova associazione uffici',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova associazione uffici' }
          ]
        }
      }, 

      //scadenze
      { 
        path: 'scadenze',  component: ScadenzeComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Scadenze pagamenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Ricerca scadenze pagamenti' }
          ]
        }
      }, 
      { 
        path: 'scadenze/:id',  component: ScadenzaComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Scadenza pagamenti',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Scadenza pagamenti' }
          ]
        }
      }, 
      { 
        path: 'scadenze/new',  component: ScadenzaComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Nuova scadenza pagamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Nuova scadenza pagamento' }
          ]
        }
      }, 
      { 
        path: 'richiestaemissione',  component: RichiestaEmissioneComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Richiesta emissione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Richiesta emissione' }
          ]
        }
      },
      { 
        path: 'richiestaemissione/:id',  component: RichiestaEmissioneComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Richiesta emissione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Richiesta emissione' }
          ]
        }
      },
      { 
        path: 'richiestaemissione',  component: EmissioneComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Richiesta emissione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Richiesta emissione' }
          ]
        }
      },
      { 
        path: 'inviorichiestapagamento',  component: InvioRichiestaPagamentoComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Invio richiesta di pagamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Invio richiesta di pagamento' }
          ]
        }
      },    
      { 
        path: 'inviorichiestapagamento/:id',  component: InvioRichiestaPagamentoComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Invio richiesta di pagamento',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Invio richiesta di pagamento' }
          ]
        }
      },      
      { 
        path: 'emissione/:id',  component: EmissioneComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Emissione',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Emissione' }
          ]
        }
      },
      { 
        path: 'pagamento/:id',  component: PagamentoComponent,  canActivate:[AuthGuard], 
        data: {
          title: 'Registrazione prelievo',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Registrazione prelievo' }
          ]
        }
      },
     

      { path: 'test',  component: TestTabComponent,  canActivate:[AuthGuard] },     
  ]}, 
  { path: '**', component: NotFoundComponent }
];



@NgModule({
  providers: [
    {
        provide: externalLoginUrlProvider,
        useValue: (route: ActivatedRouteSnapshot) => {
            //const externalUrl = route.paramMap.get('externalUrl');
            window.open(environment.API_URL + 'api/loginSaml', '_self');
        },
    },
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
