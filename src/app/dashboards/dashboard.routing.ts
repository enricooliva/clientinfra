import { Routes } from '@angular/router';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { AuthGuard } from '../core/auth.guard';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard1',
        component: Dashboard1Component,
        canActivate:[AuthGuard],
        data: {
          title: 'Dashboard',
          urls: [
            { title: 'Home', url: '/home' },
            { title: 'Dashboard' }
          ]
        }
      },     
    ]
  }
];
