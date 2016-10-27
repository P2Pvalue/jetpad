import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { UserService } from "./user.service";
import {Router} from "@angular/router";

declare let SwellRT: any;

@Injectable()
export class DocumentService {

  document: any;
  currentDocument = new Subject<any>();
  myDocuments = new Subject<any>();

  ANONYMOUS_DOCUMENT_PARTICIPANT = "_anonymous_@" + this.SWELLRT_DOMAIN;
  PUBLIC_DOCUMENT_PARTICIPANT = "@" + this.SWELLRT_DOMAIN;
  ANONYMOUS_PARTICIPANT = "_anonymous_";

  query = {};

  constructor(@Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string,
              @Inject('JETPAD_URL') private JETPAD_URL: string,
              private userService: UserService,
              private router: Router) {
    userService.currentUser.subscribe(user => this.getUserDocuments(user));
  }

  static editor(parentElementId, widgets, annotations) {
    return SwellRT.editor(parentElementId, widgets, annotations);
  }

  getDocumentUrl(waveId: any) {
    return this.JETPAD_URL + '/#/edit/' + this.getEditorId(waveId);
  }

  getEditorId(waveId: any) {
    return waveId.substr(waveId.indexOf('/') + 1);
  }

  userHasPermission() {
    return this.document.getParticipants().includes(this.PUBLIC_DOCUMENT_PARTICIPANT) ||
           this.document.getParticipants().includes(this.userService.getUser().id)
  }

  publicDocument() {
    return this.document.getParticipants().includes(this.PUBLIC_DOCUMENT_PARTICIPANT)
  }

  anonymousDocument() {
    return this.document.getParticipants().includes(this.ANONYMOUS_DOCUMENT_PARTICIPANT)
  }

  newAnonymousDocument() {
    return this.document.getParticipants().length == 1 && this.document.getParticipants()[0].startsWith(this.ANONYMOUS_PARTICIPANT)
  }

  makeDocumentAnonymous() {
    this.document.addParticipant(this.ANONYMOUS_DOCUMENT_PARTICIPANT);
    this.makeDocumentPublic()
  }

  addParticipant(participant: string) {
    this.document.addParticipant(participant)
  }

  removeParticipant(participant: string) {
    this.document.removeParticipant(participant)
  }

  makeDocumentPublic() {
    this.addParticipant(this.PUBLIC_DOCUMENT_PARTICIPANT)
  }

  makeDocumentPrivate() {
    this.removeParticipant(this.PUBLIC_DOCUMENT_PARTICIPANT)
  }

  getUserDocuments(user: any) {
    if(!user.anonymous) {
      this.query = {
        _query : { participants: { $eq: user.id,  $ne: this.ANONYMOUS_DOCUMENT_PARTICIPANT }},
       _projection: { wave_id: 1, participants: 1, 'root.doc-title' : 1, 'root.doc.lastmodtime' : 1, 'root.doc.author' : 1 }
      };
      SwellRT.query(this.query, documents => this.parseDocuments(documents.result), error => {});
    }
  }

  parseDocuments(myDocuments) {
    let that = this;
    return myDocuments.map(document => {
      let modification;
      let date = new Date(document.root.doc.lastmodtime);
      if(date.toDateString() == new Date().toDateString()) {
        modification = ('0' + date.getHours()).slice(-2)   + ':' + ('0' + date.getMinutes()).slice(-2);
      } else {
        modification = date.getDate() + " " + date.toUTCString().split(' ')[2];
      }
      let author;
      return this.userService.getUserProfiles([document.root.doc.author]).then(function(authorProfile) {
        if(authorProfile.length) {
          author = authorProfile[0];
        }
        let participants = document.participants.filter(participant => !participant.startsWith('@') && !participant.startsWith('_anonymous_'));
        return that.userService.getUserProfiles(participants);
      }).then(function (participantProfiles) {
        let parsedDocument = {
          id: document.wave_id,
          title: document.root["doc-title"],
          author: author,
          modification: modification,
          participants: participantProfiles,
          editorId: that.getEditorId(document.wave_id),
          documentUrl: that.getDocumentUrl(document.wave_id)
        };
        that.myDocuments.next(parsedDocument);
      });
    });
  }

  open(id: string) {
    this.close();
    id = this.SWELLRT_DOMAIN + '/' + id;
    return new Promise<any>((resolve, reject) => {
      SwellRT.open({id}, document => {
        if (!document || document.error) {
          reject(document ? document.error : null);
        } else {
          this.document = document;
          if(this.userHasPermission()) {
            if(this.newAnonymousDocument()) {
              this.makeDocumentAnonymous()
            }
            this.currentDocument.next(document);
            resolve(document);
          } else {
            this.router.navigate(['unauthorized']);
          }
        }
      });
    });
  }

  close() {
    if(this.document) {
      SwellRT.close(this.document.id());
      this.document = undefined;
    }
  }
}
