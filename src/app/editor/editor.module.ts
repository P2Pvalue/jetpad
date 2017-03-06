import { NgModule, ErrorHandler } from '@angular/core';
import { EditorRoutingModule } from './editor-routing.module';

import { EditorCanvasComponent } from './components/canvas';
import { EditorHeaderComponent } from './components/header';
import { EditorToolbarComponent } from './components/toolbar';
import { EditorOutlineComponent } from './components/outline';
import { EditorMenuComponent, MyCustomModalComponent, ParticipantsModalComponent } from './components/menu';
import { ShareModule } from '../share';
import { CoreModule } from '../core';
import { EditorComponent } from './editor.component';
import { LinkModalComponent } from './components/link-modal/link-modal.component';
import { SelectionMenuComponent } from './components/selection-menu/selection-menu.component';
import { LinkMenuComponent } from './components/link-menu/link-menu.component';
import { EditorErrorHandler } from './editor.errorhandler';

@NgModule({
  declarations: [
    EditorComponent,
    EditorHeaderComponent,
    EditorCanvasComponent,
    EditorToolbarComponent,
    LinkModalComponent,
    SelectionMenuComponent,
    LinkMenuComponent,
    MyCustomModalComponent,
    ParticipantsModalComponent,
    EditorOutlineComponent,
    EditorMenuComponent
    ],
  imports: [
    EditorRoutingModule,
    ShareModule,
    CoreModule
  ],
  providers: [
    { provide: ErrorHandler, useClass: EditorErrorHandler }
  ]
})

export class EditorModule { }
