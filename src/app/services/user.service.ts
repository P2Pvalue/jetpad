import { Injectable, Inject } from "@angular/core";
import { Subject } from "rxjs/Subject";

declare let SwellRT: any;

@Injectable()
export class UserService {

  user: any;
  currentUser = new Subject<any>();
  userLogged = new Subject<any>();
  userUpdated = new Subject<any>();

  session: Promise<any>;

  constructor(@Inject('SWELLRT_DOMAIN') private SWELLRT_DOMAIN: string,
              @Inject('DEFAULT_USERNAME') private DEFAULT_USERNAME: string,
              @Inject('DEFAULT_PASSWORD') private DEFAULT_PASSWORD: string,
              @Inject('DEFAULT_AVATAR_URL') private DEFAULT_AVATAR_URL: string,
              @Inject('RECOVER_PASSWORD_URL') private RECOVER_PASSWORD_URL: string) {
    this.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  generateDomainId(id: string) {
    return id + '@' + this.SWELLRT_DOMAIN;
  }

  getUser() {
    return this.user;
  }

  loggedUser() {
    return this.user && !this.user.anonymous;
  }

  getSession() {
    return this.session;
  }

  resume() {
    this.session = new Promise<any>((resolve, reject) => {
      SwellRT.resume(result => {
        if (result.error) {
          let id = this.DEFAULT_USERNAME;
          let password = this.DEFAULT_PASSWORD;
          SwellRT.login({id, password}, result => {
            if (result.error) {
              reject(result.error);
            } else if (result.data) {
              let user = this.parseUserResponse(result.data);
              this.currentUser.next(user);
              resolve(user);
            }
          });
        } else if (result.data) {
          let user = this.parseUserResponse(result.data);
          this.currentUser.next(user);
          resolve(user);
        }
      });
    });
  }

  anonymousLogin() {
    let id = this.DEFAULT_USERNAME;
    let password = this.DEFAULT_PASSWORD;
    SwellRT.login({id, password}, result => {
      if (result.error) {
        // ERROR
      } else if (result.data) {
        this.currentUser.next(this.parseUserResponse(result.data));
      }
    });
  }

  login(id: string, password: string) {
    id = this.generateDomainId(id);
    SwellRT.login({id, password}, result => {
      if (result.error) {
        // ERROR
      } else if (result.data) {
        let user = this.parseUserResponse(result.data);
        this.currentUser.next(user);
        this.userLogged.next(user);
      }
    });
  }

  create(id: string, password: string) {
    id = this.generateDomainId(id);
    SwellRT.createUser({id, password}, result => {
      if (result.error) {
        // ERROR
      } else if (result.data) {
        this.login(id, password);
      }
    });
  };

  update(email: string, name: string, avatarData: string) {
    SwellRT.updateUserProfile({email, name, avatarData}, result => {
      if (result.error) {
        // ERROR
      } else if (result.data) {
        let user = this.parseUserResponse(result.data);
        this.currentUser.next(user);
        this.userUpdated.next(user);
      }
    });
  }

  logout() {
    SwellRT.logout(result => {
      if (result.error) {
        // ERROR
      } else if (result.data.status == "SESSION_CLOSED") {
        this.anonymousLogin();
      }
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    SwellRT.setPassword(this.user.id, oldPassword, newPassword, () => this.userUpdated.next(this.user), error => {});
  }

  recoverPassword(email: string) {
    SwellRT.recoverPassword(email, this.RECOVER_PASSWORD_URL, () => this.userUpdated.next(this.user), error => {});
  }

  parseUserResponse(user) {
    let name = user.name;
    if (/_anonymous_/.test(user.id)) {
      name = 'Anonymous';
    }
    return {
      id: user.id,
      email: user.email,
      name: name ? name : user.id.slice(0, user.id.indexOf('@')),
      anonymous: name === "Anonymous",
      avatarUrl: user.avatarUrl ? user.avatarUrl : this.DEFAULT_AVATAR_URL
    }
  }
}
