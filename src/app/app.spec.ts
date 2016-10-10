import {
  inject,
  it
} from '@angular/core/testing';

import { TestBed } from '@angular/core/testing';

// Load the implementations that should be tested
import { App } from './app.component';
import { AppState } from './app.service';

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  TestBed.configureTestingModule({
    providers: [ AppState, App ]
  });

  it('should have a url', inject([ App ], (app) => {
    expect(app.url).toEqual('https://github.com/P2Pvalue/swellrt-pad');
  }));

});
