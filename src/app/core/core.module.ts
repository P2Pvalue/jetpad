import { NgModule, APP_INITIALIZER } from '@angular/core';

import {
  AppState,
  JetpadModalService,
  ModalPlaceholderComponent,
  // New
  SwellService,
  swellServiceInitializerFactory,
  SessionService,
  ObjectService,
  EditorService,
  CommentsService,
    UserService,
    DocumentService
} from './services';

import { LoggedUserGuard } from './guards';
import { ShareModule } from '../share';
import { UserResolve } from './resolver/user.resolver';
import { sessionServiceInitializerFactory } from './services/session.service';

const CORE_PROVIDERS = [
  AppState,
  LoggedUserGuard,
  JetpadModalService,
  SwellService,
  SessionService,
  ObjectService,
  EditorService,
  CommentsService,
    UserService,
    DocumentService,
    UserResolve,
  {
    provide: APP_INITIALIZER,
    useFactory: swellServiceInitializerFactory,
    deps: [SwellService],
    multi: true
  },
  {
    provide: APP_INITIALIZER,
    useFactory: sessionServiceInitializerFactory,
    deps: [SessionService, SwellService],
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
