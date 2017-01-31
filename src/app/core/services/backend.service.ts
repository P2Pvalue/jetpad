import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class BackendService {

  // swellrt's service interface
  service: Promise<any>;

  bind(service: Promise<any>) {
      this.service = service;
  }


  resume() {
    return this.service.then( s => {
      s.resume({})
        .then( user => {
          console.log("Session resumed "+ user.toString());
          // trigger event for new user logged in
        })
        .catch( error => {
          // swallow resume error
          console.log("No resumable session");
        });
    });
  }

}
