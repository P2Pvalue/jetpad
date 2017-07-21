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
  CommentService,
    UserService,
    DocumentService
} from './services';

import { LoggedUserGuard } from './guards';
import { ShareModule } from '../share';
import { UserResolve } from './resolver/user.resolver';
import { sessionServiceInitializerFactory } from './services/x-session.service';

const CORE_PROVIDERS = [
  AppState,
  LoggedUserGuard,
  JetpadModalService,
  SwellService,
  SessionService,
  ObjectService,
  EditorService,
  CommentService,
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
    deps: [SessionService],
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
