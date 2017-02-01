import { enableDebugTools, disableDebugTools } from '@angular/platform-browser';
import { enableProdMode, ApplicationRef } from '@angular/core';

let production = 'production' === ENV;

/*--------------   Configuration variables   -------------- */
let PROVIDERS = [
  { provide: 'DEFAULT_USERNAME', useValue: '_anonymous_' }, // TODO delete
  { provide: 'DEFAULT_PASSWORD', useValue: '' }, // TODO delete
  { provide: 'SWELLRT_DOMAIN', useValue: 'demo.swellrt.org' },
  { provide: 'JETPAD_URL', useValue: 'https://demo.jetpad.net' },
  { provide: 'RECOVER_PASSWORD_URL', useValue: 'https://demo.jetpad.net/recover/*$token*$user-id*' }
];

if (production) { PROVIDERS = [ ...PROVIDERS ]; }
else { PROVIDERS = [ ...PROVIDERS ]; }

export const ENV_PROVIDERS = [ ...PROVIDERS ];

/*--------------   Configuration options   -------------- */
let _decorateModuleRef = function identity(value) { return value; };

if (production) {
  disableDebugTools();
  enableProdMode();
} else {
  _decorateModuleRef = (modRef: any) => {
    var appRef = modRef.injector.get(ApplicationRef);
    var cmpRef = appRef.components[0];
    let _ng = (<any>window).ng;
    enableDebugTools(cmpRef);
    (<any>window).ng.probe = _ng.probe;
    (<any>window).ng.coreTokens = _ng.coreTokens;
    return modRef
  };
}

export const decorateModuleRef = _decorateModuleRef;
