import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';

import { App } from './app.component';

import { HeaderComponent } from "./components/header";
import { LoginComponent } from "./components/login";
import { ProfileComponent } from "./components/profile";
import { RegisterComponent } from "./components/register";
import { AuthenticationComponent } from "./components/authentication";
import { UserPanelComponent } from "./components/user-panel";
import { LandingComponent } from './components/landing';
import { EditorComponent } from './components/editor';
import { FooterComponent } from "./components/footer";
import { TermsComponent } from "./components/terms";
import { VisionComponent } from "./components/vision";
import { NoContent } from './components/no-content';
import { UnauthorizedComponent } from "./components/unauthorized";
import { ShareSettingsComponent } from "./components/share-settings";
import { UserIconComponent } from "./components/user-icon";
import { EditorOutline } from "./components/editor/outline.component";
import { InlineAssessment } from "./components/inline-assessment/inline-assessment.component";
import { CommentAssessment } from "./components/inline-assessment/comment-assessment.component";

import { DocumentService, ListenerService, UserService } from "./services";
import { LoggedUserGuard } from "./guards";
import { SessionResolver } from "./resolver";
import { OrderPipe, SearchPipe } from "./pipes";

import { AppState } from "./app.service";

import { DROPDOWN_DIRECTIVES } from "ng2-dropdown";

import { ModalModule } from "ng2-modal";
import { UiSwitchModule } from 'angular2-ui-switch';
import { ClipboardModule }  from 'angular2-clipboard';
import { CarouselModule } from 'ng2-bootstrap/components/carousel';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import {ShareButtonsModule} from "ng2-sharebuttons";

// New layout
import { _SiteComponent } from "./components/_site";
import { _SiteHeaderComponent } from "./components/_site-header";
import { _SiteFooterComponent } from "./components/_site-footer";
import { _LandingComponent } from "./components/_landing";
import { _EditorComponent } from "./components/_editor";

const APP_PROVIDERS = [
  AppState,
  DocumentService,
  ListenerService,
  UserService,
  SessionResolver,
  LoggedUserGuard
];

@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    HeaderComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    AuthenticationComponent,
    UserPanelComponent,
    LandingComponent,
    EditorComponent,
    FooterComponent,
    TermsComponent,
    VisionComponent,
    ShareSettingsComponent,
    NoContent,
    UnauthorizedComponent,
    UserIconComponent,
    OrderPipe,
    SearchPipe,
    InlineAssessment,
    CommentAssessment,
    EditorOutline,

    // New layout
    _SiteComponent,
    _SiteHeaderComponent,
    _SiteFooterComponent,
    _LandingComponent,
    _EditorComponent,

    DROPDOWN_DIRECTIVES
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    ModalModule,
    UiSwitchModule,
    ClipboardModule,
    CarouselModule,
    TooltipModule,
    RouterModule.forRoot(ROUTES),
    ShareButtonsModule
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
