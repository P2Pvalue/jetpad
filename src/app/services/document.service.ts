import {Injectable, Inject} from "@angular/core";

declare let SwellRT: any;

@Injectable()
export class DocumentService {

  document: any;

  constructor(@Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string) {}

  static editor(parentElementId, widgets, annotations) {
    return SwellRT.editor(parentElementId, widgets, annotations);
  }

  open(id: string) {
    let that = this;
    id = this.SWELLRT_DOMAIN + '/' + id;
    return new Promise<any>(function (resolve, reject) {
      SwellRT.open({id}, function (object) {
        if (!object || object.error) {
          reject(object ? object.error : null);
        }
        that.document = object;
        resolve(object);
      });
    });
  }

  close() {
    SwellRT.close(this.document.id());
  }
}
