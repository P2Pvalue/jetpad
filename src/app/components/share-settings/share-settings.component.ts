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
            <h4 *ngIf="currentDocument && currentDocument.properties.created">New public document</h4>
            <h4 *ngIf="currentDocument && !currentDocument.properties.created">Share settings</h4>
          </modal-header>
          <modal-content>
            <div *ngIf="currentDocument && currentDocument.properties.created">
              <h5>Name of de document</h5>
              <p class="text-box name">{{ documentName }}</p>
            </div>
            <h5 class="lateral-menu-title">Link to share</h5>
            <p class="text-box share-link">{{ documentUrl }}</p>
            <br>
            <div class="col-xs-12 no-padding" *ngIf="currentUser && !currentUser.anonymous && !anonymousDocument">
                <div class="col-xs-4 no-padding">
                  <h5 class="muted">Make public this document</h5>
                </div>
                <div class="col-xs-8 no-padding">
                  <div class="switch">
                    <ui-switch size="small" [(ngModel)]="publicDocument" (change)="changeDocumentVisibility()"></ui-switch>
                  </div>
                </div>
              </div>
          </modal-content>
          <modal-footer>
          <!-- Not Logged In user -->
            <div  *ngIf="currentDocument && currentDocument.properties.created">
              <h5 class="muted">If you want to make private this document you must <a (click)="goToAuthenticationScreen()">login</a> or <a (click)="goToAuthenticationScreen()">register</a>.</h5>
            </div>
            <button class="btn btn-primary" (click)="updateDocumentProperties(); shareSettings.close()">READY!</button>
          </modal-footer>
        </modal>
        `
  })

export class ShareSettingsComponent {

  // The logged in user
  currentUser: any;
  currentDocument: any;
  documentUrl: any;
  documentName: any;
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
      this.documentName = this.documentService.getEditorId(document.id());
      if(this.currentDocument.properties.created) {
        setTimeout(() => {
          this.renderer.invokeElementMethod(this.shareSettingsButton.nativeElement, 'click', []);
        }, 0);
      }
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

  updateDocumentProperties() {
    this.currentDocument.properties.created = false;
  }

}
