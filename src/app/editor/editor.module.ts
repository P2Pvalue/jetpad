import { NgModule } from '@angular/core';
import { EditorRoutingModule } from './editor-routing.module'

import { EditorCanvasComponent } from './components/canvas';
import { EditorHeaderComponent } from './components/header';
import { EditorToolbarComponent } from './components/toolbar';
import { InlineAssessment } from './components/inline-assessment/inline-assessment.component';
import { CommentAssessment } from './components/inline-assessment/comment-assessment.component';
import { EditorOutlineComponent } from './components/outline';
import { ShareModule } from '../share';
import { CoreModule } from '../core';
import { EditorComponent } from './editor.component';




@NgModule({
  declarations: [
    EditorComponent,
    EditorHeaderComponent,
    EditorCanvasComponent,
    EditorToolbarComponent,
    EditorOutlineComponent,
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
