import { RouteInfo } from "../shared/sidebar/sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: '',
    title: 'Dashboard',
    icon: 'icon-Car-Wheel',
    class: 'has-arrow',
    permissions: ['ADMIN'],
    extralink: false,
    submenu: [
      {
        path: 'dashboard/dashboard1',
        title: 'Dashboard',
        icon: '',
        class: '',
        permissions: ['ADMIN'],
        extralink: false,
        submenu: []
      },
    ],
  },
  {
    path: '',
    title: 'Gestione',
    icon: 'icon-Paint-Brush',
    class: 'has-arrow',
    extralink: false,
    permissions: [],
    submenu: [
      {
        path: 'users',
        title: 'Utenti',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'],
      },
      {
        path: 'roles',
        title: 'Ruoli',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'],
      },
      {
        path: 'permissions',
        title: 'Permessi',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'], 
      },     
      {
        path: 'tipopagamenti',
        title: 'Tipo pagamenti',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'], 
      },     
      {
        path: 'tasks',
        title: 'Attività',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'], 
      }, 
    ]
  },
  {
    path: '',
    title: 'Funzionali',
    icon: 'mdi mdi-notification-clear-all',
    class: 'has-arrow',
    extralink: false,
    permissions: [], 
    submenu: [    
      {
        path: 'convenzioni',
        title: 'Riceca convenzioni',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'],
      },
      {
        path: 'multistep-schematipo',
        title: 'Nuova convenzione',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'],
      },
    ]
  }
];
