import { NgModule } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }         from '@angular/forms';
import { FormsModule }         from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-modal';
import { ClipboardModule }  from 'ngx-clipboard';
import { TooltipModule } from 'ng2-bootstrap/tooltip';
import { OrderPipe, SearchPipe, MomentPipe } from './pipes';
import {
  UserIconComponent,
  UserPanelComponent,
  ErrorModalComponent,
  AlertModalComponent } from './components';
import { AutofocusDirective } from './directives/autofocus.directive';
import { EqualValidatorDirective } from './directives/equal-validator.directive';
import { ChangePasswordComponent } from './components/change-password.component';
import { UserFormComponent } from './components/user-form.component';
import { UserDocumentsViewComponent } from './components/user-documents-view.component';
import { GroupFormComponent } from './components/group-form.component';
import { UsersModalComponent } from './components/users-modal.component';

const COMPONENTS = [
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
    UserFormComponent,
    UserDocumentsViewComponent,
    GroupFormComponent,
    UsersModalComponent
];

const PIPES = [
    MomentPipe,
    OrderPipe,
    SearchPipe
];

const DIRECTIVES = [
    AutofocusDirective,
    EqualValidatorDirective
];
// TODO check used modules. HttpModule seems not to be used
const MODULES = [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    BrowserModule,
    ModalModule,
    ClipboardModule,
    HttpModule
];

@NgModule({
    imports: [
        TooltipModule.forRoot(), // TODO it is necessary??
        ...MODULES],
    declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
    exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES, ...MODULES]
})

export class ShareModule {

}
