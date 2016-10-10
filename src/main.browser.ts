import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { decorateModuleRef } from './app/environment';
import { bootloader } from '@angularclass/hmr';
/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModule } from './app';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(decorateModuleRef)
    .catch(err => console.error(err));

}

document.addEventListener('DOMContentLoaded', () => {

  (<any>window).SwellRT.ready(() => {

    console.log('SwellRT Loaded!');

    // Fine tunning the SwellRT server connection.
    // Don't touch!
    (<any>window).__atmosphere_config = {
      logLevel: 'info', // info, debug
      transport: 'websocket',
      fallbackTransport: 'long-polling',
      pollingInterval: 0,
      trackMessageLength: true,
      enableXDR: true,
      readResponsesHeaders: false,
      withCredentials: true,
      dropHeaders: true,
      timeout: 70000,

      connectTimeout: -1,
      reconnectInterval: 5000,
      maxReconnectOnClose: 5,
      reconnectOnServerError: true,

      clientVersion: '1.0'
    };

    bootloader(main);

  });

});
