import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/tabs-page/tabs-page.routes').then((m) => m.routes),
  },
];
