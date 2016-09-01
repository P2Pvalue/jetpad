import {Injectable, Inject} from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import {SwellRTService} from "./swellrt.service";

@Injectable()
export class UserService {

  user: any;
  currentUser = new Subject<any>();
  userLogged = new Subject<any>();
  userRegistered = new Subject<any>();
  userUpdated = new Subject<any>();

  constructor(@Inject('DEFAULT_AVATAR_URL') private defaultAvatarUrl: string,
              private swellrt: SwellRTService) {
    this.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  getUser() {
    return this.user;
  }

  loggedUser() {
    return this.user && !this.user.anonymous;
  }

  resume() {
    this.swellrt.resume().then(user => {
      let user = this.parseUserResponse(user);
      this.currentUser.next(user);
    });
  }

  login(user: string, password: string) {
    this.swellrt.login(user + this.swellrt.domain, password).then(user => {
      let user = this.parseUserResponse(user);
      this.currentUser.next(user);
      this.userLogged.next(user);
    });
  }

  create(user: string, password: string) {
    this.swellrt.createUser(user, password).then(() => {
      return this.swellrt.login(user, password);
    }).then(user => {
      let user = this.parseUserResponse(user);
      this.currentUser.next(user);
      this.userRegistered.next(user);
    });
  }

  update(email: string, avatar: string) {
    this.swellrt.updateUser(email, avatar).then(user => {
      let user = this.parseUserResponse(user);
      this.userUpdated.next(user);
    });
  }

  logout() {
    this.swellrt.logout().then(user => {
      let user = this.parseUserResponse(user);
      this.currentUser.next(user);
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    this.swellrt.changePassword(this.user.name + this.swellrt.domain, oldPassword, newPassword).then(user => {
      let user = this.parseUserResponse(user);
      this.userUpdated.next(user);
    });
  }

  recoverPassword(email: string) {
    this.swellrt.recoverPassword(email).then(user => {
      let user = this.parseUserResponse(user);
      this.userUpdated.next(user);
    });
  }

  parseUserResponse(user) {
    let name = user.name;
    if ( /_anonymous_/.test(user.id)) {
      name = 'Anonymous';
    }
    return  {
      id: user.id,
      name: name ? name : user.id.slice(0, user.id.indexOf('@')),
      anonymous: name === "Anonymous",
      avatarUrl: user.avatarUrl ? user.avatarUrl : this.defaultAvatarUrl
    }
  }
}
