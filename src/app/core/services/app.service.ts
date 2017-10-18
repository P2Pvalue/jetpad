import { Injectable } from '@angular/core';
import { HmrState } from 'angular2-hmr';
import { Subject } from 'rxjs';

export type InternalStateType = {
    [key: string]: any
};

@Injectable()
export class AppState {

  public _state = { };
  private _stateSubject = new Subject<any>();

  // already return a clone of the current state
  get state() {
    return this._state = this._clone(this._state);
  }
  // never allow mutation
  set state(value) {
    throw new Error('do not mutate the `.state` directly');
  }

  public get(prop?: any) {
    // use our state getter for the clone
    const state = this._state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  public set(prop: string, value: any) {
    // internally mutate our state
    console.log('app state mutated: ' + prop + ' = ' + value);
    let newValue = this._state[prop] = value;
    this._stateSubject.next(this._state);
    return newValue;
  }

  get subject() {
    return this._stateSubject;
  }

  public _clone(object) {
    // simple document clone
    return JSON.parse(JSON.stringify( object ));
  }
}
