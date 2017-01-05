import { NgModule } from '@angular/core';

import { DocumentService, ListenerService, UserService, AppState } from "./services";
import { LoggedUserGuard } from "./guards";
import { SessionResolver } from "./resolver";
import { OrderPipe, SearchPipe } from "./pipes";

const CORE_PROVIDERS = [
  AppState,
  DocumentService,
  ListenerService,
  UserService,
  SessionResolver,
  LoggedUserGuard
];

@NgModule({
  declarations: [
    OrderPipe,
    SearchPipe
  ],
  exports: [
    OrderPipe,
    SearchPipe
  ],
  imports: [],
  providers: CORE_PROVIDERS
})

export class CoreModule {

}
