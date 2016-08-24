import { Routes } from '@angular/router';

import { LandingComponent } from './landing';
import { UserSpaceComponent } from './user-space';
import { EditorComponent } from './editor';
import { NoContent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [

  { path: '',
    component: LandingComponent },

  {
    path: 'user',
    component: UserSpaceComponent
  },

  {
    path: 'edit/:id',
    component: EditorComponent
  },

  { path: '**',
    component: NoContent },

];
