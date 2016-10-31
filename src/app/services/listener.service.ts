import {Injectable } from "@angular/core";

declare let SwellRT: any;

@Injectable()
export class ListenerService {

  listener: any;

  bindListeners() {

    SwellRT.on(SwellRT.events.NETWORK_CONNECTED, () => {
      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_CONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.NETWORK_DISCONNECTED, () => {
      if (this.listener) {
        this.listener(SwellRT.events.NETWORK_DISCONNECTED);
      }
    });

    SwellRT.on(SwellRT.events.FATAL_EXCEPTION, () => {
      if (this.listener) {
        this.listener(SwellRT.events.FATAL_EXCEPTION);
      }
    });

  }

  setListener(_listener) {
    this.listener = _listener;
  }
}
