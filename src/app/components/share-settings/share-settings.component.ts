import { Component, ViewContainerRef } from '@angular/core';
import { UserService } from "../../services";
import {Router} from "@angular/router";
import {Overlay} from "angular2-modal";
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
    selector: 'share-settings',
    template: `<button type="button" class="btn btn-info btn-lg" (click)="openModal()">Open Modal</button>`
  })

export class ShareSettingsComponent {

  // The logged in user
  currentUser: any;

  constructor(private userService: UserService, private router: Router,
              overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
    userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['./']);
  }

  openModal() {
    this.modal.alert()
      .size('lg')
      .showClose(true)
      .title('Share settings')
      .body(`
            <h4>Alert is a classic (title/body/footer) 1 button modal window that 
            does not block.</h4>
            <b>Configuration:</b>
            <ul>
                <li>Non blocking (click anywhere outside to dismiss)</li>
                <li>Size large</li>
                <li>Dismissed with default keyboard key (ESC)</li>
                <li>Close wth button click</li>
                <li>HTML content</li>
            </ul>`)
      .open();
  }
}
