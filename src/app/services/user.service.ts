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
    let that = this;
    this.session = new Promise<any>(function(resolve, reject) {
      SwellRT.resume(function (res) {
        if (res.error) {
          let id = that.DEFAULT_USERNAME;
          let password = that.DEFAULT_PASSWORD;
          SwellRT.login({id, password}, function (res) {
            if (res.error) {
              reject(res.error);
            } else if (res.data) {
              let user = that.parseUserResponse(res.data);
              that.currentUser.next(user);
              resolve(user);
            }
          });
        } else if (res.data) {
          let user = that.parseUserResponse(res.data);
          that.currentUser.next(user);
          resolve(user);
        }
      });
    });
  }

  anonymousLogin() {
    let that = this;
    let id = this.DEFAULT_USERNAME;
    let password = this.DEFAULT_PASSWORD;
    SwellRT.login({id, password}, function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data) {
        that.currentUser.next(that.parseUserResponse(res.data));
      }
    });
  }

  login(id: string, password: string) {
    let that = this;
    id = this.generateDomainId(id);
    SwellRT.login({id, password}, function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data) {
        let user = that.parseUserResponse(res.data);
        that.currentUser.next(user);
        that.userLogged.next(user);
      }
    });
  }

  create(id: string, password: string) {
    let that = this;
    id = this.generateDomainId(id);
    SwellRT.createUser({id, password}, function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data) {
        that.login(id, password);
      }
    });
  };

  update(email: string, name: string, avatarData: string) {
    let that = this;
    SwellRT.updateUserProfile({email, name, avatarData}, function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data) {
        let user = that.parseUserResponse(res.data);
        that.currentUser.next(user);
        that.userUpdated.next(user);
      }
    });
  }

  logout() {
    let that = this;
    SwellRT.logout(function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data.status == "SESSION_CLOSED") {
        that.anonymousLogin();
      }
    });
  }

  changePassword(oldPassword: string, newPassword: string) {
    let that = this;
    SwellRT.setPassword(this.user.id, oldPassword, newPassword, function () {
      that.userUpdated.next(that.user);
    }, function (error) {
      // ERROR
    });
  }

  recoverPassword(email: string) {
    let that = this;
    SwellRT.recoverPassword(email, this.RECOVER_PASSWORD_URL, function () {
      that.userUpdated.next(that.user);
    }, function (error) {
      // ERROR
    });
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
