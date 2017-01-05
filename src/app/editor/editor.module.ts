import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ModalModule } from "ng2-modal";
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import { ShareButtonsModule } from "ng2-sharebuttons";
import { UiSwitchModule } from 'angular2-ui-switch';
import { EditorRoutingModule } from './editor-routing.module'

import {EditorComponent} from './components/canvas/editor-canvas.component';
import {InlineAssessment} from './components/inline-assessment/inline-assessment.component';
import {CommentAssessment} from './components/inline-assessment/comment-assessment.component';
import {EditorOutline} from './components/outline/outline.component';
import { UserIconComponent } from "./../core/components/user-icon";
import { ShareSettingsComponent } from "./../core/components/share-settings";


@NgModule({
  declarations: [
    EditorComponent,
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
