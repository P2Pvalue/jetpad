import { NgModule } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }         from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ModalModule } from "ng2-modal";
import { UiSwitchModule } from 'angular2-ui-switch';
import { ClipboardModule }  from 'angular2-clipboard';
import { CarouselModule } from 'ng2-bootstrap/components/carousel';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
//import { ShareButtonsModule } from "ng2-sharebuttons";
import { OrderPipe, SearchPipe } from "./pipes";
import { ProfileComponent, UserIconComponent, UserPanelComponent } from './components'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TooltipModule,
    RouterModule
  ],
  declarations: [
    OrderPipe,
    SearchPipe,
    ProfileComponent,
    UserIconComponent,
    UserPanelComponent
  ],
  exports: [
    OrderPipe,
    SearchPipe,
    ProfileComponent,
    UserIconComponent,
    UserPanelComponent,
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpModule,
    ModalModule,
    UiSwitchModule,
    ClipboardModule,
    CarouselModule,
    TooltipModule,
  ]
})

export class ShareModule {

}
