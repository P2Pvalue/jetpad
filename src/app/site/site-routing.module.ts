import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SiteComponent } from './site.component';
import { LandingComponent } from './components/landing';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';
import { ProfileComponent } from './components/profile';
import { TermsComponent } from './components/terms';
import { VisionComponent } from './components/vision';
import { UnauthorizedComponent } from './components/unauthorized';

import { LoggedUserGuard } from '../core/guards';

const siteRoutes: Routes = [
  {
    path: '',
    component: SiteComponent,
    children: [
      {
        path: '',
        component: LandingComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [ LoggedUserGuard ]
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
      }/*,

      {
        path: '**',
        component: NoContentComponent
      }*/
    ]

  }
];

@NgModule({
  imports: [
    RouterModule.forChild(siteRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class SiteRoutingModule { }
