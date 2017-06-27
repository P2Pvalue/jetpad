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
import { MyGroupsComponent } from './pages/my-groups/my-groups.component';
import { UserResolve } from '../core/resolver/user.resolver';

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
                canActivate: [LoggedUserGuard],
                resolve: {
                    user: UserResolve
                }
            },
            {
                path: 'documents',
                component: MyDocumentsComponent,
                canActivate: [LoggedUserGuard],
                resolve: {
                    user: UserResolve
                }
            },
            {
                path: 'groups',
                component: MyGroupsComponent,
                canActivate: [LoggedUserGuard],
                resolve: {
                    user: UserResolve
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
