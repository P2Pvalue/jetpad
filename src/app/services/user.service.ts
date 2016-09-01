import {Injectable, Inject} from "@angular/core";
import {Subject} from "rxjs/Subject";

declare let SwellRT: any;

@Injectable()
export class UserService {

  user: any;
  currentUser = new Subject<any>();
  userLogged = new Subject<any>();
  userRegistered = new Subject<any>();
  userUpdated = new Subject<any>();

  constructor(@Inject('DEFAULT_USERNAME') private DEFAULT_USERNAME: string,
              @Inject('DEFAULT_PASSWORD') private DEFAULT_PASSWORD: string,
              @Inject('DEFAULT_AVATAR_URL') private DEFAULT_AVATAR_URL: string,
              @Inject('RECOVER_PASSWORD_URL') private RECOVER_PASSWORD_URL: string) {
    this.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  static generateDomainId(id: string) {
    return id + '@' + SwellRT.domain();
  }

  getUser() {
    return this.user;
  }

  loggedUser() {
    return this.user && !this.user.anonymous;
  }

  resume() {
    let that = this;
    SwellRT.resume(function (res) {
      if (res.error) {
        that.login(that.DEFAULT_USERNAME, that.DEFAULT_PASSWORD);
      } else if (res.data) {
        that.currentUser.next(that.parseUserResponse(res.data));
      }
    });
  }

  login(id: string, password: string) {
    let that = this;
    id = UserService.generateDomainId(id);
    SwellRT.login({id, password}, function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data) {
        let parsedUser = that.parseUserResponse(res.data);
        that.currentUser.next(parsedUser);
        that.userLogged.next(parsedUser);
      }
    });
  }

  create(id: string, password: string) {
    let that = this;
    id = UserService.generateDomainId(id);
    SwellRT.createUser({id, password}, function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data) {
        that.userRegistered.next(that.parseUserResponse(res.data));
        that.login(that.DEFAULT_USERNAME, that.DEFAULT_PASSWORD);
      }
    });
  };

  update(email: string, avatarData: string) {
    let that = this;
    SwellRT.updateUserProfile({email, avatarData}, function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data) {
        that.userUpdated.next(that.parseUserResponse(res.data));
      }
    });
  }

  logout() {
    let that = this;
    SwellRT.logout(function (res) {
      if (res.error) {
        // ERROR
      } else if (res.data.status == "SESSION_CLOSED") {
        that.login(that.DEFAULT_USERNAME, that.DEFAULT_PASSWORD);
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
      name: name ? name : user.id.slice(0, user.id.indexOf('@')),
      anonymous: name === "Anonymous",
      avatarUrl: user.avatarUrl ? user.avatarUrl : this.DEFAULT_AVATAR_URL
    }
  }
}
