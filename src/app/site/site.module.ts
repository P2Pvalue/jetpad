import { NgModule } from '@angular/core';
import { ShareModule } from '../share';
import { SiteRoutingModule } from './site-routing.module';

import { SiteComponent } from './site.component';
import { LandingComponent } from './components/landing';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';
import { SiteHeaderComponent } from './components/site-header';
import { SiteFooterComponent } from './components/site-footer';
import { ProfileComponent } from './components/profile';
import { TermsComponent } from './components/terms';
import { VisionComponent } from './components/vision';
import { UnauthorizedComponent } from './components/unauthorized';
import { NoContent } from './components/no-content';

@NgModule({
  declarations: [
    SiteComponent,
    SiteHeaderComponent,
    SiteFooterComponent,
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    TermsComponent,
    VisionComponent,
    UnauthorizedComponent,
    NoContent
  ],
  imports: [
    SiteRoutingModule,
    ShareModule
  ]
})

export class SiteModule { }
