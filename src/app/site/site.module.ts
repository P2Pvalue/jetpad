import { NgModule } from '@angular/core';
import { ShareModule } from '../share';
import { SiteRoutingModule } from './site-routing.module';

import { SiteComponent } from './site.component';
import { LandingComponent } from './pages/landing';
import { LoginComponent } from './pages/login';
import { RegisterComponent } from './pages/register';
import { SiteHeaderComponent } from './components/site-header';
import { SiteFooterComponent } from './components/site-footer';
import { ProfileComponent } from './pages/profile';
import { TermsComponent } from './pages/terms';
import { VisionComponent } from './pages/vision';
import { UnauthorizedComponent } from './pages/unauthorized';
import { NoContentComponent } from './pages/no-content';
import { MyDocumentsComponent } from './pages/my-documents/my-documents.component';
import { MyGroupsComponent } from './pages/my-groups/my-groups.component';

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
        MyDocumentsComponent,
        MyGroupsComponent,
        NoContentComponent
    ],
    imports: [
        SiteRoutingModule,
        ShareModule
    ]
})

export class SiteModule {
}
