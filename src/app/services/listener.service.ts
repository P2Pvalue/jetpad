import {Injectable } from "@angular/core";

declare let SwellRT: any;
const DEFAULT_SNACK_TIMEOUT = 3000;

@Injectable()
export class ListenerService {

  lastSnack: any;

  listener: Function;

  bindListeners() {

    console.log('SwellRT listeners bound');

    SwellRT.on(SwellRT.events.NETWORK_CONNECTED, function () {
      if (this.lastSnack) {
        this.lastSnack.hide();
      }

      $.snackbar({content: 'Connected to server', timeout: DEFAULT_SNACK_TIMEOUT});

      this.state = 'CONNECTED';

      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_CONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.NETWORK_DISCONNECTED, function () {
      this.lastSnack = $.snackbar({content: 'Connection lost trying to reconnect...', timeout: 0});

      this.state = 'DISCONNECTED';

      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_DISCONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.FATAL_EXCEPTION, function () {

      if (this.lastSnack) {
        this.lastSnack.hide();
      }

      this.lastSnack = $.snackbar({
        content: 'Oops! an fatal error has ocurred. Please <a href="/">refresh.</a>', timeout: 0, htmlAllowed: true
      });

      this.state = 'EXCEPTION';
      if (this.listener) {
        this.listener(SwellRT.events.FATAL_EXCEPTION);
      }
    });

  }

  setListener(_listener: Function) {
    this.listener = _listener;
  }
}
