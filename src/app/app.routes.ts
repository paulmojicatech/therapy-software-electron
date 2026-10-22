import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'schedule' },
  {
    path: 'schedule',
    title: 'Schedule · Therapy Software',
    loadComponent: () => import('./schedule/schedule').then((m) => m.Schedule),
  },
  {
    path: 'clients/:id',
    title: 'Client · Therapy Software',
    loadComponent: () =>
      import('./clients/client-detail/client-detail').then((m) => m.ClientDetail),
  },
  { path: '**', redirectTo: 'schedule' },
];
