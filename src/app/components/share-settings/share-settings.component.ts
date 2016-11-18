import {Component, ElementRef, ViewChild, Renderer, Inject} from '@angular/core';
import { UserService } from "../../services";
import {Router} from "@angular/router";
import {DocumentService} from "../../services/document.service";


@Component({
    selector: 'share-settings',
    template: `
        <button #shareSettingsButton [disabled]="!documentUrl" class="btn btn-primary btn-with-icon" (click)="shareSettings.open()">
          <i class="icon icon-lock icon-middle"></i>Share
        </button>
        <modal #shareSettings>
          <modal-header>
            <h4 *ngIf="currentDocument && currentDocument.properties.created">New public document</h4>
            <h4 *ngIf="currentDocument && !currentDocument.properties.created">Share settings</h4>
          </modal-header>
          <modal-content>
            <div *ngIf="currentDocument && currentDocument.properties.created">
              <h5>Name of the document</h5>
              <p class="text-box name">{{ documentName }}</p>
            </div>
            <h5 class="lateral-menu-title">Link to share</h5>
            <p class="text-box share-link">{{ documentUrl }}</p>
            <br>
            <div class="col-xs-12 no-padding" *ngIf="currentUser && !currentUser.anonymous && !anonymousDocument">
              <div class="col-xs-4 no-padding">
                <h5 class="muted">Public document: </h5>
              </div>
              <div class="col-xs-8 no-padding">
                <div class="switch">
                  <ui-switch size="small" [(ngModel)]="publicDocument" (change)="changeDocumentVisibility()"></ui-switch>
                </div>
              </div>
            </div>
            <div class="participants-container col-xs-12" *ngIf="currentUser && !currentUser.anonymous && !anonymousDocument">
              <div *ngFor="let participant of participants; let first = first" class="col-xs-12 participant">
                 <div class="icon col-xs-1 no-padding">
                  <app-user-icon [user]="participant"></app-user-icon>
                 </div>
                 <div class="name col-xs-8">
                  <span [ngClass]="{'bold': first}">{{participant.name}}</span>
                 </div>
                 <div *ngIf="!first" class="muted remove-participant-label col-xs-2 no-padding">
                    Participant
                 </div>
                 <div *ngIf="!first" class="remove-participant-icon col-xs-1 no-padding">
                  <i (click)="deleteParticipant(participant.id)" class="icon icon-close icon-middle cursor-pointer"></i> 
                 </div>
              </div>
              <div class="col-xs-12 no-padding mar-top-30">         
                <p>Invite people</p>
                <input [(ngModel)]="usersInvited">
              </div>
            </div>
          </modal-content>
          <modal-footer>
          <!-- Not Logged In user -->
            <!-- TODO: Today, all documents created by an anonymous user are public forever
            <div  *ngIf="currentDocument && currentDocument.properties.created">
              <h5 class="muted">If you want to make private this document you must <a (click)="goToAuthenticationScreen()">login</a> or <a (click)="goToAuthenticationScreen()">register</a>.</h5>
            </div>
            -->
            <div *ngIf="currentUser && currentUser.anonymous && !anonymousDocument && publicDocument">
              <h5 class="muted">If you want to make private this document you must login or register.</h5>
              <button class="btn btn-primary btn-icon" (click)="goToAuthenticationScreen()"><i class="icon icon-lock"></i>login</button>
              <button class="btn btn-primary btn-icon" (click)="goToAuthenticationScreen()"><i class="icon icon-user"></i>register</button>
            </div>
            <button *ngIf="(currentUser && !currentUser.anonymous) || anonymousDocument || !publicDocument" class="btn btn-primary" (click)="updateDocumentProperties(); shareSettings.close()">READY!</button>
          </modal-footer>
        </modal>
        `
  })

export class ShareSettingsComponent {

  // The logged in user
  currentUser: any;
  currentDocument: any;
  documentId: any;
  documentUrl: any;
  documentName: any;
  publicDocument: any;
  anonymousDocument = true;
  participants = [];
  usersInvited: string;
  updateParticipants = true;

  @ViewChild('shareSettingsButton') shareSettingsButton: ElementRef;

  constructor(private documentService: DocumentService, private userService: UserService,
              private renderer: Renderer, private router: Router,
              @Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string) {
    this.currentUser = userService.getUser();
    documentService.currentDocument.subscribe(document => {
      this.documentUrl = this.documentService.getDocumentUrl(document.id());
      this.documentName = this.documentService.getEditorId(document.id());
      this.currentDocument = document;
      this.publicDocument = this.documentService.publicDocument();
      this.anonymousDocument = this.documentService.anonymousDocument();

      if(!this.currentUser.anonymous) {
        var participantEmails = this.currentDocument.getParticipants();
        userService.getUserProfiles(participantEmails).then(users => {
            this.setNames(users);
            this.participants = users;
        });
        documentService.myDocuments.subscribe(myDocument => {
            if(myDocument.editorId === this.documentName) {
              if(this.updateParticipants) {
                this.participants = myDocument.participants.slice();
                this.participants.unshift(myDocument.author);
                this.setNames(this.participants);
              } else {
                this.updateParticipants = true;
              }
            }
        });
      }
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
    if(this.usersInvited) {
      this.usersInvited.split(",").forEach(user => {
        let userWithDomain = user.trim();
        if(!userWithDomain.endsWith("@" + this.SWELLRT_DOMAIN)) {
          userWithDomain = userWithDomain.concat("@" + this.SWELLRT_DOMAIN);
        }
        this.documentService.addParticipant(userWithDomain);
      });
      this.usersInvited = '';
    }
  }

  deleteParticipant(id) {
    this.updateParticipants = false;
    this.documentService.removeParticipant(id);
    this.participants =  this.participants.filter(function(participant) {
      return participant.id !== id;
    });
  }

  setNames(users) {
    users.forEach(function (user) {
      user.name = user.name ? user.name : user.id.slice(0, user.id.indexOf('@'))
    });
  }

}
