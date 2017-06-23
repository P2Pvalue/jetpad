import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SiteComponent } from './site.component';
import { LandingComponent } from './pages/landing';
import { LoginComponent } from './pages/login';
import { RegisterComponent } from './pages/register';
import { ProfileComponent } from './pages/profile';
import { TermsComponent } from './pages/terms';
import { VisionComponent } from './pages/vision';
import { UnauthorizedComponent } from './pages/unauthorized';

import { LoggedUserGuard } from '../core/guards';
import { NoContentComponent } from './pages/no-content/no-content';
import { MyDocumentsComponent } from './pages/my-documents/my-documents.component';

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
                canActivate: [LoggedUserGuard]
            },
            {
                path: 'documents',
                component: MyDocumentsComponent,
                canActivate: [LoggedUserGuard]
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
                component: NoContentComponent
            }
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

export class SiteRoutingModule {
}
