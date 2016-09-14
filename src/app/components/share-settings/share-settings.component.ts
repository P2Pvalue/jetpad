import {Component, ViewContainerRef, Inject} from '@angular/core';
import { UserService } from "../../services";
import {Router} from "@angular/router";
import {DocumentService} from "../../services/document.service";

@Component({
    selector: 'share-settings',
    template: `
        <button class="btn btn-info btn-lg" (click)="shareSettings.open()">Share</button>
        <modal #shareSettings>
          <modal-header>
            <h4>Share settings</h4>
          </modal-header>
          <modal-content>
            <h5 class="lateral-menu-title">Link to share</h5>
            <p class="share-link">{{ documentUrl }}</p>
            <br>
            <div class="media" *ngIf="currentUser && !currentUser.anonymous">
              <h5 class="lateral-menu-title">Make public this document</h5>
            </div>
            <!-- Not Logged In user -->
            <div  *ngIf="!currentUser || currentUser.anonymous">
              <h5 class="lateral-menu-title">If you want to make private this document you must login</h5>
              <div class="col-md-3 col-md-offset-3">
                <button type="button" class="btn btn-default lateral-menu-button" (click)="goToAuthenticationScreen() ">Login</button>
              </div>
              <div class="col-md-3 col-md-offset-1">
                <button type="button" class="btn btn-default lateral-menu-button" (click)="goToAuthenticationScreen() ">Register</button>
              </div>
            </div>
          </modal-content>
          <modal-footer>
          </modal-footer>
        </modal>
        `
  })

export class ShareSettingsComponent {

  // The logged in user
  currentUser: any;
  currentDocument: any;
  documentUrl: any;

  constructor(@Inject('JETPAD_URL') private JETPAD_URL: string, private documentService: DocumentService,
              private userService: UserService, private router: Router) {
    this.currentUser = userService.getUser();
    documentService.currentDocument.subscribe(document => {
      let id = document.id();
      this.currentDocument = document;
      this.documentUrl = JETPAD_URL + '/#/edit/' + id.substr(id.indexOf('/') + 1);
    });
  }

  goToAuthenticationScreen() {
    this.router.navigate(['authentication']);
  }
}
