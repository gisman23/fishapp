import { Routes } from '@angular/router';
import { TabsPageComponent } from './tabs-page.component'

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPageComponent,
    children: [
      {
        path: 'map',
        loadComponent: () =>
          import('../map/map-page.component').then((m) => m.MapPageComponent),
      },
      {
        path: 'logs',
        loadComponent: () =>
          import('../logs/logs-page.component').then((m) => m.LogsPageComponent),
      },
      {
        path: 'camera',
        loadComponent: () =>
          import('../camera/camera-page.component').then((m) => m.CameraPageComponent),
      },
      {
        path: '',
        redirectTo: '/tabs/map',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/map',
    pathMatch: 'full',
  },
];
