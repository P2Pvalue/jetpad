import { NgModule } from '@angular/core';
import { EditorRoutingModule } from './editor-routing.module';

import { EditorCanvasComponent } from './components/canvas';
import { EditorHeaderComponent } from './components/header';
import { EditorToolbarComponent } from './components/toolbar';
import { InlineAssessment } from './components/inline-assessment/inline-assessment.component';
import { CommentAssessment } from './components/inline-assessment/comment-assessment.component';
import { EditorOutlineComponent } from './components/outline';
import { EditorMenuComponent } from './components/menu';
import { ShareModule } from '../share';
import { CoreModule } from '../core';
import { EditorComponent } from './editor.component';
import { LinkModalComponent } from './components/link-modal/link-modal.component';




@NgModule({
  declarations: [
    EditorComponent,
    EditorHeaderComponent,
    EditorCanvasComponent,
    EditorToolbarComponent,
    LinkModalComponent,

    EditorOutlineComponent,
    EditorMenuComponent,
    InlineAssessment,
    CommentAssessment
  ],
  imports: [
    EditorRoutingModule,
    ShareModule,
    CoreModule
  ]
})

export class EditorModule { }
