import { NgModule } from '@angular/core';

import { BackendService, DocumentService, ListenerService, UserService, AppState } from "./services";
import { LoggedUserGuard } from "./guards";
import { SessionResolver } from "./resolver";
import { ShareModule } from '../share';

const CORE_PROVIDERS = [
  AppState,
  BackendService,
  DocumentService, // deprecated
  ListenerService, // deprecated
  UserService, // deprecated
  SessionResolver,
  LoggedUserGuard
];

@NgModule({
  declarations: [],
  exports: [],
  imports: [ShareModule],
  providers: CORE_PROVIDERS
})

export class CoreModule {

}
