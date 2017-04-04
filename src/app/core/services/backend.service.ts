import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

declare let swellrt: any;

@Injectable()
export class BackendService {

  // swellrt's service interface
  service: Promise<any>;

  // the current logged in user
  session: Promise<any>;

  bind(service: Promise<any>) {
      this.service = service;
  }

  get() {
    return this.service;
  }

  startUserSession(id: string, password: string) {
    //
  }

  startDefaultSession() {

    this.session =
      this.service
        .then( s => { return s.resume({}); })
        .then( u => {
            // TODO trigger event
            console.log("Session resumed for user "+ u.toString());
            return u;
          })
        .catch( e => {
            console.log("No resumable session");
            return this.startAnonymousSession();
        });

    return this.session;

  }


  private startAnonymousSession() {

    return this.service
      .then( s => {
        return s.login({
          id : swellrt.Service.ANONYMOUS_USER_ID,
          password : ""
        });
      })
      .then( u => {
        console.log("Anonymous session started");
        return u;
      })
      .catch( e => {
        console.log("Anonymous session couldn't be started: "+ e.toString());
        throw e;
      });

  }


  open(id: string) {
    console.log("Opening document "+id);
    // No need to cache swellrt objects in this service,
    // swellrt client keeps registry of open objects,
    // i.e. opening same object several times returns the same reference.

    // We get the session first to ensure login call is completed
    // then resolve service promise just to get the reference!
    return this.session
    .then( u => { return this.service; })
    .then( s => { return s.open({ id: id }); });
  }


  close(id: string)  {
    console.log("Closing document "+id);
    this.service
      .then( s => { return s.close(id); });
  }

  static initDocObject(doc: any, docid: string) {


    let title = doc.get("title");
    let text = doc.get("text");

    let isNew = !title || !text;

    if (!title) {
      doc.put("title", BackendService.docIdToTitle(docid));
    }

    if (!text) {
      doc.put("text", swellrt.Text.create(""));
    }

    if (isNew) {
      doc.setPublic(true);
    }

    // init comments
    let comments = doc.get("comments");

    if (!comments) {
      doc.put("comments", swellrt.Map.create());      
    }

  }

  static docNameToId(name: string) {

  }

  static docIdToTitle(id: string) {
    let s = id.replace('-',' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

}
