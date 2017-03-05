import { NgModule } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }         from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-modal';
import { ClipboardModule }  from 'ngx-clipboard';
import { CarouselModule } from 'ng2-bootstrap/carousel';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { OrderPipe, SearchPipe } from './pipes';
import {
  ProfileComponent,
  UserIconComponent,
  UserPanelComponent,
  JetpadModalHeader,
  JetpadModalContent,
  JetpadModalFooter,
  JetpadModalComponent,
  ErrorModalComponent,
  AlertModalComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    OrderPipe,
    SearchPipe,
    ProfileComponent,
    UserIconComponent,
    UserPanelComponent,
    JetpadModalHeader,
    JetpadModalContent,
    JetpadModalFooter,
    JetpadModalComponent,
    ErrorModalComponent,
    AlertModalComponent
  ],
  exports: [
    OrderPipe,
    SearchPipe,
    ProfileComponent,
    UserIconComponent,
    UserPanelComponent,
    JetpadModalHeader,
    JetpadModalContent,
    JetpadModalFooter,
    JetpadModalComponent,
    ErrorModalComponent,
    AlertModalComponent,
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpModule,
    ModalModule,
    ClipboardModule
  ]
})

export class ShareModule {

}
