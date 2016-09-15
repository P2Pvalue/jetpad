import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { UserService } from "./user.service";

declare let SwellRT: any;

@Injectable()
export class DocumentService {

  document: any;
  currentDocument = new Subject<any>();
  myDocuments = new Subject<any>();

  query = {};

  constructor(@Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string,
              @Inject('JETPAD_URL') private JETPAD_URL: string,
              private userService: UserService) {
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

  getUserDocuments(user: any) {
    if(!user.anonymous) {
      this.query = {
        _query : { participants: { $eq: user.id /*,  $not: "^@"*/ }},
        _projection: { wave_id: 1, participants: 1, 'root.doc-title' : 1, 'root.doc.lastmodtime' : 1 }
      };
      SwellRT.query(this.query, documents => this.myDocuments.next(this.parseDocuments(documents.result)), error => {});
    }
  }

  parseDocuments(myDocuments) {
    return myDocuments.map(document => {
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
        'participants': participants,
        'editorId': this.getEditorId(document.wave_id)
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
        this.currentDocument.next(document);
        this.document = document;
        resolve(document);
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
