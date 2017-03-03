import { Injectable } from '@angular/core';
import { HmrState } from 'angular2-hmr';
import { Subject } from "rxjs/Subject";

@Injectable()
export class AppState {

  private _state = { };
  private _stateSubject = new Subject<any>();

  constructor() {

  }

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }


  get(prop?: any) {
    // use our state getter for the clone
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // internally mutate our state
    let newValue = this._state[prop] = value;
    this._stateSubject.next(this.state);
    return newValue;
  }

  get subject() {
    return this._stateSubject;
  }

  _clone(object) {
    // simple document clone
    return JSON.parse(JSON.stringify( object ));
  }
}
