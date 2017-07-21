import {
    NgModule,
    ApplicationRef
} from '@angular/core';
import {
    removeNgStyles,
    createNewHosts,
    createInputTransfer
} from '@angularclass/hmr';
import {
    RouterModule,
    Router
} from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
/*
 * App Modules
 */
import { CoreModule } from './core';
import { ShareModule } from './share';
import { SiteModule } from './site';
import { EditorModule } from './editor';

import { AppComponent } from './app.component';
import { AppState, InternalStateType } from './core/services/app.service';

/** Playground component for refactoring process  */
import  { CheckComponent } from './check.component';
import { SessionService } from './core/services/x-session.service';
import { UserService } from './core/services/user.service';

// Application wide providers
const APP_PROVIDERS = [
    ...APP_RESOLVER_PROVIDERS,
    AppState
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        CheckComponent
    ],
    imports: [ // import Angular's modules
        RouterModule.forRoot(ROUTES),
        CoreModule,
        ShareModule,
        EditorModule,
        SiteModule
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS
    ]
})

export class AppModule {

    constructor(public appRef: ApplicationRef,
                public appState: AppState,
                private sessionService: SessionService,
                private userService: UserService,
                private router: Router) {
    }

    public hmrOnInit(store: StoreType) {
        console.log('[HMR] hmrOnInit');
        if (!store || !store.state) {
            return;
        }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }
        this.userService.setUser(this.appState.get('user'));
        if (window.location.pathname !== this.appState.get('location')) {
            this.router.navigate([this.appState.get('location')]);
        }
        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;

    }

    public hmrOnDestroy(store: StoreType) {
        console.log('[HMR] hmrOnDestroy');
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // save state
        this.appState.set('user', this.sessionService.getSession());
        this.appState.set('location', window.location.pathname);

        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}
