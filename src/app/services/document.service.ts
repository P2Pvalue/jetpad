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
    SwellRT.query("{}", function (documents) { that.myDocuments.next(documents.result); }, function (error) {
      // ERROR
    });
  }

  open(id: string) {
    let that = this;
    if (id.indexOf('/') === -1) {
      id = this.SWELLRT_DOMAIN + '/' + id;
    }
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
    SwellRT.close(this.currentDocument.id());
  }
}
