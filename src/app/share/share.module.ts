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
  UserIconComponent,
  UserPanelComponent,
  ErrorModalComponent,
  AlertModalComponent } from './components';
import { AutofocusDirective } from './directives/autofocus.directive';
import { EqualValidatorDirective } from './directives/equal-validator.directive';
import { ChangePasswordComponent } from './components/profile/change-password.component';
import { UserFormComponent } from './components/profile/user-form.component';

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
    UserIconComponent,
    UserPanelComponent,
    ErrorModalComponent,
    AlertModalComponent,
      ChangePasswordComponent,
      AutofocusDirective,
      EqualValidatorDirective,
      UserFormComponent
  ],
  exports: [
    OrderPipe,
    SearchPipe,
    MomentPipe,
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
      EqualValidatorDirective,
      ChangePasswordComponent,
      UserFormComponent
  ]
})

export class ShareModule {

}
