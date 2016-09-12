import { Component, ViewContainerRef } from '@angular/core';
import { UserService } from "../../services";
import {Router} from "@angular/router";

@Component({
    selector: 'share-settings',
    template: `
                <button class="btn btn-info btn-lg" (click)="myModal.open()">Share</button>
                <modal #myModal>
                  <modal-header>
                    <h4>Share settings</h4>
                  </modal-header>
                  <modal-content>
                    Hello Modal!
                  </modal-content>
                  <modal-footer>
                  </modal-footer>
                </modal>`
  })

export class ShareSettingsComponent {

  // The logged in user
  currentUser: any;

  constructor(private userService: UserService, private router: Router) {
    userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }
}
