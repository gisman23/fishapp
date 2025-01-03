import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'camera',
        loadComponent: () =>
          import('../camera/camera.page').then((m) => m.CameraPage),
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('../logs/logs.page').then((m) => m.LogsPage),
      },
      {
        path: 'map',
        loadComponent: () =>
          import('../map/map.page').then((m) => m.MapPage),
      },
      {
        path: '',
        redirectTo: '/tabs/camera',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/camera',
    pathMatch: 'full',
  },
];
