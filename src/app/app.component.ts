import { Component } from '@angular/core';
import { PlayerListComponent } from './player-list/player-list.component';
import { PlayerFormComponent } from './player-form/player-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PlayerListComponent, PlayerFormComponent],
  template: `
    <app-player-form></app-player-form>
    <hr>
    <app-player-list></app-player-list>
  `
})
export class AppComponent {}
