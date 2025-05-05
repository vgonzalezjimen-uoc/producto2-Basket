import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./player-list/player-list.component').then(m => m.PlayerListComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./player-form/player-form.component').then(m => m.PlayerFormComponent)
  },
  {
    path: 'edit/nuevo',
    loadComponent: () =>
      import('./player-form/player-form.component').then(m => m.PlayerFormComponent)
  }  
];
