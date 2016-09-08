import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { UserService } from "./user.service";

declare let SwellRT: any;

@Injectable()
export class DocumentService {

  currentDocument: any;
  myDocuments = new Subject<any>();

  constructor(@Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string, private userService: UserService) {
    userService.currentUser.subscribe(user => { if(!user.anonymous) this.getMyDocuments(); });
  }

  static editor(parentElementId, widgets, annotations) {
    return SwellRT.editor(parentElementId, widgets, annotations);
  }

  getMyDocuments() {
    SwellRT.query("{}", documents => this.myDocuments.next(this.parseDocuments(documents.result)), error => {});
  }

  parseDocuments(myDocuments) {
    return myDocuments.filter(document => document.root['doc-title'] && !document.root['doc-title'].startsWith('New')
      && !document.root.doc.author.startsWith('_anonymous_')).map(document => {
      let modification;
      let date = new Date(document.root.doc.lastmodtime);
      if(date.toDateString() == new Date().toDateString()) {
        modification = ('0' + date.getHours()).slice(-2)   + ':' + ('0' + date.getMinutes()).slice(-2);
      } else {
        modification = date.getDate() + " " + date.toUTCString().split(' ')[2];
      }
      let participants = document.participants.filter(participant => !participant.startsWith('@'))
        .map(participant => participant.split('@')[0]);
      if(participants.length > 3) {
        participants = participants.slice(0, 3).join(', ').concat('...');
      }
      return {
        'id': document.wave_id,
        'title': document.root["doc-title"],
        'author': document.root.doc.author,
        'modification': modification,
        'participants': participants
      }
    });
  }

  open(id: string) {
    this.close();
    id = this.SWELLRT_DOMAIN + '/' + id;
    return new Promise<any>((resolve, reject) => {
      SwellRT.open({id}, document => {
        if (!document || document.error) {
          reject(document ? document.error : null);
        }
        this.currentDocument = document;
        resolve(document);
      });
    });
  }

  close() {
    if(this.currentDocument) {
      SwellRT.close(this.currentDocument.id());
      this.currentDocument = undefined;
    }
  }
}
