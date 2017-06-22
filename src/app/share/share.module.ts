import { NgModule } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }         from '@angular/forms';
import { FormsModule }         from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-modal';
import { ClipboardModule }  from 'ngx-clipboard';
import { CarouselModule } from 'ng2-bootstrap/carousel';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { OrderPipe, SearchPipe, MomentPipe } from './pipes';
import {
  ProfileComponent,
  UserIconComponent,
  UserPanelComponent,
  ErrorModalComponent,
  AlertModalComponent } from './components';
import { AutofocusDirective } from './directives/autofocus.directive';
import { EqualValidatorDirective } from './directives/equal-validator.directive';

@NgModule({
  imports: [
    CommonModule,
      ReactiveFormsModule,
      FormsModule,
    RouterModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    OrderPipe,
    SearchPipe,
    MomentPipe,
    ProfileComponent,
    UserIconComponent,
    UserPanelComponent,
    ErrorModalComponent,
    AlertModalComponent,
      AutofocusDirective,
      EqualValidatorDirective
  ],
  exports: [
    OrderPipe,
    SearchPipe,
    MomentPipe,
    ProfileComponent,
    UserIconComponent,
    UserPanelComponent,
    ErrorModalComponent,
    AlertModalComponent,
    CommonModule,
      ReactiveFormsModule,
      FormsModule,
    BrowserModule,
    HttpModule,
    ModalModule,
    ClipboardModule,
      AutofocusDirective,
      EqualValidatorDirective
  ]
})

export class ShareModule {

}
