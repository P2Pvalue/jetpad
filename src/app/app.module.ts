import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';

import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';

import { HeaderComponent } from "./header";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { AuthenticationComponent } from "./authentication";
import { UserPanelComponent } from "./user-panel";
import { LandingComponent } from './landing';
import { UserSpaceComponent } from './user-space';
import { EditorComponent } from './editor';
import { FooterComponent } from "./footer";
import { NoContent } from './no-content';

import {AppState} from "./app.service";
import {SwellRTService, UserService} from "./services";

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  SwellRTService,
  UserService
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    AuthenticationComponent,
    UserPanelComponent,
    LandingComponent,
    UserSpaceComponent,
    EditorComponent,
    FooterComponent,
    NoContent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
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
