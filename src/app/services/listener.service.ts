import {Injectable } from "@angular/core";

declare let SwellRT: any;
const DEFAULT_SNACK_TIMEOUT = 3000;

@Injectable()
export class ListenerService {

  lastSnack: any;
  listener: any;

  bindListeners() {

    console.log('SwellRT listeners bound');

    SwellRT.on(SwellRT.events.NETWORK_CONNECTED, () => {
      if (this.lastSnack) {
        this.lastSnack.hide();
      }
      $.snackbar({content: 'Connected to server', timeout: DEFAULT_SNACK_TIMEOUT});
      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_CONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.NETWORK_DISCONNECTED, () => {
      this.lastSnack = $.snackbar({content: 'Connection lost trying to reconnect...', timeout: 0});
      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_DISCONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.FATAL_EXCEPTION, () => {
      if (this.lastSnack) {
        this.lastSnack.hide();
      }
      this.lastSnack = $.snackbar({
        content: 'Oops! an fatal error has ocurred. Please <a href="/">refresh.</a>', timeout: 0, htmlAllowed: true
      });
      if (this.listener) {
        this.listener(SwellRT.events.FATAL_EXCEPTION);
      }
    });

  }

  setListener(_listener) {
    this.listener = _listener;
  }
}
