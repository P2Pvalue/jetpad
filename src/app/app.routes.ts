import { Routes } from '@angular/router';

import { LandingComponent } from './components/landing';
import { _LandingComponent } from './components/_landing';
import { ProfileComponent } from "./components/profile";
import { EditorComponent } from './components/editor';
import { _EditorComponent } from './components/_editor';
import { TermsComponent } from "./components/terms";
import { VisionComponent } from "./components/vision";
import { NoContent } from './components/no-content';
import { AuthenticationComponent } from "./components/authentication";
import { UnauthorizedComponent } from "./components/unauthorized";
import { LoginComponent } from "./components/login";
import { RegisterComponent } from "./components/register";

// New site layout (all prefixed with _)
import { _SiteComponent } from "./components/_site";

import { LoggedUserGuard } from "./guards";

import { SessionResolver } from "./resolver";



export const ROUTES: Routes = [

  {
    path: '',
     //component: _LandingComponent
    component: _SiteComponent,
    children: [
      {
        path: '',
        component: _LandingComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [ LoggedUserGuard ]
  },

  {
    path: 'edit/:id',
    component: _EditorComponent,
    resolve: {
      session: SessionResolver
    }
  },

  {
    path: 'terms',
    component: TermsComponent
  },

  {
    path: 'vision',
    component: VisionComponent
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
