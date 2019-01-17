import { RouteInfo } from "../shared/sidebar/sidebar.metadata";

// {title: 'Gestione', links: [
//   { href: 'users', text: 'Utenti', permissions: ['ADMIN'] },
//   { href: 'roles', text: 'Ruoli', permissions: ['ADMIN'] },
//   { href: 'permissions', text: 'Permessi', permissions: ['ADMIN'] },
//   { href: 'tipopagamenti', text: 'Tipo pagamenti', permissions: ['ADMIN'] },
// ]},    
// {title: 'Funzionali', links: [
//   { href: 'convenzione', text: 'Convenzione', permissions: ['ADMIN', 'USER'] },
//   { href: 'convenzioni', text: 'Lista convenzioni', permissions: ['ADMIN'] },
//   { href: 'allegati', text: 'Lista allegati', permissions: ['ADMIN'] },
//   { href: 'multistep-schematipo', text: 'Inserimento convenzione', permissions: ['ADMIN'] },
//   { href: 'test', text: 'Multi step form', permissions: ['ADMIN'] },
// ]}    


export const ROUTES: RouteInfo[] = [
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
        path: 'convenzione',
        title: 'Convenzione',
        icon: '',
        class: '',
        extralink: false,
        submenu: [],
        permissions: ['ADMIN'],
      },
      {
        path: 'convenzioni',
        title: 'Convenzioni',
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
