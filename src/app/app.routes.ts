import { Routes } from '@angular/router';

import { LandingComponent } from './components/landing';
import { ProfileComponent } from "./components/profile";
import { EditorComponent } from './components/editor';
import { TermsComponent } from "./components/terms";
import { NoContent } from './components/no-content';
import { AuthenticationComponent } from "./components/authentication";
import { UnauthorizedComponent } from "./components/unauthorized";

import { LoggedUserGuard } from "./guards";

import { SessionResolver } from "./resolver";

export const ROUTES: Routes = [

  {
    path: '',
    component: LandingComponent
  },

  {
    path: 'authentication',
    component: AuthenticationComponent
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ LoggedUserGuard ]
  },

  {
    path: 'edit/:id',
    component: EditorComponent,
    resolve: {
      session: SessionResolver
    }
  },

  {
    path: 'terms',
    component: TermsComponent
  },

  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },

  {
    path: '**',
    component: NoContent
  },

];
