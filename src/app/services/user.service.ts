import { Injectable, OnInit } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { User } from "../shared";

import {SwellRTService} from "./swellrt.service";

@Injectable()
export class UserService {

  constructor(private swellrt: SwellRTService) {}

  userLogged = new Subject<User>();

  resume(loginIfError: boolean) {
    this.swellrt.resume(loginIfError).then(user => {
      this.userLogged.next(user);
    });
  }

  login(user: string, password: string) {
    this.swellrt.login(user + this.swellrt.domain, password).then(user => {
        this.userLogged.next(user);
    });
  }

  create(user: string, password: string) {
    this.swellrt.createUser(user, password).then(() => {
      return this.swellrt.login(user, password);
    }).then(user => {
      this.userLogged.next(user);
    });
  }

  logout() {
    this.swellrt.logout(true).then(user => this.userLogged.next(user));
  }
}
