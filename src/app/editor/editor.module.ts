import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ModalModule } from "ng2-modal";
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import { ShareButtonsModule } from "ng2-sharebuttons";
import { UiSwitchModule } from 'angular2-ui-switch';
import { EditorRoutingModule } from './editor-routing.module'

import {EditorCanvasComponent} from './components/canvas';
import {EditorHeaderComponent} from './components/header';
import {EditorToolbarComponent} from './components/toolbar';
import {InlineAssessment} from './components/inline-assessment/inline-assessment.component';
import {CommentAssessment} from './components/inline-assessment/comment-assessment.component';
import {EditorOutline} from './components/outline/outline.component';
import { UserIconComponent } from "./../core/components/user-icon";
import { ShareSettingsComponent } from "./../core/components/share-settings";
import {EditorComponent} from './editor.component'


@NgModule({
  declarations: [
    EditorComponent,
    EditorHeaderComponent,
    EditorCanvasComponent,
    EditorToolbarComponent,
    UserIconComponent,
    ShareSettingsComponent,
    EditorOutline,
    InlineAssessment,
    CommentAssessment
  ],
  imports: [
    EditorRoutingModule,
    BrowserModule,
    FormsModule,
    TooltipModule,
    ModalModule,
    ShareButtonsModule,
    UiSwitchModule
  ]
})

export class EditorModule { }
