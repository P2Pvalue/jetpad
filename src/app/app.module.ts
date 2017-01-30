import { NgModule, ApplicationRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';

import { CoreModule } from './core'
import { ShareModule } from './share';
import { SiteModule } from './site'
import { EditorModule } from './editor'

import { App } from './app.component';

import { AppState } from "./app.service";

import { DROPDOWN_DIRECTIVES } from "ng2-dropdown";

@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    DROPDOWN_DIRECTIVES
  ],
  imports: [ // import Angular's modules
    RouterModule.forRoot(ROUTES),
    CoreModule,
    ShareModule,
    SiteModule,
    EditorModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    AppState
  ]
})

export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}
  hmrOnInit(store) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    this.appState.state = store.state;
    delete store.state;
  }
  hmrOnDestroy(store) {
    var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.state = this.appState.state;
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
