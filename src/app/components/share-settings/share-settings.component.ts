import {Component, ElementRef, ViewChild, Renderer} from '@angular/core';
import { UserService } from "../../services";
import {Router} from "@angular/router";
import {DocumentService} from "../../services/document.service";


@Component({
    selector: 'share-settings',
    template: `
        <button #shareSettingsButton [disabled]="!documentUrl" class="btn btn-info btn-lg" (click)="shareSettings.open()">Share</button>
        <modal #shareSettings>
          <modal-header>
            <h4>Share settings</h4>
          </modal-header>
          <modal-content>
            <h5 class="lateral-menu-title">Link to share</h5>
            <p class="share-link">{{ documentUrl }}</p>
            <br>
            <div *ngIf="currentUser && !currentUser.anonymous && !anonymousDocument">
              <div class="col-md-4">
                <h5 class="lateral-menu-title">Make public this document</h5>
              </div>
              <div class="col-md-8">
                <ui-switch size="small" [(ngModel)]="publicDocument" (change)="changeDocumentVisibility()"></ui-switch>
              </div>
            </div>
          </modal-content>
          <modal-footer>
          <!-- Not Logged In user -->
            <div  *ngIf="!currentUser || currentUser.anonymous">
              <h5 class="muted">If you want to make private this document you must <a (click)="goToAuthenticationScreen()">login</a> or <a (click)="goToAuthenticationScreen()">register</a>.</h5>
            </div>
            <button class="btn btn-primary">READY!</button>
          </modal-footer>
        </modal>
        `
  })

export class ShareSettingsComponent {

  // The logged in user
  currentUser: any;
  currentDocument: any;
  documentUrl: any;
  publicDocument: any;
  anonymousDocument = true;

  @ViewChild('shareSettingsButton') shareSettingsButton: ElementRef;

  constructor(private documentService: DocumentService, private userService: UserService,
              private renderer: Renderer, private router: Router) {
    this.currentUser = userService.getUser();
    documentService.currentDocument.subscribe(document => {
      this.currentDocument = document;
      if(!this.currentUser.anonymous) {
        this.publicDocument = this.documentService.publicDocument();
        this.anonymousDocument = this.documentService.anonymousDocument();
      }
      this.documentUrl = this.documentService.getDocumentUrl(document.id());
      setTimeout(() => { this.pressShareSettingsButton(); }, 0);
    });
  }

  changeDocumentVisibility() {
    if(this.publicDocument) {
      this.documentService.makeDocumentPrivate();
    } else {
      this.documentService.makeDocumentPublic();
    }
    this.publicDocument = this.publicDocument ? false : true;
  }

  goToAuthenticationScreen() {
    this.router.navigate(['authentication']);
  }

  pressShareSettingsButton() {
    let event = new MouseEvent('click', {bubbles: true});
    this.renderer.invokeElementMethod(this.shareSettingsButton.nativeElement, 'click', []);
  }

}
