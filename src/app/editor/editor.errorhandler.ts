import { Injectable, ErrorHandler } from '@angular/core';
import { BackendService, AppState } from '../core/services'

declare let window: any;

@Injectable()
export class EditorErrorHandler implements ErrorHandler {

  constructor(private appState: AppState, private backend: BackendService) {

  }

  /**
  * Update the app state with the captured error.
  */
  public handleError(error: any) {
    window._error = error;
    console.log("Captured "+error);
    this.appState.set("error", "Fatal internal error");
  }

}
