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
