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
    let that = this;
    SwellRT.query("{}", function (documents) {
      var notEmptyDocuments = [];
      //TODO: Temporal, remove empty documents
      documents.result.forEach(function (document) {
        if(document.root["doc-title"]) {
          notEmptyDocuments.push(document);
        }
      });
      that.myDocuments.next(notEmptyDocuments);
    }, function (error) {
      // ERROR
    });
  }

  open(id: string) {
    this.close();
    let that = this;
    id = this.SWELLRT_DOMAIN + '/' + id;
    return new Promise<any>(function (resolve, reject) {
      SwellRT.open({id}, function (document) {
        if (!document || document.error) {
          reject(document ? document.error : null);
        }
        that.currentDocument = document;
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
