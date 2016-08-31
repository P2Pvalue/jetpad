import {Injectable, OnInit, Inject} from '@angular/core';
import { CObject } from '../shared';

declare let SwellRT:any;
const DEFAULT_USERNAME = '_anonymous_';
const DEFAULT_PASSWORD = '';
const DEFAULT_SNACK_TIMEOUT = 3000;
const SWELLRT_SERVER = 'http://demo.swellrt.org';
const SWELLRT_DOMAIN = '@demo.swellrt.org';

@Injectable()
export class SwellRTService implements OnInit {

  domain: string = SWELLRT_DOMAIN;
  server: string = SWELLRT_SERVER;

  lastSnack: any;

  listener: Function;

  object: Promise<CObject>;

  constructor(@Inject('RECOVER_PASSWORD_URL') private recoverPasswordUrl: string) {}

  ngOnInit() {
    this.object = new Promise<CObject>(function(resolve, reject){
      reject();
    });
  }

  bindListeners() {

    console.log('SwellRT listeners bound');

    SwellRT.on(SwellRT.events.NETWORK_CONNECTED, function() {
      if (this.lastSnack) {
        this.lastSnack.hide();
      }

      $.snackbar({ content: 'Connected to server', timeout: DEFAULT_SNACK_TIMEOUT  });

      this.state = 'CONNECTED';

      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_CONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.NETWORK_DISCONNECTED, function() {
      this.lastSnack = $.snackbar({ content: 'Connection lost trying to reconnect...', timeout: 0  });

      this.state = 'DISCONNECTED';

      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_DISCONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.FATAL_EXCEPTION, function() {

      if (this.lastSnack) {
        this.lastSnack.hide();
      }

      this.lastSnack = $.snackbar({
        content: 'Oops! an fatal error has ocurred. Please <a href="/">refresh.</a>', timeout: 0, htmlAllowed: true  });

      this.state = 'EXCEPTION';
      if (this.listener) {
        this.listener(SwellRT.events.FATAL_EXCEPTION);
      }
    });

  }

  setListener(_listener: Function) {
    this.listener = _listener;
  }

  resume() {
    var that = this;
    return new Promise<any>((resolve, reject) => {
      SwellRT.resume(function(res) {
        if (res.error) {
          that.login(DEFAULT_USERNAME, DEFAULT_PASSWORD).then(user => {
            resolve(user)
          });
          reject(res.error);
        } else if (res.data) {
          resolve(res.data);
        }
      });
    });
  }

  login(id: string, password: string) {
    return new Promise<any>((resolve, reject) => {
        SwellRT.login({ id, password }, function(res) {
          if (res.error) {
            reject(res.error);
          } else if (res.data) {
            resolve(res.data);
          }
        });
    });
  }

  createUser(id: string, password: string): Promise<any> {
    return new Promise<any>(function(resolve, reject) {
      SwellRT.createUser({ id, password }, function(res) {
        if (res.error) {
          reject(res.error);
        } else if (res.data) {
          resolve(res.data);
        }
      });
    });
  };

  updateUser(email: string, avatarData: string) {
    return new Promise<any>(function(resolve, reject) {
      SwellRT.updateUserProfile({ email, avatarData }, function(res) {
        if (res.error) {
          reject(res.error);
        } else if (res.data) {
          resolve(res.data);
        }
      });
    });
  }

  logout() {
    var that = this;
    return new Promise<any>(function(resolve, reject) {
      SwellRT.logout(function(res) {
        if (res.error) {
          reject(res.error);
        } else if (res.data.status == "SESSION_CLOSED") {
          that.login(DEFAULT_USERNAME, DEFAULT_PASSWORD).then(user => {
            resolve(user);
          });
        }
      });
    });
  }

  changePassword(id: string, oldPassword: string, newPassword: string) {
    return new Promise<any>(function(resolve, reject) {
      SwellRT.setPassword(id, oldPassword, newPassword, function() {
        resolve();
      }, function(error){
        reject(error);
      });
    });
  }

  recoverPassword(email: string) {
    var that = this;
    return new Promise<any>(function(resolve, reject) {
      SwellRT.recoverPassword(email, that.recoverPasswordUrl, function() {
        resolve();
      }, function(error){
        reject(error);
      });
    });
  }

  open(_id: string) {

    // Add the domain part to the Id
    if (_id.indexOf('/') === -1) {
        _id = SwellRT.domain() + '/' + _id;
    }

    this.object = new Promise<CObject>(function(resolve, reject){
      try {
        SwellRT.openModel(_id, function(object){
          resolve(object);
        });
      } catch (e) {
        reject(e);
      }
    });

    return this.object;
  }

  close() {

    this.object.then(object => {
      SwellRT.closeModel(object.id());
    });

    this.object = new Promise<CObject>(function(resolve, reject){
      reject();
    });

    return this.object;
  }

  editor(parentElementId, widgets, annotations) {
    return SwellRT.editor(parentElementId, widgets, annotations);
  }
}
