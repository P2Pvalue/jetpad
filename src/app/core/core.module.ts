import { NgModule } from '@angular/core';

import {
  BackendService,
  DocumentService,
  ListenerService,
  UserService,
  AppState,
  JetpadModalService,
  ModalPlaceholderComponent,
  // New
  SwellService,
  SessionService
} from './services';

import { LoggedUserGuard } from './guards';
import { ShareModule } from '../share';


const CORE_PROVIDERS = [
  AppState,
  BackendService,
  DocumentService, // deprecated
  ListenerService, // deprecated
  UserService, // deprecated
  LoggedUserGuard,
  JetpadModalService,
  SwellService,
  SessionService
];

@NgModule({
  declarations: [ModalPlaceholderComponent],
  exports: [ModalPlaceholderComponent],
  imports: [ShareModule],
  providers: CORE_PROVIDERS
})

export class CoreModule {

}
