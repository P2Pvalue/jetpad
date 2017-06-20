import { NgModule, APP_INITIALIZER } from '@angular/core';

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
  swellServiceInitializerFactory,
  SessionService,
  ObjectService,
  EditorService,
  CommentService
} from './services';

import { LoggedUserGuard } from './guards';
import { ShareModule } from '../share';

const CORE_PROVIDERS = [
  AppState,
  BackendService,
  DocumentService, // TODO: deprecated
  ListenerService, // TODO: deprecated
  UserService, // TODO: deprecated
  LoggedUserGuard,
  JetpadModalService,
  SwellService,
  SessionService,
  ObjectService,
  EditorService,
  CommentService,
  {
    provide: APP_INITIALIZER,
    useFactory: swellServiceInitializerFactory,
    deps: [SwellService],
    multi: true
  }
];

@NgModule({
  declarations: [ModalPlaceholderComponent],
  exports: [ModalPlaceholderComponent],
  imports: [ShareModule],
  providers: CORE_PROVIDERS
})

export class CoreModule {

}
